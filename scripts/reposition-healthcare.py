import html
import json
import re
import subprocess
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASELINE = '54e3b19'
VOID = set('area base br col embed hr img input link meta param source track wbr'.split())

class Document(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.source, self.nodes, self.stack, self.texts, self.patches = source, [], [], [], []
        self.lines = [0]
        self.lines += [m.end() for m in re.finditer('\n', source)]
        self.feed(source)
    def pos(self):
        line, col = self.getpos()
        return self.lines[line - 1] + col
    def handle_starttag(self, tag, attrs):
        start = self.pos()
        node = dict(tag=tag, attrs=dict(attrs), start=start, inner=start+len(self.get_starttag_text()), end=None, parent=self.stack[-1] if self.stack else None)
        self.nodes.append(node)
        if tag not in VOID: self.stack.append(node)
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if self.stack and self.stack[-1]['tag'] == tag:
            self.stack.pop()
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1, -1, -1):
            if self.stack[i]['tag'] == tag:
                self.stack[i]['end'] = self.pos()
                self.stack = self.stack[:i]
                break
    def handle_data(self, data):
        if not self.stack or self.stack[-1]['tag'] in ('script','style'): return
        start = self.pos()
        end = self.source.find('<', start)
        if end == -1: end = len(self.source)
        self.texts.append((start, end, data, self.stack[-1]))
    def select(self, cls):
        return [n for n in self.nodes if cls in (n['attrs'].get('class') or '').split()]
    def set(self, node, text, markup=False):
        if node['end'] is not None:
            self.patches.append((node['inner'], node['end'], text if markup else html.escape(text)))
    def many(self, cls, values):
        nodes = self.select(cls)
        for i, n in enumerate(nodes):
            self.set(n, values[i % len(values)])
    def render(self):
        # Prefer container-level copy changes over any contained text-node changes.
        accepted = []
        unique = {(start, end): (start, end, value) for start, end, value in self.patches}
        for patch in sorted(unique.values(), key=lambda p: (p[0], -p[1])):
            if accepted and patch[0] < accepted[-1][1]: continue
            accepted.append(patch)
        source = self.source
        for start, end, value in reversed(accepted): source = source[:start] + value + source[end:]
        return source

SERVICES = [
    ('ranibizumab', 'healthcare-marketing', 'Healthcare Marketing', 'Brand, web & content', 'Medical practices', 'Strategy & execution', 'House of Karma', 'Build trust before the first appointment. Healthcare brand strategy, identity, patient-facing websites, conversion-focused landing pages, content production, reputation management, and referral campaigns work together as one acquisition system.'),
    ('natalizumab', 'emr-patient-portals', 'EMR & Patient Portals', 'Clinical systems', 'Care teams & patients', 'Custom architecture', 'House of Karma', 'We architect custom EMR systems, EHR integrations, secure patient dashboards, intake flows, appointment experiences, and referral portals around your clinical workflow. Integration scope, access controls, data migration, testing, and vendor permissions are defined before development.'),
    ('vedolizumab', 'telehealth', 'Telehealth Portals', 'Virtual care journeys', 'Virtual-first practices', 'Custom implementation', 'House of Karma', 'Connect discovery, consent, scheduling, secure intake, virtual visits, and follow-up in a coordinated telehealth experience. Clinical delivery and patient data require approved vendors, appropriate BAAs, role-based access, and a practice-specific compliance review.'),
    ('ocrelizumab', 'paid-media-seo', 'Paid Ads & SEO', 'Search & acquisition', 'Local & national growth', 'Ongoing optimization', 'House of Karma', 'Healthcare Google Ads, paid social, local SEO, technical SEO, service-page content, and conversion optimization connect qualified demand to your practice. We evaluate policy eligibility, consent, and measurement boundaries before launching campaigns; PHI must not enter advertising platforms.'),
    ('guselkumab', 'hipaa-infrastructure', 'HIPAA Infrastructure', 'CRM & automation', 'Healthcare operations', 'Configured deployment', 'Studio Escrow', 'Studio Escrow powers the CRM and automation layer: secure intake, patient communications, scheduling, referral tracking, audit logs, and role-based access. HIPAA-compliant operation depends on the contracted Medical Suite, signed BAAs, appropriate configuration, and your organization’s policies and training.'),
]
SERVICE_MAP = {s[0]: s for s in SERVICES}
ROUTES = {'/pipeline': '/services', '/partnerships': '/studio-escrow', '/careers': '/our-process'}
ROUTES.update({'/pipeline/'+s[0]: '/services/'+s[1] for s in SERVICES})

