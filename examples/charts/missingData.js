import { c2mChart } from "../../dist/index.mjs";

export const missingData = (canvas, cc) => {
    const xLabel = "Year";
    const yLabel = "Voting rate";
    const years = [
        1964, 1968, 1972, 1976, 1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008,
        2012, 2016, 2020
    ];
    const title =
        "By Region: Presidential voting rate compared to total voting-age population";

    const a =
        `0.744				0.71				0.664				0.595				0.585				0.597				0.574				0.612				0.545				0.552				0.586				0.574				0.566				0.562				0.627`.split(
            "				"
        );
    const b =
        `0.719												0.575				0.572				0.585				0.556				0.585				0.518				0.499				0.544				0.546				0.523				0.529				0.596`.split(
            "				"
        );
    const c =
        `0.567				0.601				0.554				0.549				0.556				0.568				0.545				0.59				0.522				0.535				0.564				0.577				0.557				0.549				0.549`.split(
            "				"
        );
    const d =
        `0.762												0.651				0.658				0.657				0.629				0.672				0.593				0.609				0.65				0.634				0.623				0.614				0.655`.split(
            "				"
        );

    const categories = ["Northeast", "West", "South", "Midwest"];
    const rows = [a, b, c, d];
    const colors = ["magenta", "navy", "green", "lightblue"];

    // Draw chart using Chart.js
    const config = {
        type: "line",
        data: {
            labels: years,
            datasets: categories.map((label, index) => {
                return {
                    label,
                    backgroundColor: colors[index],
                    borderColor: colors[index],
                    hoverRaidus: 10,
                    data: rows[index].map((str) => (str === "" ? null : +str))
                };
            })
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: title
                }
            }
        }
    };

    const myChart = new Chart(canvas, config);

    const data = Object.fromEntries(
        categories.map((label, index) => [
            label,
            rows[index].map((str) => (str === "" ? NaN : +str))
        ])
    );

    // Wire up Chart2Music
    const { err, data: chart } = c2mChart({
        type: "line",
        title: "by region",
        element: canvas,
        cc,
        axes: {
            x: {
                label: xLabel,
                format: (index) => years[index]
            },
            y: {
                label: yLabel,
                format: (value) => numeral(value).format("0%")
            }
        },
        data,
        options: {
            onFocusCallback: ({ slice, index }) => {
                myChart.setActiveElements([
                    { datasetIndex: categories.indexOf(slice), index }
                ]);
                myChart.update();
            }
        }
    });

    if (err) {
        console.error(err);
    }
    console.log(chart);
};
