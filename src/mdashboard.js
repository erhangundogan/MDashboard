/*
 Merlon Dashboard
 HTML5 Dashboards & Widgets
 Created by Erhan Gundogan <erhan.gundogan@gmail.com>
 MIT License
 */

var MDashboard, MCollection, MWidget;
(function (global) {

  /**
   * MDashboard
   * @returns {*}
   * @constructor
   */
  MDashboard = function () {
    this.options = {};
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
      if (typeof req[r] === 'undefined')
        return console.error('MDashboard prerequisites not met!');
    }

    _.extend(self.options, _options);

    self.collection = new MCollection(self);

    return self;
  };

  /**
   * MCollection construstor
   * @ownerDashboard Owner MDashboard
   * @returns {*} MCollection itself
   * @constructor
   */
  MCollection = function (ownerDashboard) {
    this.dashboard = ownerDashboard;
    this.widgetOptions = {
      widget_margins: [10, 10],
      widget_base_dimensions: [310, 260],
      draggable: {
        handle: 'header'
      }
    };
    this.container = $('body');
    this.widgets = [];
    return this;
  };
    MCollection.prototype.module = typeof MDashboard;

  /**
   *
   * @param _options Dashboard options (optional)
   * @param callback Callback when browser finished DOM operations (optional)
   */
  MCollection.prototype.init = function (_options, callback) {
    var self = this,
        time = 0;

    if (_.isFunction(_options)) {
      callback = _options;
      _options = {};
    }

    _.extend(self, _options);

    if (!_options && !callback) {
      return self;
    } else {
      var DOMLoadCheck = setInterval(function () {
        var body = $('body');
        if (body && body.length > 0) {
          clearInterval(DOMLoadCheck);
          callback(null, self);
        } else if (time >= 10000) {
          callback('DOM load timeout');
        } else {
          time += 100;
        }
      }, 100);
    }
  };


  MCollection.prototype.render = function() {
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

    list.gridster(self.widgetOptions);
  };

  /**
   * Crates dummy widgets
   */
  MCollection.prototype.createDummyWidgets = function () {
    var self = this,
        widgets = [
          { row:1, col:1, ySize:3, header:'header 1' },
          { row:1, col:2, xSize:2, header:'header 2' },
          { row:2, col:2, header:'header 3' },
          { row:2, col:3, header:'header 4' },
          { row:3, col:2, settings: false },
          { row:3, col:3, settings: false }
        ];

    _.each(widgets, function(widgetOptions, index) {
      self.widgets.push(new MWidget(widgetOptions));
    });

    self.render();
  };

  /**
   *
   * @param _options Widget options (optional)
   * @returns {*} Widget itself
   * @constructor
   */
  MWidget = function (_options) {
    this.xSize = 1;
    this.ySize = 1;
    this.settings = true;

    _.extend(this, _options);
    return this;
  };
  MWidget.prototype.collection = typeof MCollection;
  MWidget.prototype.render = function() {
    var self = this,
        item = $('<li></li>'),
        options = Object.keys(self);

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
          item.prepend($('<header>' + self.header + '</header>'));
          break;
        case 'content':
          item.append(self.content);
          break;
        case 'settings':
          if (self.settings) {
            item.prepend($('<i class="fa fa-cog fa-2x fa-white mdashboard-settings-icon"></i>'));
          }
          break;
      }
    });

    return item;
  };

}(this));