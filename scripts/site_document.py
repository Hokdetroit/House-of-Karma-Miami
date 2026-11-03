import html
import re
from html.parser import HTMLParser

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
        for i, node in enumerate(self.select(cls)):
            self.set(node, values[i % len(values)])
    def render(self):
        # Prefer container-level copy changes over contained text-node changes.
        unique = {(start, end): (start, end, value) for start, end, value in self.patches}
        accepted = []
        for patch in sorted(unique.values(), key=lambda p: (p[0], -p[1])):
            if accepted and patch[0] < accepted[-1][1]: continue
            accepted.append(patch)
        source = self.source
        for start, end, value in reversed(accepted): source = source[:start] + value + source[end:]
        return source
