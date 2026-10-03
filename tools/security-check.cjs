/* Proportional static scan; reports filenames only, never secret values. */
const fs=require('node:fs');const {execFileSync}=require('node:child_process');
const files=execFileSync('git',['ls-files'],{encoding:'utf8'}).trim().split('\n');const suspects=[];const external=[];
const secretPatterns=[/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/\bAKIA[0-9A-Z]{16}\b/,/\bgh[pousr]_[A-Za-z0-9]{30,}\b/,/\bsk-(?:proj-)?[A-Za-z0-9_-]{24,}\b/,/(?:api[_-]?key|password|secret|token)\s*[:=]\s*["'][^"'\s]{12,}["']/i];
for(const file of [...files,'catalog-core.js','catalog-data.js','catalog.js','lookup.js','site.js']){
 if(!/\.(?:html|css|js|py|json|txt|env)$/.test(file))continue;const text=fs.readFileSync(file,'utf8');
 if(secretPatterns.some(pattern=>pattern.test(text)))suspects.push(file);
 if(file.endsWith('.html')) for(const match of text.matchAll(/<(?:script|link|img)\b[^>]*(?:src|href)="(https?:[^\"]+)"/g))external.push({file,url:match[1]});
}
console.log(JSON.stringify({secretPatternMatches:suspects,thirdPartyResources:external,notes:['Heuristic scan; not a guarantee of secret absence.','User query values render through textContent, Option or textarea.value.','Email recipient is fixed; subject controls are stripped and subject/body are percent encoded.','No backend, new services, CSP or deployment configuration introduced.']},null,2));
if(suspects.length||external.length)process.exitCode=1;
