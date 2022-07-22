import { c2mChart } from "../../dist/index.mjs";
import { highs, lows, months } from "../data/data.js";

export const multiLinePlot = (canvas, cc) => {
    const datasets = [
        {
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: highs,
            hoverRadius: 10
        },
        {
            backgroundColor: "blue",
            borderColor: "blue",
            data: lows,
            hoverRadius: 10
        }
    ];
    const config = {
        type: "line",
        data: {
            labels: months.slice(0, 11),
            datasets
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Raleigh's High/Low Temperatures (2020)"
                },
                legend: {
                    display: false
                }
            }
        }
    };

    const myChart = new Chart(canvas, config);

    const slices = ["highs", "lows"];
    new c2mChart({
        type: "line",
        title: "Raleigh's High/Low Temperatures (2020)",
        element: canvas,
        cc,
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
                format: (value) => value
            }
        },
        data: {
            highs: highs.map((y, x) => {
                return {
                    x,
                    y
                };
            }),
            lows: lows.map((y, x) => {
                return {
                    x,
                    y
                };
            })
        },
        options: {
            onFocusCallback: ({ slice, index }) => {
                myChart.setActiveElements([
                    { datasetIndex: slices.indexOf(slice), index }
                ]);
                myChart.update();
            }
        }
    });
};
