import { c2mChart } from "../../dist/index.mjs";

const data = [
    {
        x: 1,
        y: 5
    },
    {
        x: 2,
        y: 7
    },
    {
        x: 4,
        y: 7
    },
    {
        x: 8,
        y: 3
    },
    {
        x: 9,
        y: 4
    },
    {
        x: 10,
        y: 5
    }
];

export const continuous = (canvas, cc) => {
    const config = {
        type: "line",
        data: {
            labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
            datasets: [
                {
                    backgroundColor: "rgb(255, 99, 132)",
                    borderColor: "rgb(255, 99, 132)",
                    data: data.map(({ x, y }) => {
                        return {
                            x: String(x),
                            y
                        };
                    }),
                    hoverRadius: 10
                }
            ]
        },
        options: {
            plugins: {
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
        axes: {
            x: {
                minimum: 0,
                maximum: 10,
                continuous: true
            }
        },
        data,
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
