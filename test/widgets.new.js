var widgets = [
  {
    row: 1,
    col: 1,
    ySize: 3,
    header: "Top 10 Fiyat Analiz",
    contentType: "chart",
    chart: {
      library: "highcharts",
      type: "column",
      dataset: function (widget, callback) {

        var accountingService = new MService(
          widget,
          { name: 'Product' },
          { url: Merlon.servicePath + '/Accounting/AccountingService.svc/GetProductTotalPrices', data: { count: 10 } });

        accountingService.begin(function (error, data) {
          if (error) {
            callback(error);
          } else {
            if (data) {
              callback(null, data);
            } else {
              callback("no data");
            }
          }
        });

      },
      render: function (widget) {
        var self = this;

        function renderWidget(data) {

          Highcharts.setOptions({
            lang: {
                thousandsSep: '.'
            }
          });
          self.options.series.push({ name: 'Ürünler', data: []});
          _.each(data, function (item, index) {
            self.options.xAxis.categories.push(item.ProductName);
            self.options.series[0].data.push(parseFloat(item.TotalPrice));
          });
          widget.container.highcharts(self.options);
          widget.isRendered = true;
        }

        var service = self.dataset(self, function (error, data) {
          if (error) {
            console.error(error);
          } else {
            renderWidget(data);
          }
        });
      },
      options: {
        credits: {
          enabled: false
        },
        legend: {
          enabled: false
        },
        chart: {
          type: 'column'
        },
        xAxis: {
          categories: [],
          labels: {
            rotation: 270
          }
        },
        tooltip: {
          valueDecimals: 0,
          valueSuffix: ' TL'
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Toplam Staın alma (TL)'
          }
        },
        title: {
          text: ''
        },
        series: []
      }
    }
  },
  {
    row: 1,
    col: 2,
    xSize: 2,
    header: "İşlerin Atandığı Departmanlar",
    contentType: "html",
    html: {
      dataset: function (widget, callback) {

        var taskService = new MService(
          widget,
          { name: 'Task' },
          { url: Merlon.servicePath + '/Task/TaskService.svc/GetLatestTasks', data: { count: 1500 } });

        taskService.begin(function (error, data) {

          if (error) {
            callback(error);
          } else {
            if (data) {
              var dataset = [],
                assignedDepartmentDistribution = _.groupBy(data, 'AssignedDepartmentName'),
                assignedDepartmentList = Object.keys(assignedDepartmentDistribution);

              _.each(assignedDepartmentList, function (department, index) {
                if (department) {
                  dataset.push({
                    label: department,
                    value: assignedDepartmentDistribution[department].length
                  });
                }
              });

              var result = _.sortBy(dataset, function (item) {
                return item.value;
              });

              callback(null, result);
            } else {
              callback("no data");
            }
          }
        });

      },
      style: function (widget) {
        var htmlStyle = [];
        htmlStyle.push("<style>");
        htmlStyle.push("#" + widget.id + " table.ui-crm-results { width:100%; height:100%; font-size:16pt; border-width:0 } ");
        htmlStyle.push("#" + widget.id + " table.ui-crm-results tr:nth-child(odd) { background-color: #EEE; } ");
        htmlStyle.push("#" + widget.id + " table.ui-crm-results tr td div.ui-crm-label { text-align: left; font-weight: bold } ");
        htmlStyle.push("#" + widget.id + " table.ui-crm-results tr td div.ui-crm-result { text-align: center; } ");
        htmlStyle.push("</style>");
        return htmlStyle = htmlStyle.join(" ");
      },
      render: function (widget) {
        var self = this;

        function renderWidget(data) {
          var table = $("<table></table>")
            .attr("padding", 0)
            .attr("spacing", 0)
            .addClass("ui-crm-results");

          _.each(data, function (item, index) {
            var tr = $("<tr></tr>");

            tr.append(
              $("<td></td>").append(
                $("<div></div>").addClass("ui-crm-label").append(item.label)));
            tr.append(
              $("<td></td>").append(
                $("<div></div>").addClass("ui-crm-result").append(item.value)));

            table.append(tr);
          });

          widget.container.append(self.style(widget));
          widget.container.append(table);
          widget.isRendered = true;
        }

        if (_.isFunction(self.dataset)) {
          var service = self.dataset(self, function (error, data) {
            if (error) {
              console.error(error);
            } else {
              renderWidget(data);
            }
          });
        } else {
          renderWidget(self.dataset);
        }
      }
    }
  },
  {
    row: 2,
    col: 2,
    ySize: 1,
    header: "Çizgi",
    contentType: "chart",
    chart: {
      library: "d3.v3",
      type: "line",
      dataset: [
        { date: "10.05.2013", value: 15 },
        { date: "18.05.2013", value: 102 },
        { date: "20.06.2013", value: 83 },
        { date: "30.07.2013", value: 155 },
        { date: "08.09.2013", value: 43 },
        { date: "11.10.2013", value: 62 },
        { date: "18.10.2013", value: 69 },
        { date: "05.11.2013", value: 43 },
        { date: "11.12.2013", value: 162 }
      ],
      style: function (widget) {
        var chartStyle = [];
        chartStyle.push("<style>");
        chartStyle.push("#" + widget.id + " path { stroke: maroon; stroke-width: 1; fill: none; }");
        chartStyle.push("#" + widget.id + " .axis { shape-rendering: crispEdges; }");
        chartStyle.push("#" + widget.id + " .x.axis line, ");
        chartStyle.push("#" + widget.id + " .x.axis path, ");
        chartStyle.push("#" + widget.id + " .y.axis line, ");
        chartStyle.push("#" + widget.id + " .y.axis path { fill: none; stroke: #000; }");
        chartStyle.push("</style>");
        return chartStyle = chartStyle.join(" ");
      },
      render: function (widget) {
        var chart = this,
          margin = { top: 20, right: 20, bottom: 80, left: 50 },
          width = widget.width - margin.left - margin.right,
          height = widget.height - margin.top - margin.bottom;

        widget.container.append(chart.style(widget));
        widget.container.append('<svg class="chart"></svg>');

        var parseDate = d3.time.format("%d.%m.%Y").parse;

        var x = d3.time.scale().range([0, width]);

        var y = d3.scale.linear().range([height, 0]);

        var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

        var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

        var line = d3.svg.line()
          .x(function (d) {
            return x(d.date);
          })
          .y(function (d) {
            return y(d.value);
          });

        var svg = d3.select("#" + widget.id + " .chart")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        this.dataset.forEach(function (d) {
          d.date = parseDate(d.date);
          d.value = +d.value;
        });

        x.domain(d3.extent(this.dataset, function (d) {
          return d.date;
        }));
        y.domain(d3.extent(this.dataset, function (d) {
          return d.value;
        }));

        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0, " + height + ")")
          .call(xAxis)
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", function (d) {
            return "rotate(-90)"
          });

        svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".7em")
          .style("text-anchor", "end")
          .text("Değer");

        svg.append("path")
          .datum(this.dataset)
          .attr("class", "line")
          .attr("d", line);

        widget.isRendered = true;
      }
    }
  },
  {
    row: 3,
    col: 2,
    xSize: 2,
    header: 'İşlerin Durumları',
    settings: false,
    contentType: "chart",
    chart: {
      library: 'highcharts',
      type: 'pie',
      options: {
        credits: {
          enabled: false
        },
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
        },
        title: {
          text: ''
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              color: '#000000',
              connectorColor: '#000000',
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
          }
        },
        series: [
          {
            type: 'pie',
            name: 'Task Durumları',
            data: []
          }
        ]
      },
      dataset: function (widget, callback) {

        var taskService = new MService(
          widget,
          { name: 'Task' },
          { url: Merlon.servicePath + '/Task/TaskService.svc/GetLatestTasks', data: { count: 100} });

        taskService.begin(function (error, data) {
          if (error) {
            callback(error);
          } else {
            if (data) {
              var dataset = [],
                taskStatus = _.groupBy(data, function (item, index) {
                  return item.StatusName;
                }),
                taskStatusTypes = Object.keys(taskStatus);

              var totalCount = _.reduce(taskStatus, function (memo, value, key) {
                return memo + value.length;
              }, 0);

              _.each(taskStatus, function (task, key) {
                if (task) {
                  var percent = (task.length / totalCount) * 100;
                  dataset.push([key, Number(percent.toFixed(2))]);
                }
              });

              callback(null, dataset);
            } else {
              callback("no data");
            }
          }
        });

      },
      render: function (widget) {

        var self = this;

        function renderWidget(data) {

          self.options.series[0].data = data;
          widget.container.highcharts(self.options);
          widget.isRendered = true;
        }

        var service = self.dataset(self, function (error, data) {
          if (error) {
            console.error(error);
          } else {
            renderWidget(data);
          }
        });

      }
    }
  },
  {
    row: 2,
    col: 3,
    header: "Sayaç",
    contentType: "chart",
    chart: {
      library: "highcharts",
      type: "gauge",
      render: function (widget) {
        this.options.yAxis.Max = widget.height;

        widget.container.highcharts(
          this.options,
          function (chart) {
            if (!chart.renderer.forExport) {
              setInterval(function () {
                var point = chart.series[0].points[0],
                  newVal,
                  inc = Math.round((Math.random() - 0.5) * 20);

                newVal = point.y + inc;
                if (newVal < 0 || newVal > 200) {
                  newVal = point.y - inc;
                }

                point.update(newVal);

              }, 3000);
            }
          });

        widget.isRendered = true;
      },
      options: {

        credits: {
          enabled: false
        },

        chart: {
          type: 'gauge',
          plotBackgroundColor: null,
          plotBackgroundImage: null,
          plotBorderWidth: 0,
          plotShadow: false
        },

        title: {
          text: ''
        },

        pane: {
          startAngle: -150,
          endAngle: 150,
          background: [
            {
              backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                  [0, '#FFF'],
                  [1, '#333']
                ]
              },
              borderWidth: 0,
              outerRadius: '109%'
            },
            {
              backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                  [0, '#333'],
                  [1, '#FFF']
                ]
              },
              borderWidth: 1,
              outerRadius: '107%'
            },
            {
              // default background
            },
            {
              backgroundColor: '#DDD',
              borderWidth: 0,
              outerRadius: '105%',
              innerRadius: '103%'
            }
          ]
        },

        // the value axis
        yAxis: {
          min: 0,
          max: 200,

          minorTickInterval: 'auto',
          minorTickWidth: 1,
          minorTickLength: 10,
          minorTickPosition: 'inside',
          minorTickColor: '#666',

          tickPixelInterval: 30,
          tickWidth: 2,
          tickPosition: 'inside',
          tickLength: 10,
          tickColor: '#666',
          labels: {
            step: 2,
            rotation: 'auto'
          },
          title: {
            text: 'km/h'
          },
          plotBands: [
            {
              from: 0,
              to: 120,
              color: '#55BF3B' // green
            },
            {
              from: 120,
              to: 160,
              color: '#DDDF0D' // yellow
            },
            {
              from: 160,
              to: 200,
              color: '#DF5353' // red
            }
          ]
        },

        series: [
          {
            name: 'Hız',
            data: [80],
            tooltip: {
              valueSuffix: ' km/h'
            }
          }
        ]
      }
    }
  }
];