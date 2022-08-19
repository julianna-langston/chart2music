# Developer integration

Using `c2mChart` to sonify a *static* chart is already powerful, but you can also sonify dynamic charts.


## Visual syncing

You can also use the `c2mChart` option `onFocusCallback` to keep your visual chart synchronized with the user as they navigate. How this works will depedn on how you built your chart visuals in the first place.

`onFocusCallback` calls a function and provides an object with 2 properties:
* `slice` - the name of the category
* `index` - the index of the data point

Here's an example using Chart.js with a single line:

```js
// Create your chart.js visual
const myChart = new Chart(canvas, config);

// Add Chart2Music
c2mChart({
    title: "My chart",
    type: "line",
    element: canvas,
    data: [1,2,3,4,5],
    options: {
        onFocusCallback: ({index}) => {
            myChart.setActiveElements([{
                datasetIndex: 0,
                index
            }]);
            myChart.update();
        }
    }
});
```

Here's an example using Chart.js with multiple lines:
```js
// Create your chart.js visual
const myChart = new Chart(canvas, config);

// Add Chart2Music
const categories = ["a", "b"];
c2mChart({
    title: "My chart",
    type: "line",
    element: canvas,
    data: {
        a: [1,2,3,4,5],
        b: [5,4,3,2,1]
    },
    options: {
        onFocusCallback: ({slice, index}) => {
            myChart.setActiveElements([{
                datasetIndex: categories.indexOf(slice),
                index
            }]);
            myChart.update();
        }
    }
});
```

:::tip
If you already have aesthetics for hovering over an element with a mouse, you should try to duplicate that treatment with your onFocusCallback. This way, you ensure that your mouse users and your keyboard users have access to the same information. Some common hover treatment includes:
* Changing the color or size of a highlighted element
* Having a tooltip appear near the hovered/focused data point
* Showing a crosshair near the data point
:::

:::caution
The contents of the onFocusCallback should be quick. If a user plays the full contents of a chart, the onFocusCallback could be invoked up to 40 times per second. A heavy onFocusCallback could negatively impact the performance of the play speed.
:::

Examples:

* [with Chart.js](https://codepen.io/chart2music/full/YzaVxPK)
* [with Google Charts](https://codepen.io/chart2music/full/abYGoBJ)
* [with Plotly.js](https://codepen.io/chart2music/full/BarrXYr)

## Live charts

All of our examples so far have been ignoring the fact that the `c2mChart` function actually returns a value. Let's dig into those values and what you can do with them.

`c2mChart` returns a golang-style object with 2 properties:
* `err` - either `null` if there was no error, or a string with the errors that came about while generating your chart.
* `data` - only provided if `err` is not null, `data` provides an instance of your chart. You can use this object to call the available chart methods, `appendData` and `setData`.


Add data to a chart in real time.

Example:
```js
const {data: chart} = c2mChart({
    title: "Random numbers",
    type: "line",
    element: myElement,
    data: [0],  // There must always be data. You can't start with an empty chart.
    options: {
        live: true
    }
});
// Add a random number every 5 seconds
setInterval(() => {
    chart.appendData(Math.random());
}, 5000);
```

This way, you can append one data point at a time. This is ideal for streaming a live chart, but sometimes you need to do more...

## Re-setting data

If you want to reflash the entire contents of the chart, you can use the method `setData`.

```html
<canvas id="myElement"></canvas>
<button id="randomize">Randomize data</button>
```

```js
const generateData = () => {
    return [
        Math.random(),
        Math.random(),
        Math.random(),
        Math.random(),
    ];
};

const {data: chart} = c2mChart({
    title: "Random sets",
    type: "line",
    element: myElement,
    data: generateData()
});

document.getElementById("randomize").addEventListener("click", () => {
    chart.setData(generateData());
});
```

If the data change also changes the metadata of the axes (such as changing the minimum or maximum), you can also update that. For example:

```javascript
chart.setData([1,2,3,4,5], {
    x: {
        minimum: 0
    }
});
```

:::caution
When you reset data, the user's focus moves back to the beginning of the chart by default. This behavior could confuse users. It's best practices to only reset data as the result of a user's action. For example, you can reset the chart based on the user clicking a button or making a selection from a form field.
:::

If you don't want the user's focus to be reset, you can control where the focus goes. For example, let's say you have implemented zooming in/out of a chart. When you zoom, you change the range of data, but you want the user to continue to focus on the same data point.  If you know that the user was on point #15, but once you zoom in, that will be point #5, you can include that in your data reset:

```javascript
chart.setData(zoomedInData, {}, 5);
```

You can also specify the name of the group that should receive focus. This code resets the data to `zoomedInData`, with no changes to the axes metadata, and focuses on point[5] in group "b":
```javascript
chart.setData(zoomedInData, {}, 5, "b");
```

:::info 
By default, the point that receives focus is the first point in the first group. If you attempt to assign focus to a point or group that doesn't exist, then focus will be assigned to the first point in the first group.
:::

:::note
When you reset data, the user will be informed which chart was updated, if the chart has a title. If there are multiple update-able charts on a page, be sure to include a title for each of them. This will help a user to distinguish which chart changed.

Also, since users will be informed every time a chart is updated, if you update your charts constantly, you will potentially annoy your users. If you need to regularly update your chart, consider using `appendData`, which only updates users if they've enabled monitoring mode.
:::

## Custom hotkeys

If you want to integrate custom interactions, you can use the c2mChart option `customHotkeys`. For example, let's imagine a bar chart where you can drill into data in individual bars. Let's say you've decided to use Alt+Down and Alt+Up to drill in/out of the bars. Here is how that code would look:

```javascript
c2mChart({
    title: "Drillable data",
    type: "bar",
    element: myElement,
    data,
    options: {
        customHotkeys: [
            {
                key: {
                    altKey: true,
                    key: "ArrowDown",
                },
                title: "Drill in",
                callback: drillIn
            },
            {
                key: {
                    altKey: true,
                    key: "ArrowUp",
                },
                title: "Drill out",
                callback: drillOut
            },
        ]
    }
});
```

If you want to overwrite a hotkey that Chart2Music has already defined, you can. We'd rather you didn't, because that could confuse users, but you can.

Here's an example for overwriting the hotkey "[" (which jumps to the minimum value):

```javascript
customHotkeys: [{
    key: {
        key: "["
    },
    title: "Pan left",
    callback: panLeft,
    force: true
}]
```

Without the `force:true`, the hotkey would simply not get added.