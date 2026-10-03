const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const c = require('../catalog-core.js');
const base = { make: 'All', model: '', mat: 'All', q: '' };

test('all 12 original records and specifications are preserved exactly', () => {
  const original = execFileSync('git', ['show', '3a8da47:products.html'], {encoding:'utf8'});
  const rows = JSON.parse(original.match(/var P=(\[.*?\]);/s)[1]);
  const keys = ['make','model','name','slug','material','core','transmission','part','thickness'];
  assert.deepEqual(c.products, rows.map(row => Object.fromEntries(keys.map((key,i) => [key,row[i]]))));
  assert.equal(new Set(c.products.map(p => p.part)).size, 12);
});
test('every supported vehicle lookup returns its exact record', () => {
  for (const p of c.products) {
    const parsed = c.read('?'+c.query({...base,make:p.make,model:p.model}));
    assert.deepEqual(parsed.errors, []);
    assert.deepEqual(c.filter(parsed.state).map(p => p.part), [p.part]);
  }
});
test('unsupported makes/models do not silently substitute products', () => {
  for (const url of ['?make=MG&model=HS', '?make=Suzuki&model=Wagon%20R', '?make=Toyota&model=Alto', '?make=Honda&model=not-listed']) {
    const parsed = c.read(url); assert.ok(parsed.errors.length); assert.equal(c.filter(parsed.state,parsed.errors).length,0);
  }
});
test('Alto and Corolla links remain valid; make-only and blank lookups are explicit', () => {
  assert.equal(c.filter(c.read('?make=Suzuki&model=Alto').state)[0].part,'ACC-SZ-0660');
  assert.equal(c.filter(c.read('?make=Toyota&model=Corolla').state)[0].part,'ACC-TY-0824');
  assert.equal(c.filter(c.read('?make=Suzuki').state).length,3);
  assert.equal(c.filter(c.read('?make=&model=').state).length,12);
  assert.equal(c.filter(c.read('?model=Civic').state).length,1);
});
test('combined filters and URL round trips preserve results', () => {
  const state = {...base, make:'Toyota', model:'Corolla', mat:'Plastic-Aluminum', q:'ACC-TY-0824'};
  assert.deepEqual(c.read('?'+c.query(state)).state,state);
  assert.equal(c.filter(state).length,1);
  assert.equal(c.filter({...state,mat:'Copper-Brass'}).length,0);
  assert.equal(c.filter({...base,q:'  cIvIc  '}).length,1);
});
test('duplicate, unknown, invalid material and oversized parameters are rejected', () => {
  for (const query of ['?make=Suzuki&make=Toyota','?model=Alto&model=Civic','?mat=Titanium','?redirect=javascript:alert(1)','?q='+ 'x'.repeat(201)]) {
    const parsed=c.read(query); assert.ok(parsed.errors.length); assert.equal(c.filter(parsed.state,parsed.errors).length,0);
  }
});
test('every product enquiry contains exact name, part and encoded subject/body', () => {
  for (const p of c.products) {
    const enquiry=c.enquiry(p), url=new URL(enquiry.href);
    assert.equal(url.protocol,'mailto:'); assert.equal(url.pathname,c.email);
    assert.equal(url.searchParams.get('subject'),enquiry.subject);
    assert.equal(url.searchParams.get('body'),enquiry.body);
    assert.ok(enquiry.subject.includes(p.part)); assert.ok(enquiry.body.includes(p.name)); assert.ok(enquiry.body.includes(p.part));
    assert.ok(enquiry.body.includes('Please confirm fitment, availability, pricing and warranty terms.'));
  }
});
test('special characters and untrusted vehicle details cannot add recipients or mail headers', () => {
  const vehicle='MG HS & <script>alert(1)</script>\r\nBcc: other@example.com';
  const enquiry=c.enquiry(null,vehicle), url=new URL(enquiry.href);
  assert.equal(url.pathname,c.email); assert.equal(url.searchParams.get('body'),enquiry.body);
  assert.equal(url.searchParams.get('bcc'),null); assert.equal(url.searchParams.size,2);
  assert.ok(!/[\r\n]/.test(url.searchParams.get('subject')));
});
test('homepage popular links correspond to the authoritative dataset', () => {
  const links=fs.readFileSync('index.html','utf8').matchAll(/href="products\.html\?([^\"]+)"/g);
  let n=0;
  for (const link of links) { const parsed=c.read('?'+link[1].replaceAll('&amp;','&')); assert.equal(c.filter(parsed.state,parsed.errors).length,1); n++; }
  assert.equal(n,12);
});
function luminance(hex) {
  const values=hex.replace('#','').match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
  return values[0]*.2126+values[1]*.7152+values[2]*.0722;
}
function contrast(a,b) { const x=luminance(a),y=luminance(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); }
test('text, component boundaries and focus colors meet contrast thresholds', () => {
  for(const [fg,bg] of [['#AD4500','#FFFFFF'],['#AD4500','#F8FAFC'],['#475569','#FFFFFF'],['#475569','#F8FAFC'],['#FFFFFF','#0F172A'],['#FF6600','#0F172A'],['#CBD5E1','#0F172A'],['#94A3B8','#0F172A']]) assert.ok(contrast(fg,bg)>=4.5,`${fg} on ${bg}: ${contrast(fg,bg).toFixed(2)}`);
  assert.ok(contrast('#64748B','#FFFFFF')>=3);
});
