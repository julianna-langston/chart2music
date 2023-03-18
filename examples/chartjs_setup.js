import { singleLinePlot } from "./charts/singleLine.js";
import { continuous } from "./charts/continuous.js";
import { scatter } from "./charts/scatter.js";
import { multiLinePlot } from "./charts/multiLine.js";
import { floatingBarChart } from "./charts/floatingBar.js";
import { largeDataLine } from "./charts/largeDataLine.js";
import { barLinePlot } from "./charts/barLine.js";
import { bandPlot } from "./charts/bandPlot.js";
import { livePlot } from "./charts/livePlot.js";
import { livePlotBand } from "./charts/livePlotBand.js";
import { missingData } from "./charts/missingData.js";
import { outOfBounds } from "./charts/outOfBounds.js";
import { logLinePlot } from "./charts/logLinePlot.js";
import { histogram } from "./charts/histogram.js";
import { bug120 } from "./charts/bug_gh120.js";
import { stackedBar } from "./charts/stackedBar.js";
import { groupedScatter } from "./charts/groupedScatter.js";
import { treemap1 } from "./charts/treemap.js";
import { treemap2 } from "./charts/treemap2.js";

window.addEventListener("load", () => {
    const grid = document.getElementById("examples");
    const cc = document.getElementById("cc");

    const chartFn = [
        // singleLinePlot,
        // multiLinePlot,
        // floatingBarChart,
        // largeDataLine,
        // barLinePlot,
        // bandPlot,
        // livePlot,
        // livePlotBand,
        // missingData,
        // outOfBounds,
        // logLinePlot,
        // histogram,
        // bug120,
        // continuous,
        // scatter,
        // groupedScatter,
        // stackedBar,
        treemap1,
        treemap2
    ];

    chartFn.forEach((fn) => {
        const cell = document.createElement("div");
        const canvas = document.createElement("canvas");
        cell.appendChild(canvas);
        grid.appendChild(cell);

        fn(canvas, cc);
    });
});
