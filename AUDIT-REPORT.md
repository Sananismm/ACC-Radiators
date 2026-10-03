# ACC Radiators audit remediation — 3 October 2026

## A. Initial verification

- HEAD: `3a8da47fd71f67ef356f162738b490600d8f8791` (the audited commit).
- `git status --short`: clean before editing. No local modifications to preserve.
- Inspected all three HTML pages, all CSS and JavaScript, and every tracked asset. No package manifest, backend, validation setup, AGENTS.md, or newer functionality exists.
- Confirmed ACC-01/02/03/05/06/07/08/09/10/11/12/13/14. ACC-04/15 identify hardcoded commercial claims requiring owner verification.
- No audit findings had already been resolved.
- No approved WhatsApp or telephone number exists. Published email is `info@accradiators.pk`.
- Five files in `assests/products/` duplicate assets in `assets/products/`; no repository references use `assests/`. Retain them pending deletion approval and checks for external links.
- Web fetch and direct HTTPS access to the deployment failed. Browser inventory was empty; no live production audit is claimed.

## Implementation plan (presented before edits)

1. Extract the existing 12 records into a shared static script; derive lookup options from it.
2. Add product-specific email enquiries and copyable enquiry details; explicit invalid/unsupported URL and empty states; persistent filters with Back/Forward support.
3. Fix the tracked slider reference and deliberate image fallbacks; label representative images.
4. Improve orange text contrast, visible keyboard focus, touch targets, and compact accessible mobile navigation.
5. Create compressed image variants while retaining sources; add safe domain-independent SEO metadata. Defer absolute canonicals and sitemap pending canonical-domain approval.
6. Add built-in logic tests, validate assets and JavaScript, exercise browser flows where available, and document business approvals and limitations.

## Business decisions pending

Confirm canonical domain; email ownership; any approved WhatsApp number; inventory/pricing; warranty coverage and terms; fitment, construction and transmission specifications; model-year ranges; OE guarantees; 45–50°C performance; 14–16 FPI; helium/hydrostatic testing at 2.5 bar; PA66-GF30 and virgin-polymer claims; company legal name and distribution hubs. The user authorized placeholders during this session. Important unverified commercial claims are now neutral enquiry/confirmation text; the original wording remains recoverable from the initial Git commit. Product records and specifications are preserved exactly, with a visible instruction to confirm them before ordering.

No push, deployment, production configuration, credentials, or data changes are authorized.

## B. Implemented changes

