import { c2mChart } from "../../dist/index.mjs";

const blueState = [
    ["Arizona", 823, 113990.3],
    ["California", 840, 163694.7],
    ["Colorado", 919, 104093.7],
    ["Connecticut", 860, 5543.4],
    ["Delaware", 950, 2488.7],
    ["District of Columbia", 830, 68.3],
    ["Georgia", 829, 59425.2],
    ["Hawaii", 872, 10931.7],
    ["Illinois", 825, 57913.6],
    ["Maine", 830, 35379.7],
    ["Maryland", 690, 12405.9],
    ["Massachusetts", 820, 10554.4],
    ["Michigan", 870, 96713.5],
    ["Minnesota", 870, 86935.8],
    ["Nevada", 803, 110571.8],
    ["New Hampshire", 830, 9349.2],
    ["New Jersey", 665, 8722.6],
    ["New Mexico", 877, 121590.3],
    ["New York", 539, 54555.0],
    ["Oregon", 896, 98378.5],
    ["Pennsylvania", 798, 46054.3],
    ["Rhode Island", 829, 1544.9],
    ["Vermont", 910, 9616.4],
    ["Virginia", 840, 42774.9],
    ["Washington", 870, 71298.0],
    ["Wisconsin", 860, 65496.4]
].map(([label, y, x], index) => {
    return {
        label,
        x,
        y: y / 1000,
        custom: {
            index,
            group: 0
        }
    };
});
const redState = [
    ["Alabama", 1030, 52420.1],
    ["Alaska", 960, 665384.0],
    ["Arkansas", 931, 53178.6],
    ["Florida", 796, 65757.7],
    ["Idaho", 1122, 83569.0],
    ["Indiana", 914, 36419.6],
    ["Iowa", 1050, 56272.8],
    ["Kansas", 830, 82278.4],
    ["Kentucky", 840, 40407.8],
    ["Louisiana", 910, 52378.1],
    ["Mississippi", 692, 48431.8],
    ["Missouri", 830, 69707.0],
    ["Montana", 1120, 147039.7],
    ["Nebraska", 1046, 77347.8],
    ["North Carolina", 790, 53819.2],
    ["North Dakota", 1080, 70698.3],
    ["Ohio", 910, 44825.6],
    ["Oklahoma", 860, 69898.9],
    ["South Carolina", 850, 32020.5],
    ["South Dakota", 950, 77115.7],
    ["Tennessee", 840, 42144.3],
    ["Texas", 797, 268596.5],
    ["Utah", 870, 84896.9],
    ["West Virginia", 876, 24230.0],
    ["Wyoming", 1140, 97813.0]
].map(([label, y, x], index) => {
    return {
        label,
        x,
        y: y / 1000,
        custom: {
            index,
            group: 1
        }
    };
});

export const groupedScatter = (canvas, cc) => {
    const config = {
        type: "scatter",
        data: {
            datasets: [
                {
                    label: "Blue",
                    backgroundColor: "blue",
                    hoverRadius: 10,
                    data: blueState
                },
                {
                    label: "Red",
                    backgroundColor: "red",
                    hoverRadius: 10,
                    data: redState
                }
            ]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Cars by State"
                }
            },
            scales: {
                x: {
                    type: "logarithmic",
                    title: {
                        text: "State Area",
                        display: true
                    }
                },
                y: {
                    title: {
                        text: "Vehicles per person",
                        display: true
                    }
                }
            }
        }
    };

    const myChart = new Chart(canvas, config);

    const { err, data: chart } = c2mChart({
        title: "Cars by State",
        type: "scatter",
        element: canvas,
        cc,
        data: {
            Blue: blueState,
            Red: redState
        },
        axes: {
            x: {
                label: "State Area",
                type: "log10"
            },
            y: {
                label: "Vehicles per person"
            }
        },
        options: {
            onFocusCallback: ({ point }) => {
                myChart.setActiveElements([
                    {
                        datasetIndex: point.custom.group,
                        index: point.custom.index
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
