# Changelog

All notable changes to **AI Agency Tycoon** will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [0.3.0] — 2026-05-21

### Added
- English dialog tree (`demoCallDialogEN`) for international clients
- 4 client persona archetypes: `price_focused`, `trust_focused`, `busy_founder`, `detail_oriented`
- Referral mechanic: 3% chance per client per month adds a TR demo to queue
- Progress Rail UI (8 nodes, Level 0–7) between header and main
- Objective HUD widget showing current level goal
- Demo Queue widget displaying pending TR/INT demos
- Game Over modal with win/lose states and share button
- `saveGame()` / `loadGame()` with `localStorage` persistence (`ai_agency_v1`)
- Live USD/TRY exchange rate fetch from `open.er-api.com` (fallback: 33)
- `animateCounter()` with ease-out cubic RAF animation
- `generateShareCard()`: Canvas PNG export with agency stats + download
- `COMMAND_REGISTRY`: centralized command definitions with `minLevel` guards
- Missing badge IDs: `yerel_fatih`, `global_oyuncu`
- CSS: progress rail neon animations, objective bar, game-over modal with backdrop blur
- CSS: dialogue-mode yellow neon prompt, `badge-full-item` class

### Fixed
- Churn guard: `Math.max(0, clients - 1)` prevents negative client counts
- `playSFX`: added `async/await` on `this.resume()` to prevent suspended AudioContext errors
- `startVisualizerLoop`: pre-allocated `Uint8Array` outside RAF callback (eliminated 60 allocs/sec)

### Changed
- `parseCommand` refactored: registry lookup + `minLevel` guard replaces `switch/case`
- `showHelp` now auto-generated from `COMMAND_REGISTRY`, filtered by current level
- `nextMonthCommand` split into `tryLevelUp()`, `processFinancials()`, `processChurnUpsell()`, `processBurnoutGameOver()`

---

## [0.2.0] — 2026-05-21

### Added
- Retro 8-bit background music via Web Audio API
- Sound effects (SFX) for key game events
- Audio visualizer with canvas-based real-time rendering
- Mute/unmute toggle for music and SFX independently

---

## [0.1.0] — 2026-05-21

### Added
- Initial game: AI Agency Tycoon with retro CRT terminal interface
- CLI-style gameplay (typed commands in browser)
- Core loop: clients, revenue, burnout, churn mechanics
- Turkish localization
- Demo call system with dialog tree
- Badge / achievement system
- Level progression (0–7)

---

[Unreleased]: https://github.com/workyghost/ai-agency-game/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/workyghost/ai-agency-game/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/workyghost/ai-agency-game/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/workyghost/ai-agency-game/releases/tag/v0.1.0
