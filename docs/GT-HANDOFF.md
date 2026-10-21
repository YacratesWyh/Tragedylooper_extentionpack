# GT HANDOFF — 彩窗书卷 · Loop Codex (reference build v3.0)

Updated: 2026-10-21. This is the **ground truth** every candidate run is compared against.
It is presentation-only: it never changes DOM structure, handlers, drop targets, API calls or game logic.

---

## 1. What this GT is

An interface mod for **惨剧轮回自助对战桌** (`https://tragic-aiplay.cn/auto_play.html`).
Art direction: an illuminated church codex — parchment leaves, gilt rules, rubric bands, stained glass,
Italian chapel light, Manosaba/Madoka restraint. The client requirement is the same for every candidate:

> Build an interface **mod**, an illuminated church story roleplay UX, stained glass, Italian
> church/museum atmosphere, with Manosaba/Madoka influence. Retain the artistic book identity when
> refining usability. This game is exactly for a manosaba script.

## 2. Package

| Path | What |
|---|---|
| `compare/gt-final/extension/` | installable Chrome MV3 mod (`manifest.json`, `interface.css`, `interface-refine.css`, `interface.js`) |
| `compare/gt-final/extension/interface-refine.css` | refinement layer: proportions → font rule → interaction paint → quick-reasoning recode |
| `compare/gt-live/index.html` | GT board reference page (live assets + real cards) |
| `compare/gt-live/interactions.html` | GT 快捷推理 / lightbox reference state (real game DOM) |
| `compare/starter-live/` | **neutral** start page for candidate runs (no GT code) |
| `compare/live-assets/` | public artwork + 8 native character cards fetched from the origin (QA only) |
| `compare/shots/gt-live/` | board screenshots 1440 + 390 |
| `compare/shots/gt-live/interactions/` | quick-reasoning screenshots 1440 + 390 |
| `compare/PROCESS.md` | how to reach the site, serve, run and score a candidate |
| `compare/report.html` | six-run comparison report (provisional for candidates) |

Install: load `compare/gt-final/extension/` as an unpacked extension, reload, refresh the game tab.
Content script scope: `https://tragic-aiplay.cn/*`.

## 3. What changed in v3 (vs the previous v2.2 reference)

1. **Real artwork.** The previous reference was rendered against a fixture whose CSP blocked every image,
   which made the board a grey wireframe. The live site was reached via its real IP (`159.138.48.48`) with
   SNI override after the local DNS fake-IP proxy broke the hostname; the GT page now renders real board
   sheets, counter strip, action cards, chibi and logo.
2. **All eight character cards at native resolution** (≈305×423 from `/api/character-card/<slug>`, fetched
   with a logged-in session): 住院患者 · 巫女 · 异界人 · 职员 · 情报商 · 男学生 · 大小姐 · 女学生.
3. **Card proportion fix.** Distance preview values (`--loc-char-width: 75/60px`) made cards ~14 % of a
   location; the live board is ~22 %. Reference overrides to 94 px + reclaimed grid padding so two-row
   locations still fit (`interface-refine.css` → proportions block).
4. **Typography rule.** The only installed Tsukushi cut is `FOT-TsukuMinPro-L` (**Light**). It stays for
   display sizes; anything under 13 px switches to a gothic at 13 px. Verified: computed family is 100 %
   `Loop Tsukushi`, `fontsLoaded` confirms it.
5. **Interaction surfaces are now covered** — previously `interface.css` had **zero** rules for what appears
   when the player touches a character. The reference now paints:
   - `.char-card-lightbox` (+ panel/title/image) — character card viewer;
   - `.desktop-card-preview` / `.card-preview` — hover preview;
   - `.choice-dialog-overlay.character-quick-note-overlay` and the full `.character-quick-note-*` tree —
     the 快捷推理 / 角色笔记 modal (rubric band header, vellum sections, wax-seal mark chips
     `is-blank/possible/excluded/suspected`, note textarea, oxblood primary action);
   - `.choice-dialog` / `.utility-dialog` generic dialogs.
6. **Geometry respected.** The interaction layer changes paint only; sizes, padding, display and position
   come from the game's own `dialogs.css`. The quick-note markup is the game's real markup (`notes.js`),
   so nothing is invented.

