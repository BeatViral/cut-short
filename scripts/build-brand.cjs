const fs = require('fs');
const path = require('path');
const sharp = require(process.env.CUT_SHORT_SHARP || 'sharp');
const root = path.resolve(__dirname, '..');
const out = path.join(root,'corrected');
// Custom outlined lettering. Coordinates are independent of installed fonts.
const glyphs = {
C:'M70 0Q0 0 0 65V235Q0 300 70 300Q140 300 140 235V170H78V242Q78 249 71 249Q64 249 64 242V58Q64 51 71 51Q78 51 78 58V132H140V65Q140 0 70 0Z',
U:'M0 0H64V242Q64 249 71 249Q78 249 78 242V0H142V235Q142 300 71 300Q0 300 0 235Z',
T:'M0 0H140V62H102V300H38V62H0Z',
S:'M70 0Q0 0 0 65V100Q0 130 28 151L76 188Q80 192 80 201V242Q80 250 72 250Q64 250 64 242V194H0V235Q0 300 71 300Q142 300 142 235V195Q142 165 113 144L68 109Q62 104 62 95V58Q62 50 70 50Q78 50 78 58V109H142V65Q142 0 70 0Z',
H:'M0 0H64V119H78V0H142V300H78V181H64V300H0Z',
O:'M71 0Q0 0 0 65V235Q0 300 71 300Q142 300 142 235V65Q142 0 71 0ZM71 51Q78 51 78 58V242Q78 249 71 249Q64 249 64 242V58Q64 51 71 51Z',
R:'M0 0H76Q142 0 142 64V99Q142 139 111 149Q137 157 139 196L146 300H80L75 195Q74 181 64 181V300H0ZM64 53V127H71Q80 127 80 115V65Q80 53 71 53Z'
};
const p=(d,x=0,y=0)=>`<path transform="translate(${x} ${y})" d="${d}" fill-rule="evenodd"/>`;
const word=(s,x,y)=>[...s].map((c,i)=>p(s==='CUT' && c==='T' ? 'M0 0H140V62H102V206L68 300H38V62H0Z' : glyphs[c],x+i*148,y)).join('');
// Slash rises 80 units above the letters and falls 80 below them.
const slash = 'M165 0H247L82 460H0Z';
const descriptor = JSON.parse(fs.readFileSync(path.join(__dirname,'tagline-path.json'),'utf8').replace(/^\uFEFF/,''));
const tagline=(width,x,y)=>`<g transform="translate(${x} ${y}) scale(${width/descriptor.width})"><path d="${descriptor.d}" fill-rule="evenodd"/></g>`;
const shapes={horizontal:{w:1330,h:610,body:word('CUT',0,80)+p(slash,350,0)+word('SHORT',596,80)+tagline(1000,165,500)},stacked:{w:734,h:960,body:word('CUT',0,80)+p(slash,420,0)+word('SHORT',0,500)+tagline(700,17,860)},slash:{w:247,h:460,body:p(slash)}};
const colors={primary:{fg:'#000000',bg:'#F5FF00'},blue:{fg:'#FFFFFF',bg:'#0047FF'},pink:{fg:'#000000',bg:'#FF0099'},black:{fg:'#000000'},white:{fg:'#FFFFFF'}};
function svg(shape,theme,pad=80){const s=shapes[shape],c=colors[theme],w=s.w+pad*2,h=s.h+pad*2;return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="CUT/SHORT${shape==='slash'?' slash symbol':' — The Ad Film Festival'}"><title>CUT/SHORT — The Ad Film Festival</title>${c.bg?`<path fill="${c.bg}" d="M0 0H${w}V${h}H0Z"/>`:''}<g fill="${c.fg}" transform="translate(${pad} ${pad})">${s.body}</g></svg>`;}
function square(theme){const c=colors[theme];return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><title>CUT/SHORT slash</title><path fill="${c.bg||'#FFFFFF'}" d="M0 0H512V512H0Z"/><g fill="${c.fg}" transform="translate(155 67) scale(.82)">${p(slash)}</g></svg>`;}
async function main(){
for(const d of ['svg','png','webp','icons','social'])fs.mkdirSync(path.join(out,d),{recursive:true});
const manifest=[];
for(const shape of Object.keys(shapes))for(const theme of Object.keys(colors)){
 const name=`cut-short-${shape}-${theme}`,source=svg(shape,theme);
 fs.writeFileSync(path.join(out,'svg',name+'.svg'),source);
 for(const width of (shape==='horizontal'?[160,320,640,1280,2560,4096]:[128,256,512,1024,2048])){
 const filename=name+`-${width}w.png`;await sharp(Buffer.from(source)).resize({width}).png().toFile(path.join(out,'png',filename));manifest.push(filename);
 }
 await sharp(Buffer.from(source)).resize({width:1280}).webp({lossless:true}).toFile(path.join(out,'webp',name+'.webp'));
}
for(const theme of ['primary','blue','pink']){
 const source=square(theme);fs.writeFileSync(path.join(out,'icons',`favicon-${theme}.svg`),source);
 for(const n of [16,24,32,48,64,128,180,192,256,512,1024])await sharp(Buffer.from(source)).resize(n,n).png().toFile(path.join(out,'icons',`slash-${theme}-${n}.png`));
 const c=colors[theme];
 for(const [label,w,h] of [['square',1080,1080],['landscape',1200,630],['story',1080,1920]]){
 const scale=(w-160)/1330,y=(h-shapes.horizontal.h*scale)/2;
 const social=`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path fill="${c.bg}" d="M0 0H${w}V${h}H0Z"/><g fill="${c.fg}" transform="translate(80 ${y}) scale(${scale})">${shapes.horizontal.body}</g></svg>`;
 await sharp(Buffer.from(social)).png().toFile(path.join(out,'social',`cut-short-${theme}-${label}-${w}x${h}.png`));
 }
}
const board='<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="2280">'+['primary','blue','pink'].map((theme,i)=>`<path fill="${colors[theme].bg}" d="M0 ${i*760}H1600V${(i+1)*760}H0Z"/><g fill="${colors[theme].fg}" transform="translate(135 ${i*760+70})">${shapes.horizontal.body}</g>`).join('')+'</svg>';
fs.writeFileSync(path.join(out,'preview.svg'),board);await sharp(Buffer.from(board)).png().toFile(path.join(out,'preview.png'));
fs.writeFileSync(path.join(out,'colors.json'),JSON.stringify(colors,null,2)+'\n');
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify({brand:'CUT/SHORT',descriptor:'The Ad Film Festival',primary:'Black on electric yellow',secondary:['White on cobalt blue','Black on hot pink'],pngExports:manifest},null,2)+'\n');
console.log('Built logo suite in '+out);
}
main().catch(e=>{console.error(e);process.exit(1)});
