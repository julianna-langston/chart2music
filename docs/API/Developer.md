# Developer integration

Using `c2mChart` to sonify a *static* chart is already powerful, but you can also sonify dynamic charts.


## Visual syncing

You can also use the `c2mChart` option `onFocusCallback` to keep your visual chart synchronized with the user as they navigate. How this works will depedn on how you built your chart visuals in the first place.

`onFoucsCallback` calls a function and provides an object with 2 properties:
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

## Live charts

All of our examples so far have been ignoring the fact that the `c2mChart` function actually returns a value. Let's dig into those values and what you can do with them.

`c2mChart` returns a golang-style object with 2 properties:
* `err` - either `null` if there was no error, or a string with the errors that came about while generating your chart.
* `data` - only provided if `err` is not null, `data` provides an instance of your chart. You can use this object to call the available chart methods, `appendData`.


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
