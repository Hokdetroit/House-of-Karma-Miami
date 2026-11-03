import html
import json
import re
import subprocess
from html.parser import HTMLParser
from pathlib import Path
from site_document import Document
from miami_branding import miami_branding

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
PAGES = PUBLIC / 'site-pages'
DATA = json.loads((ROOT / 'scripts/healthcare-pages.json').read_text())
ROUTES = json.loads((ROOT / 'site-manifest.json').read_text())
ASSETS = PUBLIC / 'portfolio-assets'
ASSETS.mkdir(exist_ok=True)
E = html.escape

class Images(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.images = {}
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'img' and attrs.get('alt') and attrs.get('src'):
            self.images[attrs['alt']] = attrs['src']

source_map = ASSETS / 'sources.json'
if source_map.exists():
    image_sources = json.loads(source_map.read_text())
else:
    source = subprocess.check_output(['curl','--fail','-L','-s','--max-time','45','https://www.hokdetroit.com/portfolio'],text=True)
    all_images = Images(source).images
    image_sources = {project['name']: all_images[project['name']] for project in DATA['projects']}
    source_map.write_text(json.dumps(image_sources,indent=2)+'\n')
for project in DATA['projects']:
    url = image_sources[project['name']]
    suffix = Path(url.split('?')[0]).suffix
    filename = project['slug'] + suffix
    destination = ASSETS / filename
    if not destination.exists():
        subprocess.run(['curl','--fail','-L','--max-time','60','-o',str(destination),url],check=True)
    project['image'] = '/portfolio-assets/' + filename


def metadata(source, title, description):
    doc = Document(source)
    for node in doc.nodes:
        if node['tag']=='title': doc.set(node,title+' | House of Karma')
        if node['tag']=='meta':
            attr = node['attrs'].get('name') or node['attrs'].get('property')
            if attr in ('description','og:description','twitter:description','og:title','twitter:title'):
                value = title+' | House of Karma' if attr.endswith('title') else description
                tag=source[node['start']:node['inner']]
                tag=re.sub(r'content="[^"]*"','content="'+E(value,quote=True)+'"',tag)
                doc.patches.append((node['start'],node['inner'],tag))
    source=doc.render()
    if '/healthcare-pages.css' not in source:
        source=source.replace('</head>','<link rel="stylesheet" href="/healthcare-pages.css"></head>')
    if '/healthcare-pages.js' not in source:
        source=source.replace('</body>','<script src="/healthcare-pages.js" defer></script></body>')
    return source


def directory():
    links=''.join('<a class="hok-service-link" href="/services/'+s['slug']+'"><span>'+E(s['short'])+'</span><span aria-hidden="true">↗</span></a>' for s in DATA['services'])
    return '<section class="hok-extension hok-directory" id="specialist-services"><div class="hok-section-head"><span class="hok-eyebrow">Specialist healthcare services</span><h2>From discovery<br>to lasting trust.</h2><p>Explore dedicated strategy, design, and content capabilities for healthcare organizations.</p></div><div class="hok-service-links">'+links+'<a class="hok-service-link" href="/portfolio"><span>Explore our portfolio</span><span aria-hidden="true">↗</span></a></div></section>'

for service in DATA['services']:
    template = (PAGES / 'pipeline/ranibizumab.html').read_text()
    doc = Document(template)
    doc.many('p-hero_heading',[service['name']])
    doc.many('phero_about_txt',[service['description']])
    doc.many('bullet-point_txt-2',['Built for',service['audience'],'Focus',service['focus'],'Powered by','House of Karma','Delivery','Strategy & execution'])
    doc.many('phero_brand_circle',[x[0] for x in service['deliverables'][:3]])
    doc.many('phero_partner_info_title',['House of Karma'])
    doc.many('phero_partner_visual',['House of Karma'])
    cards=''.join('<article class="hok-offering hok-reveal"><span class="hok-eyebrow">0'+str(i+1)+'</span><h3>'+E(title)+'</h3><p>'+E(copy)+'</p></article>' for i,(title,copy) in enumerate(service['deliverables']))
    steps=''.join('<article><span class="hok-eyebrow">0'+str(i+1)+'</span><h3>'+E(title)+'</h3><p>'+E(copy)+'</p></article>' for i,(title,copy) in enumerate(service['steps']))
    faqs=''.join('<details class="hok-faq"><summary>'+E(q)+'</summary><p>'+E(a)+'</p></details>' for q,a in service['faqs'])
    extra='<section class="hok-extension"><div class="hok-section-head hok-reveal"><span class="hok-eyebrow">What we deliver</span><h2>'+E(service['headline'])+'</h2></div><div class="hok-offerings">'+cards+'</div></section><section class="hok-extension hok-deep"><div class="hok-section-head"><span class="hok-eyebrow">Our approach</span><h2>Considered at every step.</h2></div><div class="hok-steps">'+steps+'</div></section><section class="hok-extension"><div class="hok-section-head"><span class="hok-eyebrow">Before we begin</span><h2>Good questions.<br>Clear answers.</h2></div><div class="hok-faqs">'+faqs+'</div><div class="hok-next-links"><a href="/portfolio">Explore selected work ↗</a><a href="/contact">Discuss your project ↗</a><a href="/services">All healthcare services ↗</a></div></section>'
    sections=[n for n in doc.nodes if n['tag']=='section' and n['parent'] and n['parent']['tag']=='main']
    doc.patches.append((sections[-1]['start'],sections[-1]['start'],extra))
    output=metadata(doc.render(),service['name'],service['description'])
    output=output.replace('<body','<body data-hok-page="service"',1)
    path=PAGES / (service['slug']+'.html')
    path.write_text(miami_branding(output))
    ROUTES['/services/'+service['slug']]='/site-pages/'+path.name

cards=[]
for project in DATA['projects']:
    details_id='project-'+project['slug']
    cards.append('<article class="hok-project hok-reveal" data-project-category="'+project['category']+'"><button class="hok-project-open" type="button" data-project-open="'+details_id+'" aria-label="View '+E(project['name'],quote=True)+' project"><div class="hok-project-image"><img src="'+project['image']+'" alt="'+E(project['name'],quote=True)+' — published HOK portfolio artwork" loading="lazy" width="1200" height="800"><span class="hok-project-arrow" aria-hidden="true">↗</span></div><div class="hok-project-meta"><span class="hok-eyebrow">'+E(project['type'])+'</span><h2>'+E(project['name'])+'</h2><p>'+E(project['scope'])+'</p></div></button><dialog class="hok-project-dialog" id="'+details_id+'" aria-labelledby="'+details_id+'-title" data-lenis-prevent><form method="dialog"><button class="hok-dialog-close" aria-label="Close project">Close ×</button></form><img src="'+project['image']+'" alt="'+E(project['name'],quote=True)+' portfolio artwork" loading="lazy" width="1200" height="800"><div class="hok-dialog-copy"><span class="hok-eyebrow">'+E(project['type'])+'</span><h2 id="'+details_id+'-title">'+E(project['name'])+'</h2><p>'+E(project['description'])+'</p><div class="hok-next-links"><a href="'+project['service']+'">Explore related services ↗</a><a href="'+project['source']+'" target="_blank" rel="noopener noreferrer">Published source ↗</a></div></div></dialog></article>')
filters=''.join('<button type="button" data-portfolio-filter="'+value+'" aria-pressed="'+('true' if value=='all' else 'false')+'">'+label+'</button>' for value,label in [('all','All work'),('healthcare','Healthcare concepts'),('infrastructure','Infrastructure'),('production','Production')])
portfolio='<section class="hok-portfolio-hero"><span class="hok-eyebrow">House of Karma / Selected work</span><h1>Work that<br>connects.</h1><div class="hok-portfolio-intro"><p>Healthcare ideas.<br>Connected capabilities.<br>Considered execution.</p><p>A curated view of our published healthcare concepts, internal brands, and production capabilities. Every project is labeled by type—not every showcase represents a client engagement or a live clinical system.</p></div><a class="hok-text-link" href="#selected-work">Explore the portfolio ↓</a></section><section class="hok-extension hok-work" id="selected-work"><div class="hok-work-top"><div class="hok-filters" role="group" aria-label="Filter portfolio">'+filters+'</div><p class="hok-eyebrow" id="portfolio-count" role="status" aria-live="polite">6 projects</p></div><div class="hok-project-grid">'+''.join(cards)+'</div><p class="hok-portfolio-note">Project descriptions and artwork are sourced from HOK’s published portfolio. Concepts are not verified patient outcomes, production deployments, or evidence of HIPAA compliance. <a href="https://www.hokdetroit.com/portfolio" target="_blank" rel="noopener noreferrer">See the complete HOK project library ↗</a></p></section>'
template=(PAGES/'insights.html').read_text()
doc=Document(template)
sections=[n for n in doc.nodes if n['tag']=='section' and n['parent'] and n['parent']['tag']=='main']
doc.patches.append((sections[0]['start'],sections[-1]['start'],portfolio))
output=metadata(doc.render(),'Healthcare Portfolio','Explore House of Karma healthcare design concepts, Studio Escrow infrastructure, and creative production capabilities. Each project is clearly labeled by type.')
output=output.replace('<body','<body data-hok-page="portfolio"',1)
(PAGES/'portfolio.html').write_text(miami_branding(output))
ROUTES['/portfolio']='/site-pages/portfolio.html'

for path in PAGES.rglob('*.html'):
    source=path.read_text()
    doc=Document(source)
    for node in doc.nodes:
        classes=(node['attrs'].get('class') or '').split()
        href=node['attrs'].get('href')
        if node['tag']=='a' and 'nav_link' in classes and href=='/our-process':
            tag=source[node['start']:node['inner']].replace('href="/our-process"','href="/portfolio"').replace(' w--current','').replace(' aria-current="page"','')
            doc.patches.append((node['start'],node['inner'],tag))
            doc.set(node,'Portfolio')
        if node['tag']=='a' and 'nav_link' in classes and href=='/services' and 'data-hok-service-menu' not in source:
            submenu='<details class="hok-nav-services" data-hok-service-menu><summary class="is-b-s hok-service-trigger">Services <span aria-hidden="true">⌄</span></summary><div class="hok-nav-service-list"><a href="/services">All healthcare services</a>'+''.join('<a href="/services/'+s['slug']+'">'+E(s['name'])+'</a>' for s in DATA['services'])+'<a href="/services/emr-patient-portals">EMR & patient portals</a><a href="/services/telehealth">Telehealth portals</a><a href="/services/hipaa-infrastructure">HIPAA infrastructure</a><a href="/services/paid-media-seo">Paid ads & SEO</a></div></details>'
            doc.patches.append((node['start'],node['end']+len('</a>'),submenu))
    if 'data-hok-process-link' not in source:
        for node in doc.select('nav_dropdown'):
            doc.patches.append((node['end'],node['end'],'<a class="is-b-s nav_dropdown-link" data-hok-process-link href="/our-process">Our process</a>'))
    if 'data-hok-footer-services' not in source:
        for node in doc.select('fter_links'):
            extra='<a class="fter_link w-inline-block" data-hok-footer-services href="/portfolio"><div class="fter_link_txt">Portfolio</div></a>'
            extra+=''.join('<a class="fter_link w-inline-block" href="/services/'+s['slug']+'"><div class="fter_link_txt">'+E(s['short'])+'</div></a>' for s in DATA['services'])
            doc.patches.append((node['end'],node['end'],extra))
    if path.name in ('index.html','pipeline.html','what-we-do.html') and 'id="specialist-services"' not in source:
        main=next(n for n in doc.nodes if n['tag']=='main')
        candidates=[n for n in doc.nodes if n['parent'] is main and n['tag']=='section']
        target=next((n for n in candidates if 'is-insights' in (n['attrs'].get('class') or '').split()),candidates[-1])
        doc.patches.append((target['start'],target['start'],directory()))
    if path.name=='pipeline.html': doc.many('pipe-hero_head_heading',['Connected services. Purpose-built for healthcare.'])
    output=doc.render()
    if '/healthcare-pages.css' not in output: output=output.replace('</head>','<link rel="stylesheet" href="/healthcare-pages.css"></head>')
    if '/healthcare-pages.js' not in output: output=output.replace('</body>','<script src="/healthcare-pages.js" defer></script></body>')
    path.write_text(miami_branding(output))

(ROOT/'site-manifest.json').write_text(json.dumps(ROUTES,indent=2)+'\n')
print('Added four dedicated service pages, portfolio, local project artwork, and sitewide navigation.')
