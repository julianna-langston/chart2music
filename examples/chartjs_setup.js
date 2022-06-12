const dataValues = [72, 73, 88, 83, 88, 91, 97, 93, 93, 83, 79];
const chartElemId = "myChart";
const labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
];


const data = {
  labels: labels,
  datasets: [{
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgb(255, 99, 132)',
    data: dataValues,
    hoverRadius: 10
  }]
};

const config = {
  type: 'line',
  data: data,
  options: {
    plugins: {
      title: {
        display: true,
        text: "Raleigh's High Temperatures (2020)"
      },
      legend: {
        display: false
      }
    }
  }
};

const canvas = document.getElementById(chartElemId);

const myChart = new Chart(
  canvas,
  config
);

window.addEventListener("load", () => {
  window.Sonify({
    title: "Raleigh's High Temperatures (2020)",
    element: canvas,
    cc: document.getElementById("cc"),
    data: dataValues.map((y, x) => {
      return {
        x,
        y,
        callback: () => {
            myChart.setActiveElements([{datasetIndex: 0, index: x}]);
            myChart.update();
        }
      }
    })
  });
});