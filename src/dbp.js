/*
 dbp.js
 JavaScript Framework for HTML5 Dashboards and widgets
 Created by Erhan Gundogan <erhan.gundogan@gmail.com>
 MIT License
 */

var DBP, Dashboard, Widget;
(function (global) {

  /**
   * DBP
   * @returns {*}
   * @constructor
   */
  DBP = function () {
    this.options = {};
    return this;
  };

  /**
   * DBP Initialize
   * @param _options DBP Options (optional)
   * @returns {*} DBP module itself
   */
  DBP.prototype.init = function (_options) {
    var self = this,
        req = [_, $, $.fn.gridster];

    for (var r in req) {
      if (typeof req[r] === 'undefined')
        return console.error('dbp prerequisites not met!');
    }

    _.extend(self.options, _options);

    self.dashboard = new Dashboard(self);

    return self;
  };

  /**
   * Dashboard construstor
   * @param module DBP module owner
   * @returns {*} Dashboar itself
   * @constructor
   */
  Dashboard = function (module) {
    this.module = module;
    this.container = $('body');
    this.widgets = [];
    return this;
  };
  Dashboard.prototype.module = typeof DBP;

  /**
   *
   * @param _options Dashboard options (optional)
   * @param callback Callback when browser finished DOM operations (optional)
   */
  Dashboard.prototype.init = function (_options, callback) {
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
          time += 200;
        }
      }, 200);
    }
  };

  /**
   * Crates dummy widgets
   */
  Dashboard.prototype.createDummy = function () {
    var wrapper = $('<div class="gridster" />'),
        list = $('<ul />'),
        self = this,
        gridsterOptions = {
          widget_margins: [10, 10],
          widget_base_dimensions: [310, 260]
        };

    self.container.append(
      wrapper.append(
        list));

    //var widget = new Widget(options);

    list.append($('<li />').attr('data-row', 1).attr('data-col', 1).attr('data-sizex', 1).attr('data-sizey', 3))
        .append($('<li />').attr('data-row', 1).attr('data-col', 2).attr('data-sizex', 2).attr('data-sizey', 1))
        .append($('<li />').attr('data-row', 2).attr('data-col', 2).attr('data-sizex', 1).attr('data-sizey', 1))
        .append($('<li />').attr('data-row', 2).attr('data-col', 3).attr('data-sizex', 1).attr('data-sizey', 1))
        .append($('<li />').attr('data-row', 3).attr('data-col', 2).attr('data-sizex', 1).attr('data-sizey', 1))
        .append($('<li />').attr('data-row', 3).attr('data-col', 3).attr('data-sizex', 1).attr('data-sizey', 1))
        .gridster(gridsterOptions);
  };

  /**
   *
   * @param _options Widget options (optional)
   * @returns {*} Widget itself
   * @constructor
   */
  Widget = function (_options) {
    this.xSize = ySize = 1;
    _.extend(this, _options);
    return this;
  };
  Widget.prototype.dashboard = typeof Dashboard;

}(this));