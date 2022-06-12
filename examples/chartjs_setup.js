const highs = [72, 73, 88, 83, 88, 91, 97, 93, 93, 83, 79];
const lows = [25, 23, 25, 34, 38, 55, 67, 64, 44, 41, 29];
const chartElemId = "myChart";
const chartElemId2 = "myChart2";
const months = [
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

// Single line plot

const config = {
  type: 'line',
  data: {
    labels: months,
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
const singleLineCanvas = document.getElementById("singleLine");

const myChart = new Chart(
  singleLineCanvas,
  config
);

// Mulit-line plot

const config2 = {
  type: 'line',
  data: {
    labels: months,
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

const multiLineCanvas = document.getElementById("multiLine");

const myChart2 = new Chart(
  multiLineCanvas,
  config2
);


// Floating bar chart
const floatingBarData = highs.map((y, index) => ([y, lows[index]]));
const config3 = {
  type: "bar",
  data: {
    labels: months,
    datasets: [
      {
        backgroundColor: 'rgb(255, 99, 132)',
        data: floatingBarData,
        hoverBorderWidth: 5,
        hoverBorderColor: 'green',
      }
    ]
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
}
const floatingCanvas = document.getElementById("floatingBar");
const myChart3 = new Chart(
  floatingCanvas,
  config3
);

window.addEventListener("load", () => {
  new window.Sonify({
    type: "line",
    element: singleLineCanvas,
    cc: document.getElementById("cc-singleLine"),
    data: highs.map((y, x) => {
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
  new window.Sonify({
    title: "Raleigh's High/Low Temperatures (2020)",
    element: multiLineCanvas,
    cc: document.getElementById("cc-multiLine"),
    axes: {
      x: {
        minimum: 0,
        maximum: 10,
        label: "Month",
        format: (value) => months[value]
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
  new window.Sonify({
    type: "bar",
    title: "Raleigh's High/Low Temperatures (2020)",
    element: floatingCanvas,
    cc: document.getElementById("cc-floatingBar"),
    axes: {
      x: {
        minimum: 0,
        maximum: 10,
        label: "Month",
        format: (value) => months[value]
      },
      y: {
        minimum: 20,
        maximum: 100,
        label: "Fahrenheit",
        format: (value) => value,
      }
    },
    data: highs.map((y, x) => {
      return {
        x,
        y: {
          high: y,
          low: lows[x]
        },
        callback: () => {
          myChart3.setActiveElements([{datasetIndex: 0, index: x}]);
          myChart3.update();
        }
      }
    })
  });
});