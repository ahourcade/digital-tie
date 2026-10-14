# Genera el wordmark DIGITAL TIE desde Manrope variable. Uso: pip install fonttools brotli && TRACK=0.02 python3 scripts/logo.py 800 public/brand  (luego mover public/brand/logo-paths.json a src/data/)
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
f=TTFont('node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2')
W=int(sys.argv[1]) if len(sys.argv)>1 else 800
f=instantiateVariableFont(f,{'wght':W})
gs=f.getGlyphSet(); cmap=f.getBestCmap(); upm=f['head'].unitsPerEm
cap=f['OS/2'].sCapHeight
track=int(float(__import__('os').environ.get('TRACK','0.02'))*upm)  # letterspacing for uppercase wordmark
def glyph(ch):
    return cmap[ord(ch)]
# measure I stem
bp=BoundsPen(gs); gs[glyph('I')].draw(bp); ib=bp.bounds
stem=ib[2]-ib[0]; ilsb=ib[0]; iadv=f['hmtx'][glyph('I')][0]
parts=[]; x=0
def add(ch,cls):
    global x
    g=glyph(ch); p=SVGPathPen(gs); gs[g].draw(p)
    parts.append((cls,x,p.getCommands()))
    x+=f['hmtx'][g][0]+track
for ch in "DIGITAL": add(ch,'ink')
x+=int(0.22*upm)  # word space
add('T','ink')
# tie I
ix=x+ilsb; c=cap
kw=stem*1.6; kh=c*0.15; gap=c*0.035
kx0=ix+stem/2-kw/2
knot=f"M{kx0:.0f} {c:.0f}L{kx0+kw:.0f} {c:.0f}L{ix+stem*1.0+ (kw-stem)/4:.0f} {c-kh:.0f}L{ix-(kw-stem)/4:.0f} {c-kh:.0f}Z"
bt=c-kh-gap
# blade: slightly wider bottom, pointed tip
bw0=stem*0.78; bw1=stem*1.34; tip=c*0.13
cx=ix+stem/2
blade=(f"M{cx-bw0/2:.0f} {bt:.0f}L{cx+bw0/2:.0f} {bt:.0f}L{cx+bw1/2:.0f} {tip:.0f}"
       f"L{cx:.0f} 0L{cx-bw1/2:.0f} {tip:.0f}Z")
parts.append(('tie',0,knot+blade))
x+=iadv+track
add('E','ink')
total=x-track
ov=int(0.025*upm)
H=c+2*ov
def svg(ink,tie,title=True):
    out=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total:.0f} {H:.0f}" role="img" aria-label="DIGITAL TIE">']
    if title: out.append('<title>DIGITAL TIE</title>')
    out.append(f'<g transform="matrix(1 0 0 -1 0 {H-ov})">')
    for cls,dx,d in parts:
        fill=tie if cls=='tie' else ink
        out.append(f'<path transform="translate({dx} 0)" fill="{fill}" d="{d}"/>')
    out.append('</g></svg>')
    return ''.join(out)
open(sys.argv[2]+'/logo-digital-tie.svg','w').write(svg('#0C1525','#0066FF'))
open(sys.argv[2]+'/logo-digital-tie-white.svg','w').write(svg('#FFFFFF','#0066FF'))
open(sys.argv[2]+'/logo-digital-tie-mono.svg','w').write(svg('currentColor','currentColor'))
# path data json for inline component
import json
json.dump({'w':round(total),'h':round(H),'parts':[{'cls':c,'dx':d,'d':p} for c,d,p in parts]},open(sys.argv[2]+'/logo-paths.json','w'))
# favicon: tie I only, standalone mark (for favicon only)
mx=ix-(kw-stem)/4-stem*0.25; mw=kw+stem*0.5
print(total,H,stem)
