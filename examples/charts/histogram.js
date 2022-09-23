import { c2mChart } from "../../dist/index.mjs";

export const histogram = (canvas, cc) => {
    const config = {
        type: "bar",
        data: {
            labels: [0, 1, 2, 3, 4],
            datasets: [
                {
                    label: "Number of Arrivals",
                    data: [19, 28, 20, 16],
                    backgroundColor: "green"
                }
            ]
        },
        options: {
            scales: {
                xAxes: [
                    {
                        display: false,
                        barPercentage: 1.3,
                        ticks: {
                            max: 3
                        }
                    },
                    {
                        display: true,
                        ticks: {
                            autoSkip: false,
                            max: 4
                        }
                    }
                ],
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true
                        }
                    }
                ]
            }
        }
    };

    const myChart = new Chart(canvas, config);

    const { err } = c2mChart({
        type: "histogram",
        title: "Arrivals",
        element: canvas,
        cc,
        axes: {
            x: {
                label: "Number of Arrivals"
            },
            y: {
                label: "Count"
            }
        },
        data: [19, 28, 20, 16],
        options: {
            onFocusCallback: ({ index }) => {
                myChart.setActiveElements([{ datasetIndex: 0, index }]);
            }
        }
    });
    if (err) {
        console.error(err);
    }
};
