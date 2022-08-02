# Providing data for a chart

You can add data to a chart in many different ways. You could provide data like this:

* An array of numbers
```js
data: [1,2,3]
```
* An array of x/y pairs
```js
data: [
    {
        x: 1990,
        y: 248709873
    },
    {
        x: 2000,
        y: 281421906
    },
    {
        x: 2010,
        y: 308745538
    }
]
```
* Dictionary of arrays of x/y pairs
```js
data: {
    Australia: [
        {
            x: 2010,
            y: 22019168
        },
        {
            x: 2011,
            y: 22357034
        },
        {
            x: 2012,
            y: 22729269
        },
    ],
    Canada: [
        {
            x: 2010,
            y: 33963412
        },
        {
            x: 2011,
            y: 34323531
        },
        {
            x: 2012,
            y: 34691878
        },
    ]
}
```

You can make a Chart by providing data like this:

```js
c2mChart({
    type: "line",
    element: myElement,
    data: [1,2,3]
});
```

## Plots with multiple categories

You can make grouped bar charts, multi-line line charts, etc, simply by providing multiple arrays of data.

In this example, the line chart will have 2 lines (Australia and Canada), each with 3 data points (for 2010, 2011, and 2012):

```js
c2mChart({
    type: "line",
    element: myElement,
    data: {
        Australia: [
            {
                x: 2010,
                y: 22019168
            },
            {
                x: 2011,
                y: 22357034
            },
            {
                x: 2012,
                y: 22729269
            },
        ],
        Canada: [
            {
                x: 2010,
                y: 33963412
            },
            {
                x: 2011,
                y: 34323531
            },
            {
                x: 2012,
                y: 34691878
            },
        ]
    }
});
```

## More complex chart types

You don't need to just provide `y`; You can also provide `high` or `low`. Here's a band plot example:

```js
c2mChart({
    type: "band",
    element: myElement,
    data: [
        {
            x: 1,
            high: 100,
            low: 80
        },
        {
            x: 2,
            high: 101,
            low: 79
        },
        {
            x: 1,
            high: 99,
            low: 75
        }
    ]
})
```

## Multiple plot types 

If you want to plot multiple types of plots on the same chart, you can provide those types as an array.

Here's an example of a band plot AND a line plot.

```js
c2mChart({
    type: ["band", "line"],
    element: myElement,
    data: {
        "Moving average": [
            {
                x: 1,
                high: 100,
                low: 80
            },
            {
                x: 2,
                high: 101,
                low: 79
            },
            {
                x: 3,
                high: 99,
                low: 75
            }
        ],
        "Close": [
            {
                x: 1,
                y: 88,
            },
            {
                x: 2,
                y: 90,
            },
            {
                x: 3,
                y: 93,
            },
        ]
    }
});
```

## Alternative axes

This example shows a bar-line chart, where the bar and line charts are plotted against 2 different axes.

```js
c2mChart({
    type: ["bar", "line"],
    element: myElement,
    data: {
        Volume: [
            {
                x: 1,
                y: 100000,
            },
            {
                x: 2,
                y: 110000,
            },
            {
                x: 3,
                y: 108000,
            },
        ],
        ClosingPrice: [
            {
                x: 1,
                y2: 115.29,
            },
            {
                x: 2,
                y2: 130.06,
            },
            {
                x: 3,
                y2: 110.18
            },
        ]
    }
});
```

