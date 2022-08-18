import { singleLinePlot } from "./charts/singleLine.js";
import { multiLinePlot } from "./charts/multiLine.js";
import { floatingBarChart } from "./charts/floatingBar.js";
import { largeDataLine } from "./charts/largeDataLine.js";
import { barLinePlot } from "./charts/barLine.js";
import { bandPlot } from "./charts/bandPlot.js";
import { livePlot } from "./charts/livePlot.js";
import { missingData } from "./charts/missingData.js";
import { outOfBounds } from "./charts/outOfBounds.js";
import { logLinePlot } from "./charts/logLinePlot.js";

window.addEventListener("load", () => {
    const grid = document.getElementById("examples");
    const cc = document.getElementById("cc");

    const chartFn = [
        singleLinePlot,
        multiLinePlot,
        floatingBarChart,
        largeDataLine,
        barLinePlot,
        bandPlot,
        livePlot,
        missingData,
        outOfBounds,
        logLinePlot
    ];

    chartFn.forEach((fn) => {
        const cell = document.createElement("div");
        const canvas = document.createElement("canvas");
        cell.appendChild(canvas);
        grid.appendChild(cell);

        fn(canvas, cc);
    });
});
