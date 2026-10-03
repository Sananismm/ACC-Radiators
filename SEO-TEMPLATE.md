# Domain-dependent SEO — review-only placeholders

Once the owner confirms the public domain, replace `CANONICAL_ORIGIN` with its HTTPS origin, without a trailing slash. Do not put unresolved placeholders into page metadata.

Add these per page, using `/`, `/about.html` and `/products.html` respectively:

```html
<link rel="canonical" href="CANONICAL_ORIGIN/PAGE_PATH">
<meta property="og:url" content="CANONICAL_ORIGIN/PAGE_PATH">
<meta property="og:image" content="CANONICAL_ORIGIN/assets/social.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="ACC Radiators — vehicle and radiator illustration">
<meta name="twitter:image" content="CANONICAL_ORIGIN/assets/social.jpg">
```

For the homepage, use `CANONICAL_ORIGIN/` (no duplicate slash). Generate `sitemap.xml` from `sitemap.xml.template`, and append `Sitemap: CANONICAL_ORIGIN/sitemap.xml` to `robots.txt`.

After verifying company identity and email ownership, add Organization JSON-LD with `name`, `url`, `logo` and `email`. Do not add telephone, address, legal name, reviews, stock or warranty fields without verified information. Social artwork is derived from the existing approved homepage illustration; it is not product-specific photography.
