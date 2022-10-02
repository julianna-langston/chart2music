---
sidebar_label: React
---

# React Walkthrough

:::tip
If you're using Recharts, one of the most popular React charting libraries, we already have a CodePen example that integrates Recharts and Chart2Music:

[CodePen example](https://codepen.io/chart2music/full/eYrrRam)
:::

All of the examples for using Chart2Music so far has been using vanilla javascript. If you are using the React framework to build your charts, here's a quick guide to how to initialize and update your date.


:::note
This guide will use hooks introduced in React 17. If you need guidance for pre-17, please [open an issue](https://github.com/julianna-langston/chart2music/issues/new) to expand this documentation.
:::

Let's say you have a react component like this:

```jsx
import React from "react";
import {LineChart} from "wherever";

const App = (props) => {
    return(
        <LineChart data={props.data} />
    )
}
```

First, you'll need to set up your container and closed caption components. Since these will need to be passed through the C2M, you will also need to include references.

Now, the component looks like this:
```jsx
import React, {useRef} from "react";
import {LineChart} from "wherever";

const App = (props) => {
    const chartRef = useRef(null);
    const ccRef = useRef(null);

    return(
        <div>
            <div ref={chartRef}>
                <LineChart data={props.data} />
            </div>
            <div ref={ccRef}></div>
        </div>
    )
}
```

Now, let's initialize C2M. This should be done on load, which can be accomplished with the `useEffect` hook.

The component looks like this:
```jsx
import React, {useRef, useEffect} from "react";
import {LineChart} from "wherever";
import {c2mChart} from "chart2music";

const App = (props) => {
    const chartRef = useRef(null);
    const ccRef = useRef(null);

    useEffect(() => {
        c2mChart({
            type: "line",
            element: chartRef.current,
            cc: ccRef.current,
            data
        });
    }, []);

    return(
        <div>
            <div ref={chartRef}>
                <LineChart data={props.data} />
            </div>
            <div ref={ccRef}></div>
        </div>
    )
}
```

At this point, C2M has been wired in, and users will be able to navigate the example line chart.

That said, this example has only shown a *static* chart, and where's the fun in pulling out an entire framework if you just want to build something static?

## Updating a React chart

Now let's say that your app's props are dynamic - that consuming applications could be updating them.

Here's how you would account for that with C2M:
```jsx
import React, {useRef, useEffect} from "react";
import {LineChart} from "wherever";
import {c2mChart} from "chart2music";

let myChart = null;

const App = (props) => {
    const chartRef = useRef(null);
    const ccRef = useRef(null);

    // Effect for when the component is first loaded
    useEffect(() => {
        const {data: chartResult} = c2mChart({
            type: "line",
            element: chartRef.current,
            cc: ccRef.current,
            data
        });

        myChart = chartResult;
    }, []);

    // Effect for when the prop data is updated
    useEffect(() => {
        myChart?.setData(props.data);
    }, [props])

    return(
        <div>
            <div ref={chartRef}>
                <LineChart data={props.data} />
            </div>
            <div ref={ccRef}></div>
        </div>
    )
}
```

Now, even as the visual chart updates, C2M will update as well.

## Visual integrations

Unfortunately, many React-based charting libraries don't provide the necessary methods to *visually* integrate with C2M.

Many popular libraries don't provide anyway for the consuming application to indicate an active/focused element to highlight. The libraries are designed to handle all of the tooltip interactions internally, so there's usually no way for the 2 to communicate.

This is true for [Recharts](https://recharts.org/en-US/), [react-chartjs-2](https://react-chartjs-2.js.org/), and [Victory](https://formidable.com/open-source/victory/).