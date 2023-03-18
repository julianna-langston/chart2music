import {Chart, registerables} from "chart.js";
import samples from "./chartjs";

const charts = Object.values(samples);

Chart.register(...registerables);
const cc = document.getElementById("cc") as HTMLDivElement;

const generateCharts = (container: HTMLDivElement) => {
    charts.forEach(({config, callback}) => {
        const newContainer = document.createElement("div");
        const canvas = document.createElement("canvas");
        newContainer.appendChild(canvas);
        container.appendChild(newContainer);

        const myChart = new Chart(canvas, config);
        callback(myChart, canvas, cc);
    })
}

export default generateCharts;