# Bräutigam website

The public DE/EN website presents Bräutigam's carbon-fibre manufacturing capabilities, team and careers, and directs visitors to enquiries and applications. It has a deliberately technical visual language with existing Univers/Bootzy typography, green accents, light/dark themes and motion. Keep the existing recruitment/application security and pre-launch indexing controls.

## Current design authority

The Craft implementation follows the client's final Figma frame `2195:165` in file `U6PdyBS92GPjpwcznGYV7J`. Its supplied photography, paired light/dark machine illustrations, Beams settings and process animation are authoritative. This is an extension of the existing website, not a new brand or design system. Other pages retain their existing heading pairing; Craft's phase headings use the regular condensed first line shown in its final frame.

The implemented visual sources remain `app/globals.css`, the generated `app/typography-tokens.css` and `app/components/CraftPage.css`. Craft's scoped phase-heading override uses Univers Condensed at weight 400 for the first line and Bootzy at weight 400 for the second; it does not change the shared bold first-line heading rule. Typography tokens are generated from `scripts/data/figma-type-styles.json` with `pnpm sync:typography`.

## Current scope

Apply the 25 November mobile feedback: spacing and alignment, CAD/minimap separation, correct portrait proportions, menu/footer clearance and button diacritics. Adapt the Craft process and equipment to a readable single-column mobile layout. Preserve static readable content when animation is unavailable or reduced motion is requested.

The CMS manages five existing careers video positions, with one shared YouTube link or separate DE/EN links, optional translated titles and draft/publish controls. Video playback loads only after visitor consent. Unpublished positions retain their photographs. Actual client video links are still required.

Implementation and migration checks are recorded in `FEEDBACK-25NOV.md`; code and asset provenance is in `THIRD_PARTY_NOTICES.md`. Do not deploy or apply a remote migration without authorization for that release.
