import { highs, lows, months } from "../data/data.js";

export const floatingBarChart = (canvas, cc) => {
    const floatingBarData = highs.map((y, index) => [y, lows[index]]);
    const config = {
        type: "bar",
        data: {
            labels: months.slice(0, 11),
            datasets: [
                {
                    backgroundColor: "rgb(255, 99, 132)",
                    data: floatingBarData,
                    hoverBorderWidth: 5,
                    hoverBorderColor: "green"
                }
            ]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Raleigh's High/Low Temperatures (2020)"
                },
                legend: {
                    display: false
                }
            }
        }
    };

    const myChart = new Chart(canvas, config);

    new window.Sonify({
        type: "bar",
        title: "Raleigh's High/Low Temperatures (2020)",
        element: canvas,
        cc,
        axes: {
            x: {
                minimum: 0,
                maximum: 10,
                label: "Month",
                format: (value) => months[value]
            },
            y: {
                minimum: 20,
                maximum: 100,
                label: "Fahrenheit",
                format: (value) => value
            }
        },
        data: highs.map((y, x) => {
            return {
                x,
                y: {
                    high: y,
                    low: lows[x]
                },
                callback: () => {
                    myChart.setActiveElements([{ datasetIndex: 0, index: x }]);
                    myChart.update();
                }
            };
        })
    });
};