| Audit ID | Problem and files | Implementation and customer result |
| --- | --- | --- |
| ACC-02 | Script case mismatch; `products.html`, `Slider.js`, `style.css` | Loads tracked `Slider.js`. Retains native touch/wheel and mouse dragging; adds Arrow Left/Right, Home/End keyboard focus; checks current reduced-motion preference on each navigation. All-fit arrows hide. Arrows sit below logos to avoid covering names. |
| ACC-01 | Generic footer enquiry; `catalog-core.js`, `catalog.js`, all HTML pages | Each card has an accessible email action containing its exact product name and part number, correctly encoded subject/body, plus expandable copyable enquiry text. Clipboard denial selects the text for manual copying. All contact areas provide a clickable published email and webmail guidance. No messages are sent by this work. |
| ACC-03, ACC-05 | Conflicting vehicle lists and misleading invalid URLs; `catalog-data.js`, `catalog-core.js`, `lookup.js`, `catalog.js`, `index.html`, `products.html` | A single shared dataset contains the exact original 12 records. Homepage options derive from it. Unsupported makes/models yield zero products and explicit guidance, never unrelated substitutions. Make only means all models of that make; neither means the full catalog. Existing popular links are preserved and tested. |
| ACC-09 | Filter reset/persistence/history; `catalog-core.js`, `catalog.js`, `products.html` | Manufacturer, model, material and submitted text searches combine. URLs use `make`, `model`, `mat`, `q`; valid refresh and Back/Forward states restore. Reset, result count, selected states, filter summary and useful empty states are provided. Invalid, repeated, unknown or excessively long parameters are explicitly rejected. Text search uses the Search button or Enter, creating one meaningful history entry per search. Clearing search restores the other filters. |
| ACC-06, ACC-10 | Missing fallback paths and ambiguous photography; `site.js`, `catalog.js`, all HTML pages, `style.css` | Failed images display intentional text or manufacturer names; no second fallback request. Representative material photography is labeled, including homepage popular products; catalog alt text explicitly states actual products may differ. Product titles, parts and specifications remain intact, and enquiry actions align within grid rows. |
| ACC-04, ACC-15 | Unverified stock/warranty/testing claims; `index.html`, `about.html`, `catalog.js` | Under the user's placeholder authorization, remove assertions of live stock, blanket warranty, legal status/hubs, OE guarantees, specified test pressure, FPI, material grade and summer-temperature performance. Show neutral confirmation/enquiry copy. Original product specifications are unchanged and visibly subject to fitment/specification confirmation. |
| ACC-07, ACC-14 | Low-contrast orange and removed outlines; `style.css`, HTML and scripts | Retain brand orange for dark backgrounds and decoration. Light-background orange text/selection uses `#AD4500`: 5.79:1 on white and 5.53:1 on surface. Component boundaries use `#64748B` (4.76:1 on white). Add consistent 3px focus, dual light/dark button focus rings, inset logo focus, skip links, active-page state and minimum 44px control targets. |
| ACC-08 | Mobile wrapping header and hidden catalog CTA; `site.js`, all HTML pages, `style.css` | Preserve logo/nav identity; compact 64px mobile header with an accessible Menu button, `aria-expanded`/`aria-controls`, Escape dismissal and visible catalog CTA when open. Without JavaScript, navigation remains available. Sticky-header anchor offsets and slider grid sizing prevent obstruction/overflow. |
| ACC-11 | Oversized images; `assets/optimized/`, all HTML pages, `catalog.js`, `style.css`, `tools/optimize-images.py` | Generate appropriately sized compressed WebP derivatives, preserving transparency, original sources and reserved image geometry. Keep header logo/hero critical assets eager; lazy-load secondary images. See measured transfer evidence below. |
| ACC-12 | Missing SEO support; all HTML pages, `assets/favicon.png`, `assets/social.jpg`, `robots.txt`, `SEO-TEMPLATE.md`, `sitemap.xml.template` | Preserve titles and page descriptions, except homepage's unsupported “every car/OE-fit” description is made neutral. Add page-specific social titles/descriptions, favicon, robots and logical headings. Social artwork is prepared from the original background. Canonicals, social image absolute URLs, sitemap publication and structured company data remain review-only templates pending verified domain/business information. No fabricated absolute domain is in live page metadata. |
| ACC-13 | Duplication/maintainability; shared scripts, tests/tools | Extract dataset, pure logic, lookup, catalog and shared navigation/fallback behavior into plain scripts; no runtime packages or framework. Five identical `assests/` duplicates remain untouched for client deletion approval. |
| Security review | URL rendering and enquiry handling; `catalog-core.js`, `catalog.js`, `site.js`, `tools/security-check.cjs` | Render URL values through `textContent`, `Option` or textarea values; fix email recipient; strip control characters from subjects; percent-encode subject/body. Remove inline script/event handlers. No secrets or external script/style/image resources detected by the proportional text scan. No production configuration or CSP changes. |

## C. Validation

All functional tests below ran against the local static server in installed Chrome via bundled Playwright. The agent-browser CLI was absent and the computer-use browser inventory was empty; existing Playwright required no dependency installation.

