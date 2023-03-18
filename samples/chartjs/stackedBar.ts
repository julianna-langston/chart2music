import { c2mChart } from "../../dist/index.mjs";
import { movingAverage, upper, lower, days } from "../data/stock.js";
import numeral from "numeral";
import { ActiveDataPoint, Chart, ChartTypeRegistry } from "chart.js";

const xLabels = ["A", "B", "C", "D", "E"];
const title = "Test";

export const config = {
    type: "bar" as keyof ChartTypeRegistry,
    data: {
        labels: xLabels,
        datasets: [
            {
                label: "Boys",
                backgroundColor: "blue",
                hoverBorderColor: "black",
                hoverBorderWidth: "4",
                data: [1, 2, 3, 4, 5]
            },
            {
                label: "Girls",
                backgroundColor: "pink",
                hoverBorderColor: "black",
                hoverBorderWidth: "4",
                data: [3, 4, 5, 6, 7]
            }
        ]
    },
    options: {
        scales: {
            x: {
                stacked: true
            },
            y: {
                stacked: true
            }
        }
    }
};

export const callback = (myChart: Chart, element: HTMLCanvasElement, cc: HTMLDivElement) => {
    const { err } = c2mChart({
        type: "bar",
        title,
        element,
        cc,
        axes: {
            x: {
                valueLabels: xLabels
            }
        },
        data: {
            [config.data.datasets[0].label]: config.data.datasets[0].data,
            [config.data.datasets[1].label]: config.data.datasets[1].data
        },
        options: {
            onFocusCallback: ({ slice, index }) => {
                const toHighlight: ActiveDataPoint[] = [];
                if (slice === "Stack") {
                    toHighlight.push({ datasetIndex: 0, index });
                    toHighlight.push({ datasetIndex: 1, index });
                } else {
                    toHighlight.push({
                        datasetIndex: ["Boys", "Girls"].indexOf(slice),
                        index
                    });
                }

                myChart.setActiveElements(toHighlight);
                myChart?.tooltip?.setActiveElements(toHighlight, {} as any);
                myChart.update();
            },
            stack: true
        }
    });
    if (err) {
        console.error(err);
    }
};
