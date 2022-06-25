import { movingAverage, upper, lower, days } from "../data/stock.js";

export const bandPlot = (canvas, cc) => {
    const config = {
        type: "line",
        data: {
            labels: days,
            datasets: [
                {
                    label: "Moving average",
                    data: movingAverage,
                    backgroundColor: "red",
                    hoverBorderWidth: 5,
                    pointRadius: 1
                },
                {
                    label: "Bollinger Upper",
                    data: upper,
                    backgroundColor: "silver",
                    hoverBorderWidth: 5,
                    fill: "+1",
                    pointRadius: 0
                },
                {
                    label: "Bollinger Lower",
                    data: lower,
                    hoverBorderWidth: 5,
                    pointRadius: 0
                }
            ]
        },
        options: {
            plugins: {
                "samples-filler-analyser": {
                    target: "chart-analyser"
                },
                title: {
                    display: true,
                    text: "AAPL"
                },
                legend: {
                    display: false
                }
            },
            interaction: {
                intersect: false
            }
        }
    };

    const myChart = new Chart(canvas, config);

    new Sonify({
        type: "band",
        title: "AAPL",
        element: canvas,
        cc,
        axes: {
            x: {
                label: "Day",
                format: (value) => days[value]
            },
            y: {
                label: "Close",
                format: (value) => numeral(value).format("$0,0[.]00")
            }
        },
        data: {
            "Moving average": movingAverage.map((y, x) => {
                return {
                    x,
                    y,
                    callback: () => {
                        myChart.setActiveElements([
                            { datasetIndex: 0, index: x }
                        ]);
                        myChart.update();
                    }
                };
            }),
            "Bollinger band": upper.map((high, x) => {
                return {
                    x,
                    y: {
                        high: high,
                        low: lower[x]
                    },
                    callback: () => {
                        myChart.setActiveElements([
                            { datasetIndex: 1, index: x },
                            { datasetIndex: 2, index: x }
                        ]);
                        myChart.update();
                    }
                };
            })
        }
    });
};
