/* Uses an already installed Playwright; no runtime dependencies are added. */
const { chromium } = require(process.env.ACC_PLAYWRIGHT || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {execFileSync} = require('node:child_process');
const base = process.env.ACC_TEST_URL || 'http://127.0.0.1:8000';
const results=[], errors=[], failedRequests=[];
const evidence='audit-evidence'; fs.mkdirSync(evidence,{recursive:true});
const visible = page => page.locator('#grid .product:visible');
async function run(name,fn) { try { await fn(); results.push({name,status:'PASS'}); console.log('PASS '+name); } catch(error) { results.push({name,status:'FAIL',reason:error.message}); console.error('FAIL '+name+': '+error.message); } }
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:process.env.ACC_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const context=await browser.newContext({viewport:{width:1440,height:1000}});
  const page=await context.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error') errors.push(message.text());});
  page.on('response',response=>{if(response.status()>=400)failedRequests.push(response.url()+' '+response.status());});
  await run('Dev-server verification: content, controls, screenshot and no JS errors',async()=>{
    await page.goto(base+'/'); await page.waitForLoadState('networkidle');
    await page.screenshot({path:evidence+'/home-desktop.png',fullPage:true});
    assert.ok((await page.locator('body').innerText()).length>500); assert.equal(await page.locator('h1').count(),1);
    assert.equal(await page.locator('#make option').count(),8); assert.equal(await page.getByRole('link',{name:'Browse Radiators',exact:true}).count(),1);
    assert.equal(errors.length,0); console.log((await page.locator('a,button,select').count())+' homepage controls');
  });
  await run('Homepage CTAs, all lookup combinations and partial lookup',async()=>{
    const products=require('../catalog-data.js').products;
    for(const p of products){
      await page.goto(base+'/'); await page.selectOption('#make',p.make); await page.selectOption('#model',p.model);
      await page.getByRole('button',{name:'Search Radiators',exact:true}).click(); await page.waitForURL('**/products.html?**');
      assert.equal(await visible(page).count(),1); assert.equal(await visible(page).getAttribute('data-part'),p.part);
    }
    await page.goto(base+'/'); await page.selectOption('#make','Toyota'); await page.getByRole('button',{name:'Search Radiators',exact:true}).click();
    await page.waitForURL('**/products.html?make=Toyota'); assert.equal(await visible(page).count(),3);
    await page.goto(base+'/'); await page.getByRole('button',{name:'Search Radiators',exact:true}).click();
    await page.waitForURL('**/products.html'); assert.equal(await visible(page).count(),12);
  });
  await run('Supported and unsupported direct URLs, malicious input and reset',async()=>{
    for(const query of ['make=MG&model=HS','make=Suzuki&model=Wagon%20R','make=Toyota&model=Alto','make=Suzuki&make=Toyota','mat=Steel','make=%3Cimg%20src=x%20onerror=alert(1)%3E']){
      await page.goto(base+'/products.html?'+query); assert.equal(await visible(page).count(),0); assert.equal(await page.locator('#filter-message').isVisible(),true);
      assert.equal(await page.locator('#empty').isVisible(),true); assert.equal(await page.locator('#filter-message img').count(),0);
      await page.locator('.results-toolbar [data-reset]').click(); assert.equal(await visible(page).count(),12); assert.equal(new URL(page.url()).search,'');
    }
    for(const query of ['make=Suzuki&model=Alto','make=Toyota&model=Corolla']){await page.goto(base+'/products.html?'+query); assert.equal(await visible(page).count(),1);}
  });
  await run('Combined filters, submission, refresh, Back/Forward and empty state',async()=>{
    await page.goto(base+'/products.html');
    await page.locator('.logo[data-v="Toyota"]').click(); await page.selectOption('#model','Corolla');
    await page.locator('.chip[data-v="Plastic-Aluminum"]').click(); await page.fill('#q','ACC-TY-0824');
    await page.locator('#catalog-search button').click(); assert.equal(await visible(page).count(),1);
    assert.ok(page.url().includes('mat=Plastic-Aluminum')); assert.ok(page.url().includes('q=ACC-TY-0824'));
    await page.reload(); assert.equal(await visible(page).count(),1); assert.equal(await page.inputValue('#q'),'ACC-TY-0824');
    await page.locator('.chip[data-v="Copper-Brass"]').click(); assert.equal(await visible(page).count(),0);
    await page.goBack(); assert.equal(await visible(page).count(),1); assert.equal(await page.locator('.chip[data-v="Plastic-Aluminum"]').getAttribute('aria-pressed'),'true');
    await page.goForward(); assert.equal(await visible(page).count(),0); await page.locator('.results-toolbar [data-reset]').click(); assert.equal(await visible(page).count(),12);
  });
  await run('Every product enquiry, readable copy alternatives and clipboard denial',async()=>{
    await page.goto(base+'/products.html');
    for(const p of require('../catalog-data.js').products){const card=page.locator('[data-part="'+p.part+'"]');const url=new URL(await card.locator('a.btn').getAttribute('href'));assert.ok(url.searchParams.get('body').includes(p.part));assert.ok(url.searchParams.get('body').includes(p.name));assert.equal(url.pathname,'info@accradiators.pk');}
    const card=page.locator('.product').first(); await card.locator('summary').click();
    await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('denied'))},configurable:true}));
    await card.locator('button').click();assert.equal(await card.locator('button').innerText(),'Select and copy the text below');
    assert.ok((await card.locator('textarea').inputValue()).includes('ACC-SZ-0660'));
  });
  await run('Slider next/previous, mouse drag, wheel, keyboard and selection',async()=>{
    await page.goto(base+'/products.html'); const track=page.locator('.slider__track');
    await page.locator('[data-dir="1"]').click(); await page.waitForFunction(()=>document.querySelector('.slider__track').scrollLeft>100);
    await page.locator('[data-dir="-1"]').click(); await page.waitForFunction(()=>document.querySelector('.slider__track').scrollLeft<2);
    const box=await track.boundingBox(); await page.mouse.move(box.x+box.width-70,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+80,box.y+box.height/2,{steps:12});await page.mouse.up();
    assert.ok(await track.evaluate(el=>el.scrollLeft)>50); assert.equal(await visible(page).count(),12);
    await page.mouse.wheel(500,0); await page.locator('.logo[data-v="Honda"]').focus(); await page.keyboard.press('Enter'); assert.equal(await visible(page).count(),2);
    await page.keyboard.press('End'); assert.equal(await page.evaluate(()=>document.activeElement.dataset.v),'Haval');await page.keyboard.press('Enter'); assert.equal(await visible(page).count(),1);
    await page.keyboard.press('Home');await page.keyboard.press('Enter');assert.equal(await visible(page).count(),12);
  });
  await run('Slider all-items-fit and reduced-motion preferences',async()=>{
    await page.emulateMedia({reducedMotion:'reduce'}); await page.goto(base+'/products.html');
    await page.evaluate(()=>{const t=document.querySelector('.slider__track');const orig=t.scrollBy.bind(t);t.scrollBy=options=>{window.__lastScrollBehavior=options.behavior;orig(options);};});
    await page.locator('[data-dir="1"]').click(); assert.equal(await page.evaluate(()=>window.__lastScrollBehavior),'auto');
    await page.evaluate(()=>{document.querySelector('.slider').style.setProperty('--per','8');window.dispatchEvent(new Event('resize'));});
    assert.equal(await page.locator('.slider').evaluate(el=>el.classList.contains('is-static')),true);assert.equal(await page.locator('[data-dir="1"]').isVisible(),false);
    await page.emulateMedia({reducedMotion:'no-preference'});
  });
  await run('Keyboard skip link, focused controls and mobile menu Escape',async()=>{
    await page.goto(base+'/products.html');await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Skip to content');await page.keyboard.press('Enter');
    await page.locator('#q').focus();assert.notEqual(await page.locator('#q').evaluate(el=>getComputedStyle(el).outlineStyle),'none');
    await page.setViewportSize({width:375,height:812});await page.goto(base+'/');
    await page.locator('.nav-toggle').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#main-nav').isVisible(),true);
    assert.equal(await page.locator('#main-nav .btn').isVisible(),true);await page.keyboard.press('Escape');assert.equal(await page.locator('#main-nav').isVisible(),false);
    assert.equal(await page.evaluate(()=>document.activeElement.className),'nav-toggle');
  });
  await run('All 3 pages at 320, 375, 390, 768, 1024 and 1440px: no overflow',async()=>{
    for(const width of [320,375,390,768,1024,1440])for(const path of ['index.html','about.html','products.html']){
      await page.setViewportSize({width,height:900});await page.goto(base+'/'+path);await page.waitForLoadState('networkidle');
      const layout=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,header:document.querySelector('.header').getBoundingClientRect().height}));
      assert.ok(layout.scroll<=width,`${path} ${width}px overflow: ${layout.scroll}`);
      if(width<=768) {assert.ok(layout.header<=80);await page.locator('.nav-toggle').click();assert.equal(await page.locator('#main-nav .btn').isVisible(),true);await page.locator('.nav-toggle').click();}
      if([375,1440].includes(width))await page.screenshot({path:evidence+'/'+path.replace('.html','')+'-'+width+'.png',fullPage:true});
    }
  });
  await run('About engineering and contact anchors clear the sticky header',async()=>{
    await page.setViewportSize({width:1440,height:900});await page.goto(base+'/about.html#engineering');
    assert.ok(await page.locator('#engineering').evaluate(el=>el.getBoundingClientRect().top)>=80);
    await page.getByRole('link',{name:'Contact',exact:true}).click();assert.ok(page.url().endsWith('#contact'));
    assert.equal(await page.locator('#contact a[href="mailto:info@accradiators.pk"]').count(),1);
  });
  await run('All images load and no console, JS or network errors',async()=>{
    for(const path of ['index.html','about.html','products.html']){await page.goto(base+'/'+path);await page.locator('footer').scrollIntoViewIfNeeded();await page.waitForLoadState('networkidle');
      // Force lazy images into view and wait for actual decoding.
      for(const img of await page.locator('img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());}
    }
    assert.deepEqual(errors,[]);assert.deepEqual(failedRequests,[]);
  });
  // Isolated expected failures: validate fallback without adding to normal network results.
  await run('Intentional missing-image fallback makes no secondary requests',async()=>{
    const broken=await context.newPage();let imageRequests=[];
    await broken.route('**/assets/optimized/*aluminium.webp',route=>{imageRequests.push(route.request().url());return route.fulfill({status:404,body:''});});
    await broken.route('**/assets/optimized/suzuki-logo.webp',route=>{imageRequests.push(route.request().url());return route.fulfill({status:404,body:''});});
    await broken.goto(base+'/products.html');await broken.locator('.product').first().scrollIntoViewIfNeeded();
    await broken.waitForFunction(()=>!document.querySelector('.product .image-fallback').hidden);
    assert.equal(await broken.locator('.logo[data-v="Suzuki"] .logo__name').isVisible(),true);
    assert.ok(!imageRequests.some(url=>url.includes('aluminum')||url.includes('carcompany')));await broken.close();
  });
  fs.writeFileSync(evidence+'/browser-results.json',JSON.stringify({results,errors,failedRequests},null,2));
  await browser.close();if(results.some(r=>r.status==='FAIL'))process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});
