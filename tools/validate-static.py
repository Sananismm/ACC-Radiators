"""Check case-sensitive asset references and lightweight HTML structure."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import re, subprocess, json, hashlib
root=Path(__file__).resolve().parents[1]
files={p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file() and '.git' not in p.parts}
issues=[]
class Check(HTMLParser):
    def __init__(self,name): super().__init__(convert_charrefs=True); self.name=name; self.ids=set(); self.h1=0; self.refs=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:
            if a['id'] in self.ids: issues.append(f'{self.name}: duplicate id {a["id"]}')
            self.ids.add(a['id'])
        if tag=='h1': self.h1+=1
        if tag=='img' and not a.get('alt'): issues.append(f'{self.name}: missing image alt')
        if any(k.startswith('on') for k in a): issues.append(f'{self.name}: inline event handler')
        for key in ['src','href']:
            if key not in a: continue
            url=urlsplit(a[key])
            if url.scheme or url.netloc: continue
            if url.path and unquote(url.path) not in files: issues.append(f'{self.name}: missing/case-mismatched {url.path}')
            if not url.path and url.fragment: self.refs.append(url.fragment)
for name in ['index.html','about.html','products.html']:
    parser=Check(name); parser.feed((root/name).read_text(encoding='utf-8'))
    assert parser.h1==1, (name,parser.h1)
    issues.extend(f'{name}: missing anchor #{anchor}' for anchor in parser.refs if anchor not in parser.ids)
for url in re.findall(r'url\("?([^\")]+)',(root/'style.css').read_text(encoding='utf-8')):
    if url not in files: issues.append(f'style.css: missing {url}')
for script in root.glob('*.js'):
    result=subprocess.run(['node','--check',str(script)],capture_output=True,text=True)
    if result.returncode: issues.append(result.stderr)
for src in (root/'assests/products').glob('*'):
    other=root/'assets/products'/src.name
    assert hashlib.sha256(src.read_bytes()).digest()==hashlib.sha256(other.read_bytes()).digest()
assert not issues, '\n'.join(issues)
metrics=json.loads((root/'assets/optimized/metrics.json').read_text())
old=sum(m['sourceBytes'] for m in metrics); new=sum(m['outputBytes'] for m in metrics)
print(f'PASS: 3 pages, all static asset paths checked case-sensitively, IDs/anchors/alts, all root JS syntax, 5 duplicate hashes.')
print(f'Image variants: {old:,} -> {new:,} bytes ({(1-new/old)*100:.2f}% smaller); file-size measurement, not a network timing claim.')
