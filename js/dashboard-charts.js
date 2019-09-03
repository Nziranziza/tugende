var ctx = document.getElementById("main-chart").getContext("2d");
var myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "Rwf",
        data: [12, 19, 3, 10, 2, 19],
        backgroundColor: [
          "rgba(84, 216, 255, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)"
        ],
        borderColor: [
          "rgba(85, 216, 254, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)"
        ],
        borderWidth: 1
      }
    ]
  },
  options: {
    legend: { display: false },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  }
});
// station stats graph
var ctx = document.getElementById("stations-stats").getContext("2d");
var myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "Rwf",
        data: [1, 2, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(85, 216, 254, 1)",
          "rgba(85, 216, 254, 1)",
          "rgba(85, 216, 254, 1)",
          "rgba(85, 216, 254, 1)",
          "rgba(85, 216, 254, 1)",
          "rgba(85, 216, 254, 1)"
        ]
      }
    ]
  },
  options: {
    responsive: false,
    legend: { display: false },
    scales: {
      xAxes: [
        {
          ticks: {
            display: false
          },
          gridLines: {
            display: false,
            color: "rgba(0, 0, 0, 0)"
          }
        }
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
            color: "rgba(0, 0, 0, 0)"
          },
          ticks: {
            display: false,
            beginAtZero: true
          }
        }
      ]
    }
  }
});
var ctx = document.getElementById("ticket-purchase").getContext("2d");
var myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "Rwf",
        labelDisplay: false,
        data: [1, 2, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(163, 160, 251, 1)",
          "rgba(163, 160, 251, 1)",
          "rgba(163, 160, 251, 1)",
          "rgba(163, 160, 251, 1)",
          "rgba(163, 160, 251, 1)",
          "rgba(163, 160, 251, 1)"
        ]
      }
    ]
  },
  options: {
    responsive: false,

    legend: { display: false },
    scales: {
      xAxes: [
        {
          ticks: {
            display: false
          },
          gridLines: {
            display: false,
            color: "rgba(0, 0, 0, 0)"
          }
        }
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
            color: "rgba(0, 0, 0, 0)"
          },
          ticks: {
            display: false,
            beginAtZero: true
          }
        }
      ]
    }
  }
});
var ctx = document.getElementById("total-earnings").getContext("2d");
var myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "Rwf",
        data: [1, 2, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(94, 226, 160, 1)",
          "rgba(94, 226, 160, 1)",
          "rgba(94, 226, 160, 1)",
          "rgba(94, 226, 160, 1)",
          "rgba(94, 226, 160, 1)",
          "rgba(94, 226, 160, 1)"
        ]
      }
    ]
  },
  options: {
    responsive: false,
    legend: { display: false },
    scales: {
      xAxes: [
        {
          ticks: {
            display: false
          },
          gridLines: {
            display: false,
            color: "rgba(0, 0, 0, 0)"
          }
        }
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
            color: "rgba(0, 0, 0, 0)"
          },
          ticks: {
            display: false,
            beginAtZero: true
          }
        }
      ]
    }
  }
});