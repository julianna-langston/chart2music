const dataValues = [0, 10, 5, 2, 20, 30, 45];
const chartType = "line";
const chartTitle = "Example";
const chartElemId = "myChart";

const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July'
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
                text: chartTitle
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
  window.Sonify({element: canvas, data: dataValues.map((y, x) => {
      return {
          x,
          y,
          callback: () => {
              myChart.setActiveElements([{datasetIndex: 0, index: x}]);
              myChart.update();
          }
      }
  })});
});