import { c2mChart } from "../../dist/index.mjs";

export const bug120 = (canvas, cc) => {
    const title = "Example for bugs";
    const groupA = [1, 2, 3, 4, 5, 6, 7];
    const groupB = [3, 4, 5, 6];

    // Chart.js setup
    const config = {
        type: "line",
        data: {
            labels: [
                "Alpha",
                "Bravo",
                "Charlie",
                "Delta",
                "Echo",
                "Foxtrot",
                "Golf"
            ],
            datasets: [
                {
                    label: "A",
                    backgroundColor: "blue",
                    borderColor: "blue",
                    hoverRadius: 10,
                    data: groupA
                },
                {
                    label: "B",
                    backgroundColor: "green",
                    borderColor: "green",
                    hoverRadius: 10,
                    data: groupB
                }
            ]
        },
        options: {
            plugins: {
                title: {
                    text: title,
                    display: true
                },
                legend: {
                    display: true
                }
            }
        }
    };

    const myChart = new Chart(canvas, config);

    // Setup Chart2Music
    const { err } = c2mChart({
        type: "line",
        title,
        element: canvas,
        cc,
        axes: {
            x: {
                valueLabels: config.data.labels
            }
        },
        data: {
            a: groupA,
            b: groupB
        },
        options: {
            // Keep the visuals in sync with the sonification by highlighting the data point the user is playing
            onFocusCallback: ({ slice, index }) => {
                myChart.setActiveElements([
                    {
                        datasetIndex: ["a", "b"].indexOf(slice),
                        index
                    }
                ]);
                myChart.update();
            }
        }
    });

    if (err) {
        console.error(err);
    }
};
