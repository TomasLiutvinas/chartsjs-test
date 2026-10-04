# Speedway Cup refresh

Branch: `feature/speedway-refresh`. The user chose to refresh this standalone
app and retain the homepage's existing GitHub Pages link. No backend needed.

- [x] Review the original app, source data, and hosting.
- [x] Preserve all 109 entrants and all seven round values exactly.
- [x] Separate the documented final placement (18/22) from raw points rank (25/109).
- [x] Build a racing archive layout, season summary, and round-point record.
- [x] Replace the overwhelming default chart with the original five rivals.
- [x] Add cumulative/per-round modes, deterministic colours, comparison presets,
      searchable accessible results, and individual driver selection.
- [x] Remove jQuery/CDN runtime dependencies; vendor Chart.js 4.5.1 with its licence.
- [x] Check mobile/desktop layout, keyboard controls, chart/table state, and errors.
- [x] Verify data against the original `graph.js` and run data/ranking tests.
- [x] User visual review accepted; delivery authorised on 2026-10-04.

Original zero scores, source names, and source row order remain in `data.js`.
The table sorts raw point totals and gives tied totals equal ranks. The original
README is the source for final placement; no championship scoring rules inferred.
Search ignores diacritics while displaying names exactly as recorded, including
the two different source spellings of Sarunas/Šarūnas Lengvinas.

## Checkpoint — 2026-10-04

The complete facelift is ready for review at `http://localhost:8189`.
All 109 original names and 763 point values match `b30817e:graph.js` exactly.
Four tests pass, covering the frozen data digest, cumulative totals, ranking and
ties, presets, and Lithuanian search; JavaScript syntax and whitespace checks
pass. Browser checks cover all six presets, both chart modes, legend/checkbox
sync, empty search, find-my-result focus, keyboard activation, and desktop/
390px/320px layouts. Corrected mobile headline clipping; no browser errors.
The existing homepage link remains valid and the main website repo is untouched.
No push or deployment performed. Original founder-task file remains preserved
in the main website repository; clear it only after this task is accepted.

## Dark mode and acceptance — 2026-10-04

Added a header light/dark toggle, system preference default, saved choice,
pre-paint theme application, and theme-aware chart/legend colours. Verified
reload persistence, both themes, desktop/mobile layout, and preservation of
chart mode, selected drivers, and search when toggling. Four data tests and
syntax/whitespace checks pass. User accepted the refresh and requested delivery.
