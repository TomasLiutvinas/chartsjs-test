# Speedway Cup 2021

A standalone racing archive for the seven-round 2021 season:
https://tomasliutvinas.github.io/chartsjs-test/

Tomas Liutvinas finished **18/22 in the final championship standings**. The
original raw results contain 109 entrants and put his seven-round total of
114 points at **25/109**. These two rankings are intentionally kept separate.

## Development

No build or dependency install is needed. Serve this directory over HTTP, e.g.
`python3 -m http.server 8189`, then open `http://localhost:8189`.
Use Node 24+ to run `npm test` and `npm run check`.
GitHub Pages can continue serving the repository root at its existing URL.

`data.js` preserves all original names and round scores. `utils.js` computes
raw totals/ranks without mutating source data. `graph.js` connects the comparison
chart, presets, legend, and results table. Zeros are shown as recorded; absence
or disqualification is not inferred. Top 5/25 presets use raw point rankings.

Chart.js **4.5.1** is vendored in `vendor/` with its MIT licence; no external
JavaScript is required. Google Fonts provide Barlow/Barlow Condensed with local
fallback fonts when unavailable. The chart uses straight segments so it does
not imply scores between rounds. Chart data is also available as a table.
Chart options follow the official [line-chart](https://www.chartjs.org/docs/latest/charts/line.html)
and [responsive-chart](https://www.chartjs.org/docs/latest/configuration/responsive.html) documentation.

The header theme toggle switches between light and dark mode, including chart
colours and table surfaces. It follows the system theme until a choice is saved
in local storage, and applies before styling loads to avoid a light flash.

Runtime CSS/JavaScript URLs and browser module imports include a release query
(`v=20261004-1`). Bump it together in `index.html` and `graph.js` when releasing
changed assets so GitHub Pages/browser caches cannot mix old scripts/styles
with a new page. Node tests import the unversioned source files locally.
