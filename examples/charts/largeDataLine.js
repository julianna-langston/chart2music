import { months } from "../data/data.js";
import { bitcoin } from "../data/bitcoin.js";
// global: numeral

const niceDay = (timestamp) => {
    const day = new Date(timestamp);
    return `${months[day.getMonth()]} ${day.getDate()}, ${day.getFullYear()}`;
};

export const largeDataLine = (canvas, cc) => {
    const labels = [];
    for (let i = 0; i < bitcoin.length; i++) {
        labels.push(i);
    }

    const config = {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    backgroundColor: "rgb(255, 99, 132)",
                    data: bitcoin,
                    hoverBorderWidth: 5,
                    hoverBorderColor: "green"
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

    new window.Sonify({
        type: "line",
        title: "Bitcoin",
        element: canvas,
        cc,
        axes: {
            x: {
                minimum: 0,
                maximum: bitcoin.length,
                label: "Date",
                format: (value) => niceDay(1279425600000 + value * 86400000)
            },
            y: {
                minimum: 0,
                maximum: 70000,
                label: "Price",
                format: (value) => numeral(value).format("$0,0[.]00")
            }
        },
        data: bitcoin.map((y, x) => {
            return {
                x,
                y,
                callback: () => {
                    myChart.setActiveElements([{ datasetIndex: 0, index: x }]);
                    myChart.update();
                }
            };
        })
    });
};
