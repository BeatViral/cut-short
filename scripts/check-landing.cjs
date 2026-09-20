const path = require('path');
const fs = require('fs');
const qaDir = process.env.CUT_SHORT_QA || path.resolve(__dirname, '../.qa');
fs.mkdirSync(qaDir, {recursive:true});
const { chromium } = require(process.env.CUT_SHORT_PLAYWRIGHT || 'playwright');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400) errors.push(r.status()+' '+r.url());});
 for(const [w,h] of [[1440,1000],[390,844],[320,700]]){
  await page.setViewportSize({width:w,height:h});await page.goto('http://127.0.0.1:4173');
  await page.locator('h1 img').waitFor();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  const loaded=await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0));
  if(overflow||!loaded)throw new Error(JSON.stringify({w,overflow,loaded}));
  await page.getByRole('button',{name:'Pause motion'}).click();
  if(await page.getByRole('button',{name:'Resume motion'}).getAttribute('aria-pressed')!=='true')throw new Error('Pause failed');
  await page.getByRole('button',{name:'Resume motion'}).click();
  await page.getByRole('link',{name:'What’s next'}).click();
  if(!page.url().endsWith('#next'))throw new Error('Navigation failed');
  await page.goto('http://127.0.0.1:4173');
  await page.screenshot({path:qaDir+'/landing-'+w+'.png',fullPage:true});
  console.log('PASS viewport '+w);
 }
 await page.emulateMedia({reducedMotion:'reduce'});
 const animation=await page.locator('.giant-slash').evaluate(e=>getComputedStyle(e).animationName);
 if(animation!=='none')throw new Error('Reduced motion failed');
 if(errors.length)throw new Error(errors.join('\n'));
 console.log('PASS navigation, motion toggle, reduced motion, image loading, console/network');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

