---
sidebar_position: 2
---

# Config

When calling `c2mChart`, there are several different config items that you can provide:

**Required**
1. Type
2. Data
3. Element

**Optional**
1. Axes
2. Title
3. CC
4. AudioEngine
5. Options

## Type

Required

Format:
* String: `line` | `bar` | `band` | `pie` | `candlestick`
* Array: any combination of the above

Examples:
```js
type: "line"
```

```js
type: ["bar", "line"]
```

:::note
Your chart will be described based on the type you provide.

| Type | Description |
| --- | --- |
| `type: "line"` | "line chart" |
| `type: ["bar", "line"]` | "bar-line chart" |
| `type: ["line", "bar"]` | "line-bar chart" |

:::

:::tip
We recommend that you provide your categories of data in the same order as your chart type. So, if you have a "bar-line chart", try to have your bar category is first and your line category is second. This provides consistency for the user.
:::

## Data

Required

Format:
* Array of numbers
* Array of object of type SupportedDataPoint
* Dictionary of array of numbers, with the dictionary key being the name of the category
* Dictionary of array of SupportedDataPoint, with the dictionary key being the name of the category

SupportedDataPoint comes in the following forms:

**SimpleDataPoint**
```ts
{
    x: number;
    y: number;
}
```

**AlternativeAxisDataPoint**
```ts
{
    x: number;
    y2: number
}
```

**HighLowDataPoint**
```ts
{
    x: number;
    high: number;
    low: number;
}
```

**OHLCDataPoint**
```ts
{
    x: number;
    open: number;
    high: number;
    low: number;
    close: number;
}
```

See [Data](./Data) for usage info

## Element

Required

Format:
* An HTML Element

:::tip
We recommend you provide one of the following common HTML elements:
* IMG
* CANVAS
* SVG

While you could provide something else, like `<div>` element, you risk confusion with users, based on how screen readers read out different kinds of elements.
:::

:::caution
Do not use structural, or otherwise non-visual, tags. For example:
* HTML
* HEAD
* BODY
* SCRIPT
* LINK
* BR

These may provide a confusing user experience, prevent user interaction altogether, or just otherwise cause errors.
:::

## Axes

Optional

Format:
* An object with any of the following keys: `x`, `y`, or `y2`. The values must be of type AxisData.

### AxisData

All AxisData properties are optional.

| Property | Type | Description |
| --- | --- | --- |
| minimum | number | The minimum value on the axis. This will automatically be calculated as the minimum of the data, but if you want to explicitly set a minimum that may be different from the data minimum, use this property. |
| maximum | number | The maximum value on the axis. This will automatically be calculated as the maximum of the data, but if you want to explicitly set a maximum that may be different from the data maximum, use this property. |
| label | string | The axis label, like "Month" or "Price" |
| format | (value: number) => string | A formatting function for data point values |

For example, if you provide a data point like this:
```json
{
    x: 1,
    y: 123456
}
```

and you provide an axes value like this:
```
y: {
    label: "Population",
    format: (value) => {
        return value.toLocaleString();
    }
}
```

Your y-value will be described as `123,456` or `123.456`, depending on your locality. This will make the value much easier for a screen reader to verbalize.

Note that data point values are always numeric. If you use values on the X axis that are strings, you will need to provide the data points as numbers, and then use the format function to format them as strings after the fact.

Here's an example where the X-axis represents Month:
```js
const months = ["January", "February", "March"];
c2mChart({
    title: "Holidays",
    type: "bar",
    element: myElement,
    data: [2, 3, 2],    // Note that the x-values will be assigned as [0, 1, 2]
    axes: {
        x: {
            label: "Month",
            format: (index) => months[index]
        }
    }
});
```

:::tip
If your chart visual has labels for the axis, try to make your axis labels match.

