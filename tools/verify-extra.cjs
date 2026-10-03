const {chromium}=require(process.env.ACC_PLAYWRIGHT || 'playwright');const fs=require('node:fs');const assert=require('node:assert/strict');
let browser;
(async()=>{
browser=await chromium.launch({headless:true,executablePath:process.env.ACC_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const evidence={};
const page=await browser.newPage({viewport:{width:375,height:812}});
await page.goto('http://127.0.0.1:8000/');await page.getByRole('link',{name:'Browse Radiators',exact:true}).click();await page.waitForURL('**/products.html');
await page.goto('http://127.0.0.1:8000/');await page.getByRole('link',{name:'Radiator Engineering',exact:true}).click();await page.waitForURL('**/about.html#engineering');
await page.locator('.nav-toggle').click();await page.locator('#main-nav').getByRole('link',{name:'Products',exact:true}).click();await page.waitForURL('**/products.html');
await page.screenshot({path:'audit-evidence/catalog-mobile-viewport.png'});
evidence.navigation='PASS: homepage CTAs and mobile Products navigation';
const touchContext=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
const touch=await touchContext.newPage();await touch.goto('http://127.0.0.1:8000/products.html');
const track=touch.locator('.slider__track'),box=await track.boundingBox();const cdp=await touchContext.newCDPSession(touch);
await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.width-30,y:box.y+box.height/2}]});
for(let i=1;i<=8;i++){await new Promise(resolve=>setTimeout(resolve,40));await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:box.x+box.width-30-i*30,y:box.y+box.height/2}]});}
await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
await touch.waitForFunction(()=>document.querySelector('.slider__track').scrollLeft>30,{},{timeout:5000});evidence.touch='PASS: paced emulated mobile touch swipe moves native slider';
await page.setViewportSize({width:1440,height:1000});await page.goto('http://127.0.0.1:8000/products.html');const desktopTrack=page.locator('.slider__track'),desktopBox=await desktopTrack.boundingBox();
await page.mouse.move(desktopBox.x+desktopBox.width/2,desktopBox.y+desktopBox.height/2);await page.mouse.wheel(450,0);
await page.waitForFunction(()=>document.querySelector('.slider__track').scrollLeft>30);evidence.wheel='PASS: horizontal wheel scroll moves native slider';
const focus=[];
for(const selector of ['#q','#model','.logo[data-v="All"]','.chip[data-v="All"]','.slider__btn--next','.product a.btn','.product summary']){
await page.locator(selector).first().focus();const style=await page.locator(selector).first().evaluate(el=>{const s=getComputedStyle(el);return {outlineStyle:s.outlineStyle,outlineWidth:s.outlineWidth,outlineColor:s.outlineColor};});assert.notEqual(style.outlineStyle,'none');focus.push({selector,...style});}
evidence.focus=focus;
try{const response=await page.goto('https://accradiators.vercel.app/',{timeout:15000});evidence.deployment={status:response.status(),headers:await response.allHeaders(),title:await page.title()};await page.screenshot({path:'audit-evidence/deployed-home.png',fullPage:true});}
catch(error){evidence.deployment={status:'NOT ACCESSIBLE',reason:error.message};}
await browser.close();fs.writeFileSync('audit-evidence/extra-results.json',JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence,null,2));
})().catch(async error=>{console.error(error);if(browser)await browser.close();process.exitCode=1;});
