import { c2mChart } from "../../dist/index.mjs";

function colorFromRaw(ctx) {
    if (ctx.type !== "data") {
        return "transparent";
    }
    const value = ctx.raw.v;
    let alpha = (1 + Math.log(value)) / 5;
    return `rgba(0, 255, 0, ${alpha})`;
}

export const treemap1 = (canvas, cc) => {
    const config = {
        type: "treemap",
        data: {
            datasets: [
                {
                    label: "My treemap dataset",
                    tree: [15, 6, 6, 5, 4, 3, 2, 2],
                    borderColor: "green",
                    borderWidth: 1,
                    spacing: 0,
                    backgroundColor: (ctx) => colorFromRaw(ctx)
                }
            ]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "My treemap chart"
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
        title: config.options.plugins.title.text,
        element: canvas,
        cc,
        data: config.data.datasets[0].tree,
        options: {
            onFocusCallback: ({ index }) => {
                const toHighlight = [{ datasetIndex: 0, index }];
                myChart.setActiveElements(toHighlight);
                myChart?.tooltip?.setActiveElements(toHighlight, {});
                myChart.update();
            }
        }
    });
    if (err) {
        console.error(err);
    }

    console.log(c2m);
};
