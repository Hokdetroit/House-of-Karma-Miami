import concurrent.futures
import json
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
ASSETS = PUBLIC / 'site-assets'
BASE = 'https://polpharma.fra1.cdn.digitaloceanspaces.com/'
SCENES = ['1fS9tMUsKehA5rXg5ejN', 'EnWLTcHESr5tdpBnL4Wy']
manifest = json.loads((ROOT / 'asset-manifest.json').read_text())

with urllib.request.urlopen('https://www.polpharmabiologics.com/', timeout=45) as response:
    source = response.read().decode()
poster = re.search(r'<meta content="([^"]+)" property="og:image"', source).group(1)
resources = [(BASE + name, name) for name in ['globe-v1.js', 'globe-v1.bin', 'glass-9081816b.js']]
resources += [('https://storage.googleapis.com/unicornstudio-production/embeds/' + scene, scene + '.json') for scene in SCENES]
resources += [(poster, 'hero-poster.webp')]

def download(item):
    url, name = item
    with urllib.request.urlopen(url, timeout=60) as response:
        data = response.read()
    (ASSETS / name).write_bytes(data)
    return url, '/site-assets/' + name

with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    for url, local in pool.map(download, resources):
        manifest[url] = local
        print('CAPTURED', local, flush=True)

for page in (PUBLIC / 'site-pages').rglob('*.html'):
    text = page.read_text().replace(poster, '/site-assets/hero-poster.webp')
    for scene in SCENES:
        text = re.sub(r'data-us-project="' + scene + r'\??"', 'data-us-project-src="/site-assets/' + scene + '.json"', text)
    page.write_text(text)

motion = ASSETS / '67ad32bc922ad3ab.js'
text = motion.read_text().replace('var SPACE_BASE = "' + BASE + '";', 'var SPACE_BASE = "/site-assets/";')
motion.write_text(text)
(ROOT / 'asset-manifest.json').write_text(json.dumps(manifest, indent=2))
print('COMPLETE', len(manifest), 'local assets')
