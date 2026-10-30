# $UODF — "The Annual Report" — Design Brief

**Concept.** The website is the *Shareholder Annual Report & Prospectus* of a (fake, meme) patriotic oil dividend fund.
Gold-on-navy engraved-banknote aesthetic: SVG-generated guilloche rosettes, intaglio hatching, serial numbers,
embossed gold foil, glossy oil-black. Mascot: a suited bald eagle (no real persons).

## How it differs structurally from previous sites
| Previous template | This site |
|---|---|
| 000–100 counter preloader | **"Ink & Emboss" intro**: guilloche rosette draws itself as stroke ink, then a seal is *stamped* (scale-slam + paper shake) and the cover slides up like a report page turning. |
| Top navbar + sticky mobile bar | **Fixed left "Table of Contents" spine** (roman-numeral chapters, ink-fill progress per chapter, page folio "p. 04 / 11"), keyboard ←/→ / J/K chapter paging. Mobile: a top **folio bar** with a chapter index drawer + bottom **gold "ticket stub" dock** (perforated edge, Buy / Copy CA / Chart). |
| Pinned hero: title left / character right + outlined bg word | **Hero is a giant stock certificate** (centered object, not a split layout) with pointer-driven 3D tilt + holographic foil sheen, live serial number, eagle seal, CA field, Buy. |
| Ribbon marquee + lore cards | **Chairman's Letter**: two-column editorial letter with drop cap, margin notes and a signature that is drawn (SVG stroke). |
| Pinned meter scene | **Operations Report**: pump-jack SVG pumps on scroll; oil drops become gold coins; canvas **gusher fountain** of gold particles; live "Freedom-Unit Ticker" clock (joke). |
| Pinned sideways gallery | **"The Vault" money rain**: 10 meme cards fall from the sky like bills (3D rotateX/Y/Z flutter, side drift), land into a messy stacked pile; canvas dollar-bill & coin rain; "Make it rain" replay. |
| How to Buy 4 equal cards | **Subscription Form**: numbered prospectus clauses on a form with tick-boxes, initials fields and a "Subscriber signature" line. |
| Tokenomics pills | **Fund Facts sheet**: ledger table with dotted leaders + drag-to-rotate 3D gold coin. |
| Chart block | **Market Data Appendix**: chart mounted in a ticker-tape frame with "Data pending" notary overlay while TBA. |
| — | **Board of Directors**: framed oval portraits of eagle poses with engraved nameplates. |
| — | **Joke Dividend Calculator** (barrels → "freedom units"), clearly labelled as fiction. |
| — | **Risk Factors**: full-width prominent disclaimer page. |

**Layout system:** 12-col "report page" grid inside a 1px gold hairline frame with folio header/footer on every chapter
(chapter numeral, running title, page number) — each section reads as a printed page.

**Type:** Playfair Display SC (display), IM Fell English SC (engraved labels), IBM Plex Sans Condensed (body),
IBM Plex Mono (serials, CA, figures). All self-hosted woff2. (No Cinzel.)

**Interaction model:** page-turn chapter paging, tilt+foil, stroke-ink drawing, stamping, scroll-scrubbed machinery,
money rain physics, drag-rotate coin, gold coin cursor. Reduced-motion and no-JS/no-lib static fallbacks.
