---
title: Chart2Music
sidebar_position: 1
sidebar_label: Introduction
---

<div align="center">
    <img src="/img/logo.jpg" alt="Logo showing an alto clef starting a musical staff with whole notes. The staff's lines turn into a line chart." width="300px" height="175px" />

</div>

<p align="center">Chart2Music turns charts into music so the blind can hear data.</p>

[![npm badge](https://badge.fury.io/js/chart2music.svg)](https://badge.fury.io/js/chart2music)
![Build verification badge](https://github.com/julianna-langston/chart2music/actions/workflows/ci-build.yml/badge.svg)
[![Vulnerabilities badge](https://snyk.io/test/github/julianna-langston/chart2music/badge.svg)](https://snyk.io/test/github/julianna-langston/chart2music)
[![Code coverage badge](https://codecov.io/gh/julianna-langston/chart2music/branch/main/graph/badge.svg?token=4T7MV9XKFS)](https://codecov.io/gh/julianna-langston/chart2music)

## Introduction

Charts can convey a lot of information but are difficult to make accessible for visually impaired and blind users.
The most common solutions are to include a data table or attempt to describe the chart in alt text, often resulting in a subpar user experience.

Chart2Music is a TypeScript/JavaScript package which allows authors to add accessibility to their charts.
With a couple lines of code, Chart2Music will provide sonification (turning data into sound), screen reader support, and keyboard handling.
It works alongside other charting libraries, so you can continue to use the tools that you know best.

## Key features

* **Inclusively designed** - The dev team behind C2M includes blind people in the design, development, and testing stages.
* **Accessibility for screen reader users** - Enables blind users to quickly absorb information about charts and graphs using sound and exploration.
* **Easier maintenance for accessibility requirements** - Traditionally, charts and graphs would be made accessible using alt text, which can be difficult to generate or maintain, or data tables, which provide a poor end user experience. C2M provides an *automated* solution while *enhancing* the user experience.
* **Visual agnostic** - Use C2M alongside your charts, regardless of how your visuals were created. ChartJS? D3.js? An image? C2M works in parallel with your visuals.
* **Use anywhere, for free** - C2M is [MIT licensed](https://github.com/julianna-langston/chart2music/blob/main/LICENSE), so you can integrate into anything - personal, commercial, government, etc.

## Demo

Try Chart2Music for yourself using the below demo.
Tab to or click on the chart.
Use the left and right arrow keys on your keyboard to explore the chart using sound.
Press the H key to get help, including a list of keyboard commands.

:::tip
Due to Autoplay restrictions in Firefox, you may have to press spacebar before you hear any sound.
:::

<iframe src="/demo.html" aria-label="Demo charts" width="500px" height="330px" />

## Examples

For code examples in action, see the [Chart2Music Examples collection on Codepen](https://codepen.io/collection/BNedqm).

Some of the examples you will find there include a variety of chart types, like:
* [Simple, no frills code example](https://codepen.io/chart2music/pen/ExEmqbr).
* [Multi-line plot](https://codepen.io/chart2music/full/gOegZpm).
* [Bar-line plot](https://codepen.io/chart2music/full/QWmdpOJ).

You can also find examples of integrations with other visualization libraries, like:
* [with Chart.js](https://codepen.io/chart2music/full/YzaVxPK) (includes visual syncing)
* [with D3.js](https://codepen.io/chart2music/full/gOezOaY)
* [with HighCharts](https://codepen.io/chart2music/full/QWmZrKj) (includes visual syncing)
* [with Recharts](https://codepen.io/chart2music/full/eYrrRam)
* [with Google Charts](https://codepen.io/chart2music/full/abYGoBJ) (includes visual syncing)
* [with AnyChart](https://codepen.io/chart2music/full/abYGoME)
* [with Chartist.js](https://codepen.io/chart2music/full/LYdmPNj)
* [with NVD3.js](https://codepen.io/chart2music/full/jOzxNQW)
* [with Plotly.js](https://codepen.io/chart2music/full/BarrXYr) (includes visual syncing)
* [with Vega-Lite](https://codepen.io/chart2music/pen/jOzpyME)
* [with Morris.js](https://codepen.io/chart2music/full/abYGobm)
* [with Frappe](https://codepen.io/chart2music/full/QWmrWWE)

## Getting started

If you want to start making accessible charts, check out our [installation instructions](./getting_started/Installation) and [walkthrough](./getting_started/BasicExample).

If you have any problems or suggestions, [open an issue in our Github repository](https://github.com/julianna-langston/chart2music/issues).