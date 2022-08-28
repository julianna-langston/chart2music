# Basic example

## Chart

First, let's assume you already have a chart on your webpage. It might be a static image (like a .png), an SVG element (like with D3.js or Google Charts), or a canvas element (like with Chart.js or Tabelau). The HTML may look like any of these items:

```html
<img src="barChart.png" />
<svg id="generated-with-d3">...</svg>
<canvas id="myChartjsTarget"></canvas>
```

When we initialize chart2music, we are going to pass along its visual, so that it can best coordinate with the flow of the page.

## To music

When you initialize chart2music, you need to provide at least 3 things:

1. What type of chart?
2. Where is the visual?
3. What is the data?

Here is a basic example:

```html
<img src="lineGoesUp.png" id="myChart" />
<div id="screenReaderText"></div>
```

```js
c2mChart({
    type: "line",
    element: document.getElementById("myChart"),
    cc: document.getElementById("screenReaderText"),
    data: [8,9,6]
});
```

:::note
Chart2Music will modify the provided element in order to optimize the experience for screen reader users. After the above javascript runs, the img tag will look like this:

```html
<img src="lineGoesUp.png" id="myChart" tabIndex="0" alt="Sonified line chart" />
```

While not *required*, it is recommended that you provide a title when creating a chart. For example, this javascript code:

```js
c2mChart({
    type: "line",
    title: "Quality of Terminator movies",
    element: document.getElementById("myChart"),
    cc: document.getElementById("screenReaderText"),
    data: [8,9,6]
});
```

would give this more informative alt text:

```html
<img src="lineGoesUp.png" id="myChart" tabIndex="0" alt="Quality of Terminator movies, sonified line chart" />
```
:::