6. **Dialog & panel layer (new).** Every click-opened surface is now skinned, not only the quick-note:
   `#noteOverlay` (对局笔记 / 风格：羊皮纸对话框、rubric 标题、羊皮纸输入框与下拉、快照卡片、
   底栏与快捷入口), `#loopLimitOverlay` (已用轮限牌), plus the generic `.choice-dialog` + overlay
   scrim used by 规则QA / 设置 / 模组详情 / 公开信息 / 公开日志 / 快照 / 角色池 / 移除区.
   Evidence captured on the running game: `compare/shots/live/notes.png`,
   `compare/shots/live/loop-limit.png`.

## 4. GT correctness checklist (all verified)

- [x] All 40 original ids / controls / drop targets preserved on the game page.
- [x] Image `src` values untouched; no artwork bundled in the extension (QA copies live only in `live-assets/`).
- [x] Tsukushi declared via `local("TsukuMinPro-L")`, no network font.
- [x] Display type Tsukushi; small text ≥ 13 px gothic; no text below 13 px.
- [x] Board cards at live proportion; eight real cards; two-row locations contained.
- [x] Interaction surfaces themed: lightbox, hover preview, quick-reasoning modal, dialogs.
- [x] Quick-reasoning modal renders the game's real DOM and retains its click/cycle behaviour (paint only).
- [x] No horizontal overflow at 1440 / 390 on the reference pages.
- [x] Extension loads as MV3; `interface-refine.css` braces balanced; manifest parses.
- [x] Verified against the real page served locally with a session proxy: GT theme applies to the live DOM.

Known limits: the local live-run still needs a valid game session to populate the board; cards are served at
≈305 px (not 750×1050) so extreme zoom is limited; demo harness markup mirrors `notes.js` but is not itself
the live page.

## 4b. Visual reference vs functional reference (important)

The GT is **CSS + decorative shell only** — `interface.js` adds chrome and settings and never touches the
game's event handlers, DOM structure or API calls. All original gameplay (character click → 快捷推理,
drag/drop, dialogs) is therefore preserved on the real site; it cannot be "recovered" because it was never
removed.

- **Visual reference** — `compare/gt-live/index.html` + `interactions.html`: static snapshots for screenshots
  and scoring. They carry no game JS, so clicking a card there does nothing by construction. Do not test
  interaction on these.
- **Functional reference** — `compare/live/auto_play-gt.html`: the **original site page**, fetched from the
  origin, with only the six GT stylesheets appended in `<head>`. No harness scripts, no synthetic clicks,
  no auto-opening, no hidden overlays — every interaction is the site's own JS. Serve it through
  `compare/serve-live.mjs` (a transparent domain/transport proxy: it forwards cookies and `Origin`/`Referer`,
  which the site requires for its writes). This is where click → 快捷推理, 对局笔记, 已用轮限牌 are verified.
  First-run dialogs (AI 剧作家 / BTX / 剧透确认) are the site's own; dismiss them as on the original site.

## 5. How candidates are compared (transmit this section)

Candidates must build the same mod against `compare/starter-live/` — never against the GT package — and must
not read `compare/gt-final/**`, `compare/gt-live/**`, `C:/Users/admin/Documents/Codex/**` or `report.html`
before finishing.

1. Copy `starter-live/{index.html,layout.css,board.css,cards.css}` into the run directory.
2. Build `mod/manifest.json` (MV3, `matches: ["https://tragic-aiplay.cn/*"]`), `mod/mod.css`, `mod/mod.js`.
3. `result.html` = fixture + `mod/mod.css` linked after the three original sheets + `mod/mod.js` (`defer`).
4. Serve with `node compare/serve.mjs` (CSS must be `text/css`; Chrome drops `application/octet-stream`).
5. Screenshot 1440 and 390, full page, ≥1 s settle.
6. Checks before scoring: 40 ids present; original image URLs unchanged; all eight cards visible;
   no console errors; no horizontal overflow; Tsukushi in use; interaction classes styled.
7. Score 7 criteria (art direction, book identity, composition, typography, colour, usability, execution)
   against `compare/gt-live/`, and record wall-clock + tokens.

## 6. Open items for the next iteration

- Capture the quick-reasoning modal on the **live** page end-to-end (needs a fresh match session, not the
  archived one) to confirm the paint in situ rather than in the harness.
- If the live card endpoint ever serves 750×1050, refresh `live-assets/char-*.png`.
- Re-run the five candidate runs on `starter-live` and regenerate `report.html`.
