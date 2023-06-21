import { c2mChart } from "../../dist/index.mjs";

let ref = null;
let groups = ["Boys", "Girls"];

export const stackedBar = (canvas, cc) => {
    const xLabels = ["A", "B", "C", "D", "E"];
    const title = "Test";

    const config = {
        type: "bar",
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
        },
        plugins: [
            {
                id: "test",
                afterDatasetUpdate: (chart, args) => {
                    if (!args.mode) {
                        return;
                    }
                    ref?.setCategoryVisibility(
                        groups[args.index],
                        args.mode === "show"
                    );
                }
            }
        ]
    };

    const myChart = new Chart(canvas, config);

    const { err, data: ref } = c2mChart({
        type: "bar",
        title,
        element: canvas,
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
                const toHighlight = [];
                if (slice === "All") {
                    toHighlight.push({ datasetIndex: 0, index });
                    toHighlight.push({ datasetIndex: 1, index });
                } else {
                    toHighlight.push({
                        datasetIndex: ["Boys", "Girls"].indexOf(slice),
                        index
                    });
                }

                myChart.setActiveElements(toHighlight);
                myChart?.tooltip?.setActiveElements(toHighlight, {});
                myChart.update();
            },
            stack: true
        }
    });
    if (err) {
        console.error(err);
    }
};
