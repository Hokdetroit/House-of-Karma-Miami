import json
import re
import subprocess
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
BASELINE = '54e3b19'

class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.links = []
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            self.links.append(dict(attrs).get('href', ''))

class HealthcareContentTests(unittest.TestCase):
    def test_original_video_and_animation_scripts_are_preserved(self):
        originals = subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', BASELINE, '--', 'public/site-pages'], cwd=ROOT, text=True).splitlines()
        for relative in originals:
            if not relative.endswith('.html'): continue
            original = subprocess.check_output(['git', 'show', BASELINE + ':' + relative], cwd=ROOT, text=True)
            updated = (ROOT / relative).read_text()
            with self.subTest(page=relative):
                for pattern in [r'<script\b[^>]*>.*?</script>', r'<video\b[^>]*>.*?</video>']:
                    tags = [tag for tag in re.findall(pattern, updated, re.S | re.I) if 'src="/healthcare-pages.js"' not in tag and 'src="/mega-menu.js"' not in tag and 'src="/resize-observer-guard.js"' not in tag]
                    self.assertEqual(re.findall(pattern, original, re.S | re.I), tags)

    def test_internal_navigation_resolves(self):
        routes = json.loads((ROOT / 'site-manifest.json').read_text())
        for destination in set(routes.values()):
            path = ROOT / ('public' + destination)
            self.assertTrue(path.exists())
            for href in Page(path.read_text()).links:
                parsed = urlsplit(href)
                if parsed.scheme or parsed.netloc or not parsed.path.startswith('/'):
                    continue
                target = unquote(parsed.path).rstrip('/') or '/'
                with self.subTest(page=destination, href=href):
                    self.assertTrue(target in routes or (ROOT / ('public' + target)).is_file(), href)

    def test_required_healthcare_services_are_present(self):
        source = (ROOT / 'public/site-pages/what-we-do.html').read_text()
        for term in ['House of Karma', 'EMR', 'patient dashboards', 'telehealth', 'LegitScript', 'Google Ads', 'SEO', 'Studio Escrow', 'HIPAA', 'BAAs']:
            with self.subTest(term=term):
                self.assertIn(term.lower(), source.lower())

    def test_new_service_routes_exist(self):
        routes = json.loads((ROOT / 'site-manifest.json').read_text())
        for path in ['/services', '/studio-escrow', '/our-process', '/services/healthcare-marketing', '/services/emr-patient-portals', '/services/telehealth', '/services/paid-media-seo', '/services/hipaa-infrastructure']:
            self.assertIn(path, routes)

    def test_dedicated_pages_and_portfolio(self):
        routes = json.loads((ROOT / 'site-manifest.json').read_text())
        data = json.loads((ROOT / 'scripts/healthcare-pages.json').read_text())
        for service in data['services']:
            route = '/services/' + service['slug']
            self.assertIn(route, routes)
            source = (ROOT / ('public' + routes[route])).read_text()
            self.assertEqual(len(re.findall(r'<h1\b', source)), 1)
            self.assertIn(service['name'].replace('&', '&amp;'), source)
            self.assertEqual(source.count('class="hok-faq"'), 3)
        portfolio = (ROOT / ('public' + routes['/portfolio'])).read_text()
        self.assertEqual(portfolio.count('data-project-category='), 6)
        self.assertEqual(portfolio.count('class="hok-project-dialog"'), 6)
        self.assertIn('not every showcase represents a client engagement', portfolio)
        for asset in re.findall(r'src="(/portfolio-assets/[^"]+)"', portfolio):
            self.assertTrue((ROOT / ('public' + asset)).is_file(), asset)

    def test_mega_menu_covers_every_unique_page(self):
        routes = json.loads((ROOT / 'site-manifest.json').read_text())
        for destination in set(routes.values()):
            source = (ROOT / ('public' + destination)).read_text()
            self.assertEqual(source.count('id="hok-mega-menu"'), 1)
            self.assertEqual(source.count('data-hok-menu-open'), 1)
            self.assertIn('aria-controls="hok-mega-menu"', source)
            menu = re.search(r'<dialog class="hok-mega".*?</dialog>', source, re.S).group()
            linked_destinations = {routes.get(urlsplit(href).path) for href in Page(menu).links}
            self.assertTrue(set(routes.values()).issubset(linked_destinations), destination)

    def test_miami_branding_on_every_page(self):
        from miami_branding import miami_branding
        for path in (ROOT / 'public/site-pages').rglob('*.html'):
            source = path.read_text()
            with self.subTest(page=path.name):
                self.assertNotIn('detroit', source.lower())
                self.assertIn('House of Karma Miami', source)
                self.assertIn('Miami, Florida', source)
                self.assertIn('MEDICAL MARKETING AGENCY', source)
                self.assertEqual(miami_branding(source), source)
        founder = (ROOT / 'public/site-pages/about-us.html').read_text()
        self.assertIn('wearing a baseball jersey', founder)
        self.assertNotIn('Miami baseball jersey', founder)

    def test_founder_biography_and_local_images(self):
        source = (ROOT / 'public/site-pages/about-us.html').read_text()
        for text in ['Mohamad Fardous', 'Rocket Mortgage', 'University of Michigan', 'Karma by Design', 'not clinical practice', 'House of Karma Miami']:
            self.assertIn(text, source)
        self.assertEqual(len(re.findall(r'<h1\b', source)), 1)
        self.assertNotIn('illustrative reference portrait', source)
        for filename in ['mohamad-fardous.webp', 'founder-strategy.png', 'founder-creative.webp', 'founder-learning.png', 'founder-community.png']:
            self.assertIn('/portfolio-assets/' + filename, source)
            self.assertTrue((ROOT / 'public/portfolio-assets' / filename).is_file())

if __name__ == '__main__':
    unittest.main()
