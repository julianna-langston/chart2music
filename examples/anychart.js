import { c2mChart } from "../dist/index.mjs";

const regions = [
    "Western Europe",
    "North America",
    "Australia and New Zeland",
    "Middle East and Northern Africa",
    "Latin America and Caribbean",
    "Southeastern Asia",
    "Central and Eastern Europe",
    "Eastern Asia",
    "Sub-Saharan Africa",
    "Southern Asia"
];

const { err } = c2mChart({
    title: "World Happiness Report",
    type: "box",
    element: document.getElementById("container"),
    cc: document.getElementById("cc"),
    axes: {
        x: {
            label: "Region",
            format: (index) => regions[index]
        },
        y: {
            label: "Average Happiness Score"
        }
    },
    data: [
        { x: 0, low: 5.03, q1: 6.36, median: 6.91, q3: 7.34, high: 7.53 },
        { x: 1, low: 7.1, q1: 7.18, median: 7.25, q3: 7.33, high: 7.4 },
        { x: 2, low: 7.31, q1: 7.32, median: 7.32, q3: 7.33, high: 7.33 },
        { x: 3, low: 3.07, q1: 4.78, median: 5.3, q3: 6.3, high: 7.27 },
        {
            x: 4,
            low: 4.87,
            q1: 5.8,
            median: 6.13,
            q3: 6.66,
            high: 7.09,
            outlier: [4.03]
        },
        { x: 5, low: 3.91, q1: 4.88, median: 5.28, q3: 6.01, high: 6.74 },
        { x: 6, low: 4.22, q1: 5.15, median: 5.49, q3: 5.81, high: 6.6 },
        { x: 7, low: 4.91, q1: 5.3, median: 5.65, q3: 5.9, high: 6.38 },
        {
            x: 8,
            low: 2.91,
            q1: 3.74,
            median: 4.13,
            q3: 4.43,
            high: 5.44,
            outlier: [5.648]
        },
        {
            x: 9,
            low: 4.4,
            q1: 4.41,
            median: 4.64,
            q3: 4.96,
            high: 5.2,
            outlier: [3.36, 3]
        }
    ]
});
if (err) {
    console.error(err);
}
