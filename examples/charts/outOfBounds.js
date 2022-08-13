import { c2mChart } from "../../dist/index.mjs";

const data = [0, 1, 4, 2, 0, 9, 3, 10, 8, 8, 5];

export const outOfBounds = (canvas, cc) => {
    const datasets = [
        {
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data,
            hoverRadius: 10
        }
    ];
    const config = {
        type: "line",
        data: {
            labels: data.map((value, index) => index),
            datasets: datasets
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Random"
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    min: 1,
                    max: 9
                },
                x: {
                    min: 1,
                    max: data.length - 2
                }
            }
        }
    };

    const myChart = new Chart(canvas, config);

    const { err } = c2mChart({
        type: "line",
        element: canvas,
        cc,
        data,
        axes: {
            x: {
                minimum: 1,
                maximum: data.length - 2
            },
            y: {
                minimum: 1,
                maximum: 9
            }
        },
        options: {
            onFocusCallback: ({ index }) => {
                myChart.setActiveElements([{ datasetIndex: 0, index }]);
                myChart.update();
            }
        }
    });
    if (err) {
        console.error(err);
    }
};
