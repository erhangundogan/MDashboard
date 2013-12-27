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
  };

  /**
   * Crates dummy widgets
   */
  MWidgetCollection.prototype.createDummyWidgets = function () {
    var self = this,
        widgets = [
          { row:1, col:1, ySize:3, header:'header 1',
            chart: {
              library:'d3.v3',
              type:'bar',
              dataset: [5, 12, 25, 8, 23, 7, 20],
              render: function(options) {
                var self = this,
                    selector = '#' + self.widget.id;

                var x = d3.scale.linear()
                  .domain([0, d3.max(options.dataset)])
                  .range([0, 420]);

                d3.select(selector)
                  .selectAll("div")
                    .data(options.dataset)
                  .enter().append("div")
                    .style("height", function(d, i) { return d * 5 + "px"; })
                    .style("left", function(d, i) { return i * 38 + "px"; })
                    .text(function(d) { return d; });
              }
            }
          },
          { row:1, col:2, xSize:2, header:'header 2' },
          { row:2, col:2, header:'header 3' },
          { row:2, col:3, header:'header 4', settings: false,
            chart: {
              library:'d3.v3', type:'pie', dataset: {
                'ATV': 20,
                'KanalD': 35,
                'NTV': 45
              }
            }
          },
          { row:3, col:2, settings: false },
          { row:3, col:3, settings: false,
            chart: {
              library:'d3.v3', type:'line', dataset: [
                { date:'10.05.2013', value:15  },
                { date:'18.05.2013', value:102 },
                { date:'20.06.2013', value:83  },
                { date:'30.07.2013', value:155 },
                { date:'08.09.2013', value:43  },
                { date:'11.10.2013', value:62  }
              ]
            }
          }
        ];

    _.each(widgets, function(options, index) {
      self.widgets.push(new MWidget(self, options));
    });

    self.render();
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
    this.order = this.collection.widgets.length + 1;
    this.id = 'mwidget-' + this.order;

    _.extend(this, _options);

    if (this.chart) {
      this.chart = new MChart(this, this.chart);
    }

    return this;
  };
  MWidget.prototype.collection = typeof MWidgetCollection;
  MWidget.prototype.render = function() {
    var self = this,
        item = $('<li></li>'),
        contentSection = $('<div></div>').addClass('mwidget-content'),
        options = Object.keys(self);

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
          item.prepend($('<header class="clearfix">' + self.header + '</header>'));
          break;
        case 'content':
          contentSection.append(self.content);
          break;
        case 'settings':
          if (self.settings) {
            item.prepend($('<i class="fa fa-cog fa-2x fa-white mdashboard-settings-icon"></i>'));
          }
          break;
        case 'chart':
          item.chart.render(function(err, result) {
            if (err) {
              console.error(err);
            } else {
              contentSection.append(result);
            }
          });
          break;
      }
    });
    return item;
  };

  MChart = function(ownerWidget, _options) {
    this.library = 'd3.v3'; // default
    this.widget = ownerWidget;

    _.extend(this, _options);

    return this;
  };
  MChart.prototype.widget = typeof MWidget;

  MChart.prototype.render = function(callback) {
    var self = this;

    if (!self.type) callback('Chart type not specified!');
    if (!self.dataset) callback('Chart data not provided');

    switch(self.library) {
      case 'd3.v3':

        break;
    }
  };

}(this));