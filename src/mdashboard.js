/*
 Merlon Dashboard
 HTML5 Dashboards & Widgets
 Created by Erhan Gundogan <erhan.gundogan@gmail.com>
 MIT License
 */

var MDashboard, MWidgetCollection, MWidget, MChart;
(function (global) {

  /**
   * MDashboard
   * @returns {*}
   * @constructor
   */
  MDashboard = function () {
    this.options = {};
    this.collections = [];
    return this;
  };

  /**
   * MDashboard Initialize
   * @param _options MDashboard Options (optional)
   * @returns {*} MDashboard module itself
   */
  MDashboard.prototype.init = function (_options) {
    var self = this,
        req = [_, $, $.fn.gridster];

    for (var r in req) {
      if (typeof req[r] === 'undefined') {
        return console.error('MDashboard prerequisites not met!');
      }
    }

    _.extend(self.options, _options);

    return self;
  };

  /**
   *
   * @param _options MWidgetCollection options (optional)
   * @param callback Callback when browser finished DOM operations (optional)
   */
  MDashboard.prototype.createCollection = function(_options, callback) {
    var self = this,
        time = 0;

    if (_.isFunction(_options)) {
      callback = _options;
      _options = {};
    }

    var newCollection = new MWidgetCollection(self, _options);
    self.collections.push(newCollection);

    if (!_options && !callback) {
      return newCollection;
    } else {
      var DOMLoadCheck = setInterval(function () {
        var body = $('body');
        if (body && body.length > 0) {
          clearInterval(DOMLoadCheck);
          callback(null, newCollection);
        } else if (time >= 10000) {
          callback('DOM load timeout');
        } else {
          time += 100;
        }
      }, 100);
    }
  };

  /**
   * MWidgetCollection construstor
   * @ownerDashboard Owner MDashboard
   * @returns {*} MWidgetCollection itself
   * @constructor
   */
  MWidgetCollection = function (ownerDashboard, _options) {
    this.dashboard = ownerDashboard;
    this.order = ownerDashboard.collections.length + 1;
    this.isInitialized = false;
    this.collectionOptions = {
      widget_margins: [10, 10],
      widget_base_dimensions: [310, 260],
      draggable: {
        handle: 'header'
      }
    };
    this.container = $('body');
    this.widgets = [];

    if (_options) {
      _.extend(this, _options);
    }

    this.columnWidth = this.collectionOptions.widget_base_dimensions[0];
    this.rowHeight = this.collectionOptions.widget_base_dimensions[1];
    this.columnMargin = this.collectionOptions.widget_margins[0];
    this.rowMargin = this.collectionOptions.widget_margins[1];

    return this;
  };
  MWidgetCollection.prototype.dashboard = typeof MDashboard;

  MWidgetCollection.prototype.render = function() {
    var wrapper = $('<div class="gridster" />'),
        list = $('<ul />'),
        self = this;

    if (self.widgets.length == 0) return;

    self.container.append(
      wrapper.append(
        list));

    _.each(self.widgets, function(widget, index) {
      list.append(widget.render());
    });

    list.gridster(self.collectionOptions);

    self.isInitialized = true;
  };

  /**
   *
   * @param ownerCollection Owner MCollection
   * @param _options Widget options (optional)
   * @returns {*} Widget itself
   * @constructor
   */
  MWidget = function (ownerCollection, _options) {
    this.xSize = 1;
    this.ySize = 1;
    this.settings = true;
    this.collection = ownerCollection;
    this.isInitialized = false;
    this.order = this.collection.widgets.length + 1;
    this.id = 'mwidget-' + this.order;

    _.extend(this, _options);

    this.width = (this.xSize * this.collection.columnWidth) +
      (2 * ((this.xSize - 1) * this.collection.columnMargin));

    this.height = (this.ySize * (this.collection.rowHeight)) +
      (2 * ((this.ySize - 1) * this.collection.rowMargin));

    if (this.chart) {
      this.chart = new MChart(this, this.chart);
    }

    var self = this;
    var collectionInitialized = setInterval(function() {
      if (self.collection.isInitialized) {
        clearInterval(collectionInitialized);
        if (self.header) {
          var headerHeight = self.header.height();
          self.height = self.height - headerHeight;

          if (self.header.css) {
            var headerPaddingTop = parseInt(self.header.css('padding-top')) || 0;
            var headerPaddingBottom = parseInt(self.header.css('padding-bottom')) || 0;
            self.height -= (headerPaddingTop + headerPaddingBottom);
          }

          self.container.height(self.height);
        }
        self.isInitialized = true;
      }
    }, 100);

    return this;
  };
  MWidget.prototype.collection = typeof MWidgetCollection;
  MWidget.prototype.render = function() {
    var self = this,
        item = $('<li></li>').attr('id', this.id),
        contentSection = $('<div></div>').addClass('mwidget-content'),
        options = Object.keys(self);

    self.container = contentSection;
    item.append(contentSection);

    _.each(options, function(key, index) {
      switch(key) {
        case 'row':
          item.attr('data-row', self.row);
          break;
        case 'col':
          item.attr('data-col', self.col);
          break;
        case 'xSize':
          item.attr('data-sizex', self.xSize);
          break;
        case 'ySize':
          item.attr('data-sizey', self.ySize);
          break;
        case 'header':
          var header = $('<header>' + self.header + '</header>')
            .attr('id', 'mwidget-header-' + self.order);
          self.header = header;
          item.prepend(header);
          break;
        case 'content':
          contentSection.append(self.content);
          break;
        case 'settings':
          if (self.settings) {
            var settingsIcon = $('<i class="fa fa-cog fa-2x fa-white mdashboard-settings-icon"></i>');
            self.settingsIcon = settingsIcon;
            item.prepend(settingsIcon);
          }
          break;
      }
    });

    return item;
  };

  MChart = function(ownerWidget, _options) {
    this.library = 'd3.v3'; // default
    this.widget = ownerWidget;
    this.isInitialized = false;

    _.extend(this, _options);

    var self = this;
    var widgetInitialized = setInterval(function() {
      if (self.widget.isInitialized) {
        clearInterval(widgetInitialized);
        if (self.render) {
          self.render(self.widget);
        }
        self.chartInitialized = true;
      }
    }, 100);

    return this;
  };
  MChart.prototype.widget = typeof MWidget;

  /*MChart.prototype.render = function(callback) {
    var self = this;

    if (!self.type) callback('Chart type not specified!');
    if (!self.dataset) callback('Chart data not provided');

    switch(self.library) {
      case 'd3.v3':

        break;
    }
  };*/

  /**
   * Crates dummy widgets
   */
  MWidgetCollection.prototype.createDummyWidgets = function () {
    var self = this,
        widgets = [
          { row:1, col:1, ySize:3, header:"header 1",
            chart: {
              library:"d3.v3",
              type:"bar",
              dataset: [5, 12, 25, 8, 23, 7, 20],
              render: function(widget) {
                var width = widget.width,
                    height = widget.height;

                widget.container.append('<svg class="chart"></svg>');

                var y = d3.scale.linear().range([height, 0]);
                var chart = d3.select("#" + widget.id + " .chart").attr("width", width).attr("height", height);
                y.domain([0, d3.max(this.dataset, function(d) { return d; })]);

                var barWidth = width / this.dataset.length;
                var bar = chart.selectAll("g")
                  .data(this.dataset)
                  .enter().append("g")
                  .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

                bar.append("rect")
                  .attr("y", function(d) { return y(d); })
                  .attr("height", function(d) { return height - y(d); })
                  .attr("width", barWidth - 1);

                bar.append("text")
                  .attr("x", (barWidth / 2) - 4)
                  .attr("y", function(d) { return y(d) + 3; })
                  .attr("dy", "1em")
                  .attr("fill", "white")
                  .text(function(d) { return d; });
              }
            }
          },
          { row:1, col:2, xSize:2, header:'header 2' },
          { row:2, col:2, ySize:2,
            chart: {
              library:'d3.v3',
              type:'line',
              dataset: [
                { date:'10.05.2013', value:15  },
                { date:'18.05.2013', value:102 },
                { date:'20.06.2013', value:83  },
                { date:'30.07.2013', value:155 },
                { date:'08.09.2013', value:43  },
                { date:'11.10.2013', value:62  },
                { date:'18.10.2013', value:69  },
                { date:'05.11.2013', value:43  },
                { date:'11.12.2013', value:162 }
              ],
              style: function(widget) {
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
              render: function(widget) {
                var chart = this,
                    margin = {top: 20, right: 20, bottom: 80, left: 50},
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
                  .x(function(d) { return x(d.date); })
                  .y(function(d) { return y(d.value); });

                var svg = d3.select("#" + widget.id + " .chart")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                this.dataset.forEach(function(d) {
                  d.date = parseDate(d.date);
                  d.value = +d.value;
                });

                x.domain(d3.extent(this.dataset, function(d) { return d.date; }));
                y.domain(d3.extent(this.dataset, function(d) { return d.value; }));

                svg.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0, " + height + ")")
                  .call(xAxis)
                  .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", function(d) {
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
              }
            }
          },
          { row:2, col:3, header:'header 4', settings: false,
            chart: {
              library:'d3.v3',
              type:'pie',
              dataset: [
                { label:'ATV', value:20 },
                { label:'KanalD', value:35 },
                { label:'NTV', value:45 }
              ],
              render: function(widget) {
                var width = widget.width,
                    height = widget.height,
                    radius = Math.min.apply(Math, [widget.width/2, widget.height/2]) - 10,
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
                  .value(function(d) { return d.value; });

                var arcs = vis.selectAll("g.slice")
                  .data(pie)
                  .enter()
                  .append("svg:g")
                  .attr("class", "slice");

                    arcs.append("svg:path")
                      .attr("fill", function(d, i) { return color(i); } )
                      .attr("d", arc);

                    arcs.append("svg:text")
                      .attr("transform", function(d) {

                        d.innerRadius = 0;
                        d.outerRadius = radius;
                        return "translate(" + arc.centroid(d) + ")";
                      })
                      .attr("text-anchor", "middle")
                      .text(function(d, i) { return chart.dataset[i].label; });
              }
            }
          },
          { row:3, col:3, settings: false }
        ];

    _.each(widgets, function(options, index) {
      self.widgets.push(new MWidget(self, options));
    });

    self.render();
  };

}(this));