COMMON = {
 '.polpharmabiologics.com': 'Current deployment', 'Linkedin': 'Explore services',
 'Impact-driven': 'Patient-centered', 'Biosimilars': 'Growth systems',
 'Biosimilarity isn’t discovered. It’s engineered.': 'Healthcare growth isn’t luck. It’s engineered.',
 'Precision in every molecule.': 'Marketing. Infrastructure. One connected system.',
 'A pure-play biosimilar company with an international track record.': 'A healthcare marketing agency. A systems architecture partner.',
 'Built to accelerate biosimilars development – cell to sell.': 'Built in Detroit. Connecting patient acquisition to care delivery.',
 'We produce impact-driven biosimilars. From concept to commercial supply.': 'We build healthcare growth systems. From first search to patient follow-up.',
 'We know as programs pass through various stages of development, they need specific experience and focused attention.': 'We know as healthcare organizations grow, their marketing and infrastructure need specialist expertise and connected thinking.',
 "We don't just develop molecules.": 'We don’t just run campaigns.',
 'We manage the interfaces.': 'We connect the entire patient journey.',
 'as programs pass': 'as practices grow,', 'through various stages': 'their marketing and', 'of development, they need': 'infrastructure need',
 'specific experience and focused attention.': 'specialist expertise and connected thinking.',
 'To keep every program seamlessly moving as one system, from concept to commercial supply.': 'To connect every stage of your patient journey, from the first search to long-term care.',
 'Our goal is to keep every program seamlessly moving as one system, from concept to commercial supply.': 'Our goal is to connect every stage of your patient journey, from the first search to long-term care.',
 'Full biosimilar lifecycle.': 'The complete patient journey.', 'One global development strategy.': 'One connected growth strategy.',
 'Swiss engineered, supplied globally': 'Detroit built. Healthcare focused.',
 'A foundation for reach': 'Built to be found', 'A clean track record': 'Privacy by design',
 'Built for continuity': 'Connected to care', 'One point, full orchestration': 'One partner. Every system.',
 'We build every program to be regulatory-ready across geographies, giving our commercial partners the fastest possible path to their markets.': 'Brand strategy, healthcare SEO, Google Ads, paid media, and content help the right patients discover your practice and understand their next step.',
 'Development pathways built on regulatory rigor, so partners commercialize with certainty. Every product we’ve brought to approval cleared without regulatory objections.': 'We plan data flows, permissions, consent, and vendor agreements before launch. HIPAA infrastructure and advertising policy readiness are built into the project scope.',
 'Coordinated manufacturing and distribution networks designed to keep supply steady, even at scale.': 'EMR integrations, patient dashboards, telehealth portals, and Studio Escrow CRM connect front-end experiences to the workflows behind them.',
 'A single accountable partner coordinating best-in-class development, manufacturing and commercial supply — so partners can focus on getting products to market.': 'A single strategy across identity, websites, patient acquisition, secure systems, and automation — so your team can focus on care.',
 'Market Reach': 'Patient Acquisition', 'Regulatory, IP': 'Privacy, Policy', 'Quality': 'Trust', 'Supply Reliability': 'Connected Systems', 'Partnership Model': 'One Growth Partner',
 'From concept to commercial supply': 'From first search to lasting care',
 'We cover the full biosimilar lifecycle': 'We connect the complete patient journey',
 'A strong intellectual property landscape assessment guides development, differentiation and long-term value creation.': 'Start with a clear strategy. Connect the brand, acquisition channels, clinical workflows, and infrastructure that make sustainable healthcare growth possible.',
 'Development': 'Strategy & design', 'Regulatory': 'Policy & readiness', 'Commercial supply': 'Launch & acquisition', 'Lifecycle management': 'Optimize & support',
 'Designed for scale from day one': 'Brand strategy, identity, and healthcare positioning',
 'GMP manufacturing built for compliance': 'Patient-facing websites and conversion-focused UX',
 'Tech transfer managed end-to-end': 'EMR integrations and secure patient dashboards',
 'Clinical strategy, study planning, execution & reporting': 'Telehealth journeys, scheduling, and patient intake',
 'Innovation-led device development focused on usability & access': 'CRM architecture and Studio Escrow automation',
 'One unified regulatory strategy': 'HIPAA scope, BAAs, and access-control planning',
 'Dossier built for global submission': 'LegitScript application readiness and documentation',
 'Inspection readiness from the start': 'Google Ads healthcare policy and eligibility review',
 'Supply continuity built into the program': 'Healthcare Google Ads and paid social campaigns',
 'Launch planning across global markets': 'Local SEO, technical SEO, and service-line content',
 'Operational risk managed proactively': 'Privacy-conscious attribution and conversion optimization',
 'Post-approval changes handled in-house': 'Ongoing campaign and platform improvements',
 'Label extensions and process updates': 'Referral workflows, reputation, and patient retention',
 'Accountable long after launch': 'Reporting, maintenance, and long-term support',
 'Biosimilars pipeline': 'Healthcare services',
 'Molecules that  support long-term economic sustainability.': 'Connected capabilities for patient acquisition, experience, and operations.',
 'Program': 'Service', 'Reference drug': 'Focus', 'Reference Drug': 'Focus', 'Therapeutic area': 'Built for', 'Status': 'Delivery', 'Partner': 'Powered by', 'partner': 'Powered by',
 'Pipeline': 'Services', 'Partnerships': 'Studio Escrow', 'Careers': 'Our process',
 'Meet the team of experts behind every program': 'Expertise behind every patient journey',
 'Deep expertise. Lean by intention.': 'Marketing and systems capabilities. Retained reference imagery is illustrative, not our personnel.',
 'The right partner changes everything': 'Build infrastructure. Not just ads.',
 'Our partnerships are built on trust, ownership, and long-term commitment.': 'House of Karma connects healthcare marketing, patient experiences, and the systems that power them.',
 'Precision starts': 'Better growth starts',
 "Tell us about your program, your molecule, or your question. We'll take it from there.": 'Tell us about your practice, growth goals, or systems. Business inquiries only — do not include patient information or PHI.',
 'Program inquiry': 'Healthcare systems', 'Media & press': 'Marketing & growth',
 'Our office': 'Detroit & nationwide',
 'Polpharma Biologics International AG,': 'House of Karma',
 'Erlenring 2, 6343 Rotkreuz, Switzerland': 'Detroit, Michigan · Serving healthcare organizations nationwide',
 'office@polpharmabiologics.ch': 'concierge@hokdetroit.com',
 '© 2026 Polpharma Biologics. All rights reserved.': '© 2026 House of Karma. All rights reserved.',
 'Made by': 'Infrastructure by', 'Widelab': 'Studio Escrow',
 'Terms of use': 'Contact & inquiries', 'Imprint': 'Agency details', 'Code of conduct': 'Our approach', 'Third-party code of conduct': 'Studio Escrow',
 'About this program': 'About this service', 'In-market brands': 'Core capabilities', 'Commercialization partners': 'Delivery partner',
 "Whether you’re a partner, patient advocate, or future team member, we’d love to hear from you.": 'Let’s connect your marketing and infrastructure. Call 313-351-0279 or email concierge@hokdetroit.com. For business inquiries only; never send patient information here.',
}

