import { c2mChart } from "../../dist/index.mjs";
import { highs, months } from "../data/data.js";

export const singleLinePlot = (canvas, cc) => {
    const datasets = [
        {
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: highs,
            hoverRadius: 10
        }
    ];
    const config = {
        type: "line",
        data: {
            labels: months.slice(0, 11),
            datasets: datasets
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Raleigh's High Temperatures (2020)"
                },
                legend: {
                    display: false
                }
            }
        }
    };

    const myChart = new Chart(canvas, config);

    const { err } = c2mChart({
        type: "line",
        element: canvas,
        cc,
        data: highs.map((y, x) => {
            return {
                x,
                y
            };
        }),
        options: {
            onFocusCallback: ({ index }) => {
                console.log(index);
                myChart.setActiveElements([{ datasetIndex: 0, index }]);
                myChart.update();
            }
        }
    });
    if (err) {
        console.error(err);
    }
};
