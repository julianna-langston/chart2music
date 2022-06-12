const highs = [72, 73, 88, 83, 88, 91, 97, 93, 93, 83, 79];
const lows = [25, 23, 25, 34, 38, 55, 67, 64, 44, 41, 29];
const chartElemId = "myChart";
const chartElemId2 = "myChart2";
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

const datasets = [
  {
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgb(255, 99, 132)',
    data: highs,
    hoverRadius: 10
  },
  {
    backgroundColor: 'blue',
    borderColor: 'blue',
    data: lows,
    hoverRadius: 10
  }
];

const config = {
  type: 'line',
  data: {
    labels,
    datasets: datasets.slice(0, 1)
  },
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

const config2 = {
  type: 'line',
  data: {
    labels,
    datasets
  },
  options: {
    plugins: {
      title: {
        display: true,
        text: "Raleigh's High/Low Temperatures (2020)"
      },
      legend: {
        display: false
      }
    }
  }
};

const canvas = document.getElementById(chartElemId);
const canvas2 = document.getElementById(chartElemId2);

const myChart = new Chart(
  canvas,
  config
);
const myChart2 = new Chart(
  canvas2,
  config2
);

window.addEventListener("load", () => {
  new window.Sonify({
    title: "Raleigh's High Temperatures (2020)",
    element: canvas,
    cc: document.getElementById("cc"),
    axes: {
      x: {
        minimum: 0,
        maximum: 10,
        label: "Month",
        format: (value) => labels[value]
      },
      y: {
        minimum: 70,
        maximum: 100,
        label: "Fahrenheit",
        format: (value) => value,
      }
    },
    data: {highs: highs.map((y, x) => {
      return {
        x,
        y,
        callback: () => {
            myChart.setActiveElements([{datasetIndex: 0, index: x}]);
            myChart.update();
        }
      }
    })}
  });
  new window.Sonify({
    title: "Raleigh's High/Low Temperatures (2020)",
    element: canvas2,
    cc: document.getElementById("cc2"),
    axes: {
      x: {
        minimum: 0,
        maximum: 10,
        label: "Month",
        format: (value) => labels[value]
      },
      y: {
        minimum: 20,
        maximum: 100,
        label: "Fahrenheit",
        format: (value) => value,
      }
    },
    data: {
      highs: highs.map((y, x) => {
          return {
            x,
            y,
            callback: () => {
                myChart2.setActiveElements([{datasetIndex: 0, index: x}]);
                myChart2.update();
            }
          }
        }),
      lows: lows.map((y, x) => {
          return {
            x,
            y,
            callback: () => {
                myChart2.setActiveElements([{datasetIndex: 1, index: x}]);
                myChart2.update();
            }
          }
        })
    }
  });
});