import { c2mChart } from "../../dist/index.mjs";

export const example2 = (canvas, cc) => {
    var data = [
        {
            z: [
                [0, NaN, 30, 50, 0],
                [20, 0, 60, 80, 30],
                [30, 60, 0, 10, 20]
            ],
            x: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            y: ["Morning", "Afternoon", "Evening"],
            type: "heatmap",
            hoverongaps: false
        }
    ];

    Plotly.newPlot(canvas, data);

    const { err } = c2mChart({
        title: "Time using a device",
        type: "matrix",
        axes: {
            x: {
                label: "Day",
                format: (index) => data[0].x[index]
            },
            y: {
                label: "Amount",
                format: (num) => `${num}%`
            }
        },
        element: canvas,
        cc,
        data: Object.fromEntries(
            data[0].y.map((label, index) => [label, data[0].z[index]])
        )
    });
    if (err) {
        console.error(err);
    }
};
