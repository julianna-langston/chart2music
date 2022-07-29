import { c2mChart } from "../../dist/index.mjs";

export const livePlot = (canvas, cc) => {
    let arr = [1, 2, 3, 2, 1, 2, 3, 4, 4, 3, 2, 2, 2, 1, 3, 2, 4];
    const datasets = [
        {
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: arr,
            hoverRadius: 10
        }
    ];
    const config = {
        type: "line",
        data: {
            labels: arr.map((num, index) => String(index)),
            datasets: datasets
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Random wandering (live)"
                },
                legend: {
                    display: false
                }
            }
        }
    };

    const myChart = new Chart(canvas, config);

    const { err, data: c2m } = c2mChart({
        type: "line",
        element: canvas,
        cc,
        data: arr.map((y, x) => {
            return {
                x,
                y
            };
        }),
        options: {
            live: true,
            onFocusCallback: ({ index }) => {
                myChart.setActiveElements([{ datasetIndex: 0, index }]);
                myChart.update();
            }
        }
    });
    if (err) {
        console.error(err);
    }

    setInterval(() => {
        const num = +(arr[arr.length - 1] + Math.floor(Math.random() * 3) - 1);
        arr.push(num);
        myChart.data.datasets.data = arr;
        myChart.data.labels = arr.map((num, index) => String(index));
        myChart.update();

        c2m.appendData(num);
    }, 1000);
};
