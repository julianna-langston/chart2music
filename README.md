# Chart2Music

Chart2Music turns charts into music so the blind can hear data.

[![npm version](https://badge.fury.io/js/chart2music.svg)](https://badge.fury.io/js/chart2music)
![Build verification](https://github.com/julianna-langston/chart2music/actions/workflows/ci-build.yml/badge.svg)
![Documentation](https://github.com/julianna-langston/chart2music/actions/workflows/ci-docs-build.yml/badge.svg?event=push)
[![Known Vulnerabilities](https://snyk.io/test/github/julianna-langston/chart2music/badge.svg)](https://snyk.io/test/github/julianna-langston/chart2music)
[![codecov](https://codecov.io/gh/julianna-langston/chart2music/branch/main/graph/badge.svg?token=4T7MV9XKFS)](https://codecov.io/gh/julianna-langston/chart2music)

## Key features

* **Accessibility for screen reader users** - Enables blind users to rapidly absorb information about charts and graphs using sound and exploration.
* **Easier maintenance for accessibility requirements** - Traditionally, charts and graphs would be made accessible using alt text, which can be difficult to generate or maintain, or data tables, which provide a poor end user experience. C2M provides an *automated* solution while *enhancing* the user experience.
* **Visual agnostic** - Use C2M alongside your charts, regardless of how your visuals were created. ChartJS? D3.js? An image? C2M works in parallel with your visuals.

## Getting started

Include the following script tag on your page:

```html
<script src="https://cdn.jsdelivr.net/npm/chart2music"></script>
```

On your page, you will also need your chart. For the sake of simplicity, here's an example with an image:

```html
<img src="mychart.png" id="MyChart" />
```

Now, in your javascript, you can start a new instance of Chart2Music. In this example, we will include a simple bar chart, and point it to the img element above.

```javascript
c2mChart({
    type: "bar",
    element: document.getElementById("MyChart"),
    data: [1,2,3]
});
```

What will the user experience be? When the user navigates to the image, a description will be automatically generated, telling the user that there is interaction available. Then, the user can use arrow keys or keyboard shortcuts to interact with the data.

## Advanced

For code examples in action, see the [Chart2Music Examples collection on Codepen](https://codepen.io/collection/BNedqm).

Some of the examples you will find there include:
* [Simple, no frills code example](https://codepen.io/chart2music/pen/ExEmqbr).
* [Multi-line plot](https://codepen.io/chart2music/full/gOegZpm).
* [Bar-line plot](https://codepen.io/chart2music/full/QWmdpOJ).

You can also find examples of integrations with other visualization libraries:
* [with Chart.js](https://codepen.io/chart2music/pen/YzaVxPK)
* [with D3.js](https://codepen.io/chart2music/full/gOezOaY)
* [with Google Charts](https://codepen.io/chart2music/full/abYGoBJ)
* [with AnyChart](https://codepen.io/chart2music/full/abYGoME)
* [with Chartist.js](https://codepen.io/chart2music/full/LYdmPNj)
* [with NVD3.js](https://codepen.io/chart2music/full/jOzxNQW)
* [with Plotly.js](https://codepen.io/chart2music/full/BarrXYr)
* [with Vega-Lite](https://codepen.io/chart2music/pen/jOzpyME)
* [with Morris.js](https://codepen.io/chart2music/full/abYGobm)
* [with Frappe](https://codepen.io/chart2music/full/QWmrWWE)

Go to [chart2music.com](https://www.chart2music.com) for the full tutorial.