| Command or test | Result | Evidence / limits |
| --- | --- | --- |
| `git status --short`, `git rev-parse HEAD`, `git ls-files`, log/diff/remote inspection | PASS | Initial clean tree; inspected audited commit; no newer functionality. |
| `node --check Slider.js` and syntax checks for every root `.js` | PASS | Performed directly and by `tools/validate-static.py`. Inline JavaScript was extracted into checked files. |
| `node --test` | PASS | 10 tests: exact original dataset, all supported vehicles, unsupported vehicles, partial links, combined/round-trip filters, invalid parameters, all enquiries, special characters/header safety, popular links and contrast. |
| Bundled Python `tools/validate-static.py` | PASS | Three pages; case-sensitive local paths, duplicate IDs, anchors, alt text, inline-handler absence, all root JS syntax, five duplicate-asset hashes. This is a lightweight structural check, not full HTML5 standards certification. |
| Bundled Python `tools/optimize-images.py` | PASS | 12 image derivatives: 7,325,529 → 301,574 bytes (95.88% smaller on disk); original source assets unchanged. Favicon/social image generated. |
| Bundled Python `-m http.server 8000 --bind 127.0.0.1` | PASS | Local-only static server used for all browser tests. |
| `node tools/browser-smoke.cjs` | PASS | 12 grouped browser tests covering content/navigation controls; all 12 lookups and partial lookup; invalid/unsupported and malicious URL states; reset; combined filters; direct refresh and Back/Forward; all product enquiry URLs; clipboard denial; next/previous/drag/selection/keyboard; reduced motion/all-fit; skip link/menu Escape; all three pages at all six widths; sticky anchors; complete image decoding; deliberate broken images. Zero normal console/JavaScript/HTTP asset errors. |
| Responsive matrix and visual review | PASS | All pages at 320, 375, 390, 768, 1024, 1440px; no horizontal overflow, mobile header ≤80px, catalog CTA accessible in menu. Reviewed desktop homepage/catalog and mobile catalog screenshots. Screenshots in `audit-evidence/`. |
| Final mobile contrast/control placement check | PASS | After final CSS edits: selected manufacturer border is `rgb(173,69,0)`, no 375px overflow, and slider arrows are below rather than overlapping the track. |
| `node tools/verify-extra.cjs` | PASS for local checks | Clicked homepage/catalog/engineering and mobile Products journeys; paced emulated touch swipe and horizontal wheel actually moved the slider; checked visible focus styles on search, select, logos, material buttons, arrows, enquiry links and summaries. Emulation is not physical-device or assistive-technology certification. |
| `node tools/measure-page.cjs` | PASS | Isolated browser comparison of the original Git revision and current files, with lazy images loaded. Homepage image response bodies: 5,550,805 → 214,272 bytes (96.14% fewer). Catalog: 5,839,211 → 255,872 bytes (95.62% fewer). Distinct fetched images counted once. This measures image payload, not production latency, LCP, Lighthouse score or real mobile data usage. |
| `node tools/security-check.cjs` | PASS | No suspicious secret patterns in inspected tracked/new source text; no third-party resource dependencies. Heuristic scan does not guarantee absence of all secret types or inspect complete Git history. |
| `git diff --check` | PASS | No whitespace errors. Git reports expected LF→CRLF conversion notices on Windows. |
| Formal HTML5 validator | NOT EXECUTED | No suitable installed HTML5 validator. Available lxml parser was attempted but reports valid HTML5 elements as unknown HTML4 tags, so its messages are not treated as website defects. Lightweight structure checks and browser rendering passed. |
| Deployed site and Vercel headers | NOT EXECUTED | Web/direct HTTPS attempts failed; installed browser returned `net::ERR_NETWORK_ACCESS_DENIED`. Unable to compare deployed behavior, inspect response headers or claim a live audit. |
| Email client delivery, physical touch/trackpad, Safari/Firefox, screen reader, production performance | NOT EXECUTED | No message was sent, and these environments were unavailable. Mailto URL contents and copy fallback were verified locally. |

Failures found and corrected during verification:

- First responsive run failed: catalog overflowed to 457px at a 320px viewport. Fixed grid minimum sizing with `.filters > * { min-width: 0 }`; the complete matrix then passed.
- Extra navigation harness initially selected both header and footer Products links. Scoped the locator to the header and reran successfully; no application defect.
- Immediate/synthetic touch injection did not move the native slider. Paced touch events did move it; final touch test uses the paced gesture and passes. Physical-device checks are still needed.
- A one-off lxml invocation had a Python syntax error; the corrected invocation exposed the HTML4 parser limitation described above. No formal HTML5-validation pass is claimed.
- Default Python launcher was not configured and agent-browser was unavailable. Used existing bundled Python/Pillow/Playwright, without installation.

