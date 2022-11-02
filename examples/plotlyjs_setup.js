import { example2 } from "./plotly/example2.js";
import { example3 } from "./plotly/example3.js";

window.addEventListener("load", () => {
    const grid = document.getElementById("examples");
    const cc = document.getElementById("cc");

    const chartFn = [example2, example3];

    chartFn.forEach((fn) => {
        const cell = document.createElement("div");
        const canvas = document.createElement("div");
        cell.appendChild(canvas);
        grid.appendChild(cell);

        fn(canvas, cc);
    });
});