HOME_STATS = ['2', '1', 'BAA · Access · Audit', 'Detroit, MI', 'Local · Regional · National', '5']
HOME_LABELS = ['Connected disciplines', 'Accountable partner', 'Infrastructure foundations', 'Built in Detroit', 'Healthcare reach', 'Service pillars']
SERVICE_HEADINGS = ['Healthcare branding & websites', 'EMR, dashboards & telehealth', 'HIPAA & policy readiness', 'Paid ads & healthcare SEO', 'CRM, automation & support']
SERVICE_DESCRIPTIONS = [
 'Position your practice with clarity. We bring together brand strategy, visual identity, messaging, websites, content production, and conversion-focused design.',
 'Every experience is designed around patient needs, your services, and the next meaningful action — not just visual appeal.',
 'Architect systems around the way your team delivers care: custom EMR workflows, patient dashboards, secure intake, referral portals, and virtual care experiences.',
 'We scope EHR integrations, permissions, data migration, and clinical requirements before development. Studio Escrow complements your clinical record system rather than replacing it.',
 'Plan HIPAA responsibilities, vendor agreements, access controls, audit logging, and data handling before systems go live. Your organization retains responsibility for its compliance program.',
 'We also support LegitScript application readiness and healthcare advertising policy review. Certification and ad approval are determined by the relevant organizations, never guaranteed by us.',
 'Reach the right patients with Google Ads, paid social, local search, technical SEO, and service-line content. Tie acquisition to a considered website and intake journey.',
 'Measurement is designed around privacy boundaries. We do not send PHI to advertising platforms or use sensitive health data for prohibited targeting.',
 'Studio Escrow powers CRM pipelines, secure communication workflows, scheduling, referral tracking, and automation in an appropriately configured Medical Suite environment.',
 'We provide ongoing reporting, optimization, maintenance, and support. BAAs and configuration are reviewed for the specific tools and workflows in scope.',
]
SERVICE_ROWS = [
 'Healthcare brand strategy and positioning', 'Visual identity, messaging, and patient trust', 'Conversion-focused websites and landing pages', 'Content production, photography, and video', 'Patient education and service-line content', 'Accessibility and patient experience planning',
 'Custom EMR architecture and EHR integrations', 'Secure patient dashboards and referral portals', 'Telehealth scheduling, consent, and intake', 'Role-based access and data migration planning',
 'HIPAA scoping, BAA coordination, and access controls', 'LegitScript application and documentation support', 'Google Ads healthcare policy readiness',
 'Google Ads and paid social campaign management', 'Local SEO, technical SEO, and content marketing', 'Privacy-conscious measurement and conversion optimization',
 'Studio Escrow CRM pipelines and lead routing', 'Scheduling, patient follow-up, and referral workflows', 'Reputation management and retention systems', 'Reporting, maintenance, and long-term support',
]

