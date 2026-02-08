# disambiguationPREGEN

Generated during pregen JSON creation from Sinless core p53-60 and Quickstart p28-37.

## Scope
- Core sample characters were mostly clean text extraction.
- Quickstart front sheets required best-effort visual extraction from rendered pages; some circles/ratings are ambiguous.

## Core Mapping Notes
- MARTIAL ARTIST: source has both 12 months middle lifestyle and 6 months high lifestyle. Fields are set to High x6; additional middle months are in invTxt.
- COVERT OPERATIVE: source lists 'Mazada Sedan'. Compendium has no exact match; mapped to 'Sports Sedan' as closest vehicle.
- COVERT OPERATIVE: Firearms (Rifles) 5/7 applied as Skill_Firearms=7 and noted in pcNotes.
- DETECTIVE: Observation 6 + 2 applied as Skill_Observation=8 and noted in pcNotes.

## Quickstart Ambiguities
- Vampire Mentalist Face: several skill pip rows are difficult to separate due scan/overlay; values are best-effort.
- Cybered Recon: etiquette and some non-primary skill pips are approximate best-effort.
- Uplifted Gorilla hacker: right-column focus-skill pips include faint marks; only high-confidence skills were set.
- Rigger Sleuth: ghost rating field on page 34 appears unreadable/blank in rendered image; ghostRating left blank.
- Rigger Sleuth and Synthetic wasteland archmage: some side-panel marks could not be confidently disambiguated from print artifacts.
- Synthetic wasteland archmage: "Plus 7 more Force of spells (player choice)" left as note in invTxt for manual selection.

## Compendium Name Check
- All configured pregen compendium item names matched names in docs-internal/compendium-index.md.

## Files Created
- fvtt-Actor-martial-artist.json
- fvtt-Actor-assassin.json
- fvtt-Actor-covert-operative.json
- fvtt-Actor-pop-idol.json
- fvtt-Actor-wasteland-mage.json
- fvtt-Actor-detective.json
- fvtt-Actor-driver.json
- fvtt-Actor-archmage.json
- fvtt-Actor-vampire-mentalist-face.json
- fvtt-Actor-cybered-recon.json
- fvtt-Actor-uplifted-gorilla-hacker.json
- fvtt-Actor-rigger-sleuth.json
- fvtt-Actor-synthetic-wasteland-archmage.json
