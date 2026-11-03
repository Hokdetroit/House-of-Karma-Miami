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
        for path in (ROOT / 'public/site-pages').rglob('*.html'):
            relative = str(path.relative_to(ROOT))
            original = subprocess.check_output(['git', 'show', BASELINE + ':' + relative], cwd=ROOT, text=True)
            updated = path.read_text()
            with self.subTest(page=relative):
                for pattern in [r'<script\b[^>]*>.*?</script>', r'<video\b[^>]*>.*?</video>']:
                    self.assertEqual(re.findall(pattern, original, re.S | re.I), re.findall(pattern, updated, re.S | re.I))

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

if __name__ == '__main__':
    unittest.main()
