/*
 Merlon Dashboard
 HTML5 Dashboards & Widgets
 Created by Erhan Gundogan <erhan.gundogan@gmail.com>
 MIT License
 */

var MDashboard, MWidgetCollection, MWidget, MChart, MService;
(function (global) {

  /**
   * MDashboard
   * @returns {*}
   * @constructor
   */
  MDashboard = function () {
    this.options = {};
    this.collections = [];
    this.services = [];
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

  MDashboard.prototype.connect = function() {
    var self = this;
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
    var self = this;
    this.dashboard = ownerDashboard;
    this.order = ownerDashboard.collections.length + 1;
    this.isInitialized = false;
    this.collectionOptions = {
      widget_margins: [10, 10],
      //widget_base_dimensions: [360, 300],
      draggable: {
        handle: 'header'
      }
    };
    this.widgets = [];

    if (_options) {
      _.extend(this, _options);
    }

    if (!this.container) {
      this.container = $('body');
      $(window).bind('resize', function(event) {
        self.events.onContainerResize(event, self);
      });
      this.height = $(window).height();
    } else {
      this.height = $(this.container).height();
      $(this.container).bind('resize', function(event) {
        self.events.onContainerResize(event, self);
      });
    }

    this.width = $(this.container).width();

    this.columnMargin = this.collectionOptions.widget_margins[0];
    this.rowMargin = this.collectionOptions.widget_margins[1];

    return this;
  };
  MWidgetCollection.prototype.dashboard = typeof MDashboard;
  MWidgetCollection.prototype.invalidate = function() {
    var self = this;

    self.collectionOptions.widget_base_dimensions = [self.width, self.height];

    var xCount = yCount = 0;
    _.each(self.widgets, function(widget, index) {
      if (widget.row === 1) {
        xCount += widget.xSize;
      }
      if (widget.col === 1) {
        yCount += widget.ySize;
      }
    });

    var xWidth = parseInt((self.width / xCount) - (2 * self.columnMargin));
    var yHeight = parseInt((self.height / yCount) - (2 * self.rowMargin));
    self.collectionOptions.widget_base_dimensions = [xWidth, yHeight];

    self.columnWidth = xWidth;
    self.rowHeight = yHeight;

    _.each(self.widgets, function(widget, index) {
      widget.width = (widget.xSize * self.columnWidth) +
        (2 * ((widget.xSize - 1) * self.columnMargin));

      widget.height = (widget.ySize * (self.rowHeight)) +
        (2 * ((widget.ySize - 1) * self.rowMargin));
    });
  };
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
    return self;
  };
  MWidgetCollection.prototype.add = function(widget) {
    var self = this;

    if (_.isArray(widget)) {
      _.each(widget, function(item, index) {
        self.widgets.push(new MWidget(self, item));
      });
    } else if (_.isObject(widget)) {
      self.widgets.push(new MWidget(self, widget));
    }

    self.events.onCollectionChange(self);

    return self;
  };
  MWidgetCollection.prototype.events = {
    onCollectionChange: function(collection) {
      collection.invalidate();
    },
    onContainerResize: function(event, collection) {
      //widget.resize();
      collection.invalidate();
    }
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
    this.services = this.collection.dashboard.services;

    _.extend(this, _options);

    if (this.contentType === "chart") {
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
        case 'html':
          if (self.contentType === "html" && self.html.render) {
            contentSection.append(self.html.render(self));
          }
          //contentSection.append(self.content);
          break;
        case 'settings':
          if (self.settings) {
            var settingsIcon = $('<i class="fa fa-cog fa-2x fa-white mdashboard-settings-icon"></i>');
            self.settingsIcon = settingsIcon;
            settingsIcon.bind('click', function(event) {
              self.events.onSettingsOpen(event, self);
            });
            item.prepend(settingsIcon);
          }
          break;
      }
    });

    return item;
  };
  MWidget.prototype.redraw = function() {
    var self = this;
    self.container.empty();
  };
  MWidget.prototype.events = {
    onSettingsOpen: function(event, widget) {
      console.log("onSettingsOpen");
    }
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

  MService = function(ownerDashboard, _options, _ajaxOptions) {
    var self = this;
    this.name = 'Dashboard Service';
    this.dashboard = ownerDashboard;
    this.params = [];
    this.errors = [];
    this.results = [],
    this.isInitialized = false;

    this.ajaxOptions = {
      async: true,
      cache: true,
      complete: self.complete,
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      crossDomain: false,
      data: {},
      //dataType: 'json'
      global: true,
      headers: {},
      ifModified: false,
      //jsonp: ''
      //jsonpCallback: function() {}
      //password: ''
      processData: true,
      /*statusCode: {
        404: function() {
          alert( "page not found" );
        }
      }*/
      timeout: 30000,
      type: 'GET',
      //username: ''
      url: ''
    };

    _.extend(this, _options);

    _.extend(this.ajaxOptions, _ajaxOptions);

    return this;
  };
  MService.prototype.dashboard = typeof MDashboard;
  MService.prototype.init = function() {
    var self = this;
    self.requestTime = new Date();
    $.ajax.call(self, self.ajaxOptions);
  };
  /**
   * MService ajaxOptions .error
   * @param request
   * @param status
   */
  MService.prototype.fail = function(request, status, error) {
    var self = this;
    this.errors.push({
      requestTime: self.requestTime,
      responseTime: new Date(),
      name: self.name,
      request: request,
      status: status,
      error: error
    });
  };
  /**
   * MService ajaxOptions .success
   * @param data
   * @param status
   * @param request
   */
  MService.prototype.done = function(data, status, request) {
    var self = this;
    this.results.push({
      requestTime: self.requestTime,
      responseTime: new Date(),
      name: self.name,
      request: request,
      status: status,
      data: data
    });
  };


}(this));