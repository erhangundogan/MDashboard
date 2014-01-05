var widgets = [

  // mwidget-1
  // d3 bar chart
  { row: 1,
    col: 1,
    ySize: 3,
    header: "header 1",
    contentType: "chart",
    chart: {
      library: "d3.v3",
      type: "bar",
      dataset: [5, 12, 25, 8, 23, 7, 20],
      render: function (widget) {
        var width = widget.width,
          height = widget.height;

        widget.container.append('<svg class="chart"></svg>');

        var y = d3.scale.linear().range([height, 0]);
        var chart = d3.select("#" + widget.id + " .chart").attr("width", width).attr("height", height);
        y.domain([0, d3.max(this.dataset, function (d) {
          return d;
        })]);

        var barWidth = width / this.dataset.length;
        var bar = chart.selectAll("g")
          .data(this.dataset)
          .enter().append("g")
          .attr("transform", function (d, i) {
            return "translate(" + i * barWidth + ",0)";
          });

        bar.append("rect")
          .attr("y", function (d) {
            return y(d);
          })
          .attr("height", function (d) {
            return height - y(d);
          })
          .attr("width", barWidth - 1);

        bar.append("text")
          .attr("x", (barWidth / 2) - 4)
          .attr("y", function (d) {
            return y(d) + 3;
          })
          .attr("dy", "1em")
          .attr("fill", "white")
          .text(function (d) {
            return d;
          });

        widget.isRendered = true;
      }
    }
  },

  // mwidget-2
  // html
  { row: 1,
    col: 2,
    xSize: 2,
    header: 'Feedbacks',
    contentType: "html",
    html: {
      /*dataset: function(widget) {
        var taskService = new MService(
          widget, {
            name: 'Task'
          }, {
            url: ''
          });
      },*/
      dataset: [
        { label: "Feedback", value: 32 },
        { label: "Reservation", value: 8 },
        { label: "Meeting", value: 4 },
        { label: "Performance", value: 11 }
      ],
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
        var table = $("<table></table>").attr("padding", 0).attr("spacing", 0).addClass("ui-crm-results");

        _.each(this.dataset, function (item, index) {
          var tr = $("<tr></tr>");

          tr.append(
            $("<td></td>").append(
              $("<div></div>").addClass("ui-crm-label").append(item.label)));
          tr.append(
            $("<td></td>").append(
              $("<div></div>").addClass("ui-crm-result").append(item.value)));

          table.append(tr);
        });

        widget.container.append(this.style(widget));
        widget.container.append(table);

        widget.isRendered = true;
      }
    }
  },

  // mwidget-3
  // d3 line chart
  { row: 2,
    col: 2,
    ySize: 2,
    contentType: "chart",
    chart: {
      library: "d3.v3",
      type: "line",
      dataset: [
        { date: "10.05.2013", value: 15  },
        { date: "18.05.2013", value: 102 },
        { date: "20.06.2013", value: 83  },
        { date: "30.07.2013", value: 155 },
        { date: "08.09.2013", value: 43  },
        { date: "11.10.2013", value: 62  },
        { date: "18.10.2013", value: 69  },
        { date: "05.11.2013", value: 43  },
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
          format = d3.time.format("%d.%m.%Y"),
          parseDate = format.parse,
          margin = {top: 20, right: 20, bottom: 80, left: 50},
          width = widget.width - margin.left - margin.right,
          height = widget.height - margin.top - margin.bottom,
          x = d3.time.scale().range([0, width]),
          y = d3.scale.linear().range([height, 0]);

        widget.container.append(chart.style(widget));
        widget.container.append('<svg class="chart"></svg>');

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
          var date = _.isString(d.date) ? parseDate(d.date) : d.date;
          d.date = date;
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

  // mwidget-4
  // d3 pie chart
  { row: 2,
    col: 3,
    header: 'header 4',
    settings: false,
    contentType: "chart",
    chart: {
      library: 'd3.v3',
      type: 'pie',
      dataset: [
        { label: 'ATV', value: 20 },
        { label: 'KanalD', value: 35 },
        { label: 'NTV', value: 45 }
      ],
      render: function (widget) {
        var width = widget.width,
          height = widget.height,
          radius = Math.min.apply(Math, [widget.width / 2, widget.height / 2]) - 10,
          chart = this,
          color = d3.scale.category20c();

        widget.container.append('<svg class="chart"></svg>');

        var marginLeft = parseInt((width - (2 * radius)) / 2);
        marginLeft = marginLeft > 0 ? marginLeft : 0;

        var marginTop = parseInt((height - (2 * radius)) / 2);
        marginTop = marginTop > 0 ? marginTop : 0;

        var vis = d3.select("#" + widget.id + " .chart")
          .append("svg:svg")
          .data([this.dataset])
          .attr("width", width)
          .attr("height", height)
          .append("svg:g")
          .attr("transform", "translate(" + (radius + marginLeft) + "," + (radius + marginTop) + ")");

        var arc = d3.svg.arc()
          .outerRadius(radius);

        var pie = d3.layout.pie()
          .value(function (d) {
            return d.value;
          });

        var arcs = vis.selectAll("g.slice")
          .data(pie)
          .enter()
          .append("svg:g")
          .attr("class", "slice");

        arcs.append("svg:path")
          .attr("fill", function (d, i) {
            return color(i);
          })
          .attr("d", arc);

        arcs.append("svg:text")
          .attr("transform", function (d) {

            d.innerRadius = 0;
            d.outerRadius = radius;
            return "translate(" + arc.centroid(d) + ")";
          })
          .attr("text-anchor", "middle")
          .text(function (d, i) {
            return chart.dataset[i].label;
          });

        widget.isRendered = true;
      }
    }
  },

  // mwidget-5
  // highcharts gauge
  { row: 3,
    col: 3,
    header: "header 5",
    contentType: "chart",
    chart: {
      library: "highcharts",
      type: "gauge",
      render: function(widget) {
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