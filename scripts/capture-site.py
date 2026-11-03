import concurrent.futures
import hashlib
import html
import json
import re
import urllib.request
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
PAGES = PUBLIC / 'site-pages'
ASSETS = PUBLIC / 'site-assets'
PAGES.mkdir(exist_ok=True)
ASSETS.mkdir(exist_ok=True)
ORIGIN = 'https://www.polpharmabiologics.com'
pages = {}
assets = {}
errors = []

def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=90) as response:
        return response.read(), response.headers.get_content_type()

def page_job(path):
    data, _ = fetch(ORIGIN + path)
    return path, data.decode('utf-8')

pending = {'/'}
visited = set()
while pending:
    batch = sorted(pending - visited)
    if not batch:
        break
    visited.update(batch)
    pending = set()
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        jobs = {pool.submit(page_job, p): p for p in batch}
        for job in concurrent.futures.as_completed(jobs):
            path = jobs[job]
            try:
                path, source = job.result()
                pages[path] = source
                print('PAGE', path, len(source), flush=True)
                for href in re.findall(r'href=[\"\x27]([^\"\x27]+)', source):
                    parsed = urlparse(urljoin(ORIGIN, html.unescape(href)))
                    if parsed.hostname in ('www.polpharmabiologics.com', 'polpharmabiologics.com'):
                        target = parsed.path.rstrip('/') or '/'
                        if not Path(target).suffix and target not in visited and not target.startswith('/cdn-cgi'):
                            pending.add(target)
            except Exception as error:
                errors.append({'url': ORIGIN + path, 'error': str(error)})

allowed = ('cdn.prod.website-files.com', 'assets.website-files.com', 'cdn.jsdelivr.net', 'cdn.odyn.dev', 'unpkg.com', 'd3e54v103j8qbb.cloudfront.net', 'polpharma.fra1.digitaloceanspaces.com', 'polpharma.fra1.cdn.digitaloceanspaces.com', 'fonts.gstatic.com', 'fonts.googleapis.com', 'assets.unicorn.studio')
url_re = re.compile(r'https?://[^\s\"\x27<>`\\)]+')

def collect(text):
    found = set()
    for raw in url_re.findall(text):
        url = html.unescape(raw).rstrip(';,')
        parsed = urlparse(url)
        if parsed.hostname in allowed and parsed.path and parsed.path != '/':
            found.add(url)
    return found

def asset_job(url):
    data, content_type = fetch(url)
    ext = Path(unquote(urlparse(url).path)).suffix
    if len(ext) > 8 or not ext:
        ext = { 'application/javascript': '.js', 'text/javascript': '.js', 'text/css': '.css', 'application/json': '.json' }.get(content_type, '.bin')
    filename = hashlib.sha256(url.encode()).hexdigest()[:16] + ext
    text = None
    if ext in ('.js', '.css', '.json', '.svg'):
        text = data.decode('utf-8')
    return filename, data, text

pending = set().union(*(collect(source) for source in pages.values()))
for depth in range(4):
    batch = sorted(pending - assets.keys())
    if not batch:
        break
    pending = set()
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
        jobs = {pool.submit(asset_job, url): url for url in batch}
        for job in concurrent.futures.as_completed(jobs):
            url = jobs[job]
            try:
                filename, data, text = job.result()
                assets[url] = {'file': filename, 'text': text}
                (ASSETS / filename).write_bytes(data)
                print('ASSET', filename, len(data), flush=True)
                if text and filename.endswith(('.css', '.json')):
                    pending.update(collect(text))
                    if filename.endswith('.css'):
                        for relative in re.findall(r'url\([\"\x27]?([^\"\x27)]+)', text):
                            if not relative.startswith(('data:', '#')):
                                pending.add(urljoin(url, relative))
                if text and filename.endswith('.js') and urlparse(url).hostname == 'cdn.odyn.dev':
                    pending.update(collect(text))
            except Exception as error:
                errors.append({'url': url, 'error': str(error)})
                print('UNAVAILABLE', url, str(error), flush=True)

replacements = sorted([(url, '/site-assets/' + info['file']) for url, info in assets.items()], key=lambda pair: -len(pair[0]))
def localize(text):
    for url, local in replacements:
        text = text.replace(url, local).replace(html.escape(url, quote=True), local)
    return text

for url, info in assets.items():
    if info['text'] is not None:
        text = localize(info['text'])
        if info['file'].endswith('.css'):
            def css_url(match):
                relative = match.group(1)
                full = urljoin(url, relative)
                return 'url("/site-assets/' + assets[full]['file'] + '")' if full in assets else match.group(0)
            text = re.sub(r'url\([\"\x27]?([^\"\x27)]+)[\"\x27]?\)', css_url, text)
        (ASSETS / info['file']).write_text(text)

manifest = {}
for path, source in pages.items():
    source = re.sub(r'<script\b[^>]*>.*?</script>', lambda m: '' if any(x in m.group(0) for x in ('_linkedin_partner_id', 'snap.licdn.com', 'googletagmanager.com', 'google-analytics.com')) else m.group(0), source, flags=re.S)
    source = re.sub(r'<noscript\b[^>]*>.*?</noscript>', '', source, flags=re.S)
    source = re.sub(r'\s+integrity="[^"]*"', '', source)
    source = localize(source)
    source = source.replace('href="https://www.polpharmabiologics.com/', 'href="/').replace('href="https://polpharmabiologics.com/', 'href="/')
    source = source.replace('</head>', '<meta name="robots" content="noindex,nofollow"/><script src="/replica-safety.js"></script></head>')
    filename = 'index.html' if path == '/' else path.strip('/') + '.html'
    target = PAGES / filename
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(source)
    manifest[path] = '/site-pages/' + filename
(ROOT / 'site-manifest.json').write_text(json.dumps(manifest, indent=2))
(ROOT / 'asset-manifest.json').write_text(json.dumps({url: '/site-assets/' + info['file'] for url, info in assets.items()}, indent=2))
(ROOT / 'capture-errors.json').write_text(json.dumps(errors, indent=2))
print('COMPLETE', len(pages), 'pages,', len(assets), 'assets,', len(errors), 'unavailable resources', flush=True)
import runpy
runpy.run_path(str(ROOT / 'scripts' / 'finalize-site.py'))
