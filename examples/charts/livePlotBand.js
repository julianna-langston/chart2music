import { c2mChart } from "../../dist/index.mjs";
let arr1 = [2, 3, 4];
let arr2 = [1, 0, 0];

export const livePlotBand = (canvas, cc) => {
    const datasets = [
        {
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: arr1.map((item, index) => [item, arr2[index]]),
            hoverRadius: 10
        }
    ];
    const config = {
        type: "bar",
        data: {
            labels: arr1.map((num, index) => String(index)),
            datasets: datasets
        },
        options: {
            responsive: true,
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
        type: "bar",
        element: canvas,
        cc,
        data: arr1.map((item, x) => {
            return {
                x,
                high: item,
                low: arr2[x]
            };
        }),
        options: {
            live: true,
            maxWidth: 20,
            onFocusCallback: ({ index }) => {
                myChart.setActiveElements([{ datasetIndex: 0, index }]);
                myChart.update();
            }
        }
    });
    if (err) {
        console.error(err);
    }
    let x = arr1.length;

    setInterval(() => {
        const num1 = +(
            arr1[arr1.length - 1] +
            Math.floor(Math.random() * 3) -
            1
        );
        arr1.push(num1);
        const num2 = Math.max(
            +(arr2[arr2.length - 1] + Math.floor(Math.random() * 3) - 1),
            num1 - 1
        );
        arr2.push(Math.min(num2, num1 - 1));
        myChart.data.datasets[0].data = arr1.map((item, index) => [
            item,
            arr2[index]
        ]);
        myChart.data.labels = arr1.map((num, index) => String(index));
        myChart.update();

        if (arr1.length >= 20) {
            arr1.shift();
            arr2.shift();
            myChart.data.datasets.data = arr1.map((item, index) => [
                item,
                arr2[index]
            ]);
            myChart.data.datasets.labels = arr1.map((num, index) =>
                String(index)
            );
            myChart.update();
        }

        c2m.appendData({
            x,
            high: arr1[arr1.length - 1],
            low: arr2[arr2.length - 1]
        });
        x++;
    }, 1000);
};
