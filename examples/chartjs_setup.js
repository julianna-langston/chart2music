import { singleLinePlot } from "./charts/singleLine.js";
import { multiLinePlot } from "./charts/multiLine.js";
import { floatingBarChart } from "./charts/floatingBar.js";
import { largeDataLine } from "./charts/largeDataLine.js";
import { barLinePlot } from "./charts/barLine.js";
import { bandPlot } from "./charts/bandPlot.js";
import { livePlot } from "./charts/livePlot.js";

window.addEventListener("load", () => {
    const grid = document.getElementById("examples");

    const chartFn = [
        singleLinePlot,
        multiLinePlot,
        floatingBarChart,
        largeDataLine,
        barLinePlot,
        bandPlot,
        livePlot
    ];

    chartFn.forEach((fn) => {
        const cell = document.createElement("div");
        const canvas = document.createElement("canvas");
        const cc = document.createElement("div");
        cell.appendChild(canvas);
        cell.appendChild(cc);
        grid.appendChild(cell);

        fn(canvas, cc);
    });
});
