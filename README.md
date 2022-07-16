# Chart2Music

Chart2Music turns charts into music so the blind can hear data.

## Key features

* **Accessibility for screen reader users** - Enables blind users to rapidly absorb information about charts and graphs using sound and exploration.
* **Easier maintenance for accessibility requirements** - Traditionally, charts and graphs would be made accessible using alt text, which can be difficult to generate or maintain, or data tables, which provide a poor end user experience. C2M provides an *automated* solution while *enhancing* the user experience.
* **Visual agnostic** - Use C2M alongside your charts, regardless of how your visuals were created. ChartJS? D3.js? An image? C2M works in parallel with your visuals.

## Getting started

Include the following script tag on your page:

```html
<script src="https://cdn.jsdelivr.net/npm/chart2music@latest/dist/index.min.js"></script>
```

On your page, you will also need your chart. For the sake of similicity, here's an example with an image:

```html
<img src="mychart.png" id="MyChart" />
```

Now, in your javascript, you can start a new instance of Chart2Music. In this example, we will include a simple bar chart, and point it to the img element above.

```javascript
new c2mChart({
    type: "bar",
    element: document.getElementById("MyChart"),
    data: [1,2,3]
});
```

What will the user experience be? When the user navigates to the image, a description will be automatically generated, telling the user that there is interaction available. Then, the user can use arrow keys or keyboard shortcuts to interact with the data.

## Advanced

For more advanced options, see our [examples](./examples/chartjs.html).