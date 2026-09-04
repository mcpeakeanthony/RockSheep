# RockSheep Modernization Plan

Tracks the modernization/bug-fix work for this project. Section 1 is done and
ready for testing. Section 2 is queued up for the next work session.

## 1. Completed (needs your testing before moving on)

### Image flash-in on page load

`css/preload.scss` was dead code (never `@import`ed into `main.scss`, and its
repeated `background-image` declarations were a CSS no-op anyway) — deleted.
Replaced with a real preload:

- `scripts/generate-preload-manifest.js` extracts every image url out of each
  `css/pageN.scss` into `assets/preload-manifest.json`.
- `npm run build` / `npm run dev` now run this as `build:manifest` before Vite.
- `js/story-effects.js` (`story.load`) preloads the current page's images
  (`Image()` + `Promise.all`, 5s failsafe) before hiding the `.loader` spinner,
  then prefetches the next page's images in the background.

**Test:** load each page on a throttled/mobile connection, confirm no
background images pop in after the loader disappears, and pages don't hang on
"Loading..." indefinitely.

### Page 5 (and Page 25) lost their tap animation

Root cause: `story.effects.fireworks()` clones a `.svg` template element to
build the tap-triggered particle burst. The Vite modernization pass had
deleted the hidden `<img class="svg">` templates (star/record/musical-notes)
from `5.html` and `25.html` — the only two pages using fireworks — so
`svgArray` was empty and `svgArray[0].cloneNode()` threw. That exception
happened inside page init, before `makeHotspotsAccessible()` ran, silently
breaking keyboard accessibility too.

Fixed by:

- Guarding `createExplosion()` in `js/story-effects.js` to bail out cleanly if
  no `.svg` templates exist (no more crash either way).
- Restoring the deleted `<img class="svg">` templates in `5.html` and
  `25.html` (image assets were untouched on disk, only the HTML refs were gone).

**Test:** tap the rocksheep on page 5 and the circle on page 25 — confirm the
sound plays _and_ the firework/particle burst animation plays. Also confirm
tabbing to those hotspots and pressing Enter/Space still works (a11y).

### Page 25 had zero page-specific CSS

`css/main.scss` never `@import`ed `page25.scss`. Added the missing import.

**Test:** load 25.html, confirm it's laid out/styled like the other pages
(backgrounds, positioning), not a blank/unstyled page.

### Touch/click consistency

Page 3 was the only page binding `pointerup.storyRuntime` directly instead of
`click.storyRuntime` like every other page. Standardized to `click.storyRuntime`
for the moon, sleep, and rocksheep hotspots on page 3.

**Test:** tap the moon, sleep, and rocksheep hotspots on page 3 on a real
touch device — confirm each still fires exactly once per tap (no double-fire,
no missed taps).

### Page 22's pirate-sheep had no interaction

The DOM/CSS for the pirate-sheep character (body/chest/arms/feet, all with
correct `transform-origin`s) existed, but nothing was ever wired up in
`story.page22` — it only ran the cloud effects. Its container also carried a
stray `js-bounce` class that did nothing, since `story.effects.bounce()` is
never called on this page.

Added a tap-triggered sequence in `js/story-main.js` (`story.page22`):
tapping the character (`.js-pirate-sheep`, renamed from `js-bounce`) makes it
bounce off-screen to the left with its arms/legs wiggling, pause off-screen
for 5 seconds, then bounce back in from the right to its original position
(arms/legs wiggling again during the re-entry, not during the pause). Added
`.js-pirate-sheep` to `hotspotSelectors` in `js/story-effects.js` so it's
keyboard-accessible like the other tap hotspots.

**Test:** tap the pirate-sheep on page 22 — confirm it exits left, stays gone
for ~5s, then re-enters from the right back to its exact original spot, with
arm/leg wiggle only during the moving portions. Tap again after it settles to
confirm it can replay (and that rapid re-tapping mid-animation is ignored).

---

## 2. Next stage (not yet implemented)

### 2a. Touch/click workaround simplification (depends on your device testing above)

`js/story-effects.js` (~line 1330-1410) has a pointerup→synthetic-click
normalization layer with a 500ms dedupe window, built to work around mobile
tap reliability issues. Now that page 3 is consistent with the rest of the
codebase, and assuming your device testing above comes back clean:

- Evaluate whether this whole workaround can be deleted in favor of binding
  `click.storyRuntime` everywhere and relying on `touch-action: manipulation`
  (already set in `css/main.scss`) for fast, delay-free clicks on modern
  mobile browsers.
- Only do this if device testing confirms taps are reliable without it — this
  is exactly the kind of change that needs real-device verification, not just
  code review.

### 2b. Dev tooling

- Add ESLint (flat config) + Prettier for `js/story-*.js` and `js/dom-lite.js`.
- Add `npm run lint` / `npm run format` scripts.

### 2c. Automated tests

- Playwright E2E suite covering all 25 pages:
  - loader disappears within a reasonable time, no console errors
  - primary hotspot tap triggers the expected animation/class change
  - touch emulation (Playwright supports this) for tap reliability regression
    coverage going forward
- GitHub Actions workflow: lint + `npm run build` + Playwright tests on push/PR.

### 2d. Code cleanup

- Remove stray debug code: `blow: function() { console.log('sdfsdf'); }` in
  `js/story-effects.js`, and the large commented-out block inside `wind()`.
- Sweep for any other leftover `console.log` calls.

### 2e. Documentation

- Lightweight `README.md`: project structure, `story.pageN` pattern, dev/build
  commands, event-binding convention (`click.storyRuntime`), effects catalogue.

---

## Notes / conventions discovered

- Each `N.html` is a fully separate Vite entry (no client-side routing);
  `js/story-main.js` defines `story.pageN` setup functions, `js/story-effects.js`
  holds shared effects + global event/loader/audio plumbing, `js/dom-lite.js`
  is a minimal jQuery-replacement (`.on/.off` support namespaced events like
  `.storyRuntime`).
- `css/main.scss` `@import`s every `css/pageN.scss` partial — if you add a new
  page's SCSS file, remember to add the `@import` line, or its styles will
  silently never apply (this is exactly what happened to page 25).
- `assets/preload-manifest.json` is generated, not hand-edited — rerun
  `npm run build:manifest` after changing any `pageN.scss` background image.
