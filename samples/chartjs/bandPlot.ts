import { c2mChart } from "../../dist/index.mjs";
import { movingAverage, upper, lower, days } from "../data/stock.js";
import numeral from "numeral";
import { Chart, ChartTypeRegistry } from "chart.js";

export const config = {
    type: "line" as keyof ChartTypeRegistry,
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

export const callback = (myChart: Chart, element: HTMLCanvasElement, cc: HTMLDivElement) => {
    const { err } = c2mChart({
        type: ["line", "band"],
        title: "AAPL",
        element,
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
                    y,
                    custom: true
                };
            }),
            "Bollinger band": upper.map((high, x) => {
                return {
                    x,
                    high: high,
                    low: lower[x],
                    custom: false
                };
            })
        },
        options: {
            onFocusCallback: ({ index, point }) => {
                if (point.custom) {
                    myChart.setActiveElements([{ datasetIndex: 0, index }]);
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
