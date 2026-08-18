# I Also Help Charity (IAHC Nepal)

Polished, responsive one-page static website for I Also Help Charity, a community-based charity based in Ranipouwa / Pokhara, Nepal.

## Run locally

The site has no build step. Open `index.html` directly in a browser, or serve this directory with any static server, for example:

```sh
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Included

- Semantic one-page structure for education, people, programs, charity shop, impact, support, contact, and safeguarding.
- Responsive editorial layout with blue-led IAHC palette, serif display type, and local image assets under `public/assets`.
- Sticky navigation, keyboard-safe mobile menu, active section state, reveal-on-scroll, reduced-motion handling, language toggle (English / Nepali labels), donation summary, client-side form states, cookie notice, and newsletter UI.
- SEO metadata, Open Graph tags, `sitemap.xml`, and `robots.txt`.

## Source and safeguarding notes

Copy is limited to the supplied IAHC source materials and the figures stated there: 11 children currently supported across 5 families, a goal of reaching 25 children in need and a separate goal of supporting 10 families, a £400/month / £4,800/year fundraising target, and £20 / $25 per child per month sponsorship. Child names, ages, sensitive family circumstances, and banking details are intentionally not published.

## TODO before launch

- Connect the support flow to a verified payment provider and confirm currency, recurring payment, receipts, and donor data handling.
- Add verified registration numbers and legal/financial disclosures if the charity supplies them.
- Complete consent, safeguarding, and image-rights review for every public image and any future story.
- Connect the contact and newsletter forms to an approved inbox/provider with privacy and anti-spam handling.
- Add analytics only after consent, privacy review, and the owner’s approval.
- Confirm the canonical production URL and update `sitemap.xml` / `robots.txt` if it differs from the supplied bio.site URL.
