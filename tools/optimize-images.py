"""Regenerate compressed derivatives without changing approved source assets.
Requires Pillow (available in the bundled Codex Python runtime).
"""
from pathlib import Path
from PIL import Image, ImageOps
import json
root=Path(__file__).resolve().parents[1]
out=root/'assets/optimized';out.mkdir(exist_ok=True)
metrics=[]
for src in [root/'logo.png',root/'background.png',*sorted((root/'assets/products').glob('*.webp')),*sorted((root/'assets/images/radiators').glob('*.webp'))]:
    original=Image.open(src)
    # Preserve source transparency rather than flattening paletted logos.
    im=original.convert('RGBA' if 'A' in original.getbands() or 'transparency' in original.info else 'RGB')
    size=(480,320) if src.name=='logo.png' else (1600,1000) if src.name=='background.png' else (640,427) if 'radiators' in str(src) else (360,240)
    im.thumbnail(size,Image.Resampling.LANCZOS)
    dest=out/(src.stem+'.webp');im.save(dest,'WEBP',quality=88,method=6)
    metrics.append({'source':src.relative_to(root).as_posix(),'sourceBytes':src.stat().st_size,'sourceSize':original.size,'output':dest.relative_to(root).as_posix(),'outputBytes':dest.stat().st_size,'outputSize':im.size})
(out/'metrics.json').write_text(json.dumps(metrics,indent=2)+'\n',encoding='utf-8')
im=Image.open(root/'logo.png').convert('RGBA');im.thumbnail((64,64),Image.Resampling.LANCZOS)
canvas=Image.new('RGBA',(64,64),'white');canvas.alpha_composite(im,((64-im.width)//2,(64-im.height)//2));canvas.save(root/'assets/favicon.png',optimize=True)
social=ImageOps.pad(Image.open(root/'background.png').convert('RGB'),(1200,630),color='#F8FAFC',method=Image.Resampling.LANCZOS)
social.save(root/'assets/social.jpg',quality=88,optimize=True)
