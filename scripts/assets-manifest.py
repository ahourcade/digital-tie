#!/usr/bin/env python3
"""Genera docs/assets-manifest.md: inventario de imágenes de portfolio con dimensiones, peso y dónde se usan.
Uso: python3 scripts/assets-manifest.py  (requiere Pillow)"""
import os, re, glob
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORK = os.path.join(ROOT, 'src/assets/work')
src_text = ''
for f in glob.glob(os.path.join(ROOT, 'src/**/*.*'), recursive=True):
    if f.endswith(('.ts', '.astro')):
        src_text += open(f, encoding='utf-8').read()
ORIGIN = {
    'manual-': 'PROATV_manual.pdf (página rasterizada a 1600px)',
    'ig-': 'Captura de Instagram (ZIP V2)',
    'profile': 'Captura de perfil de Instagram (ZIP V2)',
    'logo-dark': 'LOGO NUEVO VZH 2022.GIF → PNG sin escalar (paquete complementario)',
    'logo-white': 'Logo blanco png.png (paquete complementario)',
    'slide': 'Presentación 2023.pptx (recorte de diapositiva)',
}
rows = []
for f in sorted(glob.glob(os.path.join(WORK, '*/*'))):
    rel = os.path.relpath(f, WORK)
    try:
        im = Image.open(f); w, h = im.size
    except Exception:
        w = h = '?'
    kb = os.path.getsize(f) // 1024
    used = 'sí' if rel in src_text else 'NO (no referenciado)'
    origin = next((v for k, v in ORIGIN.items() if k in os.path.basename(rel)), 'ZIP V2 / presentaciones (ver auditoría)')
    q = 'baja (<500px)' if isinstance(w, int) and w < 500 else 'media' if isinstance(w, int) and w < 1000 else 'alta'
    rows.append(f'| `{rel}` | {rel.split("/")[0]} | {w}×{h} | {kb} KB | {q} | {used} | {origin} |')
out = ['# Inventario de assets (generado)', '', 'Columnas: archivo · cliente/carpeta · dimensiones · peso · calidad estimada · usado en el sitio · origen.', '',
       '| Archivo | Cliente | Dimensiones | Peso | Calidad | Usado | Origen |', '|---|---|---|---|---|---|---|'] + rows
open(os.path.join(ROOT, 'docs/assets-manifest.md'), 'w', encoding='utf-8').write('\n'.join(out) + '\n')
print(len(rows), 'assets')
