import html
import json
from pathlib import Path
from site_document import Document
from miami_branding import miami_branding

ROOT = Path(__file__).resolve().parents[1]
PAGES = ROOT / 'public/site-pages'
routes = json.loads((ROOT / 'site-manifest.json').read_text())
groups = [
    ('01', 'House of Karma', [('Home','/'),('About us','/about-us'),('Meet the founder','/about-us#founder'),('What we do','/what-we-do'),('Our process','/our-process'),('Portfolio','/portfolio'),('Insights','/insights')]),
    ('02', 'Growth & creative', [('All services','/services'),('Healthcare marketing','/services/healthcare-marketing'),('SEO & AI SEO','/services/healthcare-seo-ai-seo'),('Web design','/services/healthcare-web-design'),('Brand strategy','/services/healthcare-branding'),('Content & production','/services/healthcare-content'),('Paid media','/services/paid-media-seo')]),
    ('03', 'Connected systems', [('Studio Escrow','/studio-escrow'),('EMR & patient portals','/services/emr-patient-portals'),('Telehealth','/services/telehealth'),('HIPAA infrastructure','/services/hipaa-infrastructure'),('Start a project','/contact')])
]
def link(label, href):
    return '<a href="'+html.escape(href,quote=True)+'"><span>'+html.escape(label)+'</span><span aria-hidden="true">↗</span></a>'
columns=''.join('<section class="hok-mega-column"><h3><span>'+number+'</span>'+html.escape(title)+'</h3>'+''.join(link(label,href) for label,href in links)+'</section>' for number,title,links in groups)
canonical = {destination: route for route,destination in routes.items()}
articles=[]
for destination,route in canonical.items():
    if not route.startswith('/insights/'): continue
    doc=Document((ROOT/('public'+destination)).read_text())
    heading=next((n for n in doc.nodes if n['tag']=='h1'),None)
    title=html.unescape(doc.source[heading['inner']:heading['end']]) if heading else route.rsplit('/',1)[-1].replace('-',' ').title()
    import re
    title=re.sub('<[^>]+>','',title)
    articles.append(link(title,route))
menu='<dialog class="hok-mega" id="hok-mega-menu" aria-labelledby="hok-mega-title" data-lenis-prevent><div class="hok-mega-shell"><div class="hok-mega-top"><a href="/" class="hok-mega-brand">house of karma<span>DETROIT ROOTS. CONNECTED THINKING.</span></a><button type="button" class="hok-mega-close" data-hok-menu-close autofocus aria-label="Close navigation">Close <span aria-hidden="true">×</span></button></div><div class="hok-mega-intro"><div><span class="hok-mega-eyebrow">Explore House of Karma</span><h2 id="hok-mega-title">Good things.<br>Connected.</h2></div><p>Strategy, creativity, and systems.<br>Find your next move.</p></div><nav aria-label="Site navigation"><div class="hok-mega-grid">'+columns+'<aside class="hok-mega-feature"><span class="hok-mega-eyebrow">Your next chapter</span><h3>Let’s build<br>something<br>meaningful.</h3><p>Tell us where you want to go.<br>We’ll help connect the dots.</p><a href="/contact">Start a conversation <span aria-hidden="true">↗</span></a></aside></div><details class="hok-mega-library"><summary>Explore the complete insights library <span aria-hidden="true">+</span></summary><div>'+''.join(articles)+'</div></details><div class="hok-mega-bottom"><span>Detroit, Michigan · Working nationwide</span><div><a href="/privacy-policy">Privacy</a><a href="/cookies-policy">Cookies</a><a href="/contact">Contact ↗</a></div></div></nav></div></dialog>'
trigger='<button type="button" class="hok-menu-toggle" data-hok-menu-open aria-expanded="false" aria-controls="hok-mega-menu" aria-haspopup="dialog"><span>Menu</span><span class="hok-menu-icon" aria-hidden="true"><i></i><i></i></span></button>'
for path in PAGES.rglob('*.html'):
    source=path.read_text()
    doc=Document(source)
    existing=next((n for n in doc.nodes if n['attrs'].get('id')=='hok-mega-menu'),None)
    if existing: doc.patches.append((existing['start'],existing['end']+len('</dialog>'),menu))
    else: doc.patches.append((source.rfind('</body>'),source.rfind('</body>'),menu))
    if 'data-hok-menu-open' not in source:
        header=doc.select('nav_component')[0]
        doc.patches.append((header['end'],header['end'],trigger))
    output=doc.render()
    if '/mega-menu.css' not in output: output=output.replace('</head>','<link rel="stylesheet" href="/mega-menu.css"></head>')
    if '/mega-menu.js' not in output: output=output.replace('</body>','<script src="/mega-menu.js" defer></script></body>')
    path.write_text(miami_branding(output))
print('Installed single-button mega navigation on every page with all unique destinations and the complete insights library.')
