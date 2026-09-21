const {chromium}=require(process.env.CUT_SHORT_PLAYWRIGHT || 'playwright');
(async()=>{
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage();
 let payload;
 await page.route('https://formsubmit.co/**',async route=>{
  payload=new URLSearchParams(route.request().postData());
  if(route.request().method()!=='POST')throw Error('Expected POST');
  await route.fulfill({status:200,contentType:'text/html',body:'<p>Intercepted test only — no email sent.</p>'});
 });
 await page.goto('http://127.0.0.1:4173');
 await page.locator('[name=name]').fill('Local QA');
 await page.locator('[name=email]').fill('qa@example.com');
 await page.locator('[name=filmTitle]').fill('Test film');
 await page.locator('[name=brand]').fill('Test brand');
 await page.locator('[name=youtubeUrl]').fill('https://example.com/video');
 if(await page.locator('[name=youtubeUrl]').evaluate(el=>el.checkValidity()))throw Error('Invalid link accepted');
 await page.locator('[name=youtubeUrl]').fill('https://youtu.be/dQw4w9WgXcQ');
 if(await page.locator('#submission-form').evaluate(el=>el.checkValidity()))throw Error('Rights checkbox not required');
 await page.locator('[name=rightsConfirmed]').check();
 await page.locator('#submission-form button').click();
 await page.waitForURL('https://formsubmit.co/**');
 if(!payload || payload.get('filmTitle')!=='Test film' || !payload.get('youtubeUrl') || !payload.get('rightsConfirmed') || payload.get('email')!=='qa@example.com')throw Error('Missing submission fields');
 console.log('PASS YouTube validation, required rights, and intercepted email-form POST. No email sent.');
}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