ARTICLE_TOPICS = [
 ('healthcare-growth-systems', 'Healthcare growth starts with connected systems', 'Brand, website, search, intake, CRM, and care operations should work as one patient journey. We begin by mapping the points where patients and teams lose momentum, then define the systems and responsibilities needed to connect them.'),
 ('emr-integration-planning', 'Plan your EMR integration before you build', 'Define the system of record, vendor permissions, data fields, workflows, and access roles before development. API, FHIR, or HL7 availability must be confirmed with the specific EHR vendor and licensed environment.'),
 ('patient-dashboard-design', 'Designing a clearer patient dashboard', 'A useful patient portal makes the next action clear: intake, appointments, records access, or secure communication. Authentication, role permissions, audit trails, and accessibility are implementation requirements, not decorative features.'),
 ('telehealth-patient-journey', 'Connecting the telehealth patient journey', 'Virtual care needs more than a video link. Discovery, eligibility, consent, scheduling, secure intake, visit access, and follow-up should form one understandable journey for patients and care teams.'),
 ('healthcare-google-ads', 'Google Ads for healthcare: readiness comes first', 'Healthcare advertising eligibility varies by service, location, and platform policy. Review the service offering, licensing, landing pages, required certifications, and measurement plan before launching campaigns.'),
 ('legitscript-readiness', 'Preparing for a LegitScript application', 'Application support can include an eligibility review, documentation checklist, website disclosures, and remediation planning. LegitScript independently evaluates applications; neither certification nor advertising approval can be guaranteed.'),
 ('healthcare-local-seo', 'Local SEO built around patient intent', 'Build accurate location information, useful service pages, sound technical foundations, and a consistent reputation strategy. Focus on helping patients find relevant care rather than promising rankings or publishing unsupported medical claims.'),
 ('hipaa-workflow-design', 'HIPAA-ready infrastructure is a shared responsibility', 'A platform and BAA are part of the foundation, not a complete compliance program. Organizations must evaluate workflows, vendors, access controls, risk, policies, staff training, and incident-response responsibilities.'),
 ('studio-escrow-medical-suite', 'Where Studio Escrow fits in your healthcare stack', 'Studio Escrow provides the CRM and automation layer alongside your clinical record system. Its published Medical Suite includes a BAA, access controls, audit logging, scheduling, referral tracking, and patient communication capabilities, subject to contracted scope and configuration.'),
 ('privacy-conscious-attribution', 'Measure growth without exposing patient information', 'Keep patient information out of advertising pixels and campaign platforms. Review tracking events, URLs, forms, consent requirements, and vendor agreements before choosing an attribution approach.'),
 ('healthcare-brand-strategy', 'Healthcare branding is a foundation for trust', 'Clear positioning, consistent identity, readable content, and useful service information help patients understand your practice. Creative strategy should reflect real capabilities without implying outcomes you cannot substantiate.'),
 ('secure-intake-design', 'Make intake easier without compromising data handling', 'Ask only for necessary information and route it into an approved workflow. Public marketing inquiries and clinical intake should remain distinct; PHI requires appropriate security, access controls, and vendor agreements.'),
 ('referral-workflows', 'Build a clearer physician referral workflow', 'Define referral sources, ownership, status changes, required information, and follow-up responsibilities. Role-based dashboards can help teams coordinate without giving every user unnecessary access to patient records.'),
 ('patient-communication', 'Designing patient communication workflows', 'Choose channels, consent language, message content, and escalation paths around the specific use case. Sensitive information should not be placed in unapproved messaging, automation, or AI tools.'),
 ('healthcare-reputation', 'Reputation management with patient privacy in mind', 'Create a consistent review-request process and a thoughtful response policy. Public responses should not confirm a patient relationship or disclose treatment details, even when a reviewer has shared them.'),
 ('care-team-access', 'Give care teams the access they actually need', 'Define roles and permissions before connecting systems. User provisioning, access review, audit logging, and timely offboarding belong in the operating plan for every patient-facing application.'),
 ('healthcare-content', 'Useful content for a complex care decision', 'Patient education should be clear, accurate, accessible, and reviewed by appropriate clinical stakeholders. Connect service pages, FAQs, and practice information to a straightforward next step.'),
 ('healthcare-website-strategy', 'Your healthcare website is part of the system', 'A website should connect patient intent to a useful next action while respecting data boundaries. Brand, content, accessibility, search visibility, and intake architecture should be planned together.'),
 ('crm-routing', 'Lead routing that supports the care team', 'Map inquiry types, team ownership, response expectations, and escalation rules before automating. Keep general marketing inquiries separate from clinical information and route each into an appropriate system.'),
 ('healthcare-automation', 'Automate the handoffs, not the responsibility', 'Automation can reduce repetitive work across scheduling, follow-up, and referral coordination. Human review, exception handling, permissions, and monitoring remain essential for healthcare workflows.'),
 ('healthcare-launch-checklist', 'A connected healthcare launch checklist', 'Review content, accessibility, forms, routing, integrations, analytics, security, vendor scope, and staff readiness before release. A controlled launch makes it easier to identify gaps before scaling acquisition.'),
 ('healthcare-reporting', 'Reporting that connects marketing to operations', 'Choose measures your team can act on: qualified inquiries, appointment workflows, referral status, and funnel friction. Reporting should use appropriate aggregation, permissions, and privacy controls.'),
 ('healthcare-growth-partner', 'Choose a partner for the entire patient journey', 'The right partner understands both acquisition and operations. House of Karma connects healthcare strategy, creative execution, marketing, custom systems, and Studio Escrow infrastructure around a coordinated plan.'),
]

