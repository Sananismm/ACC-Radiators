/* Measures fetched image-body bytes against the original commit in an isolated browser.
   This is a local asset-transfer comparison, not a production timing benchmark. */
const { chromium }=require(process.env.ACC_PLAYWRIGHT || 'playwright');
const {execFileSync}=require('node:child_process');const fs=require('node:fs');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp'};
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.ACC_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const results=[];
 for(const path of ['index.html','products.html'])for(const revision of ['original','remediated']){
  const context=await browser.newContext({viewport:{width:1440,height:1000}});const page=await context.newPage();const sizes=new Map(),tasks=[];
  if(revision==='original')await page.route('**/*',route=>{
   const name=decodeURIComponent(new URL(route.request().url()).pathname).replace(/^\//,'')||'index.html';
   try {const body=execFileSync('git',['show','3a8da47:'+name],{maxBuffer:16e6,stdio:['ignore','pipe','ignore']});return route.fulfill({body,contentType:mime[require('node:path').extname(name)]||'application/octet-stream'});}catch{return route.fulfill({status:404,body:'Not found'});}
  });
  page.on('response',response=>{if(/\.(webp|png)(?:\?|$)/.test(response.url())&&response.ok())tasks.push(response.body().then(body=>sizes.set(response.url(),body.length)));});
  await page.goto('http://127.0.0.1:8000/'+path);await page.waitForLoadState('networkidle');
  for(const img of await page.locator('img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode()).catch(()=>{});}
  await page.waitForLoadState('networkidle');await Promise.all(tasks);
  results.push({path,revision,uniqueImages:sizes.size,imageBodyBytes:[...sizes.values()].reduce((a,b)=>a+b,0),assets:[...sizes].map(([url,bytes])=>({path:new URL(url).pathname,bytes}))});
  await context.close();
 }
 await browser.close();fs.mkdirSync('audit-evidence',{recursive:true});fs.writeFileSync('audit-evidence/image-transfer.json',JSON.stringify(results,null,2));
 for(const path of ['index.html','products.html']){const before=results.find(r=>r.path===path&&r.revision==='original'),after=results.find(r=>r.path===path&&r.revision==='remediated');console.log(path+': '+before.imageBodyBytes+' -> '+after.imageBodyBytes+' image bytes ('+((1-after.imageBodyBytes/before.imageBodyBytes)*100).toFixed(2)+'% less)');}
})().catch(error=>{console.error(error);process.exitCode=1;});
