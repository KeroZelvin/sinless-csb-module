# SinlessCSB Release Checklist (GitHub)

## Scope
This checklist is for building and publishing a new GitHub release for the SinlessCSB Foundry module.

## Preflight
1. Confirm you are on the correct branch and the repo root is `D:\Git\sinlesscsb`.
2. Ensure Foundry v13 + CSB v5 is the target runtime.
3. Run `git status` and make sure you understand any existing changes.

## Content updates
1. Update compendium content in Foundry (do not edit `packs/` in VS Code).
2. Export compendiums back into `D:\Git\sinlesscsb\packs` as an intentional packaging step.
3. Regenerate `docs-internal\compendium-index.md` via the Foundry export macro and replace the file in the repo. This file is documentation only and is not packaged.
4. Update any other content that should ship (scripts, styles, assets, module.json).
5. Update the release number in `module.json`.
6. Update `CHANGELOG.md` if you want release notes in-repo.

## Stage and commit in VS Code
1. Open `View -> Source Control` (or press `Ctrl+Shift+G`).
2. Review the file list; ensure `packs/**` changes are intentional and `docs-internal/**` changes are expected.
3. Stage files with the `+` button or `Stage All Changes`.
4. Enter a commit message and click the checkmark to commit.

## Tag in VS Code (exact steps)
1. Open the Command Palette with `Ctrl+Shift+P`.
2. Run `Git: Create Tag`.
3. Enter the tag name in `vX.Y.Z` format (for example `v0.0.8`).
4. When prompted, enter a tag message (creates an annotated tag) or leave blank for a lightweight tag.
5. Open the Command Palette again and run `Git: Push Tags`.

## Build package (after tagging)
1. Run `.\build.ps1` from the repo root.
2. Verify `dist\sinlesscsb\` contains `module.json`, `scripts\`, `packs\`, `styles\`, and `assets\`.
3. Verify `docs-internal\` is not present in the package.
4. Verify `dist\sinlesscsb.zip` exists.

## GitHub release
1. On GitHub, go to `Releases` -> `Draft a new release`.
2. Choose the tag you just pushed and target the correct branch.
3. Upload `dist\sinlesscsb.zip` and `module.json` (from repo root or `dist\sinlesscsb\module.json`).
4. Publish the release.

## Post-release sanity
1. Install the release in a clean Foundry instance and confirm the module loads.
2. Spot-check a compendium or two to confirm pack contents are updated.

## Code tracking
1. in powershell: tokei -e packs -e dist -e .tmp -e dist-snapshot .

