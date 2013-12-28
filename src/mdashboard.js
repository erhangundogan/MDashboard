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
      ((this.xSize - 1) * this.collection.columnMargin);

    this.height = (this.ySize * this.collection.rowHeight) +
      ((this.ySize - 1) * this.collection.rowMargin);

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
                var chart = d3.select(".chart").attr("width", width).attr("height", height);
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
                  .attr("x", barWidth / 2)
                  .attr("y", function(d) { return y(d) + 3; })
                  .attr("dy", ".75em")
                  .text(function(d) { return d; });
              }
            }
          },
          { row:1, col:2, xSize:2, header:'header 2' },
          { row:2, col:2, header:'header 3' },
          { row:2, col:3, header:'header 4', settings: false
            /*chart: {
              library:'d3.v3', type:'pie', dataset: {
                'ATV': 20,
                'KanalD': 35,
                'NTV': 45
              }
            }*/
          },
          { row:3, col:2, settings: false },
          { row:3, col:3, settings: false
            /*chart: {
              library:'d3.v3', type:'line', dataset: [
                { date:'10.05.2013', value:15  },
                { date:'18.05.2013', value:102 },
                { date:'20.06.2013', value:83  },
                { date:'30.07.2013', value:155 },
                { date:'08.09.2013', value:43  },
                { date:'11.10.2013', value:62  }
              ]
            }*/
          }
        ];

    _.each(widgets, function(options, index) {
      self.widgets.push(new MWidget(self, options));
    });

    self.render();
  };

}(this));