import re
from pathlib import Path


def miami_branding(source):
    def update_link(match):
        anchor = match.group()
        label = re.sub(r'<[^>]+>', '', anchor).strip()
        if 'Published source' in label or 'complete HOK project library' in label or 'full founder story' in label:
            return ''
        if 'mailto:' in anchor:
            destination = '/contact'
        elif 'map' in label.lower():
            destination = 'https://www.google.com/maps/search/?api=1&query=Miami%2C+Florida'
        elif any(word in label.lower() for word in ['positions', 'join us']):
            destination = '/careers'
        elif 'services' in label.lower():
            destination = '/services'
        else:
            destination = '/'
        return re.sub(r'href="[^"]+"', f'href="{destination}"', anchor, count=1)

    source = re.sub(r'<a\b[^>]*href="[^"]*hokdetroit\.com[^"]*"[^>]*>.*?</a>', update_link, source, flags=re.S | re.I)
    source = source.replace('or email concierge@hokdetroit.com', 'or use our contact page')
    source = source.replace('contact concierge@hokdetroit.com', 'visit our contact page')
    source = source.replace('concierge@hokdetroit.com', 'Contact our team')
    source = source.replace('Detroit baseball jersey', 'baseball jersey')
    source = source.replace('Detroit roots.', 'Miami based.')
    source = source.replace('DETROIT ROOTS. CONNECTED THINKING.', 'MIAMI · MEDICAL MARKETING AGENCY')
    source = source.replace('Detroit, Michigan', 'Miami, Florida').replace('Detroit, MI', 'Miami, FL')
    source = source.replace('Built in Detroit', 'Based in Miami').replace('Detroit built.', 'Miami based.')
    source = re.sub('detroit', lambda match: 'MIAMI' if match.group().isupper() else 'Miami', source, flags=re.I)
    source = source.replace('HEALTHCARE GROWTH &amp; SYSTEMS', 'MEDICAL MARKETING AGENCY').replace('HEALTHCARE GROWTH & SYSTEMS', 'MEDICAL MARKETING AGENCY')
    source = re.sub(r'House of Karma(?! Miami)', 'House of Karma Miami', source)
    source = re.sub(r'house of karma(?! miami)', 'house of karma miami', source)
    source = source.replace('House of Karma Miami | Healthcare Marketing &amp; Systems Architecture', 'House of Karma Miami | Medical Marketing Agency')
    source = source.replace('House of Karma Miami | Healthcare Marketing & Systems Architecture', 'House of Karma Miami | Medical Marketing Agency')
    return source


if __name__ == '__main__':
    pages = Path(__file__).resolve().parents[1] / 'public/site-pages'
    count = 0
    for path in pages.rglob('*.html'):
        source = path.read_text()
        updated = miami_branding(source)
        if updated != source:
            path.write_text(updated)
            count += 1
    print(f'Updated Miami branding on {count} pages.')