Sometimes, axes don't have labels. Usually, this is because the data makes it obvious. If the X axis values are "January", "February", "March", etc, a chart author may skip adding the label "Month" to the visual because that's clear from context. Even in those cases, it's still best to provide the axis label "Month".
:::

## Title

Format:
* String

Example:
```json
{
    title: "MSFT Stock Price"
}
```

:::tip Best practices
* Synchronized. If possible, use the same title as your visual chart.
* Distinguishable. If you have multiple charts on the page, make sure they're easily distinguished. For example, having 3 copies of "Stock Chart" is unhelpful. Having "MSFT", "GOOG", and "IBM" helps distinguish the charts.
* Terse. If you don't *need* a word, don't use it. You don't need something like "Chart of Movie Ratings" when you can just say "Movie Ratings".
:::

## CC

Optional

Format:
* An HTML element, ideally a `<div>`

This is the "closed caption" element. When a user navigates around the chart, their screen reader will read custom text we provide it. The CC element is where the screen reader's script is going to be printed. This element is the magic of how everything works.

Why is it optional? Because we'll generate an element if you don't provide us one. However, if you provide us one, you can style it more effectively.

:::tip
While developing and debugging, you may want to include this element in a central, visible location. This helps you make sure things like number formatting is going correctly. This is where the "closed caption" sentiment comes from - it can provide a sighted developer a closed caption of what the screen reader is saying.

For production mode, you can use CSS to position the CC element off-screen, so that screen readers can read it, but no one else can.
:::

:::note
You can have one CC element on a page, and point all of your charts that that single element.
:::


## AudioEngine

Optional

Format:
* Class implementation with the following public method:
```ts
playDataPoint(frequency: number, panning: number, duration: number): void
```

If you'd like to write your own sounds to match your branding or personal taste, this option will let you override sounds. 

:::tip
Also, if you want to write automated test cases for a page with charts, and your test system doesn't like chart2music's use of the WebAudioAPI, you can write an audio engine mockup for testing purposes.
:::

Example testing mockup:
```js

let lastDuration = 0;
let lastFrequency = 0;
let lastPanning = 0;
let playHistory = [];

/**
 * Mock audio engine. Built for testing purposes.
 */
class MockAudioEngine {

constructor() {
        lastDuration = -10;
        lastFrequency = -10;
        lastPanning = -10;
    }

    /**
     * The instructions to play a data point. The details are being recorded for the test system.
     *
     * @param {number} frequency - hertz to play
     * @param {number} panning - panning (-1 to 1) to play at
     * @param {number} duration - how long to play
     */
    playDataPoint(frequency, panning, duration) {
        lastFrequency = frequency;
        lastPanning = panning;
        lastDuration = duration;
        playHistory.push({ frequency, panning, duration });
    }
}

c2mChart({
    type: "line",
    data: [1,2,3],
    element: myElement,
    audioEngine: new MockAudioEngine()
});

// Write test cases where data points are played, then test the lastDuration, lastFrequency, and lastPanning variables to confirm the expected values were passed
```

## Options

When you call `c2mChart`, you can provide several different options, all optional:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| enableSound | boolean | `true` | When true, sound is played. When false, sonification is muted. This does not impact if screen readers verbalize anything. |
| enableSpeech | boolean | `true` | When true, screen readers are given text to read. When false, chart2music will not provide screen readers anything to say (though they may continue speaking based on other context on the page.) |
| live | boolean | `false` | When true, the user is told that it is a live chart. It is expected that streaming data will be added to the chart using the `appendData` method. |
| maxWidth | number | nothing | Only relevant for `live` charts. This indicates the maximum number of data points to be displayed on a chart. For example, if you're streaming to a live chart once every second, you may want to cap the number of data points at 100. Otherwise, the chart will become too unwieldy. |
| onFocusCallback | function | nothing | Provides a callback as a user is navigating a chart. Use this if you'd like to keep your visuals synchronized with the user. This is especially helpful for low vision users or blind users who collaborate with sighted users. |
