# chart2music
Turns charts into music so the blind can hear data

## Getting started

Sonification is the representation of data using sound. Chart2Music provides an easy hookup for interactive sonification. Just provide your data and a reference to your chart, and C2M will do the rest.

### Initialize your data

You can include Chart2Music as a library in the browser like this:
```html
<script src="sonify.js"></script>
```

This will add a global variable, `Sonify`. You can invoke a simple line chart like this:

```javascript
const mySonifier = new Sonify({
    element: document.getElementById("myChart"),
    data: [1,2,3,4]
  });
})
```

In this case, you see the 2 required options to pass to `Sonify`:
1. `element` - the chart that you want to sonify. Ideally, this is a `<canvas>` or `<svg>` element, but it could be a `<div>` or some other container. C2M will wire up event listeners to this element, and give it a `tabIndex="0"` if you haven't already.
2. `data` - the data associated with your chart. You can provide this data in a number of ways.

Providing only y-values:
```javascript
data: [1,2,3,4]
```

Providing x- and y-values:
```
data: [
    {
        x: 1990,
        y: 248709873
    },
    {
        x: 2000,
        y: 308745538
    }
]
```

Providing multiple lines of data:
```javascript
data: {
    "United States of America": [
        {
            x: 1990,
            y: 20
        },
        {
            x: 2000,
            y: 21
        }
    ],
    Canada: [
        {
            x: 1990,
            y: 30
        },
        {
            x: 2000,
            y: 29
        }
    ],
}
```

C2M is handling keyboard navigation as it relates to an auditory experience. If you would like to update the visuals of your chart to align with the sounds, you can provide callbacks for data points. These callbacks will fired as each data point receives "focus". That would look like this:

```
data: [{
    x: 1,
    y: 2,
    callback: () => {
        // Do something to highlight this data point
    }
}]
```

Providing multiple Y-values for a given X-value. For example, when you have a floating bar chart, you would have 1 X-value, and then a high and low y-value. Here's an example of what that could look like:

```javascript
const highs = [72, 73, 88, 83, 88, 91, 97, 93, 93, 83, 79];
const lows = [25, 23, 25, 34, 38, 55, 67, 64, 44, 41, 29];
new Sonify({
    type: "bar",
    title: "Raleigh's High/Low Temperatures (2020)",
    element: floatingCanvas,
    cc: document.getElementById("cc-floatingBar"),
    axes: {
      x: {
        minimum: 0,
        maximum: 10,
        label: "Month",
        format: (value) => months[value]
      },
      y: {
        minimum: 20,
        maximum: 100,
        label: "Fahrenheit",
        format: (value) => value,
      }
    },
    data: highs.map((high, index) => {
      return {
        x: index,
        y: {
          high: high,
          low: lows[index]
        }
      }
    })
});
```

### Other options

While C2M only requires 2 options to get started, you can refine your chart with other options:

* `title` - the title of the chart. This is communicated to screen readers when they first focus on the container element.
* `cc` - a closed caption element. Information about the chart will be fed to a user's screen reader using the ScreenReaderBridge. This will be done by updating a `<div>` on the page, called a "live region". If you want to control where that element is, and what it looks like, you can provide that element here. Otherwise, C2M will create one for you.
* `axes` data - provide relevant metadata for each axis in particular
    * `x` or `y`:
        * `minimum` - minimum of the chart. If not provided, it will be assumed to be the lowest value in the dataset
        * `maximum` - maximum of the chart. If not provided, it will be assumed to be the lowest value in the dataset
        * `label` - the axis label.
        * `format` - a function for formatting values. If, for example, you are providing money, and want your data read as "$1,235.50" and not "1234.50", you can provide that formatter here. That case could be accomplished in conjunction with a tool like Numeral.js, using something like: `{format: (value) => numeral(value).format("$0,0.00")}`

Here is an example of all of those options being used:

```javascript
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November'];
const highs = [72, 73, 88, 83, 88, 91, 97, 93, 93, 83, 79];
const lows = [25, 23, 25, 34, 38, 55, 67, 64, 44, 41, 29];

new window.Sonify({
    title: "Raleigh's High/Low Temperatures (2020)",
    element: document.getElementById("myCanvas"),
    cc: document.getElementById("cc"),
    axes: {
        x: {
            minimum: 0,
            maximum: 10,
            label: "Month",
            // Convert X-values (index of the months array) to text
            format: (value) => months[value]
        },
        y: {
            minimum: 20,
            maximum: 100,
            label: "Fahrenheit",
        }
    },
    data: {
        highs: highs.map((y, index) => {
            return {
                x: index,
                y,
                callback: () => {
                    highlight("highs", x);
                }
            }
        }),
        lows: lows.map((y, index) => {
            return {
                x: index,
                y,
                callback: () => {
                    highlight("lows", x);
                }
            }
        })
    }
});
```

## End user experience

Once you've wired everything up, what is the end-user going to experience? What is the interactions that are being wired up?

Here are the hotkeys users can use to interact with the chart:
* Right arrow - Move to the next point to the right (silent if they're at the far right)
* Left arrow - Move to the next point to the left (silent if they're at the far left)
* Home - Move to the far left point
* End - Move to the far right point
* Page Down - Cycle forward through the various lines in the chart. (Silent if there are no other lines, of if the user has cycled to the end of list of lines)
* Page Up - Cycle backward through the mulitple lines in the chart. (Silent if there are no other lines, of if the user has cycled to the front of list of lines.)
* Spacebar - Replay the current point
* Shift + Right - Play all data points to the right
* Shift + Left - Play all data points to the left
* Q - Speed up the play rate
* E - Slow down the play rate

## Contributing

To work with the project, clone the repo, and run `npm install`. If you plan to commit code, initialize Husky with `npm run prepare`.

In order to build the library and work with the examples, run `npm run build`. Then, in your browser, open: `localhost:8080/examples/chartjs.html`.

To run in watch mode, run `npm run start`.

Either way, to see the examples, open the following page in your browser: `localhost:8080/examples/chartjs.html`.
