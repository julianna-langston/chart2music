import { c2mChart } from "../../dist/index.mjs";
import { DateTime } from "https://cdn.skypack.dev/luxon@3.0.1";

const title = "Sale to list trend for 27703";

const canvas = document.getElementById("canvas");
const cc = document.getElementById("cc");

let hash = {};
let c2m = null;

const sales = [
    ["2022-07-27", 0, 0],
    ["2022-07-27", 0, 0],
    ["2022-07-27", 0, 0],
    ["2022-07-27", 0, 0],
    ["2022-07-27", 5510, 0.0143],
    ["2022-07-27", 38372, 0.116],
    ["2022-07-28", 0, 0],
    ["2022-07-28", -10000, -0.0251],
    ["2022-07-28", 0, 0],
    ["2022-07-28", 0, 0],
    ["2022-07-28", 7927, 0.0233],
    ["2022-07-28", 37377, 0.112],
    ["2022-07-28", 18332, 0.0487],
    ["2022-07-28", 450, 0.0008],
    ["2022-07-28", 7000, 0.0157],
    ["2022-07-28", -15000, -0.0333],
    ["2022-07-28", 0, 0],
    ["2022-07-28", 0, 0],
    ["2022-07-29", -15600, 0.0808],
    ["2022-07-29", 0, 0],
    ["2022-07-29", 0, 0],
    ["2022-07-29", -150, -0.0003],
    ["2022-07-29", 29954, 0.0808],
    ["2022-07-29", 0, 0],
    ["2022-07-29", 10133, 0.0296],
    ["2022-07-29", 0, 0],
    ["2022-07-29", -42990, -0.819],
    ["2022-07-29", -10000, -0.0222],
    ["2022-07-29", 61300, 0.2043],
    ["2022-07-29", 0, 0],
    ["2022-07-29", -25000, -0.0526],
    ["2022-07-29", 80100, 0.1178],
    ["2022-07-29", 10500, 0.0176],
    ["2022-08-01", 7000, 0.0169],
    ["2022-08-01", -4000, -0.0108],
    ["2022-08-01", 5100, 0.0104],
    ["2022-08-01", 16000, 0.0356],
    ["2022-08-01", 0, 0],
    ["2022-08-02", 5000, 0.0095],
    ["2022-08-02", -107500, -0.185]
];

sales.forEach(([day, bid]) => {
    if (!hash[day]) {
        hash[day] = [];
    }
    hash[day].push(bid);
});

const data = Object.values(hash).map(
    (arr) => arr.reduce((a, b) => a + b, 0) / arr.length
);
const days = Object.keys(hash).map((iso) => DateTime.fromISO(iso));

const datasets = [
    {
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        cubicInteroplationMode: "monotone",
        data,
        hoverRadius: 10
    }
];
const config = {
    type: "line",
    data: {
        labels: days.map((dt) => dt.toFormat("MMM dd")),
        datasets: datasets
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: title
            },
            legend: {
                display: false
            }
        }
    }
};

const myChart = new Chart(canvas, config);

const { err, data: chart } = c2mChart({
    type: "line",
    element: canvas,
    title,
    cc,
    axes: {
        x: {
            label: "Day",
            format: (index) => days[index].toFormat("MMMM dd")
        },
        y: {
            label: "Difference",
            format: (value) => numeral(value).format("$0,0[.]00")
        }
    },
    data: data.map((y, x) => {
        return {
            x,
            y
        };
    }),
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
c2m = chart;

const refreshData = (showPercent) => {
    hash = {};
    sales.forEach(([day, bid, pct]) => {
        if (!hash[day]) {
            hash[day] = [];
        }
        hash[day].push(showPercent ? pct : bid);
    });

    const data = Object.values(hash).map(
        (arr) => arr.reduce((a, b) => a + b, 0) / arr.length
    );

    myChart.data.datasets[0].data = data;
    myChart.update();

    c2m.setData(
        data.map((y, x) => {
            return {
                x,
                y
            };
        }),
        {
            y: {
                format: showPercent
                    ? (value) => numeral(value).format("0[.]00%")
                    : (value) => numeral(value).format("$0,0[.]00")
            }
        }
    );
};

document.getElementById("switch").addEventListener("change", (e) => {
    refreshData(e.target.checked);
});
