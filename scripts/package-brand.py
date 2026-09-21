from pathlib import Path
from PIL import Image
import zipfile
root = Path(__file__).resolve().parents[1]
for theme in ['primary','blue','pink']:
    with Image.open(root/'corrected'/'icons'/f'slash-{theme}-256.png') as im:
        im.save(root/'corrected'/'icons'/f'favicon-{theme}.ico', sizes=[(16,16),(24,24),(32,32),(48,48),(64,64),(128,128),(256,256)])
files = list((root/'corrected').rglob('*.png'))
for file in files:
    with Image.open(file) as im:
        im.verify()
with zipfile.ZipFile(root/'corrected.zip','w',zipfile.ZIP_DEFLATED) as z:
    for file in (root/'corrected').rglob('*'):
        if file.is_file(): z.write(file,file.relative_to(root))
    z.write(root/'README.md','README.md')
print(f'Verified {len(files)} PNGs; packaged logo suite.')