manifest = json.loads(subprocess.check_output(['git','show',BASELINE+':site-manifest.json'],cwd=ROOT,text=True))
original_routes = dict(manifest)
article_routes = [r for r in original_routes if r.startswith('/insights/')]
article_map = {r:ARTICLE_TOPICS[i % len(ARTICLE_TOPICS)] for i,r in enumerate(article_routes)}
ROUTES.update({r:'/insights/'+topic[0] for r,topic in article_map.items()})

for route, destination in original_routes.items():
    relative = 'public' + destination
    source = subprocess.check_output(['git','show',BASELINE+':'+relative],cwd=ROOT,text=True)
    doc = Document(source)
    local = dict(COMMON)
    for s in SERVICES:
        original_name = s[0].capitalize()
        local[original_name] = s[2]
    for start,end,value,node in doc.texts:
        stripped = value.strip()
        if stripped in local:
            doc.patches.append((start,end,html.escape(local[stripped])))
        elif 'The controller of your data is Polpharma' in value:
            doc.patches.append((start,end,'Business inquiries only. Do not submit patient records, medical details, or other protected health information through this public website. For your inquiry, contact concierge@hokdetroit.com. '))
        elif 'I hereby consent to be sent commercial information' in value:
            doc.patches.append((start,end,'I agree to be contacted by House of Karma about my business inquiry. I will not include patient information or PHI.'))

    doc.many('join_h2',['Build the systems that connect your next patient to your practice.'])
    doc.many('ins-row_left_txt',['02','11','2026'])
    doc.many('home-how-it-works_stat-label', HOME_LABELS)
    doc.many('home-how-it-works_stat-value', HOME_STATS)
    doc.many('pipeline_table_row_txt', [item for s in SERVICES for item in s[2:7]])
    doc.many('pipeline_logos_label', ['Our connected capabilities'])
    doc.many('team-m_info_txt', ['Healthcare strategy','Brand & acquisition','Systems architecture','EMR & patient experience','Growth marketing','Paid media & healthcare SEO','Connected operations','Studio Escrow CRM & automation'])
    doc.many('board-item_info_name', ['Brand strategy','Patient experience','Systems architecture','Healthcare SEO','Paid media','CRM & automation','Content production','Privacy-aware design'])
    doc.many('board-item_info_role', ['Service capability · illustrative reference portrait'])
    doc.many('wwd_team_caption', ['Specialist capabilities · reference imagery'])
    doc.many('behind_category_title', ['Strategy & creative','Patient experience','Growth & acquisition','Systems & operations'])
    for n in doc.select('pipeline_logo_visual'):
        index = doc.select('pipeline_logo_visual').index(n)
        doc.set(n, '<span class="hok-capability">'+['Brand strategy','Healthcare SEO','Google Ads','Patient portals','Telehealth','EMR systems','Studio Escrow','LegitScript support'][index % 8]+'</span>', True)
    for n in doc.select('nav_logo'):
        doc.set(n, '<span class="hok-wordmark" aria-label="House of Karma">house of karma<span>HEALTHCARE GROWTH & SYSTEMS</span></span>', True)
    # The original footer wordmark is vector text, not editable HTML copy.
    for n in doc.nodes:
        classes = n['attrs'].get('class','') or ''
        if 'footer' in classes and ('logo' in classes or 'wordmark' in classes) and n['end'] is not None:
            if '<svg' in source[n['inner']:n['end']]:
                doc.set(n, '<span class="hok-footer-wordmark">house of karma</span>', True)

    if route == '/what-we-do':
        doc.many('header_heading',['How we build','healthcare growth'])
        doc.many('header_p',['Marketing and infrastructure. Connected by design.'])
        doc.many('how-work_heading',['Healthcare growth needs a connected brand, patient journey, and operational foundation. We build all three.'])
        doc.many('how-work_grid_p',['House of Karma combines creative strategy, healthcare marketing, and custom systems architecture. Studio Escrow powers the CRM and automation layer, with compliance requirements scoped to each organization.'])
        doc.many('bullet-point_txt',SERVICE_HEADINGS)
        doc.many('content_heading',SERVICE_HEADINGS)
        doc.many('wwd_desc_title',['Trust starts before the first visit.','Built around your care delivery.','Readiness before launch.','Reach the right patients.','Connected long after launch.'])
        doc.many('wwd_desc_p',SERVICE_DESCRIPTIONS)
        doc.many('nb-table-row_p',SERVICE_ROWS)
    elif route == '/about-us':
        doc.many('header_heading',['The agency','behind your growth','The capabilities behind','your patient journey'])
        doc.many('header_p',['House of Karma. Detroit roots. Healthcare focus.'])
        doc.many('about-journey_heading',['Creative strategy and systems architecture. Built together for modern healthcare.','From Detroit, we connect patient acquisition, digital experiences, and care operations.'])
        doc.many('about-journey_caption',['A marketing agency and healthcare systems partner.','One strategy across brand, technology, and growth.'])
        doc.many('header-2_head_heading',['Purpose-built','for healthcare'])
        doc.many('header-2_grid_title',['House of Karma connects branding, websites, SEO, paid media, CRM, and automation. Our healthcare focus extends that approach to custom EMR systems, patient dashboards, telehealth portals, and Studio Escrow infrastructure.'])
        doc.many('nb-row_title',SERVICE_HEADINGS)
        doc.many('track-record_intro',['Discover. Design. Build. Connect. Launch. Optimize. A deliberate process for healthcare growth.'])
        for start,end,value,node in doc.texts:
            parent=node
            timeline=False
            while parent:
                if 'track-record' in (parent['attrs'].get('class') or ''): timeline=True
                parent=parent['parent']
            if timeline and value.strip():
                replacement = 'Phase' if re.fullmatch(r'\d{4}',value.strip()) else 'Connect your brand, acquisition channels, patient experiences, and operating systems through a clearly scoped delivery process.'
                if node['tag'] in ('p','h3','div'): doc.patches.append((start,end,html.escape(replacement)))
    elif route == '/partnerships':
        doc.many('part-hero_head_heading',['House of Karma builds the strategy. Studio Escrow powers the infrastructure.'])
        doc.many('part-hero_grid_title',['A connected healthcare stack: marketing, custom experiences, CRM, automation, and a properly configured Medical Suite environment.'])
        doc.many('process-row_title',['Strategy & implementation','Studio Escrow Medical Suite','Shared HIPAA responsibilities','Your clinical system stays central'])
        doc.many('process-row_p',[
            'House of Karma plans and implements the brand, acquisition, patient experience, and system integrations around your operating needs.',
            'Studio Escrow publishes a Medical Suite with a BAA, secure communication workflows, role-based access, audit logging, scheduling, and referral tracking.',
            'HIPAA compliance requires appropriate vendor agreements and configuration plus your organization’s policies, risk analysis, staff training, and ongoing oversight.',
            'Studio Escrow complements existing EHR and practice-management tools. Integration availability and scope must be confirmed with each vendor.'])
        doc.many('icon-card_bottom_title',['Medical practices','Virtual care teams','Multi-location organizations'])
        doc.many('icon-card_bottom_p',['Connect discovery, scheduling, and secure follow-up around the needs of your practice.','Coordinate marketing, consent, intake, and telehealth workflows with approved infrastructure.','Build repeatable routing, permissions, reporting, and operational workflows across locations.'])
        doc.many('proven-card_bottom_p',['House of Karma designs the strategy, identity, website, and patient acquisition journey.','Studio Escrow powers the CRM, automation, scheduling, and communication layer.','Clinical systems remain the record of care, with integrations scoped and validated by vendor.','Patient dashboards and referral portals are designed around appropriate permissions.','LegitScript and advertising-policy readiness are supported without guaranteeing approvals.','Security, BAAs, configuration, and operational responsibilities are reviewed before launch.'])
        for node in doc.select('eyebrow_text'):
            text=html.unescape(source[node['inner']:node['end']]).strip().lower() if node['end'] else ''
            if text in ['sandoz','ms pharma','fresenius kabi','teva','libbs','tuteur','bioeq']:
                doc.set(node,'Connected healthcare systems')
        doc.many('home-how-it-works_heading',['Your patient journey, connected. Your responsibilities, clearly defined.'])
        doc.many('partnership-process_step-title',['Discover & scope','Configure & connect','Launch & support'])
        doc.many('partnership-process_sub-text',['Practice goals, patient journeys, and current tools','PHI boundaries, permissions, and vendor agreements','CRM, scheduling, and workflow configuration','EMR and patient portal integration planning','Security review, validation, and team training','Reporting, maintenance, and ongoing optimization'])
    elif route == '/pipeline':
        doc.many('header_heading',['Healthcare services'])
        doc.many('header_p',['Marketing and systems architecture for the entire patient journey.'])
        doc.many('pipe-hero_grid_title',['From healthcare branding and acquisition to EMR architecture, patient dashboards, telehealth, and HIPAA infrastructure.'])
        doc.many('is-pipe-dev',['Healthcare growth takes more than a campaign. It takes connected strategy, patient experiences, and operational systems.'])
        doc.many('content_heading',['How we connect healthcare growth'])
        doc.many('process-row_title',['Strategy before execution','Systems built around care','Privacy-aware acquisition','Long-term partnership'])
        doc.many('process-row_p',['We connect your audience, service offering, brand, and patient journey before choosing channels or building technology.','We scope clinical-system integrations, patient experiences, and workflows around the needs of your care team.','We review data boundaries, vendor requirements, and platform policies before enabling campaigns or measurement.','Ongoing optimization and support keep your marketing and infrastructure working together.'])
    elif route.startswith('/pipeline/'):
        s=SERVICE_MAP[route.split('/')[-1]]
        doc.many('p-hero_heading',[s[2]])
        doc.many('phero_about_txt',[s[7]])
        doc.many('p-hero_phase_txt',['Discover','Strategize','Build','Validate','Optimize'])
        doc.many('bullet-point_txt-2',['Built for',s[4],'Focus',s[3],'Powered by',s[6],'Delivery',s[5]])
        doc.many('bullet-point_caption',['Built for','Focus','Powered by','Delivery'])
        doc.many('phero_partner_info_title',[s[6]])
        doc.many('phero_partner_info_country_txt',['Detroit based','Serving practices nationwide','Scoped to your systems'])
        doc.many('phero_brand_circle',[s[3],s[4],s[5]])
        doc.many('phero_partner_visual',[s[6]])
    elif route == '/careers':
        doc.many('header_heading',['A connected path to healthcare growth'])
        doc.many('header_p',['Strategy first. Systems connected. Support beyond launch.'])
        doc.many('is-careers-hero',['We connect the work that brings patients to your practice with the systems that support their experience.','A structured process built around your goals, clinical workflows, and infrastructure requirements.'])
        doc.many('open_header_head_heading',['Strategists, creatives, and systems architects'])
        doc.many('open_header_title',['Your project brings together the disciplines needed to connect acquisition, patient experience, and operations. Retained reference imagery is illustrative.'])
        doc.many('icon-card_bottom_title',SERVICE_HEADINGS)
        doc.many('icon-card_bottom_p',[s[7] for s in SERVICES])
        doc.many('careers-process_title',['Discover','Strategize','Design','Build & integrate','Validate','Launch & optimize'])
        doc.many('careers-process_row-label',['Discover','Strategize','Design','Build','Validate','Launch'])
        doc.many('careers-process_description',[
            'Understand your practice, audience, goals, and current technology. Map the patient journey and operational gaps.',
            'Define priorities, success measures, scope, vendor responsibilities, and the infrastructure needed to support growth.',
            'Develop brand direction, content, interfaces, and workflows around patient needs and team responsibilities.',
            'Implement the website, campaigns, CRM, automations, and scoped clinical-system connections.',
            'Review permissions, data handling, accessibility, routing, integrations, and team readiness before launch.',
            'Monitor performance, refine campaigns, maintain systems, and support the next stage of growth.'])
        for start,end,value,node in doc.texts:
            if 'biosimilar development' in value or 'senior team where' in value:
                doc.patches.append((start,end,'Clear ownership and connected delivery across strategy, creative, marketing, and healthcare systems.'))

    if route.startswith('/insights/'):
        topic=article_map[route]
        doc.many('bpost-hero_header_heading',[topic[1]])
        rich=[n for n in doc.nodes if 'w-richtext' in (n['attrs'].get('class') or '')]
        for n in rich:
            doc.set(n, '<h2>'+html.escape(topic[1])+'</h2><p>'+html.escape(topic[2])+'</p><h2>How House of Karma helps</h2><p>We connect healthcare brand strategy, websites, SEO, paid media, custom EMR architecture, patient dashboards, telehealth portals, and Studio Escrow CRM infrastructure. Every engagement starts with your workflow, goals, data boundaries, and implementation scope.</p><h2>Define the requirements before launch</h2><p>Validate vendor capabilities, access permissions, BAAs where applicable, advertising eligibility, and operational responsibilities. LegitScript certification and advertising approvals are determined independently; healthcare compliance requires an ongoing organizational program.</p><p><a href="/contact">Discuss your healthcare growth strategy</a> · <a href="https://www.studioescrow.cloud" target="_blank" rel="noopener noreferrer">Explore Studio Escrow</a></p><p>Educational guidance, not legal or clinical advice. Retained visuals are illustrative.</p>',True)
    if route in ('/privacy-policy','/cookies-policy'):
        for n in doc.nodes:
            if 'w-richtext' in (n['attrs'].get('class') or ''):
                doc.set(n, '<h2>House of Karma website information</h2><p>This public website describes healthcare marketing and systems services. It is not a patient portal or a clinical intake system. Do not submit protected health information, patient records, or medical details.</p><h2>Business inquiries</h2><p>Contact <a href="mailto:concierge@hokdetroit.com">concierge@hokdetroit.com</a> or <a href="tel:+13133510279">313-351-0279</a> for agency inquiries. Form delivery in this preview is not connected.</p><h2>Cookies and preferences</h2><p>The cookie-preference controls remain available. Third-party functionality and any future analytics require review of the deployed configuration and applicable consent requirements.</p><h2>Healthcare infrastructure</h2><p>Production patient systems require a separately configured environment, appropriate agreements, access controls, and an organizational compliance program. The marketing website itself is not a demonstration of HIPAA compliance.</p><h2>Before publication</h2><p>Final privacy and cookie notices must be reviewed against actual collection, vendors, retention, and rights-handling practices. These notes do not replace a reviewed production privacy policy.</p>',True)
        doc.many('header_p',['House of Karma · Detroit, Michigan · concierge@hokdetroit.com'])
        for node in doc.nodes:
            if node['tag']=='table':
                doc.set(node,'<tbody><tr><th>Deployment review</th><td>Inventory actual cookies, vendors, purposes, and retention before publishing a final notice.</td></tr></tbody>',True)

    # Rewrite related editorial headlines globally so old press releases do not imply HOK partnerships.
    for cls in ['ins-card_top_title','art-small_title','ins-row_left_title']:
        nodes=doc.select(cls)
        for i,n in enumerate(nodes):
            parent=n
            href=''
            while parent:
                if parent['tag']=='a': href=parent['attrs'].get('href',''); break
                parent=parent['parent']
            topic=article_map.get(href,ARTICLE_TOPICS[i % len(ARTICLE_TOPICS)])
            doc.set(n,topic[1])
    for node in doc.nodes:
        if node['tag'] != 'a': continue
        href=node['attrs'].get('href','') or ''
        target=None
        if href.startswith('tel:'): target='tel:+13133510279'
        elif href.lower().endswith('.pdf'): target='/contact'
        elif href.startswith(('https://','http://')):
            target='https://www.studioescrow.cloud' if 'widelab' in href else 'https://www.hokdetroit.com'
        if target:
            tag=source[node['start']:node['inner']]
            tag=re.sub(r'href=([\"\x27]).*?\1', 'href="'+target+'"',tag)
            doc.patches.append((node['start'],node['inner'],tag))
    output=doc.render()
    for old,new in sorted(ROUTES.items(),key=lambda x:len(x[0]),reverse=True):
        output=output.replace('href="'+old+'"','href="'+new+'"')
    output=re.sub(r'mailto:[^"<>\s]+', 'mailto:concierge@hokdetroit.com', output)
    output=re.sub(r'href="https?://[^\"]*(?:linkedin\.com|widelab\.co)[^\"]*"', 'href="https://www.hokdetroit.com"', output)
    output=output.replace('Polpharma Biologics International AG','House of Karma').replace('Polpharma Biologics','House of Karma')
    output=re.sub(r'<title>.*?</title>', '<title>House of Karma | Healthcare Marketing & Systems Architecture</title>',output,flags=re.S)
    for attr in ['name="description"','property="og:description"','name="twitter:description"']:
        output=re.sub(r'<meta\b(?=[^>]*'+re.escape(attr)+r')[^>]*>', '<meta '+attr+' content="House of Karma connects healthcare marketing, custom EMR systems, patient dashboards, telehealth portals, paid ads, SEO, and Studio Escrow infrastructure.">',output)
    output=re.sub(r'<meta\b(?=[^>]*(?:property="og:title"|name="twitter:title"))[^>]*>', '<meta property="og:title" content="House of Karma | Healthcare Marketing & Infrastructure">',output)
    output=output.replace('</head>', '<link rel="stylesheet" href="/healthcare-brand.css"></head>')
    original_scripts = iter(re.findall(r'<script\b[^>]*>.*?</script>', source, flags=re.S | re.I))
    output = re.sub(r'<script\b[^>]*>.*?</script>', lambda _: next(original_scripts), output, flags=re.S | re.I)
    (ROOT/relative).write_text(output)
    print('UPDATED',route)

for old,new in ROUTES.items():
    manifest[new]=manifest[old]
(ROOT/'site-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Healthcare content migration complete; original media and animation scripts preserved.')
