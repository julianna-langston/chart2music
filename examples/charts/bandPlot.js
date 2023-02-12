import { c2mChart } from "../../dist/index.mjs";
import { movingAverage, upper, lower, days } from "../data/stock.js";

export const bandPlot = (canvas, cc) => {
    const config = {
        type: "line",
        data: {
            labels: days,
            datasets: [
                {
                    label: "Moving average",
                    data: movingAverage,
                    backgroundColor: "red",
                    hoverBorderWidth: 5,
                    pointRadius: 1
                },
                {
                    label: "Bollinger Upper",
                    data: upper,
                    backgroundColor: "silver",
                    hoverBorderWidth: 5,
                    fill: "+1",
                    pointRadius: 0
                },
                {
                    label: "Bollinger Lower",
                    data: lower,
                    hoverBorderWidth: 5,
                    pointRadius: 0
                }
            ]
        },
        options: {
            plugins: {
                "samples-filler-analyser": {
                    target: "chart-analyser"
                },
                title: {
                    display: true,
                    text: "AAPL"
                },
                legend: {
                    display: false
                }
            },
            interaction: {
                intersect: false
            }
        }
    };

    const myChart = new Chart(canvas, config);

    const slices = ["Moving average", "Bollinger band"];
    const { err } = c2mChart({
        type: ["line", "band"],
        title: "AAPL",
        element: canvas,
        cc,
        axes: {
            x: {
                label: "Day",
                valueLabels: days
            },
            y: {
                label: "Close",
                format: (value) => numeral(value).format("$0,0[.]00")
            }
        },
        data: {
            "Moving average": movingAverage.map((y, x) => {
                return {
                    x,
                    y
                };
            }),
            "Bollinger band": upper.map((high, x) => {
                return {
                    x,
                    high: high,
                    low: lower[x]
                };
            })
        },
        options: {
            onFocusCallback: ({ slice, index }) => {
                const datasetIndex = slices.indexOf(slice);
                if (datasetIndex === 0) {
                    myChart.setActiveElements([{ datasetIndex, index }]);
                } else {
                    myChart.setActiveElements([
                        { datasetIndex: 1, index },
                        { datasetIndex: 2, index }
                    ]);
                }
                myChart.update();
            }
        }
    });
    if (err) {
        console.error(err);
    }
};
