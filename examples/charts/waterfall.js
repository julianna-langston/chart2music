import { c2mChart } from "../../dist/index.mjs";

export const waterfall = (canvas, cc) => {
    const labels = ["Revenue", "Expenses", "Other"];
    const data = [
        { x: 0, open: 0, close: 120 },
        { x: 1, open: 120, close: 85 },
        { x: 2, open: 85, close: 100 }
    ];

    const chart = new Chart(canvas, {
        type: "bar",
        data: {
            labels,
            datasets: [{ data: data.map(({ open, close }) => [open, close]) }]
        },
        options: {
            plugins: { title: { display: false, text: "Waterfall chart" } }
        }
    });

    const { err } = c2mChart({
        type: "bar",
        title: "Waterfall chart",
        element: canvas,
        cc,
        axes: {
            x: { label: "Category", valueLabels: labels },
            y: { label: "Amount", format: (value) => `$${value}` }
        },
        data,
        options: {
            onFocusCallback: ({ index }) => {
                chart.setActiveElements([{ datasetIndex: 0, index }]);
                chart.update();
            }
        }
    });

    if (err) {
        console.error(err);
    }
};