Detailed local evidence (ignored by Git to avoid committing long screenshots): `audit-evidence/browser-results.json`, `extra-results.json`, `image-transfer.json`, and PNG screenshots. Source/output image dimensions and byte sizes are in `assets/optimized/metrics.json`.

## D. Business approvals

- Owner review of temporary neutral/confirmation copy before publication.
- Confirm the canonical HTTPS domain, then apply `SEO-TEMPLATE.md`, resolve the sitemap template, add the robots sitemap line, and validate absolute URLs. Do not deploy unresolved templates as metadata.
- Confirm published email ownership and any approved business WhatsApp/telephone. No number has been invented.
- Confirm warranty coverage/terms; available products and wholesale pricing; model-year ranges, transmissions, materials and core dimensions; testing/FPI/temperature/fitment claims; legal identity/hubs. This work provides no live inventory feed.
- Confirm any verified structured organization information and product-specific photography before adding it.
- Five duplicate assets may be candidates for cleanup, but deletion requires separate approval and confirmation they have no external consumers. None were deleted.

## E. Remaining risks

- Ready for local human review, not cleared for production publication. Company content, email and product specifications still require owner confirmation.
- Native mailto depends on visitor device/email settings; the copyable enquiry and readable email are the working alternatives. Actual client launch/delivery must be checked manually.
- Only installed Chrome was tested; touch/trackpad behavior was emulated. Verify physical devices and other browsers before publishing.
- Invalid queries intentionally show zero products. Unknown query keys (including tracking keys) are rejected with guidance; future marketing tracking support should explicitly whitelist expected keys if required.
- Product catalog is static. Adding a radiator requires an approved record and appropriate asset; the shared dataset derives vehicle lookup options. Homepage featured links and manufacturer presentation should be reviewed alongside additions.
- No live Vercel checks, production timings or response-header review were possible. Optional hardening to evaluate later: `X-Content-Type-Options`, `Referrer-Policy`, framing restrictions and a tested CSP. Inline style attributes still exist, so any CSP must accommodate or extract them. Do not deploy an untested restrictive policy.
- Domain-dependent SEO and structured organization data are prepared as templates, not live assertions.

## F. Final handover

Modified tracked files: `index.html`, `about.html`, `products.html`, `style.css`, `Slider.js`.

New website files: `catalog-data.js`, `catalog-core.js`, `catalog.js`, `lookup.js`, `site.js`, `robots.txt`, `assets/favicon.png`, `assets/social.jpg`, `assets/optimized/{logo,background,changan-logo,haval-logo,honda-logo,hyundai-logo,kia-logo,suzuki-logo,toyota-logo,all-aluminium,copper-brass,plastic-aluminium}.webp`.

New review/validation files: `.gitignore`, `AUDIT-REPORT.md`, `SEO-TEMPLATE.md`, `sitemap.xml.template`, `assets/optimized/metrics.json`, `tests/catalog.test.cjs`, `tools/optimize-images.py`, `tools/validate-static.py`, `tools/browser-smoke.cjs`, `tools/verify-extra.cjs`, `tools/measure-page.cjs`, `tools/security-check.cjs`.

No original asset was deleted, no framework/runtime dependency added, and no push, commit, deployment or production configuration change was made. All changes are unstaged for human review. The local test server was stopped after validation; start it with the commands below for review.

### Rerun locally in PowerShell

```powershell
node --test
node tools/security-check.cjs
$accPython = 'C:\Users\Muhammad Sanan\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
& $accPython tools/validate-static.py
& $accPython -m http.server 8000 --bind 127.0.0.1
```

In another PowerShell terminal, while the server is running:

```powershell
$env:ACC_PLAYWRIGHT = 'C:\Users\Muhammad Sanan\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\playwright'
node tools/browser-smoke.cjs
node tools/verify-extra.cjs
node tools/measure-page.cjs
git diff --check
```

If tooling lives elsewhere, adjust the environment path and `ACC_BROWSER` (Chrome executable) as needed. No npm build/lint/test scripts exist or were assumed. Review locally at `http://127.0.0.1:8000/`; stop the server with Ctrl+C when finished. Resolve business/domain decisions before requesting any push or deployment.
