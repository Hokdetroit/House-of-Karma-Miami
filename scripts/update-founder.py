import html
import re
from pathlib import Path
from site_document import Document

ROOT = Path(__file__).resolve().parents[1]
path = ROOT / 'public/site-pages/about-us.html'
source = path.read_text()
doc = Document(source)
profile = (ROOT / 'scripts/founder-profile.html').read_text()
expertise = (ROOT / 'scripts/founder-expertise.html').read_text()
hero = doc.select('header_heading')[0]
doc.set(hero, 'Built on trust.')
if hero['tag'] == 'h2':
    doc.patches.append((hero['start'],hero['inner'],source[hero['start']:hero['inner']].replace('<h2','<h1',1)))
    doc.patches.append((hero['end'],hero['end']+5,'</h1>'))
doc.many('header_p',['Founded by Mohamad Fardous. Business strategy, creative direction, and connected systems for healthcare growth.'])
doc.many('about-journey_heading',['Business strategy and creative direction. Connected by a belief in doing right by people.','From Detroit, we bring brand, patient experience, and operational systems into one considered strategy.'])
existing = next((n for n in doc.nodes if n['attrs'].get('id')=='founder'),None)
if existing:
    doc.patches.append((existing['start'],existing['end']+len('</section>'),profile))
else:
    journey = doc.select('is-about-journey')[0]
    doc.patches.append((journey['start'],journey['start'],profile))
old_team = doc.select('is-behind')
if old_team:
    node=old_team[0]
    doc.patches.append((node['start'],node['end']+len('</section>'),expertise))
else:
    first=next(n for n in doc.nodes if n['attrs'].get('id')=='founder-expertise')
    last=doc.select('hok-founder-values')[0]
    doc.patches.append((first['start'],last['end']+len('</section>'),expertise))
images=[('founder-strategy.png','Business strategy imagery from Mohamad Fardous’s founder profile'),('founder-creative.webp','Creative work from Mohamad Fardous’s founder profile'),('founder-learning.png','Professional development from Mohamad Fardous’s founder profile'),('founder-community.png','Community involvement from Mohamad Fardous’s founder profile')]
for node,(filename,alt) in zip(doc.select('about-journey_image-inner'),images):
    tag=source[node['start']:node['inner']]
    tag=re.sub(r'\s(?:srcset|sizes)="[^"]*"','',tag)
    tag=re.sub(r'src="[^"]*"','src="/portfolio-assets/'+filename+'"',tag)
    tag=re.sub(r'alt="[^"]*"','alt="'+html.escape(alt,quote=True)+'"',tag)
    doc.patches.append((node['start'],node['inner'],tag))
for node in doc.nodes:
    if node['tag']=='title': doc.set(node,'About House of Karma & Founder Mohamad Fardous')
    if node['tag']=='meta':
        key=node['attrs'].get('name') or node['attrs'].get('property')
        if key in ('description','og:description','twitter:description','og:title','twitter:title'):
            value='About House of Karma & Founder Mohamad Fardous' if key.endswith('title') else 'Meet founder Mohamad Fardous. Discover how his finance, leadership, branding, and creative expertise shape House of Karma’s healthcare marketing and connected systems.'
            tag=source[node['start']:node['inner']]
            tag=re.sub(r'content="[^"]*"','content="'+html.escape(value,quote=True)+'"',tag)
            doc.patches.append((node['start'],node['inner'],tag))
path.write_text(doc.render())
print('Updated About Us with the published founder biography, five sourced images, and service connections.')
