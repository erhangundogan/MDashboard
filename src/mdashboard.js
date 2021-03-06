/*
 Merlon Dashboard
 HTML5 Dashboards & Widgets
 Created by Erhan Gundogan <erhan.gundogan@gmail.com>
 MIT License
 */

var MDashboard, MWidgetCollection, MWidget, MChart, MService,
    MModule, MDialog, MDialogPage, MAuth, MAccount, MOrchestrator;
(function (global) {

  // http://www.yuiblog.com/blog/2010/12/14/strict-mode-is-coming-to-town/
  'use strict';

  var managementDialog = null,
    addItemDialog = null,
    editWidgetDialog = null,
    editChartDialog = null,
    globalUniqueIdLength = 32,
    classTopContainer = 'mdashboard-container',
    classToolbar = 'mdashboard-toolbar',
    classToolbarList = 'mdashboard-toolbar-list',
    classToolbarButton = 'mdashboard-toolbar-button',
    classGridster = 'gridster',
    widgetHandle = 'header',
    gridsterOptions = {
      namespace: '',
      widget_selector: 'li',
      widget_margins: [20, 20],
      widget_base_dimensions: [200, 125],
      extra_rows: 0,
      extra_cols: 0,
      min_cols: 10,
      max_cols: null,
      min_rows: 6,
      max_size_x: false,
      autogenerate_stylesheet: true,
      avoid_overlapped_widgets: true,
      serialize_params: function($w, wgd) {
        return {
            col: wgd.col,
            row: wgd.row,
            size_x: wgd.size_x,
            size_y: wgd.size_y
        };
      },
      collision: {},
      draggable: {
        items: '.gs-w',
        distance: 10
      },
      resize: {
        enabled: false,
        axes: ['x', 'y', 'both'],
        handle_append_to: '',
        handle_class: 'gs-resize-handle',
        max_size: [Infinity, Infinity]
      }
    },
    faIcons = ['fa-glass', 'fa-music', 'fa-search', 'fa-envelope-o', 'fa-heart', 'fa-star', 'fa-star-o', 'fa-user',
      'fa-film', 'fa-th-large', 'fa-th', 'fa-th-list', 'fa-check', 'fa-times', 'fa-search-plus', 'fa-search-minus',
      'fa-power-off', 'fa-signal', 'fa-gear', 'fa-cog', 'fa-trash-o', 'fa-home', 'fa-file-o', 'fa-clock-o', 'fa-road',
      'fa-download', 'fa-arrow-circle-o-down', 'fa-arrow-circle-o-up', 'fa-inbox', 'fa-play-circle-o',
      'fa-rotate-right', 'fa-repeat', 'fa-refresh', 'fa-list-alt', 'fa-lock', 'fa-flag', 'fa-headphones',
      'fa-volume-off', 'fa-volume-down', 'fa-volume-up', 'fa-qrcode', 'fa-barcode', 'fa-tag', 'fa-tags', 'fa-book',
      'fa-bookmark', 'fa-print', 'fa-camera', 'fa-font', 'fa-bold', 'fa-italic', 'fa-text-height', 'fa-text-width',
      'fa-align-left', 'fa-align-center', 'fa-align-right', 'fa-align-justify', 'fa-list', 'fa-dedent', 'fa-outdent',
      'fa-indent', 'fa-video-camera', 'fa-picture-o', 'fa-pencil', 'fa-map-marker', 'fa-adjust', 'fa-tint', 'fa-edit',
      'fa-pencil-square-o', 'fa-share-square-o', 'fa-check-square-o', 'fa-arrows', 'fa-step-backward',
      'fa-fast-backward', 'fa-backward', 'fa-play', 'fa-pause', 'fa-stop', 'fa-forward', 'fa-fast-forward',
      'fa-step-forward', 'fa-eject', 'fa-chevron-left', 'fa-chevron-right', 'fa-plus-circle', 'fa-minus-circle',
      'fa-times-circle', 'fa-check-circle', 'fa-question-circle', 'fa-info-circle', 'fa-crosshairs',
      'fa-times-circle-o', 'fa-check-circle-o', 'fa-ban', 'fa-arrow-left', 'fa-arrow-right', 'fa-arrow-up',
      'fa-arrow-down', 'fa-mail-forward', 'fa-share', 'fa-expand', 'fa-compress', 'fa-plus', 'fa-minus',
      'fa-asterisk', 'fa-exclamation-circle', 'fa-gift', 'fa-leaf', 'fa-fire', 'fa-eye', 'fa-eye-slash',
      'fa-warning', 'fa-exclamation-triangle', 'fa-plane', 'fa-calendar', 'fa-random', 'fa-comment', 'fa-magnet',
      'fa-chevron-up', 'fa-chevron-down', 'fa-retweet', 'fa-shopping-cart', 'fa-folder', 'fa-folder-open',
      'fa-arrows-v', 'fa-arrows-h', 'fa-bar-chart-o', 'fa-twitter-square', 'fa-facebook-square', 'fa-camera-retro',
      'fa-key', 'fa-gears', 'fa-cogs', 'fa-comments', 'fa-thumbs-o-up', 'fa-thumbs-o-down', 'fa-star-half',
      'fa-heart-o', 'fa-sign-out', 'fa-linkedin-square', 'fa-thumb-tack', 'fa-external-link', 'fa-sign-in',
      'fa-trophy', 'fa-github-square', 'fa-upload', 'fa-lemon-o', 'fa-phone', 'fa-square-o', 'fa-bookmark-o',
      'fa-phone-square', 'fa-twitter', 'fa-facebook', 'fa-github', 'fa-unlock', 'fa-credit-card', 'fa-rss',
      'fa-hdd-o', 'fa-bullhorn', 'fa-bell', 'fa-certificate', 'fa-hand-o-right', 'fa-hand-o-left', 'fa-hand-o-up',
      'fa-hand-o-down', 'fa-arrow-circle-left', 'fa-arrow-circle-right', 'fa-arrow-circle-up', 'fa-arrow-circle-down',
      'fa-globe', 'fa-wrench', 'fa-tasks', 'fa-filter', 'fa-briefcase', 'fa-arrows-alt', 'fa-group', 'fa-users',
      'fa-chain', 'fa-link', 'fa-cloud', 'fa-flask', 'fa-cut', 'fa-scissors', 'fa-copy', 'fa-files-o', 'fa-paperclip',
      'fa-save', 'fa-floppy-o', 'fa-square', 'fa-bars', 'fa-list-ul', 'fa-list-ol', 'fa-strikethrough',
      'fa-underline', 'fa-table', 'fa-magic', 'fa-truck', 'fa-pinterest', 'fa-pinterest-square',
      'fa-google-plus-square', 'fa-google-plus', 'fa-money', 'fa-caret-down', 'fa-caret-up', 'fa-caret-left',
      'fa-caret-right', 'fa-columns', 'fa-unsorted', 'fa-sort', 'fa-sort-down', 'fa-sort-asc', 'fa-sort-up',
      'fa-sort-desc', 'fa-envelope', 'fa-linkedin', 'fa-rotate-left', 'fa-undo', 'fa-legal', 'fa-gavel',
      'fa-dashboard', 'fa-tachometer', 'fa-comment-o', 'fa-comments-o', 'fa-flash', 'fa-bolt', 'fa-sitemap',
      'fa-umbrella', 'fa-paste', 'fa-clipboard', 'fa-lightbulb-o', 'fa-exchange', 'fa-cloud-download',
      'fa-cloud-upload', 'fa-user-md', 'fa-stethoscope', 'fa-suitcase', 'fa-bell-o', 'fa-coffee', 'fa-cutlery',
      'fa-file-text-o', 'fa-building-o', 'fa-hospital-o', 'fa-ambulance', 'fa-medkit', 'fa-fighter-jet', 'fa-beer',
      'fa-h-square', 'fa-plus-square', 'fa-angle-double-left', 'fa-angle-double-right', 'fa-angle-double-up',
      'fa-angle-double-down', 'fa-angle-left', 'fa-angle-right', 'fa-angle-up', 'fa-angle-down', 'fa-desktop',
      'fa-laptop', 'fa-tablet', 'fa-mobile-phone', 'fa-mobile', 'fa-circle-o', 'fa-quote-left', 'fa-quote-right',
      'fa-spinner', 'fa-circle', 'fa-mail-reply', 'fa-reply', 'fa-github-alt', 'fa-folder-o', 'fa-folder-open-o',
      'fa-smile-o', 'fa-frown-o', 'fa-meh-o', 'fa-gamepad', 'fa-keyboard-o', 'fa-flag-o', 'fa-flag-checkered',
      'fa-terminal', 'fa-code', 'fa-reply-all', 'fa-mail-reply-all', 'fa-star-half-empty', 'fa-star-half-full',
      'fa-star-half-o', 'fa-location-arrow', 'fa-crop', 'fa-code-fork', 'fa-unlink', 'fa-chain-broken', 'fa-question',
      'fa-info', 'fa-exclamation', 'fa-superscript', 'fa-subscript', 'fa-eraser', 'fa-puzzle-piece', 'fa-microphone',
      'fa-microphone-slash', 'fa-shield', 'fa-calendar-o', 'fa-fire-extinguisher', 'fa-rocket', 'fa-maxcdn',
      'fa-chevron-circle-left', 'fa-chevron-circle-right', 'fa-chevron-circle-up', 'fa-chevron-circle-down',
      'fa-html5', 'fa-css3', 'fa-anchor', 'fa-unlock-alt', 'fa-bullseye', 'fa-ellipsis-h', 'fa-ellipsis-v',
      'fa-rss-square', 'fa-play-circle', 'fa-ticket', 'fa-minus-square', 'fa-minus-square-o', 'fa-level-up',
      'fa-level-down', 'fa-check-square', 'fa-pencil-square', 'fa-external-link-square', 'fa-share-square',
      'fa-compass', 'fa-toggle-down', 'fa-caret-square-o-down', 'fa-toggle-up', 'fa-caret-square-o-up',
      'fa-toggle-right', 'fa-caret-square-o-right', 'fa-euro', 'fa-eur', 'fa-gbp', 'fa-dollar', 'fa-usd',
      'fa-rupee', 'fa-inr', 'fa-cny', 'fa-rmb', 'fa-yen', 'fa-jpy', 'fa-ruble', 'fa-rouble', 'fa-rub', 'fa-won',
      'fa-krw', 'fa-bitcoin', 'fa-btc', 'fa-file', 'fa-file-text', 'fa-sort-alpha-asc', 'fa-sort-alpha-desc',
      'fa-sort-amount-asc', 'fa-sort-amount-desc', 'fa-sort-numeric-asc', 'fa-sort-numeric-desc', 'fa-thumbs-up',
      'fa-thumbs-down', 'fa-youtube-square', 'fa-youtube', 'fa-xing', 'fa-xing-square', 'fa-youtube-play',
      'fa-dropbox', 'fa-stack-overflow', 'fa-instagram', 'fa-flickr', 'fa-adn', 'fa-bitbucket', 'fa-bitbucket-square',
      'fa-tumblr', 'fa-tumblr-square', 'fa-long-arrow-down', 'fa-long-arrow-up', 'fa-long-arrow-left',
      'fa-long-arrow-right', 'fa-apple', 'fa-windows', 'fa-android', 'fa-linux', 'fa-dribbble', 'fa-skype',
      'fa-foursquare', 'fa-trello', 'fa-female', 'fa-male', 'fa-gittip', 'fa-sun-o', 'fa-moon-o', 'fa-archive',
      'fa-bug', 'fa-vk', 'fa-weibo', 'fa-renren', 'fa-pagelines', 'fa-stack-exchange', 'fa-arrow-circle-o-right',
      'fa-arrow-circle-o-left', 'fa-toggle-left', 'fa-caret-square-o-left', 'fa-dot-circle-o', 'fa-wheelchair',
      'fa-vimeo-square', 'fa-turkish-lira', 'fa-try', 'fa-plus-square-o'];

  MAccount = function(_options, owner) {
    this.uid = getUniqueId(globalUniqueIdLength);
    this.roles = [];
    this.userId = null;
    this.owner = owner;

    _.extend(this, _options);

    return this;
  };
  MAccount.prototype.serialize = function() {
    var self = this,
        serialized = {};

    serialized.uid = self.uid;
    serialized.roles = self.roles;
    serialized.userId = self.userId;
    serialized.owner = self.owner.uid;

    return serialized;
  };
  MAccount.prototype.deserialize = function(data, owner) {
    var self = this;

    self.uid = data.uid;
    self.roles = data.roles;
    self.userId = data.userId;
    self.owner = owner;

    return self;
  };
  MAccount.prototype.isAdmin = function() {
    return this.roles.indexOf('admin') >= 0;
  };
  MAccount.prototype.authenticate = function() {
  };
  MAccount.prototype.getDashboards = function() {
  };

  /**
   * MDashboard
   * @returns {*}
   * @constructor
   */
  MDashboard = function () {
    var self = this;

    this.uid = getUniqueId(globalUniqueIdLength);
    this.isLoaded = false;
    this.name = 'MDashboard';
    this.options = {};
    this.collections = [];
    this.modules = [];
    this.activeDialog = null;
    this.orchestrator = new MOrchestrator(null, self);
    this.account = new MAccount({ roles: ['admin'], userId: 499 }, self);

    return this;
  };
  MDashboard.prototype.account = typeof MAccount;
  MDashboard.prototype.orchestrator = typeof MOrchestrator;
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

    if (self.account && self.account.userId) {
      var dataId = 'dashboard' + self.account.userId,
          data = localStorage.getItem(dataId);

      if (data) {
        self.isLoaded = true;
        self = self.deserialize(data);
      }
    }

    return self;
  };
  /**
   *
   * @param _options MWidgetCollection options (optional)
   * @param callback Callback when browser finished DOM operations (optional)
   */
  MDashboard.prototype.createCollection = function (_options, callback) {
    var self = this,
        time = 0;

    if (_.isFunction(_options)) {
      callback = _options;
      _options = {};
    }

    var newCollection = new MWidgetCollection(self, _options);
    self.collections.push(newCollection);

    if (_options && callback) {
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
  MDashboard.prototype.save = function(callback) {
    var self = this,
        userId = self.account && self.account.userId ? self.account.userId : '',
        dataId = 'dashboard' + userId,
        oldItem = localStorage.getItem(dataId),
        newItem = null;

    // first remove old one
    if (oldItem) { localStorage.removeItem(dataId); }

    // begin to check if storage is written
    var storageCheck = setInterval(function() {
      var newItem = localStorage.getItem(dataId);
      if (newItem !== null) {
        clearInterval(storageCheck);
        callback(null, newItem);
      }
    }, 100);

    try {
      // lazy code section about json/serialization
      var data = self.serialize(),
          dataString = JSON.stringify(data);

      //console.log(data);
      localStorage.setItem(dataId, dataString);
    } catch (exception) {
      // oldies but goldies
      console.error(exception);
      if (oldItem) {
        localStorage.setItem(dataId, oldItem);
      }
      else if (storageCheck) {
        clearInterval(storageCheck);
      }

      callback(exception);
    }
  };
  MDashboard.prototype.serialize = function() {
    var self = this,
        serialized = {};

    serialized.mType = 'MDashboard';
    serialized.uid = self.uid;
    serialized.options = self.options;

    serialized.account = self.account.serialize();

    // modules
    serialized.modules = _.map(self.modules, function(module, index) {
      return module.serialize();
    });

    // widget collections
    serialized.collections = _.map(self.collections, function(collection, index) {
      return collection.serialize();
    });

    return serialized;
  };
  MDashboard.prototype.deserialize = function(rawData) {
    var self = this,
        data = $.parseJSON(rawData);

    if (data) {
      self.uid = data.uid;
      self.userId = data.userId;
      self.options = data.options;

      self.modules = _.map(data.modules, function(moduleData, index) {
        var newModule = new MModule();
        return newModule.deserialize(moduleData, self);
      });

      self.collections = _.map(data.collections, function(collectionData, index) {
        var newCollection = new MWidgetCollection(self);
        return newCollection.deserialize(collectionData, self);
      });
    }

    return self;
  };
  MDashboard.prototype.events = {
    onSaved: function(error, config) {
      if (error) {
        console.error(error);
      } else {
        var dialog = $('.dialog');

        if (dialog && dialog.length > 0) {
          dialog.prop('disabled', false).removeClass('passive-dialog loading');
          $.boxer("destroy");
        }

        console.log('Dashboard saved successfully');
      }
    },
    onDeleteConfig: function(dashboard) {
      var userId = dashboard.account && dashboard.account.userId ? dashboard.account.userId : '',
          dataId = 'dashboard' + userId;

      localStorage.removeItem(dataId);
      window.location.reload(true);
    }
  };
  /**
   * Finds module specified by module.uid
   * @param moduleId
   * @return {*}
   */
  MDashboard.prototype.getModuleById = function(moduleId) {
    var self = this,
        allModules = [];

    function getModules(moduleArray) {
      _.each(moduleArray, function(module, index) {
        allModules.push(module);
        if (module.modules && module.modules.length > 0) {
          getModules(module.modules);
        }
      });
    }
    getModules(self.modules);

    return _.find(allModules, function (item) {
      return item.uid === moduleId;
    });
  };
  MDashboard.prototype.getServiceById = function(serviceId) {
    var self = this,
        allServices = [];

    function getServices(moduleArray) {
      _.each(moduleArray, function(module, index) {
        if (module.service) {
          allServices.push(module.service);
        }
        if (module.modules && module.modules.length > 0) {
          getServices(module.modules);
        }
      });
    }
    getServices(self.modules);

    return _.find(allServices, function (item) {
      return item.uid === serviceId;
    });
  };
  MDashboard.prototype.getServiceByModuleId = function(moduleId) {
    var self = this,
        allModules = [];

    function getModules(moduleArray) {
      _.each(moduleArray, function(module, index) {
        allModules.push(module);
        if (module.modules && module.modules.length > 0) {
          getModules(module.modules);
        }
      });
    }
    getModules(self.modules);

    var foundModule = _.find(allModules, function (item) {
      return item.uid === moduleId;
    });

    return foundModule.service;
  };
  MDashboard.prototype.getWidgetPrototypeById = function(widgetId, callback) {
    var self = this,
        allWidgets = [];

    function getWidgets(moduleArray) {
      _.each(moduleArray, function(module, index) {
        if (module.widgetPrototypes && module.widgetPrototypes.length > 0) {
          var widgetResult = _.find(module.widgetPrototypes, function(prototype) {
            return widgetId === prototype.uid;
          });
          if (widgetResult) {
            callback(widgetResult);
          }
        }
        if (module.modules && module.modules.length > 0) {
          getWidgets(module.modules);
        }
      });
    }
    getWidgets(self.modules);
  };
  /**
   * Finds module if is stored in dashboard modules
   * @param module
   * @return {*}
   */
  MDashboard.prototype.replaceModule = function(searchModule) {
    var self = this,
        found = false;

    // get one module everytime
    function getModules(moduleArray) {

      // look child modules
      _.each(moduleArray, function(module, index) {

        // already found module?
        if (!found) {

          // found module
          if (module.uid === searchModule.uid) {

            // existing module has child modules?
            if (module.modules && module.modules.length > 0) {

              // merge existing child modules with replacing child modules
              searchModule.modules = module.modules.concat(searchModule.modules);
              moduleArray[index] = searchModule;
            } else {

              // replace module
              moduleArray[index] = searchModule;
            }
            // module replaced, getting out of loop
            found = true;
          }
          if (module.modules && module.modules.length > 0 && !found) {
            getModules(module.modules);
          }
        }
      });
    }
    getModules(self.modules);

    // true: found and replaced module
    // false: module not exist
    return found;
  };

  /**
   * MWidgetCollection constructor
   * @ownerDashboard Owner MDashboard
   * @returns {*} MWidgetCollection itself
   * @constructor
   */
  MWidgetCollection = function (ownerDashboard, _options) {
    var self = this;
    this.uid = getUniqueId(globalUniqueIdLength);
    this.dashboard = ownerDashboard;
    this.order = ownerDashboard.collections.length + 1;
    this.isInitialized = false;
    this.toolbar = $('<div class="toolbar-collapse ' + classToolbar + '"></div>');
    this.toolbar.mouseover(function() {
      $(this).removeClass('toolbar-collapse');
      $('.' + classToolbarList).css('display', 'list-item');
    }).mouseout(function() {
      $(this).addClass('toolbar-collapse');
      $('.' + classToolbarList).css('display', 'none');
    });

    this.collectionOptions = gridsterOptions;

    _.extend(this.collectionOptions, {
      widget_margins: [25, 25],
      resize: {
        enabled: true,
        stop: function (event, ui, $widget) {
          var resizedWidgetId = $widget.attr('id'),
              resizedWidget = _.find(self.widgets, function (item) {
                return item.id === resizedWidgetId;
              });

          if (resizedWidget) {
            resizedWidget.events.onResized(resizedWidget, event, ui);
          }
        }
      },
      draggable: {
        handle: widgetHandle,
        stop: function(event, ui) {
          var draggedWidgetId =  ui.$player.attr('id'),
              draggedWidget = _.find(self.widgets, function (item) {
                return item.id === draggedWidgetId;
              });

          if (draggedWidget) {
            draggedWidget.events.onDragged(draggedWidget, event, ui);
          }
        }
      }
    });

    this.widgets = [];

    _.extend(this, _options);

    if (!self.container) {
      self.container = $('body');
      self.height = $(window).height();
    } else {
      self.height = $(self.container).height();
    }

    $(window).bind('resize', debouncer(
      function (event) {
        if (!self.resizing) {
          self.resizing = true;
          self.events.onContainerResize(event, self);
        }
      }, 1000
    ));

    return this;
  };
  /**
   * Owner dashboard
   * @type {string}
   */
  MWidgetCollection.prototype.dashboard = typeof MDashboard;

  /**
   * Finds widget in a collection by looking it's uid
   * @param widgetId
   * @returns {*}
   */
  MWidgetCollection.prototype.getWidgetById = function(widgetId) {
    return _.find(this.widgets, function(widget, index) {
      return widget.uid === widgetId;
    });
  };
  /**
   * Rearrange widget collection
   * @returns {*} self
   */
  MWidgetCollection.prototype.invalidate = function () {
    var self = this,
        xCount = 0,
        yCount = 0;

    self.width = $(self.container).width();
    self.height = self.container.is('body') ? $(window).height() : $(self.container).height();

    self.columnMargin = self.collectionOptions.widget_margins[0];
    self.rowMargin = self.collectionOptions.widget_margins[1];
    self.collectionOptions.widget_base_dimensions = [self.width, self.height];

    _.each(self.widgets, function (widget, index) {
      if (widget.row === 1) {
        xCount += widget.xSize;
      }
      if (widget.col === 1) {
        yCount += widget.ySize;
      }
    });

    // widget minimums
    xCount = xCount < self.collectionOptions.min_cols ? self.collectionOptions.min_cols : xCount;
    yCount = yCount < self.collectionOptions.min_rows ? self.collectionOptions.min_rows : yCount;

    var xWidth = parseInt((self.width / xCount) - (2 * self.columnMargin), 10);
    var yHeight = parseInt((self.height / yCount) - (2 * self.rowMargin), 10);
    self.collectionOptions.widget_base_dimensions = [xWidth, yHeight];

    self.columnWidth = xWidth;
    self.rowHeight = yHeight;

    _.each(self.widgets, function (widget, index) {
      widget.width = (widget.xSize * self.columnWidth) + (2 * ((widget.xSize - 1) * self.columnMargin));
      widget.height = (widget.ySize * (self.rowHeight)) + (2 * ((widget.ySize - 1) * self.rowMargin));
    });

    return self;
  };
  /**
   * Render widget collection
   * @returns {*} self
   */
  MWidgetCollection.prototype.render = function () {
    var self = this,
        wrapper = $('<div class="' + classGridster + '" />').attr('data-uid', self.uid),
        list = $('<ul />');

    self.container.addClass(classTopContainer);

    if (self.toolbar) {
      var buttons = [];

      // Add widget button
      var addButton = $('<a href="#" class="btn"><i class="fa fa-3x fa-bar-chart-o"></i></a>')
        .attr('title', 'Add Widget')
        .click(function () {
          self.events.onAddWidget(self);
        });
      buttons.push(addButton);

      // Add save button
      var saveButton = $('<a href="#" class="btn"><i class="fa fa-3x fa-save"></i></a>')
        .attr('title', 'Save Dashboard')
        .click(function () {
          self.dashboard.save(self.dashboard.events.onSaved);
        });
      buttons.push(saveButton);

      // Add management button
      if (self.dashboard.account.isAdmin()) {
        var manageButton = $('<a href="#" class="btn"><i class="fa fa-3x fa-cogs"></i></a>')
          .attr('title', 'Manage Services')
          .click(function () {
            self.events.onManageServices(self);
          });
        buttons.push(manageButton);

        var deleteButton = $('<a href="#" class="btn"><i class="fa fa-3x fa-times-circle-o"></i></a>')
          .attr('title', 'Reset Dashboard')
          .click(function () {
            self.dashboard.events.onDeleteConfig(self.dashboard);
          });
        buttons.push(deleteButton);

        var loadConfigurationButton = $('<a href="#" class="btn"><i class="fa fa-3x fa-download"></i></a>')
          .attr('title', 'Load Dashboard')
          .click(function () {
            var serviceAddress = window.location.origin + '/Service/Common/CommonService.svc/GetDashboardData';

            var request = $.ajax({
                url: serviceAddress,
                type: 'GET',
                processData: true,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                cache: false
            });

            request.done(function (msg) {
              if (msg.result.Success && msg.result.Data) {
                localStorage.setItem('dashboard499', msg.result.Data);
                var dashboard = new MDashboard().init();
                if (dashboard.isLoaded) {
                  dashboard.collections[0].invalidate();
                  window.location.reload(true);
                } else {
                  dashboard.createCollection(function (err, collection) {
                    collection.render();
                  });
                }
              } else {
                console.error('Could not get default dashboard configuration.');
              }
            });

            request.fail(function (jqXHR, status, error) {
              console.error(error);
            });
        });

        buttons.push(loadConfigurationButton);
      }


      self.toolbar.empty();

      var buttonContainer = $('<ul style="display:none" class="' + classToolbarList + '"></ul>');

      _.each(buttons, function(button, index) {
        var buttonElement = $('<li class="' + classToolbarButton + '"></li>');

        buttonContainer.append(
          buttonElement.append(button));
      });

      self.toolbar.append(buttonContainer);
      self.container.append(self.toolbar);
    }

    if (self.widgets.length === 0) {
      return;
    }

    self.container.append(
      wrapper.append(
        list));

    _.each(self.widgets, function (widget, index) {
      list.append(widget.render());
    });

    self.gridster = list.gridster(self.collectionOptions).data('gridster');
    self.isInitialized = true;

    return self;
  };
  /**
   * Add new widget to collection
   * @param widget MWidget
   * @returns {*} self
   */
  MWidgetCollection.prototype.add = function (widget) {
    var self = this;

    if (_.isArray(widget)) {
      _.each(widget, function (item, index) {
        self.widgets.push(new MWidget(self, item));
      });
    } else if (_.isObject(widget)) {
      self.widgets.push(new MWidget(self, widget));
    }

    self.events.onCollectionChange(self);

    return self;
  };
  /**
   * Rearrange collection and renders it
   */
  MWidgetCollection.prototype.redraw = function() {
    var self = this,
        selector = '.' + classGridster + '[data-uid=' + self.uid + ']';

    $(selector).remove();

    self.isInitialized = false;
    self.invalidate().render();

    _.each(self.widgets, function (widget, index) {
      widget.invalidate();
    });
  };
  /**
   * Widget Collection events
   * @type {{onCollectionChange: Function, onContainerResize: Function}}
   */
  MWidgetCollection.prototype.events = {
    onCollectionChange: function (collection) {
      collection.invalidate();
    },
    onContainerResize: function (event, collection) {
      collection.redraw();
      collection.resizing = false;
    },
    onAddWidget: function (collection) {
      var subHeader = 'Please add, remove or modify your widgets and charts from this dialog. ' +
            'Your widget/chart would be ready when you have finished your configuration and saved your settings.';

      var addItemPage = {
        name: 'widget|main',
        headerOptions: {
          name: 'Widgets & Charts',
          description: subHeader,
          icon: 'fa-bar-chart-o',
          align: 'left'
        },
        bodyOptions: {
          hasScroller: false,
          hasWell: false,
          hasSwiper: true
        },
        footerOptions: {
          buttons: [{
            name: 'Close<br/>Dialog',
            icon: 'fa-sign-out',
            class: 'danger',
            click: function(event) {
              event.preventDefault();
              addItemDialog.close();
            }
          }]
        }
      };

      collection.dashboard.orchestrator.swiperVisibleItems = { Modules:true, Services:false, Widgets:true };

      addItemDialog.dashboard = collection.dashboard;
      addItemDialog.orchestrator = collection.dashboard.orchestrator;
      addItemDialog.createPage(new MDialogPage(addItemPage, addItemDialog));
      addItemDialog.getPage('widget|main', 'slideUpDown');
    },
    onCreateChart: function (widget, editChart) {
      var chart = null,
          module = null,
          form = null,
          paramOrder = 1,
          dialogPageTitle = editChart ? 'Edit Chart' : 'Add Chart';

      var addParam = function(result) {
        var keyValueLabel = $('<div class="form-label"></div>').css({'vertical-align':'top'}),
            keyValueColumnBreak = $('<div class="form-break"><span>&nbsp;:&nbsp;</span></div>').css({'vertical-align':'top', 'padding':'15px 0 0 0'}),
            keyValueItem = $('<div class="form-item"></div>');

        var removeButton = $('<a href="#" class="form-button red"><i class="fa fa-times fa-2x fa-white"></i></a>')
          .attr('data-order', paramOrder)
          .click(function(event) {
            var itemId = $(this).attr('data-order');
            $('div.form-row[data-order=' + itemId + ']').remove();
            if ($('.param-key').length === 0) {
              $('.underline-container').remove();
            }
          });

        var formRow = $('<div class="form-row"></div>');

        keyValueLabel.append(
          $('<input class="param-serie-name text" type="text" />').attr('data-order', paramOrder));

        var options = $('<select class="param-serie text"></select>')
          .attr('data-order', paramOrder)
          .change(function() {
            var selectedKey = $(this).val(),
                containerItem = $(this).parents('.form-item'),
                paramValue = $(this).attr('data-order'),
                dataResult = null;

            // remove category options if exists
            containerItem.find('.param-category').remove();
            containerItem.find('.param-aggregate').remove();
            containerItem.find('.param-value-field').remove();
            containerItem.find('br').remove();

            if (result[selectedKey] && _.isString(result[selectedKey])) {
                var resultset = $.parseJSON(result[selectedKey]);
                if (resultset && _.isObject(resultset)) {
                    if (resultset.Table) {
                        dataResult = resultset.Table;
                    } else {
                        dataResult = resultset;
                    }
                }
            } else {
                dataResult = result[selectedKey];
            }

            // if selected serie is an array and has items
            if (dataResult && _.isArray(dataResult) && dataResult.length > 0) {
              var firstItem = dataResult[0];

              if (firstItem && _.isObject(firstItem)) {
                var categories = Object.keys(firstItem),
                    categorySelect = $('<select title="X-Axis Categories" class="param-category text"></select>').attr('data-order', paramValue),
                    valueFieldSelect = $('<select title="Y-Axis Values" class="param-value-field text short"></select>').attr('data-order', paramValue);

                _.each(categories, function(item, index) {
                  categorySelect.append($('<option></option>').attr('value', item).append(item));
                  valueFieldSelect.append($('<option></option>').attr('value', item).append(item));
                });

                $(containerItem)
                  .append($('<br/>'))
                  .append(categorySelect);

                $(containerItem)
                  .append($('<br/>'))
                  .append($('<select title="Y-Axis Values Aggregation" class="param-aggregate text short"></select>')
                    .attr('data-order', paramValue)
                    .append($('<option value="average">Average</option>'))
                    .append($('<option value="count">Count</option>'))
                    .append($('<option value="min">Minimum</option>'))
                    .append($('<option value="max">Maximum</option>'))
                    .append($('<option value="sum">Total</option>'))
                    .append($('<option value="value" selected>Value</option>')))
                  .append(valueFieldSelect);

              } else {
                console.error('Selected serie items do not has objects');
              }
            } else {
              console.error('Selected serie is not an array or empty');
            }
          });

        if (_.isArray(result)) {
          result = { result: result }; // if we have an array in result we should put it into object
        }
        var resultKeys = Object.keys(result);
        options.append($('<option value="">- Please select an array -</option>'));
        _.each(resultKeys, function(item, index) {
          options.append($('<option></option>').attr('value', item).append(item));
        });
        keyValueItem.append(options);

        //if (key) { keyValueLabel.val(key); }
        //if (value) { keyValueItem.val(value); }

        if ($('.underline-container').length === 0) {
          form.append(
            $('<div class="underline-container"></div>')
              .append('Series')
              .append($('<div class="fuzzy-background"></div>')
                .append($('<div class="span span-1"></div>'))
                .append($('<div class="span span-2"></div>'))
                .append($('<div class="span span-3"></div>'))
                .append($('<div class="span span-4"></div>'))
                .append($('<div class="span span-5"></div>')))
              .append($('<div class="header-underline"></div>')));
        }

        formRow.append(keyValueLabel)
               .append(keyValueColumnBreak)
               .append(keyValueItem)
               .append(removeButton)
               .attr('data-order', paramOrder);
        form.append(formRow);
        ++paramOrder;
      };

      chart = new MChart(widget);
      form = chart.createForm();

      var createChartPage = {
        name: 'chart|main',
        headerOptions: {
          name: dialogPageTitle,
          icon: 'fa-dashboard',
          align: 'left'
        },
        bodyOptions: {
          hasScroller: false,
          hasWell: true,
          container: $('<div id="dialog-content-id"></div>'),
          content: $('<div id="dialog-inner-content"></div>')
            .addClass('inner-panel-resize') // resize inner panel and center content
            .append(form)
        },
        footerOptions: {
          buttons: [{
            name: 'Go<br/>Back',
            class: 'critical',
            icon: 'fa-arrow-left',
            click: function(event) {
              event.preventDefault();
              managementDialog.block();
              managementDialog.getPage('widget|edit', 'slideUpDown');
            }
          }, {
            name: 'Save<br/>Chart',
            class: 'success',
            icon: 'fa-save',
            // Save Widget visible if it is admin and if dialog page showed up from management dialog
            click: function(event) {
              event.preventDefault();

              chart = chart.events.onSave(chart, widget.collection);
              if (chart.widget.collection) {
                chart.widget.collection.events.onCreateWidget(chart.widget.collection, chart.widget);
              } else if (chart.widget.dashboard) {
                var widgetCollection = chart.widget.dashboard.collections[0];
                widgetCollection.events.onCreateWidget(widgetCollection, chart.widget);
              }
            }
          }, {
            name: 'Add<br/>Series',
            icon: 'fa-key',
            disabled: !(widget && widget.serviceId),
            click: function(event) {
              event.preventDefault();
              if (widget && widget.serviceId) {
                managementDialog.block();
                var service = managementDialog.dashboard.getServiceById(widget.serviceId);
                service.getData(function(err, result) {
                  addParam(result);
                  managementDialog.unblock();
                });
              }
            }
          }]
        }
      };

      /* // todo: load series and options
      if (editChart && editChart.params && editChart.params.length > 0) {
        _.each(editChart.params, function(param, index) {
          for (var paramKey in param) {
            if (param.hasOwnProperty(paramKey)) {
              addParam(paramKey, param[paramKey]);
            }
          }
        });
      }
      */

      managementDialog.createPage(new MDialogPage(createChartPage, managementDialog));
      managementDialog.getPage('chart|main', 'slideUpDown');

    },
    onCreateWidget: function (collection, editWidget) {
      var widget = null,
          module = null,
          form = null,
          paramOrder = 1,
          dialogPageTitle = editWidget ? 'Edit Widget' : 'Create Widget';

      if (editWidget) {
        widget = editWidget;
        module = collection.dashboard.getModuleById(editWidget.moduleId);
        form = widget.createForm(editWidget);
      } else {
        widget = new MWidget(collection);
        module = collection.dashboard.orchestrator.selected;

        if (module) {
          widget.header = module.name;
          widget.contentType = 'html';
          widget.serviceId = module.service ? module.service.uid : null;

          if (collection.dashboard.account.isAdmin()) {
            widget.isPrototype = true;
            widget.moduleId = module.uid;
          }
        }
        form = widget.createForm();
      }

      // Check that if it is admin and if dialog page opened up from management dialog
      // activeDialog does not set when user dialog opened or settings icon clicked
      var isManagementDialog = collection.dashboard.account.isAdmin() &&
        collection.dashboard.activeDialog ? true : false;

      var createWidgetPage = {
        name: 'widget|edit',
        headerOptions: {
          name: dialogPageTitle,
          icon: 'fa-bar-chart-o',
          align: 'left'
        },
        bodyOptions: {
          hasScroller: false,
          hasWell: true,
          container: $('<div id="dialog-content-id"></div>'),
          content: $('<div id="dialog-inner-content"></div>')
            .addClass('inner-panel-resize') // resize inner panel and center content
            .append(form)
        },
        footerOptions: {
          buttons: [{
            name: 'Go<br/>Back',
            class: 'critical',
            icon: 'fa-arrow-left',
            visible : isManagementDialog,
            click: function(event) {
              event.preventDefault();
              managementDialog.block();
              managementDialog.getPage('module|main', 'slideUpDown');
            }
          }, {
            name: 'Save<br/>Widget',
            class: 'success',
            icon: 'fa-save',
            visible : isManagementDialog,
            click: function(event) {
              event.preventDefault();
              managementDialog.block();

              widget.events.onSave(widget, collection, function(err, result) {
                if (err) {
                  console.error(err);
                } else {
                  managementDialog.getPage('module|main', 'slideUpDown');
                  var orchestrator = collection.dashboard.orchestrator;
                  orchestrator.swiper.removeAllSlides();
                  orchestrator.events.onModuleSelected(orchestrator.selected);
                }
              });
            }
          }, {
            name: 'Add<br/>Chart',
            icon: 'fa-dashboard',
            visible : isManagementDialog,
            click: function(event) {
              event.preventDefault();
              collection.events.onCreateChart(widget);
            }
          }, {
            name: 'Add to<br/>Dashboard',
            icon: 'fa-plus-square',
            visible : isManagementDialog,
            click: function(event) {
              event.preventDefault();
              var newWidget = _.clone(widget);
              newWidget.uid = getUniqueId(globalUniqueIdLength);

              // TODO: should control same widget id exists or not
              newWidget.id = 'mwidget-' + (collection.widgets.length + 1);
              newWidget.isPrototype = false;
              collection.add(newWidget);
              collection.dashboard.save(collection.dashboard.events.onSaved);
              collection.dashboard.activeDialog.close();
            }
          }, {
            name: 'Close<br/>Dialog',
            class: 'danger',
            icon: 'fa-sign-out',
            click: function(event) {
              event.preventDefault();
              collection.dashboard.activeDialog.close();
            }
          }]
        }
      };

      managementDialog.dashboard = collection.dashboard;
      managementDialog.orchestrator = collection.dashboard.orchestrator;
      managementDialog.createPage(new MDialogPage(createWidgetPage, managementDialog));
      managementDialog.getPage('widget|edit', 'slideUpDown');

    },
    onCreateModule: function (collection) {
      var module = new MModule(),
          selectedItem = collection.dashboard.orchestrator.selected;

      module.dashboard = collection.dashboard;

      if (selectedItem && selectedItem instanceof MModule) {
        module.parent = selectedItem;
      }

      // creates management dialog new module form
      var form = module.createForm();

      var paramOrder = 1;
      var editModulePage = {
        name: 'module|edit',
        headerOptions: {
          name: 'Create/Edit Module',
          description: 'You can specify options for your module here. When you saved your module, it would be possible to create service from another dialog screen',
          icon: 'fa-puzzle-piece',
          align: 'left'
        },
        bodyOptions: {
          hasScroller: false,
          hasWell: true,
          container: $('<div id="dialog-content-id"></div>'),
          content: $('<div id="dialog-inner-content"></div>')
            .addClass('inner-panel-resize') // resize inner panel and center content
            .append(form)
        },
        footerOptions: {
          buttons: [{
            name: 'Go<br/>Back',
            class: 'critical',
            icon: 'fa-arrow-left',
            click: function(event) {
              event.preventDefault();
              managementDialog.block();
              managementDialog.getPage('module|main', 'slideUpDown');
            }
          }, {
            name: 'Save<br/>Module',
            class: 'success',
            icon: 'fa-save',
            click: function(event) {
              event.preventDefault();
              managementDialog.block();

              module.events.onSave(module, function(err, result) {
                if (err) {
                  console.error(err);
                } else {
                  managementDialog.getPage('module|main', 'slideUpDown');
                  collection.dashboard.orchestrator.swiper.removeAllSlides();
                  collection.dashboard.orchestrator.events.onModuleSelected(module);
                }
              });
            }
          }, {
            name: 'Add<br/>Key/Value',
            icon: 'fa-key',
            click: function(event) {
              event.preventDefault();

              var keyValueLabel = $('<div class="form-label"></div>'),
                  keyValueColumnBreak = $('<div class="form-break"><span>&nbsp;:&nbsp;</span></div>'),
                  keyValueItem = $('<div class="form-item"></div>'),
                  removeButton = $('<a href="#" class="form-button red"><i class="fa fa-times fa-2x fa-white"></i></a>')
                    .attr('data-order', paramOrder)
                    .click(function(event) {
                      var itemId = $(this).attr('data-order');
                      $('div.form-row[data-order=' + itemId + ']').remove();
                    }),
                  formRow = $('<div class="form-row"></div>');

              keyValueLabel.append($('<input class="param-key text" type="text" />').attr('data-order', paramOrder));
              keyValueItem.append($('<input class="param-value text" type="text" />').attr('data-order', paramOrder));
              formRow.append(keyValueLabel)
                     .append(keyValueColumnBreak)
                     .append(keyValueItem)
                     .append(removeButton)
                     .attr('data-order', paramOrder);
              form.append(formRow);

              var paramRow = $('.form-row[data-order='+paramOrder+']');
              if (paramRow && paramRow.length > 0) {
                $('#dialog-inner-content').animate({
                    scrollTop: paramRow.offset().top
                }, 2000);
              }

              ++paramOrder;
            }
          }]
        }
      };

      managementDialog.dashboard = collection.dashboard;
      managementDialog.orchestrator = collection.dashboard.orchestrator;
      managementDialog.createPage(new MDialogPage(editModulePage, managementDialog));
      managementDialog.getPage('module|edit', 'slideUpDown');

    },
    onCreateService: function (collection, editService) {
      var service = null,
          form = null,
          dialogPageTitle = editService ? 'Edit Service' : 'Create Service',
          createConnectionButton = editService ? 'Edit<br/>Connection' : 'Create<br/>Connection',
          paramOrder = 1;

      var addParam = function(key, value) {
        var keyValueLabel = $('<div class="form-label"></div>'),
            keyValueColumnBreak = $('<div class="form-break"><span>&nbsp;:&nbsp;</span></div>'),
            keyValueItem = $('<div class="form-item"></div>');

        var removeButton = $('<a href="#" class="form-button red"><i class="fa fa-times fa-2x fa-white"></i></a>')
              .attr('data-order', paramOrder)
              .click(function(event) {
                var itemId = $(this).attr('data-order');
                $('div.form-row[data-order=' + itemId + ']').remove();
              });

        var formRow = $('<div class="form-row"></div>');

        keyValueLabel.append($('<input class="param-key text" type="text" />').attr('data-order', paramOrder));
        keyValueItem.append($('<input class="param-value text" type="text" />').attr('data-order', paramOrder));

        if (key) { keyValueLabel.val(key); }
        if (value) { keyValueItem.val(value); }

        formRow.append(keyValueLabel)
               .append(keyValueColumnBreak)
               .append(keyValueItem)
               .append(removeButton)
               .attr('data-order', paramOrder);
        form.append(formRow);

        var paramRow = $('.form-row[data-order='+paramOrder+']');
        if (paramRow && paramRow.length > 0) {
          $('#dialog-inner-content').animate({
              scrollTop: paramRow.offset().top
          }, 2000);
        }

        ++paramOrder;
      };

      if (editService) {
        if (_.isString(editService)) {
          service = collection.dashboard.getServiceById(editService);
          form = service.createForm(service);
        } else if (editService instanceof MService) {
          service = editService;
          form = service.createForm(editService);
        }
      } else {
        var selectedItem = collection.dashboard.orchestrator.selected;
        if (selectedItem && selectedItem instanceof MModule) {
          service = new MService();
          service.module = selectedItem;
        } else {
          console.error('Module must be selected to create service!');
          return;
        }
        form = service.createForm();
      }

      var editServicePage = {
        name: 'service|edit',
        headerOptions: {
          name: dialogPageTitle,
          description: 'You can specify options for your web service here. This web service would be data connection for your widgets and charts.',
          icon: 'fa-cloud-upload',
          align: 'left'
        },
        bodyOptions: {
          hasScroller: false,
          hasWell: true,
          container: $('<div id="dialog-content-id"></div>'),
          content: $('<div id="dialog-inner-content"></div>')
            .addClass('inner-panel-resize') // resize inner panel and center content
            .append(form)
        },
        footerOptions: {
          buttons: [{
            name: 'Go<br/>Back',
            class: 'critical',
            icon: 'fa-arrow-left',
            click: function(event) {
              event.preventDefault();
              managementDialog.block();
              managementDialog.getPage('module|main', 'slideUpDown');
            }
          }, {
            name: 'Save<br/>Service',
            class: 'success',
            icon: 'fa-save',
            click: function(event) {
              event.preventDefault();
              if (service.ajaxOptions.url) {
                managementDialog.block();
                // Save service
                service.events.onSave(service, function(err, result) {
                  if (err) {
                    console.error(err);
                  } else {
                    managementDialog.getPage('module|main', 'slideUpDown');
                    var orchestrator = collection.dashboard.orchestrator;
                    orchestrator.swiper.removeAllSlides();
                    orchestrator.events.onModuleSelected(orchestrator.selected);
                  }
                });
              } else {
                alert('Connection settings not specified for web service. Please create connection first.');
              }
            }
          }, {
            name: createConnectionButton,
            icon: 'fa-chain',
            click: function(event) {
              event.preventDefault();
              if (editService) {
                var serviceItem = null;
                if (_.isString(editService)) {
                  serviceItem = collection.dashboard.getServiceById(editService);
                } else if (editService instanceof MService) {
                  serviceItem = editService;
                }
                collection.events.onCreateServiceConnection(collection, service, serviceItem.ajaxOptions);
              } else {
                collection.events.onCreateServiceConnection(collection, service);
              }
            }
          }, {
            name: 'Add<br/>Key/Value',
            icon: 'fa-key',
            click: function(event) {
              event.preventDefault();
              addParam();
            }
          }]
        }
      };

      if (editService && editService.params && editService.params.length > 0) {
        _.each(editService.params, function(param, index) {
          for (var paramKey in param) {
            if (param.hasOwnProperty(paramKey)) {
              addParam(paramKey, param[paramKey]);
            }
          }
        });
      }

      managementDialog.dashboard = collection.dashboard;
      managementDialog.orchestrator = collection.dashboard.orchestrator;
      managementDialog.createPage(new MDialogPage(editServicePage, managementDialog));
      managementDialog.getPage('service|edit', 'slideUpDown');

    },
    onCreateServiceConnection: function (collection, service, editConnection) {
      if (!service) {
        console.error('Service must be specified to create/edit connection.');
        return;
      }

      var dialogPageTitle = editConnection ? 'Edit Connection' : 'Create Connection',
          form = service.createConnectionForm(collection, service, editConnection);

      var paramOrder = 1;

      var addParam = function(key, value) {
        var keyValueLabel = $('<div class="form-label"></div>'),
            keyValueColumnBreak = $('<div class="form-break"><span>&nbsp;:&nbsp;</span></div>'),
            keyValueItem = $('<div class="form-item"></div>'),
            removeButton = $('<a href="#" class="form-button red"><i class="fa fa-times fa-2x fa-white"></i></a>')
              .attr('data-order', paramOrder)
              .click(function(event) {
                var itemId = $(this).attr('data-order');
                $('div.form-row[data-order=' + itemId + ']').remove();
              }),
            formRow = $('<div class="form-row"></div>');

        var keyValueLabelInput = $('<input class="param-key text" type="text" />').attr('data-order', paramOrder),
            keyValueItemInput = $('<input class="param-value text" type="text" />').attr('data-order', paramOrder);

        if (key) { keyValueLabelInput.val(key); }
        if (value) { keyValueItemInput.val(value); }

        keyValueLabel.append(keyValueLabelInput);
        keyValueItem.append(keyValueItemInput);

        formRow.append(keyValueLabel)
               .append(keyValueColumnBreak)
               .append(keyValueItem)
               .append(removeButton)
               .attr('data-order', paramOrder);
        form.find('form.form').append(formRow);

        var paramRow = $('.form-row[data-order='+paramOrder+']');
        if (paramRow && paramRow.length > 0) {
          $('#dialog-inner-content').animate({
              scrollTop: paramRow.offset().top
          }, 2000);
        }

        ++paramOrder;
      };

      var editConnectionPage = {
        name: 'connection|edit',
        headerOptions: {
          name: dialogPageTitle,
          description: 'You can specify options for your web service connection here. This web service would be doing ajax requests for data retrieval.',
          icon: 'fa-chain',
          align: 'left'
        },
        bodyOptions: {
          hasScroller: false,
          hasWell: true,
          container: $('<div id="dialog-content-id"></div>'),
          content: $('<div id="dialog-inner-content"></div>')
            .addClass('inner-panel-resize') // resize inner panel and center content
            .append(form)
        },
        footerOptions: {
          buttons: [{
            name: 'Go<br/>Back',
            class: 'critical',
            icon: 'fa-arrow-left',
            click: function(event) {
              event.preventDefault();
              managementDialog.getPage('service|edit', 'slideUpDown');
            }
          }, {
            name: 'Save<br/>Connection',
            class: 'success',
            icon: 'fa-save',
            click: function(event) {
              event.preventDefault();
              service = service.events.onConnectionSave(service, editConnection);
              collection.dashboard.activeDialog.activePage.enableButton('Test<br/>Connection');
            }
          }, {
            name: 'Add Query<br/>Strings',
            icon: 'fa-key',
            click: function(event) {
              event.preventDefault();
              addParam();
            }
          }, {
            name: 'Test<br/>Connection',
            id: 'connection-page-button-test',
            disabled: editConnection ? false : true,
            icon: 'fa-bolt',
            click: function(event) {
              event.preventDefault();
              $('.dialog').prop('disabled', true).addClass('passive-dialog loading');
              service.events.onConnectionTest(service);
            }
          }]
        }
      };

      if (editConnection && editConnection.data && Object.keys(editConnection.data).length > 0) {
        for (var key in editConnection.data) {
          if (editConnection.data.hasOwnProperty(key)) {
            addParam(key, editConnection.data[key]);
          }
        }
      }

      managementDialog.dashboard = collection.dashboard;
      managementDialog.orchestrator = collection.dashboard.orchestrator;
      managementDialog.createPage(new MDialogPage(editConnectionPage, managementDialog));
      managementDialog.getPage('connection|edit', 'slideUpDown');
    },
    onManageServices: function(collection) {
      var subHeader = 'Please add, remove or modify your modules and connections from this dialog.' +
        ' <strong>You can create new module clicking button below.</strong> When you have saved your new module, it would' +
        ' be placed in scroller section as you may see below. Create modules as many as you like. ' +
        ' It is possible to create child modules and/or services.';

      var entrancePage = {
        name: 'module|main',
        headerOptions: {
          name: 'Management Section',
          description: subHeader,
          icon: 'fa-cogs',
          align: 'left'
        },
        bodyOptions: {
          hasScroller: false,
          hasWell: false,
          hasSwiper: true
        },
        footerOptions: {
          buttons: [{
            name: 'Create<br/>Module',
            icon: 'fa-puzzle-piece',
            click: function(event) {
              event.preventDefault();
              collection.events.onCreateModule(collection);
            }
          }, {
            name: 'Create<br/>Service',
            icon: 'fa-cloud-download',
            disabled: true,
            click: function(event) {
              event.preventDefault();
              var container = $('#dialog-content-id'),
                  orchestrator = collection.dashboard.orchestrator;

              if (orchestrator.selected && orchestrator.selected instanceof MModule) {
                collection.events.onCreateService(collection);
              } else {
                console.error('Module not specified.');
              }
            }
          }, {
            name: 'Create<br/>Widget',
            disabled: true,
            icon: 'fa-list',
            click: function(event) {
              event.preventDefault();
              var orchestrator = collection.dashboard.orchestrator;

              if (orchestrator.selected && orchestrator.selected instanceof MModule) {
                collection.events.onCreateWidget(collection);
              } else {
                console.error('Module not specified.');
              }
            }
          }, {
            name: 'Close<br/>Dialog',
            class: 'danger',
            icon: 'fa-sign-out',
            click: function(event) {
              event.preventDefault();
              managementDialog.close();
            }
          }]
        }
      };

      managementDialog.dashboard = collection.dashboard;
      managementDialog.orchestrator = collection.dashboard.orchestrator;
      managementDialog.createPage(new MDialogPage(entrancePage, managementDialog));
      managementDialog.getPage('module|main', 'slideUpDown');
    }
  };
  MWidgetCollection.prototype.serialize = function() {
    var self = this,
        serialized = {};

    serialized.mType = 'MWidgetCollection';
    serialized.uid = self.uid;
    serialized.columnMargin = self.columnMargin;
    serialized.columnWidth = self.columnWidth;
    serialized.height = self.height;
    serialized.order = self.order;
    serialized.rowHeight = self.rowHeight;
    serialized.rowMargin = self.rowMargin;
    serialized.width = self.width;

    // dashboard cannot serialize again. prevents circular json.stringify error
    serialized.dashboard = self.dashboard.uid;

    // widgets
    serialized.widgets = _.map(self.widgets, function(widget, index) {
      return widget.serialize();
    });

    return serialized;
  };
  MWidgetCollection.prototype.deserialize = function(data, owner) {
    var self = this;

    self.uid = data.uid;
    self.columnMargin = data.columnMargin;
    self.columnWidth = data.columnWidth;
    self.height = data.height;
    self.order = data.order;
    self.rowHeight = data.rowHeight;
    self.rowMargin = data.rowMargin;
    self.width = data.width;
    self.dashboard = owner;

    self.widgets = _.map(data.widgets, function(widgetData, index) {
      var newWidget = new MWidget(self);
      return newWidget.deserialize(widgetData, self);
    });

    return self;
  };

  /**
   *
   * @param owner Owner MWidgetCollection or MDashboard
   * @param _options Widget options (optional)
   * @returns {*} Widget itself
   * @constructor
   */
  MWidget = function (owner, _options) {
    this.uid = getUniqueId(globalUniqueIdLength);
    this.name = 'MWidget';
    this.xSize = 1;
    this.ySize = 1;
    this.row = 1;
    this.col = 1;
    this.data = null;
    this.header = null;
    this.description = null;
    this.template = null;
    this.settings = true;
    this.serviceId = null;
    this.moduleId = null;
    this.isInitialized = false;
    this.isClosable = true;
    this.isLocked = false;
    this.isRendered = false;
    this.chart = null;

    if (owner instanceof MWidgetCollection) {
      this.collection = owner;
      this.dashboard = null;
    } else if (owner instanceof MDashboard) {
      this.collection = null;
      this.dashboard = owner;
    }

    this.isPrototype = this.collection
      ? (this.collection.dashboard.account.isAdmin() ? true : false)
      : true;
    this.order = this.collection ? this.collection.widgets.length + 1 : 0;
    this.id = 'mwidget-' + this.order;

    _.extend(this, _options);

    if (this.collection) {
      var self = this;
      var collectionInitialized = setInterval(function () {
        if (self.collection.isInitialized) {
          clearInterval(collectionInitialized);
          if (self.headerItem) {
            var headerHeight = self.headerItem.height();
            self.height = self.height - headerHeight;

            if (self.headerItem.css) {
              var headerPaddingTop = parseInt(self.headerItem.css('padding-top'), 10) || 0;
              var headerPaddingBottom = parseInt(self.headerItem.css('padding-bottom'), 10) || 0;
              self.height -= (headerPaddingTop + headerPaddingBottom);
            }

            self.container.height(self.height);
          }
          self.isInitialized = true;
        }
      }, 100);

      var widgetIsRendered = setInterval(function () {
        if (self.isRendered) {
          clearInterval(widgetIsRendered);
          self.container.removeClass('loading');
        }
      }, 100);
    } else {
      var headerItem = $('<' + widgetHandle + '>' + this.header + '</' + widgetHandle + '>');
      this.headerItem = headerItem;
    }

    return this;
  };
  MWidget.prototype.collection = typeof MWidgetCollection;
  /**
   * Renders widget
   * @returns {*|jQuery}
   */
  MWidget.prototype.render = function () {
    var self = this,
      item = $('<li></li>').attr('id', this.id),
      contentSection = $('<div></div>').addClass('mwidget-content'), //.addClass('loading'), // TODO
      options = Object.keys(self);

    self.mainContainer = item;
    self.container = contentSection;
    item.append(contentSection);

    _.each(options, function (key, index) {
      switch (key) {
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
          if (self.header) {
            var headerText = (self.header && _.isString(self.header)
              ? self.header
              : (self.headerItem && self.headerItem instanceof jQuery
                ? self.headerItem.text()
                : 'Header'));
            var headerItem = $('<' + widgetHandle + '>' + headerText + '</' + widgetHandle + '>')
              .attr('id', 'mwidget-header-' + self.order);
            self.headerItem = headerItem;
            item.prepend(headerItem);
          }
          break;
        case 'html':
          if (self.contentType === "html" && self.html) {
            if (self.serviceId) {
              contentSection.addClass('loading');

              if (self.collection) {
                var service = self.collection.dashboard.getServiceById(self.serviceId);
                service.getData(function(err, result) {
                  contentSection.removeClass('loading');
                  if (self.html.render) {
                    contentSection.append(self.html.render(self, { data:result }));
                  } else if (self.template) {
                    try {
                      contentSection.append(_.template(self.template, { data:result }));
                    } catch (exception) {
                      console.error(exception);
                    }
                  }
                  self.isRendered = true;
                });
              } else {
                self.isRendered = true;
              }
            } else {
              if (self.html.render) {
                contentSection.append(self.html.render(self, { data:self }));
              } else if (self.template) {
                try {
                  contentSection.append(_.template(self.template, { data:self }));
                } catch (exception) {
                  console.error(exception);
                }
              }
              self.isRendered = true;
            }
          } else if (self.contentType === "chart" && self.template && self.chart) {
            if (self.serviceId) {
              contentSection.addClass('loading');

              if (self.collection) {
                var service = self.collection.dashboard.getServiceById(self.serviceId);
                service.getData(function(err, result) {
                  try {
                    contentSection.append(_.template(self.template, { data:result }));
                    if (!self.chart.isRendering) {
                      self.chart.renderDefault(contentSection, result);
                    }
                  } catch (exception) {
                    console.error(exception);
                  }
                  self.isRendered = true;
                });
              } else {
                self.isRendered = true;
              }
            } else {
              try {
                contentSection.append(_.template(self.template));
                if (!self.chart.isRendering) {
                  self.chart.renderDefault(contentSection);
                }
              } catch (exception) {
                console.error(exception);
              }
              self.isRendered = true;
            }
          }
          break;
        case 'settings':
          var isAdmin = self.collection.dashboard.account.isAdmin();
          if (isAdmin || (self.settings && !self.isPrototype)) {
            var settingsIcon = $('<i class="fa fa-cog fa-2x fa-white mwidget-icon icon-settings"></i>');
            self.settingsIcon = settingsIcon;
            settingsIcon.bind('click', function (event) {
              self.events.onSettingsOpen(event, self);
            });
            item.prepend(settingsIcon);
          }
          break;
        case 'isClosable':
          if (self.isClosable) {
            var closeIcon = $('<i class="fa fa-times fa-2x fa-white mwidget-icon icon-close"></i>');
            self.closeIcon = closeIcon;
            closeIcon.bind('click', function (event) {
              self.events.onClose(event, self);
            });
            item.prepend(closeIcon);
          }
          break;
      }
    });

    return item;
  };
  /**
   * Rearrange widget
   */
  MWidget.prototype.invalidate = function () {
    var self = this;
    self.isRendered = false;
    self.container.empty();

    self.container.addClass('loading');

    self.xSize = parseInt(self.mainContainer.attr('data-sizex'));
    self.ySize = parseInt(self.mainContainer.attr('data-sizey'));

    self.width = (self.xSize * self.collection.columnWidth) +
      (2 * ((self.xSize - 1) * self.collection.columnMargin));

    self.height = (self.ySize * (self.collection.rowHeight)) +
      (2 * ((self.ySize - 1) * self.collection.rowMargin));

    if (self.headerItem) {
      var headerHeight = self.headerItem.height();
      self.height = self.height - headerHeight;

      if (self.headerItem.css) {
        var headerPaddingTop = parseInt(self.headerItem.css('padding-top')) || 0;
        var headerPaddingBottom = parseInt(self.headerItem.css('padding-bottom')) || 0;
        self.height -= (headerPaddingTop + headerPaddingBottom);
      }
    }
    self.container.height(self.height); //.addClass('loading');

    var widgetIsRendered = setInterval(function () {
      if (self.isRendered) {
        clearInterval(widgetIsRendered);
        self.container.removeClass('loading');
      }
    }, 100);


    if (self.template) {
      if (self.serviceId && self.collection) {
        try {
          var service = self.collection.dashboard.getServiceById(self.serviceId);
          if (service) {
            service.getData(function(err, result) {
              self.container.append(_.template(self.template, { data:result }));
              if (self.contentType === "chart" && self.chart) {
                self.chart.renderDefault(self.container, result);
              }
              self.container.removeClass('loading');
            });
          } else {
            console.error('Widget service could not be found');
            self.container.removeClass('loading');
          }
        } catch (exception) {
          console.error(exception);
          self.container.removeClass('loading');
        }
      } else {
        try {
          self.container.append(_.template(self.template));
          if (self.contentType === "chart" && self.chart) {
            self.chart.renderDefault(self.container);
          }
          self.container.removeClass('loading');
        } catch (exception) {
          console.error(exception);
          self.container.removeClass('loading');
        }
      }
    } else {
      console.error('Cannot render widget without template');
      self.container.removeClass('loading');
    }

  };
  /**
   * Widget events
   * @type {{onSettingsOpen: Function, onClose: Function}}
   */
  MWidget.prototype.events = {
    onSettingsOpen: function (event, widget) {
      widget.collection.events.onCreateWidget(widget.collection, widget);
    },
    onClose: function (event, widget) {
      for (var i in widget.collection.widgets) {
        if (widget.collection.widgets.hasOwnProperty(i)) {
          if (widget.collection.widgets[i].uid === widget.uid) {
            widget.collection.widgets.splice(i, 1);
            break;
          }
        }
      }

      if (widget.collection.gridster && widget.collection.gridster.$widgets) {
        _.each(widget.collection.gridster.$widgets, function(item, index) {
          if ($(item).attr('id') === widget.id) {
            widget.collection.gridster.remove_widget($(item));
          }
        });
      }

      widget.collection.dashboard.save(widget.collection.dashboard.events.onSaved);
    },
    onSave: function(widget, collection, callback) {
      var dashboard = null;

      function processSave(widget) {
        var module = dashboard.getModuleById(widget.moduleId);
        var widgetPrototypeIDs = _.map(module.widgetPrototypes, function(widgetPrototype) {
          return widgetPrototype.uid;
        });
        var widgetIndex = widgetPrototypeIDs.indexOf(widget.uid);
        if (widgetIndex < 0) {
          module.widgetPrototypes.push(widget);
        } else {
          module.widgetPrototypes[widgetIndex] = widget;
        }

        dashboard.save(function(err, result) {
          if (callback) {
            callback(err, result);
          } else {
            dashboard.events.onSaved(err, result);
          }
        });
      }

      widget = widget.loadForm();

      if (widget && widget.collection) {
        dashboard = widget.collection.dashboard;
      } else if (collection) {
        dashboard = collection.dashboard;
      } else if (widget && widget.dashboard) {
        dashboard = widget.dashboard;
      }

      if (widget.moduleId) {
        processSave(widget);
      } else {
        dashboard.getWidgetPrototypeById(widget.uid, function(widgetPrototype) {
          if (widgetPrototype) {
            processSave(widgetPrototype);
          } else {
            console.error('Widget prototype could not be found!');
          }
        });
      }
    },
    onResized: function(widget, event, ui) {
      widget.invalidate();
      widget.collection.dashboard.save(widget.collection.dashboard.events.onSaved);
    },
    onDragged: function(widget, event, ui) {
      if (widget.mainContainer) {
        widget.col = widget.mainContainer.attr('data-col');
        widget.row = widget.mainContainer.attr('data-row');
      } else {
        var mainContainer = $('#' + widget.id);
        widget.col = mainContainer.attr('data-col');
        widget.row = mainContainer.attr('data-row');
      }
      widget.collection.dashboard.save(widget.collection.dashboard.events.onSaved);
    }

  };
  /**
   * Gets "Create Widget" dialog page form values to create new widget
   * @return {*}
   */
  MWidget.prototype.loadForm = function() {
    var self = this;

    var headerText = $('.form-row .form-item .item-header').val();
    self.header = headerText || self.header;

    self.template = $('.form-row .form-item .item-template').val();

    self.row = $('.form-row .form-item .item-row').val();
    self.col = $('.form-row .form-item .item-col').val();
    self.xSize = $('.form-row .form-item .item-xsize').val();
    self.ySize = $('.form-row .form-item .item-ysize').val();
    self.serviceId = $('.form-row .form-item .item-serviceId').val();
    //self.contentType = $('.form-row .form-item .item-contentType').val();

    self.description = $('.form-row .form-item .item-description').val();

    return self;
  };
  /**
   * Creates "Create Widget" dialog page form values
   * @return {*|jQuery|HTMLElement}
   */
  MWidget.prototype.createForm = function(record) {
    var self = this,
        formContainer = $('<div class="widget-container"></div>'),
        rows = [],
        form = $('<form class="form"></form>');


    _.each(self, function(value, key) {
      var propertyRequired = false,
          formRow = $('<div class="form-row"></div>'),
          label = $('<div class="form-label"></div>'),
          item = $('<div class="form-item"></div>'),
          order = null,
          columnBreak = $('<div class="form-break"><span>&nbsp;:&nbsp;</span></div>');


      switch(key) {
        case 'uid':
          label.append($('<span>ID</span>'));
          item.append($('<span class="item-uid">' + (record ? record[key] : value) + '</span>'));
          propertyRequired = true;
          order = 1;
          break;
        case 'header':
          label.append($('<span>Header</span>'));
          item.append($('<input class="item-header text" type="text" required autofocus />')
            .val(record ? record[key] : self.header));
          propertyRequired = true;
          order = 2;
          break;
        case 'contentType':
          label.append($('<span>Widget Type</span>'));
          item.append($('<span class="item-contentType">' + (record ? record[key] : value) + '</span>'));
          propertyRequired = true;
          order = 3;
          break;
          /*
          var contentTypeSelect = $('<select class="item-contentType text"></select>');
          contentTypeSelect.append($('<option value="chart">Chart</option>'))
                           .append($('<option value="html">HTML</option>'));
          if (record) {
            contentTypeSelect.val(record[key]);
          } else {
            contentTypeSelect.val('html');
          }

          label.append($('<span>Content</span>'));
          item.append(contentTypeSelect);
          propertyRequired = true;
          order = 3;
          break;*/
        case 'template':
          // html
          label.append($('<span>Template</span>')).css({'vertical-align':'top', 'padding':'15px 0 0 0'});
          columnBreak.css({'vertical-align':'top', 'padding':'15px 0 0 0'});
          item.append($('<textarea class="item-template text" rows="5"></textarea>')
            .val(record ? record[key] : ''));

          propertyRequired = true;
          order = 5;
          break;
        case 'row':
          label.append($('<span>Row</span>'));
          item.append($('<input class="item-row text" type="number" required />')
            .val(record ? record[key] : '1'));
          propertyRequired = true;
          order = 6;
          break;
        case 'col':
          label.append($('<span>Column</span>'));
          item.append($('<input class="item-col text" type="number" required />')
            .val(record ? record[key] : '1'));
          propertyRequired = true;
          order = 7;
          break;
        case 'xSize':
          label.append($('<span>Width Size</span>'));
          item.append($('<input class="item-xsize text" type="number" required />')
            .val(record ? record[key] : '2'));
          propertyRequired = true;
          order = 8;
          break;
        case 'ySize':
          label.append($('<span>Height Size</span>'));
          item.append($('<input class="item-ysize text" type="number" required />')
            .val(record ? record[key] : '2'));
          propertyRequired = true;
          order = 9;
          break;
        case 'description':
          label.append($('<span>Description</span>')).css({'vertical-align':'top', 'padding':'15px 0 0 0'});
          columnBreak.css({'vertical-align':'top', 'padding':'15px 0 0 0'});
          item.append($('<textarea class="item-description text" rows="4"></textarea>')
            .val(record ? record[key] : ''));
          propertyRequired = true;
          order = 10;
          break;
        case 'serviceId':
          var service = null,
              dashboard = null,
              services = $('<select class="item-serviceId text"></select>')
                .append($('<option value="" selected>- Please select a data service -</option>'));

          if (self.collection) {
            dashboard = self.collection.dashboard;
          } else if (self.dashboard) {
            dashboard = self.dashboard;
          }

          if (self.serviceId) {
            service = dashboard.getServiceById(self.serviceId);
            if (service) {
              services.append($('<option value="' + service.uid + '" selected>' +
                (service.name || service.uid) + '</option>'));
            }
          } else if (self.moduleId) {
            service = dashboard.getServiceByModuleId(self.moduleId);
            if (service) {
              services.append($('<option value="' + service.uid + '">' +
                (service.name || service.uid) + '</option>'));
            }
          }
          label.append($('<span>Service</span>'));
          item.append(services);
          propertyRequired = true;
          order = 4;
          break;
      }

      if (propertyRequired) {
        rows[order] = {
          label: label,
          columnBreak: columnBreak,
          item: item
        };
      }
    });

    for (var count = 0; count < rows.length; count++) {
      var currentRowItem = rows[count],
          formRow = $('<div class="form-row"></div>');

      if (currentRowItem) {
        formRow
          .append(currentRowItem.label)
          .append(currentRowItem.columnBreak)
          .append(currentRowItem.item);

        form.append(formRow);
      }
    }

    formContainer.append(form).append($('<div id="connection-page-result-test"></div>'));

    return formContainer;
  };
  MWidget.prototype.serialize = function() {
    var self = this,
        serialized = {};

    serialized.mType = 'MWidget';

    serialized.contentType = self.contentType;
    serialized.description = self.description;
    serialized.template = self.template;
    serialized.name = self.name;
    serialized.header = self.header;
    serialized.height = self.height;
    serialized.id = self.id;
    serialized.isClosable = self.isClosable;
    serialized.isLocked = self.isLocked;
    serialized.isPrototype = self.isPrototype;
    serialized.moduleId = self.moduleId;
    serialized.order = self.order;
    serialized.settings = self.settings;
    serialized.uid = self.uid;
    serialized.width = self.width;
    serialized.xSize = self.xSize;
    serialized.ySize = self.ySize;
    serialized.col = self.col;
    serialized.row = self.row;
    // service
    serialized.serviceId = self.serviceId;

    if (self.contentType === 'html') {
      serialized.html = {};
    } else if (self.contentType === 'chart' && self.chart) {
      serialized.html = {};
      serialized.chart = self.chart.serialize();
    }

    return serialized;
  };
  MWidget.prototype.deserialize = function(data, owner) {
    var self = this;

    self.contentType = data.contentType;
    self.col = data.col;
    self.name = data.name;
    self.header = data.header;
    self.description = data.description;
    self.template = data.template;
    self.height = data.height;
    self.id = data.id;
    self.isClosable = data.isClosable;
    self.isLocked = data.isLocked;
    self.isPrototype = data.isPrototype;
    self.order = data.order;
    self.row = data.row;
    self.settings = data.settings;
    self.uid = data.uid;
    self.width = data.width;
    self.xSize = data.xSize;
    self.ySize = data.ySize;
    self.serviceId = data.serviceId;
    self.moduleId = data.moduleId;

    if (owner instanceof MDashboard) {
      self.collection = null;
      self.dashboard = owner;
    } else if (owner instanceof MWidgetCollection) {
      self.collection = owner;
      self.dashboard = null;
    }

    if (data.chart) {
      var newChart = new MChart(self);
      self.chart = newChart.deserialize(data.chart, self);
    }

    // TODO test
    //self.module = owner.dashboard.getModuleById(data.module);

    if (data.contentType === 'html') {
      self.html = {};
    } else if (data.contentType === 'chart') {
      self.html = {};
      var newChart = new MChart(self);
      self.chart = newChart.deserialize(data.chart, self);
    }

    return self;
  };

  /**
   * Chart item would be placed into widget
   * @param ownerWidget MWidget
   * @param _options
   * @returns {*}
   * @constructor
   */
  MChart = function (ownerWidget, _options) {
    this.uid = getUniqueId(globalUniqueIdLength);
    this.library = 'Highcharts'; // default
    this.widget = ownerWidget;
    this.type = 'column';
    this.isRendering = false;
    this.container = null;
    this.config = null;
    this.render = null;
    this.series = [];

    _.extend(this, _options);

    return this;
  };
  MChart.prototype.widget = typeof MWidget;
  MChart.prototype.serialize = function() {
    var self = this,
        serialized = {};

    serialized.mType = 'MChart';
    serialized.library = self.library;
    serialized.type = self.type;
    serialized.uid = self.uid;
    serialized.container = self.container;

    serialized.config = self.config ? JSON.stringify(self.config) : null;
    serialized.series = self.series && self.series.length > 0
      ? JSON.stringify(self.series) : null;

    if (self.render) {
      serialized.render = _.isFunction(self.render)
        ? self.render.toString()
        : JSON.stringify(self.render);
    }

    // parent widget
    serialized.widget = self.widget ? self.widget.uid : null;

    return serialized;
  };
  MChart.prototype.deserialize = function(data, owner) {
    var self = this;

    self.library = data.library;
    self.type = data.type;
    self.uid = data.uid;
    self.container = data.container;
    self.widget = owner;
    self.config = data.config ? $.parseJSON(data.config) : null;
    self.series = data.series ? $.parseJSON(data.series) : [];

    if (data.render) {
      if (/function/.test(data.render)) {
        self.render = getSource(data.render, ['widget', 'callback']);
      } else {
        self.render = $.parseJSON(data.render);
      }
    }

    return self;
  };
  MChart.prototype.renderDefault = function(container, data) {
    var self = this;

    function _renderHighcharts(container, data) {
      if (!self.type || !self.container || !self.config) {
        return;
      }

      self.isRendering = true;

      var chartOptions = $.extend(true, {}, self.config);

      chartOptions.chart = chartOptions.chart || {};
      chartOptions.chart.type = self.type;
      chartOptions.series = chartOptions.series || [];

      if (self.series && self.series.length > 0) {
        chartOptions.series = _.map(self.series, function(item) {
          var dataArray = data[item.serviceResultProperty];

          if (dataArray && _.isString(dataArray)) {
             dataArray = $.parseJSON(dataArray);
             if (dataArray && _.isObject(dataArray) && dataArray.Table) {
                dataArray = dataArray.Table;
             }
          }

          var serie = {
            name: item.serieName || item.serviceResultProperty,
            data: []
          };

          chartOptions.xAxis = chartOptions.xAxis || {};
          chartOptions.xAxis.categories = chartOptions.xAxis.categories || [];

          // Creating data series and xAxis categories
          switch(item.aggregateFunction) {
            case 'value':
              _.each(dataArray, function(dataItem, dataItemIndex) {
                serie.data.push(dataItem[item.valueField]);

                // Check xAxis array if we have value or not
                if (chartOptions.xAxis.categories.indexOf(dataItem[item.categoryField]) < 0) {
                  chartOptions.xAxis.categories.push(dataItem[item.categoryField]);
                }
              });
              return serie;

            case 'count':
              var countResult = _.reduce(
                _.map(dataArray, function(arrayItem) {
                    return { key: arrayItem[item.categoryField], value: 1 }
                }),
                function(memo, num) {
                    memo[num.key] = memo[num.key] || 0;
                    memo[num.key] += num.value;
                    return memo;
                }, {});

              _.each(countResult, function(dataItem, dataItemIndex) {
                serie.data.push(dataItem);

                // Check xAxis array if we have value or not
                if (chartOptions.xAxis.categories.indexOf(dataItemIndex) < 0) {
                  chartOptions.xAxis.categories.push(dataItemIndex);
                }
              });
              return serie;

            case 'sum':
              var sumResult = _.reduce(
                _.map(dataArray, function(arrayItem) {
                    return { key: arrayItem[item.categoryField], value: arrayItem[item.valueField] }
                }),
                function(memo, num) {
                    memo[num.key] = memo[num.key] || 0;
                    memo[num.key] += num.value;
                    return memo;
                }, {});

              _.each(sumResult, function(dataItem, dataItemIndex) {
                serie.data.push(dataItem);

                // Check xAxis array if we have value or not
                if (chartOptions.xAxis.categories.indexOf(dataItemIndex) < 0) {
                  chartOptions.xAxis.categories.push(dataItemIndex);
                }
              });
              return serie;

            case 'average':
              var averageResult = _.reduce(
                _.map(dataArray, function(arrayItem) {
                    return { key: arrayItem[item.categoryField], value: arrayItem[item.valueField] }
                }),
                function(memo, num) {
                    memo[num.key] = memo[num.key] || 0;
                    memo[num.key] += num.value;
                    return memo;
                }, {});

              var itemCount = dataArray.length;
              _.each(averageResult, function(dataItem, dataItemIndex) {
                serie.data.push((dataItem/itemCount).toFixed(2));

                // Check xAxis array if we have value or not
                if (chartOptions.xAxis.categories.indexOf(dataItemIndex) < 0) {
                  chartOptions.xAxis.categories.push(dataItemIndex);
                }
              });
              return serie;

            case 'min':
              var minResult = _.min(dataArray, function(arrayItem) {
                return arrayItem[item.valueField];
              });

              serie.data.push(minResult[item.valueField]);

              if (chartOptions.xAxis.categories.indexOf(minResult[item.categoryField]) < 0) {
                chartOptions.xAxis.categories.push(minResult[item.categoryField]);
              }
              return serie;

            case 'max':
              var maxResult = _.max(dataArray, function(arrayItem) {
                return arrayItem[item.valueField];
              });

              serie.data.push(maxResult[item.valueField]);

              if (chartOptions.xAxis.categories.indexOf(maxResult[item.categoryField]) < 0) {
                chartOptions.xAxis.categories.push(maxResult[item.categoryField]);
              }
              return serie;
          }

        });
      }

      if (chartOptions.xAxis && chartOptions.xAxis.labels && chartOptions.xAxis.labels.rotation) {
        chartOptions.xAxis.labels.rotation = Number(chartOptions.xAxis.labels.rotation);
      }

      var chartContainer = self.container;
      $(chartContainer, container).highcharts(chartOptions);
      /*
      if (self.config.renderTo) {
        delete self.config.renderTo;
      }*/

      self.isRendering = false;
    }


    switch (self.library) {
      case 'highcharts':
        if (_.isArray(data)) {
          _renderHighcharts(container, { result: data });
        } else {
          _renderHighcharts(container, data);
        }

        break;
    }
  };
  MChart.prototype.loadForm = function() {
    var self = this;

    var series = [];
    $('.param-serie-name').each(function() {
      var serie = {},
          paramNumber = $(this).attr('data-order');

      serie.serieName = $(this).val();
      serie.serviceResultProperty = $('.param-serie[data-order=' + paramNumber + ']').val();
      serie.categoryField = $('.param-category[data-order=' + paramNumber + ']').val();
      serie.aggregateFunction = $('.param-aggregate[data-order=' + paramNumber + ']').val();
      serie.valueField = $('.param-value-field[data-order=' + paramNumber + ']').val();
      series.push(serie);
    });

    self.series = series;
    self.library = $('.form-row .form-item .item-library').val();
    self.type = $('.form-row .form-item .item-type').val();
    self.container = $('.form-row .form-item .item-container').val();
    self.render = $('.form-row .form-item .item-render').val();

    var configValue = $('.form-row .form-item .item-config').val();
    if (configValue && configValue.length > 0) {
      self.config = $.parseJSON(configValue);
    }

    return self;
  };
  MChart.prototype.createForm = function(record) {
    var self = this,
        formContainer = $('<div class="chart-container"></div>'),
        rows = [],
        form = $('<form class="form"></form>');

    _.each(self, function(value, key) {
      var propertyRequired = false,
          formRow = $('<div class="form-row"></div>'),
          label = $('<div class="form-label"></div>'),
          item = $('<div class="form-item"></div>'),
          order = null,
          columnBreak = $('<div class="form-break"><span>&nbsp;:&nbsp;</span></div>');

      switch(key) {
        case 'uid':
          label.append($('<span>ID</span>'));
          item.append($('<span class="item-uid">' + (record ? record[key] : value) + '</span>'));
          propertyRequired = true;
          order = 1;
          break;
        case 'library':
          var librarySelect = $('<select class="item-library text"></select>');
          librarySelect.append($('<option value="">- Please Select Chart Library -</option>'))
                       .append($('<option value="google" disabled="disabled">Google Visualization Library</option>'))
                       .append($('<option value="highcharts">Highcharts</option>'))
                       .append($('<option value="d3" disabled="disabled">D3</option>'));

          if (record) {
            librarySelect.val(record[key]);
          }

          librarySelect.change(function() {
            var renderRow = $('.item-render').parents('.form-row');
            var configItem = $('.item-config');
            var typeItem = $('.item-type');

            if (librarySelect.val() === 'highcharts') {
              if (renderRow && renderRow.length > 0) {
                  renderRow.hide();
              }

              if (configItem && configItem.length > 0) {
                if (typeItem && typeItem.length > 0) {
                  var config = {
                    chart: {
                      type: typeItem.val()
                    },
                    credits: {
                      enabled: false
                    },
                    xAxis: {
                        labels: {
                            rotation: -90,
                            align: 'right',
                            style: {
                                fontSize: '10px',
                                fontFamily: 'Arial, sans-serif'
                            }
                        }
                    }
                  };
                  configItem.val(JSON.stringify(config, null, 2));
                }
              }
            } else {
              if (renderRow && renderRow.length > 0) {
                renderRow.show();
              }
            }
          });

          label.append($('<span>Library</span>'));
          item.append(librarySelect);
          propertyRequired = true;
          order = 2;
          break;
        case 'type':
          var chartTypeSelect = $('<select class="item-type text"></select>');
          chartTypeSelect.append($('<option value="bar" disabled="disabled">Bar</option>'))
                         .append($('<option value="column" selected>Column</option>'))
                         .append($('<option value="line" disabled="disabled">Line</option>'))
                         .append($('<option value="pie" disabled="disabled">Pie</option>'));

          if (record) {
            chartTypeSelect.val(record[key]);
          }
          label.append($('<span>Type</span>'));
          item.append(chartTypeSelect);
          propertyRequired = true;
          order = 3;
          break;
        case 'container':
          var containerSelector = $('<input class="item-container text" type="text" placeholder="chart container element css selector (eg: #chart)" /></input>');

          if (record) {
            containerSelector.val(record ? record[key] : '');
          }

          label.append($('<span>Container</span>'));
          item.append(containerSelector);
          propertyRequired = true;
          order = 4;
          break;
        case 'config':
          label.append($('<span>Configuration</span>')).css({'vertical-align':'top', 'padding':'15px 0 0 0'});
          columnBreak.css({'vertical-align':'top', 'padding':'15px 0 0 0'});
          item.append($('<textarea class="item-config text" rows="4" style="height:100px;"></textarea>')
            .val(record ? record[key] : ''));

          propertyRequired = true;
          order = 5;
          break;
        case 'render':
          label.append($('<span>Render</span>')).css({'vertical-align':'top', 'padding':'15px 0 0 0'});
          columnBreak.css({'vertical-align':'top', 'padding':'15px 0 0 0'});
          item.append($('<textarea class="item-render text" rows="4"></textarea>')
            .val(record ? record[key] : ''));

          propertyRequired = true;
          order = 6;
          break;
      }

      if (propertyRequired) {
        rows[order] = {
          label: label,
          columnBreak: columnBreak,
          item: item
        };
      }
    });

    for (var count = 0; count < rows.length; count++) {
      var currentRowItem = rows[count],
          formRow = $('<div class="form-row"></div>');

      if (currentRowItem) {
        formRow
          .append(currentRowItem.label)
          .append(currentRowItem.columnBreak)
          .append(currentRowItem.item);

        form.append(formRow);
      }
    }

    formContainer.append(form);

    return formContainer;
  };
  MChart.prototype.events = {
    onSave: function(chart) {
      var widget = chart.widget;
      widget.contentType = 'chart';

      var newChart = chart.loadForm();
      widget.chart = newChart;
      newChart.widget = widget;

      return newChart;
    }
  };

  /***********************   Management   **************************/

  /**
   *
   * @param _options Module options
   * @param hasForm Create html form output for input
   * @return {*}
   * @constructor
   */
  MModule = function(_options, module) {
    this.uid = getUniqueId(globalUniqueIdLength);
    this.name = 'MModule';
    this.image = null;
    this.icon = null;
    this.description = null;
    this.parent = module;
    this.modules = [];
    this.tags = [];
    this.service = null;
    this.dashboard = null;
    this.widgetPrototypes = [];
    this.params = [];

    //this.css = {};
    //this.class = null;
    //this.content = $('<img src="#" />');

    return this;
  };
  MModule.prototype.parent = typeof MModule;
  MModule.prototype.service = typeof MService;
  MModule.prototype.dashboard = typeof MDashboard;
  /**
   * Get form values to put into module
   * @param callback
   */
  MModule.prototype.loadForm = function(callback) {
    var self = this,
        message = null;

    self.name = $('.form-row .form-item .item-name').val();

    // split tags
    self.tags = _.map( $('.form-row .form-item .item-tags').val().split(','),
      function(item ,index) {
        return $.trim(item);
      });
    self.description = $('.form-row .form-item .item-description').val();

    $('.param-key').each(function() {
      var param = {},
          key = $(this).val();

      if (key) {
        var orderId = $(this).attr('data-order');
        param[key] = $('.param-value[data-order=' + orderId + ']').val();
        self.params.push(param);
      }
    });

    // get icon or image
    var item = $('ul.item-icons li.selected-icon');
    if (item && item.length > 0) {
      self.image = null;
      self.icon = item.attr('data-icon');
      callback(null, self);
    } else {
      var uploadControl = $('.item-image')[0];
        if (uploadControl.files
          && uploadControl.files[0]
          && /image/.test(uploadControl.files[0].type)) {
            if (uploadControl.files[0].size > 1000000) { // ~1MB
              message = 'Image file size should be less than 1MB';
              callback(message);
            } else {
              // read image file
              var reader = new FileReader();
              reader.onload = function(e, a) {
                self.image = e.target.result;
                self.icon = null;
                callback(null, self);
              };
              reader.readAsDataURL(uploadControl.files[0]);
            }
        } else {
          self.image = null;
          self.icon = 'fa-question-circle';
          callback(null, self);
        }
    }
  };
  /**
   * Creates module generation form fields
   * @return {*|jQuery|HTMLElement}
   */
  MModule.prototype.createForm = function() {
    var self = this,
        formContainer = $('<div class="module-container"></div>'),
        rows = [],
        order = null,
        orderOffset = 0,
        form = $('<form class="form"></form>');

    _.each(self, function(value, key) {
      var propertyRequired = false,
          formRow = $('<div class="form-row"></div>'),
          label = $('<div class="form-label"></div>'),
          item = $('<div class="form-item"></div>'),
          columnBreak = $('<div class="form-break"><span>&nbsp;:&nbsp;</span></div>');

      switch(key) {
        case 'parent':
          if (value && value.name) {
            label.append($('<span>Parent</span>'));
            item.append($('<span class="item-parent">' + value.name + '</span>'));
            propertyRequired = true;
            order = 1;
            orderOffset = 1;
          }
          break;
        case 'uid':
          label.append($('<span>ID</span>'));
          item.append($('<span class="item-uid">' + value + '</span>'));
          propertyRequired = true;
          order = 1 + orderOffset;
          break;
        case 'name':
          label.append($('<span>Name</span>'));
          item.append($('<input class="item-name text" type="text" required autofocus />'));
          propertyRequired = true;
          order = 2 + orderOffset;
          break;
        case 'tags':
          label.append($('<span>Tags</span>'));
          item.append($('<input class="item-tags text" type="text" />'));
          propertyRequired = true;
          order = 3 + orderOffset;
          break;
        case 'description':
          label.append($('<span>Description</span>')).css({'vertical-align':'top', 'padding':'15px 0 0 0'});
          columnBreak.css({'vertical-align':'top', 'padding':'15px 0 0 0'});
          item.append($('<textarea class="item-description text" rows="3"></textarea>'));
          propertyRequired = true;
          order = 4 + orderOffset;
          break;
        case 'image':
          label.append($('<span>Image</span>'));
          item.append($('<input class="item-image text" type="file" />'));
          propertyRequired = true;
          order = 5 + orderOffset;
          break;
        case 'icon':
          label.append($('<span>Icon</span>')).css({'vertical-align':'top', 'padding':'15px 0 0 0'});
          columnBreak.css({'vertical-align':'top', 'padding':'15px 0 0 0'});
          var itemIcons = $('<ul class="item-icons text"></ul>');
          _.each(faIcons, function(faIcon, index) {
            var listItem = $('<li class="item-icon" data-icon="' + faIcon + '"></li>');
            listItem.append($('<i class="fa fa-2x fa-white ' + faIcon + '"></i>'));
            itemIcons.append(listItem);
          });
          item.append(itemIcons);
          propertyRequired = true;
          order = 6 + orderOffset;
          break;
      }

      if (propertyRequired) {
        rows[order] = {
          label: label,
          columnBreak: columnBreak,
          item: item
        };
      }
    });

    for (var count = 0; count < rows.length; count++) {
      var currentRowItem = rows[count],
          formRow = $('<div class="form-row"></div>');

      if (currentRowItem) {
        formRow
          .append(currentRowItem.label)
          .append(currentRowItem.columnBreak)
          .append(currentRowItem.item);

        form.append(formRow);
      }
    }

    formContainer.append(form);

    return formContainer;
  };
  MModule.prototype.events = {
    onSave: function (module, callback) {
      module.loadForm(function(err, result) {
        if (err) {
          console.error(err);
        } else {
          if (result) {
            // if we have this module replace it otherwise push
            var replaced = result.dashboard.replaceModule(module);
            if (!replaced) {
              if (module.parent) { // put child module under it's parent module
                module.parent.modules.push(module);
              } else { // it is top module
                result.dashboard.modules.push(module);
              }
            }
            result.dashboard.save(function(err, result) {
              if (callback) {
                callback(err, result);
              }
            });
          } else {
            console.error('Could not load module form values');
          }
        }
      });
    }
  };
  MModule.prototype.serialize = function() {
    var self = this,
        serialized = {};

    serialized.mType = 'MModule';
    serialized.uid = self.uid;
    serialized.name = self.name;
    serialized.image = self.image;
    serialized.icon = self.icon;
    serialized.description = self.description;
    serialized.tags = self.tags;
    serialized.params = self.params;

    // parent module
    serialized.parent = self.parent ? self.parent.uid : null;

    // parent dashboard
    serialized.dashboard = self.dashboard ? self.dashboard.uid : null;

    // service
    serialized.service = self.service ? self.service.serialize() : null;

    // modules
    serialized.modules = _.map(self.modules, function(module, index) {
      return module.serialize();
    });

    // widgets
    serialized.widgetPrototypes = _.map(self.widgetPrototypes, function(widget, index) {
      return widget.serialize();
    });

    return serialized;
  };
  MModule.prototype.deserialize = function(data, owner) {
    var self = this;

    self.uid = data.uid;
    self.name = data.name;
    self.image = data.image;
    self.icon = data.icon;
    self.description = data.description;
    self.tags = data.tags;
    self.widgetPrototypes = data.widgetPrototypes;
    self.params = data.params;

    //self.dashboard = dashboard;

    if (data.service) {
      var newService = new MService();
      self.service = newService.deserialize(data.service, self);
    }

    if (owner instanceof MDashboard) {
      self.parent = null;
      self.dashboard = owner;
    } else if (owner instanceof MModule) {
      self.parent = owner;
      self.dashboard = owner.dashboard;
    }

    if (data.modules && data.modules.length > 0) {
      self.modules = _.map(data.modules, function(moduleData, index) {
        var newModule = new MModule();
        return newModule.deserialize(moduleData, self);
      });
    }

    if (data.widgetPrototypes && data.widgetPrototypes.length > 0) {
      self.widgetPrototypes = _.map(data.widgetPrototypes, function(widgetData, index) {
        var newWidget = new MWidget(self.dashboard);
        return newWidget.deserialize(widgetData, self.dashboard);
      });
    }

    return self;
  };

  /**
   * Data services for widgets and charts
   * @param ownerDashboard
   * @param _options service options
   * @param _ajaxOptions $.ajax options
   * @return self
   * @constructor
   */
  MService = function (owner, _options, _ajaxOptions) {
    var self = this;

    this.uid = getUniqueId(globalUniqueIdLength);
    this.name = 'MService';
    this.schedule = null; // https://raw.github.com/erhangundogan/MDashboard/master/cron.md
    this.image = null;
    this.icon = null;
    this.description = null;
    this.methods = [];
    this.isInitialized = false;
    this.isScheduled = false;
    this.module = null;
    this.params = [];

    if (owner) {
      owner.service = self;
    }

    _.extend(this, _options);

    this.ajaxOptions = {
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      data: {},
      dataType: 'json',
      processData: true,
      timeout: 20000, // 20sn
      type: 'GET',
      url: '',
      jsonp: 'callback',
      jsonpCallback: 'jsonpCallback',
      crossDomain: false
      //cache: false,
      //username: '',
      //async: true,
      //global: true,
      //headers: {},
      //ifModified: false,
      //password: ''
    };
    _.extend(this.ajaxOptions, _ajaxOptions);

    return self;
  };
  MService.prototype.dashboard = typeof MDashboard;
  /**
   * Serialization
   */
  MService.prototype.serialize = function() {
    var self = this,
        serialized = {};

    serialized.mType = 'MService';
    serialized.uid = self.uid;
    serialized.name = self.name;
    serialized.description = self.description;
    serialized.schedule = self.schedule;
    serialized.isScheduled = self.isScheduled;
    serialized.image = self.image;
    serialized.icon = self.icon;
    serialized.ajaxOptions = self.ajaxOptions;
    serialized.params = self.params;

    // parent module
    serialized.module = self.module ? self.module.uid : null;

    return serialized;
  };
  MService.prototype.deserialize = function(data, owner) {
    var self = this;

    self.uid = data.uid;
    self.name = data.name;
    self.description = data.description;
    self.schedule = data.schedule;
    self.isScheduled = data.isScheduled;
    self.image = data.image;
    self.icon = data.icon;
    self.ajaxOptions = data.ajaxOptions;
    self.params = data.params;
    self.module = owner;

    return self;
  };
  MService.prototype.getData = function(callback) {
    var self = this;

    self.begin(function(err, data) {
      if (err) {
        console.error(err);
        callback(err);
      } else {
        self.data = data;
        callback(null, data);
      }
    });
  };
  /**
   * Here we go to get it
   * @param _params service parameters
   */
  MService.prototype.begin = function (callback) {
    var self = this;

    function callMeMaybe() {
      var request = $.ajax(self.ajaxOptions);

      request.done(function (data, status, request) {
        callback(null, data);
      });

      request.fail(function (request, status, error) {
        callback(error);
      });

    }

    if (self.schedule) {
      // http://bunkat.github.io/later/parsers.html#cron
      var cronSchedule = later.parse.cron(self.schedule),
        schedule = later.schedule();

      // http://bunkat.github.io/later/execute.html#set-interval
      self.scheduled = later.setInterval(callMeMaybe, schedule);
    } else {
      callMeMaybe();
    }
  };
  /**
   * Get connection form values to put into service ajax properties
   * @param callback
   */
  MService.prototype.loadConnectionForm = function() {
    var self = this;

    /*
    var dataValue = $('.form-row .form-item .item-data').val();
    self.ajaxOptions.data = dataValue ? $.parseJSON(dataValue) : {};
    */

    var param = {};
    $('.param-key').each(function() {
      var key = $(this).val();

      if (key) {
          var orderId = $(this).attr('data-order'),
              value = $('.param-value[data-order=' + orderId + ']').val();

        if (value) {
          param[key] = value; //$.parseJSON(value);
        } else {
          param[key] = '';
        }
      }
    });

    self.ajaxOptions.data = param;

    self.ajaxOptions.contentType    = $('.form-row .form-item .item-contentType').val();
    self.ajaxOptions.url            = $('.form-row .form-item .item-url').val();
    self.ajaxOptions.type           = $('.form-row .form-item .item-type').val();
    self.ajaxOptions.dataType       = $('.form-row .form-item .item-dataType').val();
    self.ajaxOptions.jsonp          = $('.form-row .form-item .item-jsonp').val();
    self.ajaxOptions.jsonpCallback  = $('.form-row .form-item .item-jsonpCallback').val();
    self.ajaxOptions.processData    = $('.form-row .form-item .item-processData').prop('checked');
    self.ajaxOptions.crossDomain    = $('.form-row .form-item .item-crossDomain').prop('checked');

    //self.ajaxOptions.cache        = $('.form-row .form-item .item-cache').prop('checked');
    //self.ajaxOptions.async        = $('.form-row .form-item .item-async').prop('checked');
    //self.ajaxOptions.global       = $('.form-row .form-item .item-global').prop('checked');
    //self.ajaxOptions.ifModified   = $('.form-row .form-item .item-ifModified').prop('checked');

    var timeoutValue = $('.form-row .form-item .item-timeout').val();
    self.ajaxOptions.timeout = timeoutValue ? parseInt(timeoutValue) : 30000;

    //var headersValue = $('.form-row .form-item .item-headers').val();
    //self.ajaxOptions.headers = headersValue ? $.parseJSON(headersValue) : {};

    return self;
  };
  MService.prototype.createConnectionForm = function(collection, service, record) {
    var formContainer = $('<div class="service-ajax-container"></div>'),
        rows = [],
        form = $('<form class="form"></form>');

    _.each(service.ajaxOptions, function(value, key) {
      var propertyRequired = false,
          order = null,
          label = $('<div class="form-label"></div>'),
          item = $('<div class="form-item"></div>'),
          columnBreak = $('<div class="form-break"><span>&nbsp;:&nbsp;</span></div>');

      switch(key) {
        case 'url':
          label.append($('<span>Url</span>'));
          item.append(
            $('<input class="item-url text" type="text" required placeholder="http://yourdomain.com/service" />')
              .val(record && record.url ? record.url : '')
          );
          propertyRequired = true;
          order = 1;
          break;
        case 'dataType':
          label.append($('<span>Data Type</span>'));
          var dataTypes = $('<select class="item-dataType text"></select>')
            .append($('<option value="xml">XML</option>'))
            .append($('<option value="html">HTML</option>'))
            .append($('<option value="script">Script</option>'))
            .append($('<option value="json" selected>JSON</option>'))
            .append($('<option value="jsonp">JSONP</option>'))
            .append($('<option value="text">Text</option>'));
          item.append(dataTypes);
          if (record && record.dataType) {
            dataTypes.val(record.dataType);
          }
          propertyRequired = true;
          order = 4;
          break;
        case 'type':
          label.append($('<span>Method</span>'));
          var types = $('<select class="item-type text"></select>')
            .append($('<option value="GET" selected>GET</option>'))
            .append($('<option value="POST">POST</option>'));
          item.append(types);
          if (record && record.type) {
            types.val(record.type);
          }
          propertyRequired = true;
          order = 2;
          break;
        case 'processData':
          label.append($('<span>Process Data</span>'));

          var processData = $('<input class="item-processData text" type="checkbox" />');

          if (record) {
            processData.prop('checked', (record && record.processData) ? true : false);
          } else {
            processData.prop('checked', true);
          }
          item.append(processData);
          propertyRequired = true;
          order = 9;
          break;
        case 'contentType':
          label.append($('<span>Content Type</span>'));
          item.append($('<input class="item-contentType text" type="text" placeholder="application/x-www-form-urlencoded; charset=UTF-8" />')
            .val(record && record.contentType ? record.contentType : 'application/x-www-form-urlencoded; charset=UTF-8'));
          propertyRequired = true;
          order = 3;
          break;
        case 'timeout':
          label.append($('<span>Timeout</span>'));
          item.append($('<input class="item-timeout text" type="text" placeholder="20000 (20 seconds)" />')
            .val(record && record.timeout ? record.timeout : 20000));
          propertyRequired = true;
          order = 5;
          break;
        case 'jsonp':
          label.append($('<span>jsonp</span>'));
          item.append($('<input class="item-jsonp text" type="text" />')
            .val(record && record.jsonp ? record.jsonp : 'callback'));
          propertyRequired = true;
          order = 6;
          break;
        case 'jsonpCallback':
          label.append($('<span>jsonpCallback</span>'));
          item.append($('<input class="item-jsonpCallback text" type="text" />')
            .val(record && record.jsonpCallback ? record.jsonpCallback : 'jsonpCallback'));
          propertyRequired = true;
          order = 7;
          break;
        case 'crossDomain':
          label.append($('<span>Cross domain</span>'));

          var crossDomain = $('<input class="item-crossDomain text" type="checkbox" />');

          if (record) {
            crossDomain.prop('checked', (record && record.crossDomain) ? true : false);
          } else {
            crossDomain.prop('checked', true);
          }
          item.append(crossDomain);
          propertyRequired = true;
          order = 8;
          break;
        /*case 'crossDomain':
          label.append($('<span>Cross Domain</span>'));
          item.append($('<input class="item-crossDomain text" type="checkbox" />')
            .prop('checked', (record && record.crossDomain ? true : false)));
          propertyRequired = true;
          order = 7;
          break;

        case 'async':
          label.append($('<span>Asynchronous</span>'));
          item.append($('<input class="item-async text" type="checkbox" checked="checked" />')
            .prop('checked', (record && record.async ? true : false)));
          propertyRequired = true;
          order = 6;
          break;
        case 'cache':
          label.append($('<span>Cache Results</span>'));
          item.append($('<input class="item-cache text" type="checkbox" checked="checked" />')
            .prop('checked', (record && record.cache ? true : false)));
          propertyRequired = true;
          order = 7;
          break;
        case 'global':
          label.append($('<span>Global</span>'));
          item.append($('<input class="item-global" type="checkbox" checked="checked" />')
            .prop('checked', (record && record.global ? true : false)));
          propertyRequired = true;
          order = 9;
          break;
        case 'ifModified':
          label.append($('<span>If Modified</span>'));
          item.append($('<input class="item-ifModified text" type="checkbox" />')
            .prop('checked', (record && record.ifModified ? true : false)));
          propertyRequired = true;
          order = 10;
          break;
        case 'headers':
          label.append($('<span>Headers</span>')).css({'vertical-align':'top', 'padding':'15px 0 0 0'});
          columnBreak.css({'vertical-align':'top', 'padding':'15px 0 0 0'});
          item.append($('<textarea rows="2" class="item-headers text" type="text" placeholder="{ \'User-Agent\':\'foo\', \'Accept\':\'text/html\', ... }"></textarea>')
            .val(record && record.headers ? record.header : ''));
          propertyRequired = true;
          order = 13;
          break;*/
      }

      if (propertyRequired) {
        rows[order] = {
          label: label,
          columnBreak: columnBreak,
          item: item
        };
      }
    });

    for (var count = 0; count < rows.length; count++) {
      var currentRowItem = rows[count],
          formRow = $('<div class="form-row"></div>');

      if (currentRowItem) {
        formRow
          .append(currentRowItem.label)
          .append(currentRowItem.columnBreak)
          .append(currentRowItem.item);

        form.append(formRow);
      }
    }

    formContainer.append(form).append($('<div id="connection-page-result-test"></div>'));

    return formContainer;
  };
  /**
   * Get form values to put into service properties
   * @param callback
   */
  MService.prototype.loadForm = function(callback) {
    var self = this,
        message = null;

    self.name = $('.form-row .form-item .item-name').val();
    self.description = $('.form-row .form-item .item-description').val();
    self.schedule = $('.form-row .form-item .item-schedule').val();
    self.isScheduled = $('.form-row .form-item .item-scheduled').prop('checked');

    $('.param-key').each(function() {
      var param = {},
          key = $(this).val();

      if (key) {
        var orderId = $(this).attr('data-order');
        param[key] = $('.param-value[data-order=' + orderId + ']').val();
        self.params.push(param);
      }
    });

    // get icon or image
    var item = $('ul.item-icons li.selected-icon');
    if (item && item.length > 0) {
      self.image = null;
      self.icon = item.attr('data-icon');
      callback(null, self);
    } else {
      var uploadControl = $('.item-image')[0];
      if (uploadControl.files && uploadControl.files[0] && /image/.test(uploadControl.files[0].type)) {
        if (uploadControl.files[0].size > 1000000) { // ~1MB
          message = 'Image file size should be less than 1MB';
          callback(message);
        } else {
          // read image file
          var reader = new FileReader();
          reader.onload = function(e) {
            self.image = e.target.result;
            self.icon = null;
            callback(null, self);
          };
          reader.readAsDataURL(uploadControl.files[0]);
        }
      } else {
        var updateImage = $('.dialog-image-container img');
        if (updateImage.length > 0) {
          self.image = $(updateImage).attr('src');
          self.icon = null;
        } else {
          self.image = null;
          self.icon = 'fa-question-circle';
        }
        callback(null, self);
      }
    }
  };
  MService.prototype.createForm = function(record) {
    var self = this,
        formContainer = $('<div class="service-container"></div>'),
        rows = [],
        form = $('<form class="form"></form>');

    _.each(self, function(value, key) {
      var propertyRequired = false,
          order = null,
          label = $('<div class="form-label"></div>'),
          item = $('<div class="form-item"></div>'),
          columnBreak = $('<div class="form-break"><span>&nbsp;:&nbsp;</span></div>');

      switch(key) {
        case 'uid':
          label.append($('<span>ID</span>'));
          item.append($('<span class="item-uid">' + (record ? record[key] : value) + '</span>'));
          propertyRequired = true;
          order = 2;
          break;
        case 'description':
          label.append($('<span>Description</span>')).css({'vertical-align':'top', 'padding':'15px 0 0 0'});
          columnBreak.css({'vertical-align':'top', 'padding':'15px 0 0 0'});
          item.append($('<textarea class="item-description text" rows="2"></textarea>')
            .val(record ? record[key] : self.description));
          propertyRequired = true;
          order = 4;
          break;
        case 'name':
          label.append($('<span>Name</span>'));
          item.append($('<input class="item-name text" type="text" required autofocus />')
            .val(record ? record[key] : self.name));
          propertyRequired = true;
          order = 3;
          break;
        case 'schedule':
          label.append($('<span>Schedule</span>'));
          item.append($('<input class="item-schedule text" type="text" placeholder="*/5 * * * * (eg. every 5 minute, cron string)" />')
            .val(record ? record[key] : self.schedule));
          propertyRequired = true;
          order = 5;
          break;
        case 'isScheduled':
          label.append($('<span>Scheduled</span>'));
          if (record && record.isScheduled) {
            item.append($('<input class="item-scheduled text" type="checkbox" />').prop('checked', true));
          } else {
            item.append($('<input class="item-scheduled text" type="checkbox" />'));
          }
          propertyRequired = true;
          order = 6;
          break;
        case 'module':
          label.append($('<span>Module</span>'));
          item.append($('<span class="item-module text">' + (value.name ? value.name : '') + '</span>')
            .val(record ? record[key] : ''));
          propertyRequired = true;
          order = 1;
          break;
        case 'image':
          label.append($('<span>Image</span>'));
          item.append($('<input class="item-image text" type="file" />'));
          if (record && record.image) {
            item.append($('<div class="dialog-image-container"></div>').append($('<img />').attr('src', record.image)));
          }
          propertyRequired = true;
          order = 7;
          break;
        case 'icon':
          label.append($('<span>Icon</span>')).css({'vertical-align':'top', 'padding':'15px 0 0 0'});
          columnBreak.css({'vertical-align':'top', 'padding':'15px 0 0 0'});
          var itemIcons = $('<ul class="item-icons text"></ul>');
          if (record && record.icon) {
            _.each(faIcons, function(faIcon, index) {
              var listItem = null;
              if (record.icon === faIcon) {
                listItem = $('<li class="item-icon selected-icon" data-icon="' + faIcon + '"></li>');
              } else {
                listItem = $('<li class="item-icon" data-icon="' + faIcon + '"></li>');
              }
              listItem.append($('<i class="fa fa-2x fa-white ' + faIcon + '"></i>'));
              itemIcons.append(listItem);
            });
          } else {
            _.each(faIcons, function(faIcon, index) {
              var listItem = $('<li class="item-icon" data-icon="' + faIcon + '"></li>');
              listItem.append($('<i class="fa fa-2x fa-white ' + faIcon + '"></i>'));
              itemIcons.append(listItem);
            });
          }
          item.append(itemIcons);
          propertyRequired = true;
          order = 8;
          break;
      }

      if (propertyRequired) {
        rows[order] = {
          label: label,
          columnBreak: columnBreak,
          item: item
        };
      }
    });

    for (var count = 0; count < rows.length; count++) {
      var currentRowItem = rows[count],
          formRow = $('<div class="form-row"></div>');

      if (currentRowItem) {
        formRow
          .append(currentRowItem.label)
          .append(currentRowItem.columnBreak)
          .append(currentRowItem.item);

        form.append(formRow);
      }
    }

    formContainer.append(form);

    return formContainer;
  };
  MService.prototype.events = {
    onSave: function (service, callback) {
      service.loadForm(function(err, result) {
        if (err) {
          console.error(err);
        } else {
          if (result) {
            result.module.service = service;
            result.module.dashboard.save(function(err, result) {
              if (callback) {
                callback(err, result);
              } else {
                result.module.dashboard.events.onSaved(err, result);
              }
            });
          } else {
            console.error('Could not load form values');
          }
        }
      });
    },
    onConnectionSave: function (service) {
      return service.loadConnectionForm();
    },
    onConnectionTest: function (service, noLoadForm) {
      // service must be saved
      service = service.loadConnectionForm();
      // empty result section
      var resultContainer = $('#connection-page-result-test');
      // clear container
      resultContainer.empty().removeClass('error').removeClass('success');

      service.begin(function (error, data) {
        if (error) {
          $('.dialog').prop('disabled', false).removeClass('passive-dialog loading');

          var resultMessage = $('<div></div>').addClass('error').append('Service request failed.');
          var dataMessage = $('<div></div>').append(error);
          resultContainer.append(resultMessage).append('<hr/>').append(dataMessage);
        } else {
          $('.dialog').prop('disabled', false).removeClass('passive-dialog loading');

          if (data) {
            var resultMessage = $('<div></div>').addClass('succeeded').append('Service request successful.'),
                dataMessage = $('<textarea class="dialog-json-textarea"></textarea>').val(JSON.stringify(data, null, 2));

            resultContainer.append(resultMessage).append('<hr/>').append(dataMessage);

          } else {
            var resultMessage = $('<div></div>').addClass('succeeded').append('Service request successful. But no result returned.');
            resultContainer.append(resultMessage);
          }
        }
      });
    }
  };

  /**
   * Creates modal dialogs any kind of usage
   * @param _options {Object} MDialog custom options
   * @param owner {MWidgetCollection} Owner widget collection
   * @returns {*}
   * @constructor
   */
  MDialog = function(_options, owner) {
    var self = this;
    this.uid = getUniqueId(globalUniqueIdLength);
    this.name = 'MDialog';
    this.dashboard = null;
    this.activePage = null;
    this.orchestrator = null;
    this.container = null;
    this.pages = [];

    _.extend(this, _options);

    if (owner) {
      if (owner instanceof MWidgetCollection) {
        self.dashboard = owner.dashboard;
      }
    }

    return this;
  };
  /**
   * Creates dialog page and adds it to dialog pages
   * @param dialogPage {MDialogPage} New dialog page
   * @param isReplace {bool} If true new page will be prelaced with old one. Default: true
   */
  MDialog.prototype.createPage = function(dialogPage, isReplace) {
    var self = this,
        found = false;

    if (isReplace === undefined) {
      _.each(self.pages, function(page, index) {
         if (page.name === dialogPage.name) {
           self.pages[index] = dialogPage;
           found = true;
         }
      });

      if (!found) {
        self.pages.push(dialogPage);
      }

    } else {
      self.pages.push(dialogPage);
    }
  };
  /**
   * Dailog events
   * @type {Object}
   */
  MDialog.prototype.events = {
    onDialogReady: function(dialog) {
      // this event fires when the first time dialog showes up
      dialog.dashboard.activeDialog = dialog;
      dialog.orchestrator.setBreadcrumb();
      dialog.orchestrator.setSwiperItemsVisible(dialog);
    },
    onPageReady: function(dialogPage) {
      switch(dialogPage.name) {
        case 'module|edit':
        case 'service|edit':
          // icon choice section
          $('ul.item-icons').off().on('click', 'li', function(event) {
            // remove old selected
            var item = $('ul.item-icons li.selected-icon');
            if (item && item.length > 0) {
              item.removeClass('selected-icon');
            }

            // add new selected icon
            if (event.currentTarget !== item[0]) {
              $(event.currentTarget).addClass('selected-icon');
            }
          });
          break;

        case 'module|main':
          // if we have swiper component on main page, we must refresh it
          var orchestrator = dialogPage.dialog.orchestrator;
          if (orchestrator) {
            orchestrator.setBreadcrumb(orchestrator.selected);
            dialogPage.dialog.unblock();
          }
          break;
      }
      // when dialog page changed
    },
    onDialogClosed: function(dialog) {
      dialog.dealloc();
    }
  };

  MDialog.prototype.hasPage = function(identifier) {
    var self = this;

    if (identifier && _.isString(identifier)) {
      if (self.pages && self.pages.length > 0) {
        return _.find(self.pages, function(page) {
          return page.name === identifier;
        });
      }
    }
  }
  /**
   * Show dialog page with pageNumber or DialogPage.name
   * @param identifier pageNumber or DialogPage.name
   * @param animationType 'slideUpDown'
   * @return {*}
   */
  MDialog.prototype.getPage = function(identifier, animationType) {
    var self = this;

    if (identifier && _.isNumber(identifier)) {
      if (self.pages && self.pages.length > identifier) {
        selectedPage = self.pages[index];
        selectedPage.dialog.activePage = selectedPage;
        return selectedPage.build(animationType);
      } else {
        return null;
      }
    } else if (identifier && _.isString(identifier)) {
      if (self.pages && self.pages.length > 0) {
        var selectedPage = _.find(self.pages, function(page) {
          return page.name === identifier;
        });

        if (selectedPage) {
          selectedPage.dialog.activePage = selectedPage;
          return selectedPage.build(animationType);
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
  };
  MDialog.prototype.block = function() {
    var self = this,
        existingDialog = $('.dialog');

    if (existingDialog && existingDialog.length > 0) {
      existingDialog
        .prop('disabled', true)
        .addClass('passive-dialog')
        .addClass('loading');
    }
  };
  MDialog.prototype.unblock = function() {
    var self = this,
        existingDialog = $('.dialog');

    if (existingDialog && existingDialog.length > 0) {
      existingDialog
        .prop('disabled', false)
        .removeClass('passive-dialog')
        .removeClass('loading');
    }
  };
  MDialog.prototype.close = function() {
    this.unblock();
    $.boxer("destroy");
    this.events.onDialogClosed(this);
  };
  MDialog.prototype.activateScroller = function() {

    /* DOM-based rendering (Uses 3D when available,
       falls back on margin when transform not available) */
    var render = (function(global) {
      var docStyle = document.documentElement.style;

      var engine;
      if (global.opera && Object.prototype.toString.call(opera) === '[object Opera]') {
        engine = 'presto';
      } else if ('MozAppearance' in docStyle) {
        engine = 'gecko';
      } else if ('WebkitAppearance' in docStyle) {
        engine = 'webkit';
      } else if (typeof navigator.cpuClass === 'string') {
        engine = 'trident';
      }

      var vendorPrefix = {
        trident: 'ms',
        gecko: 'Moz',
        webkit: 'Webkit',
        presto: 'O'
      }[engine];

      var helperElem = document.createElement("div");
      var undef;

      var perspectiveProperty = vendorPrefix + "Perspective";
      var transformProperty = vendorPrefix + "Transform";

      if (helperElem.style[perspectiveProperty] !== undef) {
        return function(left, top, zoom) {
          content.style[transformProperty] = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + zoom + ')';
        };
      } else if (helperElem.style[transformProperty] !== undef) {
        return function(left, top, zoom) {
          content.style[transformProperty] = 'translate(' + (-left) + 'px,' + (-top) + 'px) scale(' + zoom + ')';
        };
      } else {
        return function(left, top, zoom) {
          content.style.marginLeft = left ? (-left/zoom) + 'px' : '';
          content.style.marginTop = top ? (-top/zoom) + 'px' : '';
          content.style.zoom = zoom || '';
        };
      }
    })(this);

    var container = document.getElementById("scroller-container"),
        content = document.getElementById("scroller-content"),
        panel = document.getElementById("scroller-panel"),
        self = this;

    // Content Generator
    var sizeX = 200,
        sizeY = 177;

    var frag = document.createDocumentFragment();
    for (var row = 0, rl = content.clientHeight/sizeY; row < rl; row++) {
      for (var cell = 0, cl = content.clientWidth/sizeX; cell < cl; cell++) {
        var elem = document.createElement("div");
        elem.className = "scroller-cell";
        elem.innerHTML = '&nbsp;';
        frag.appendChild(elem);
      }
    }
    content.appendChild(frag);


    if (self.dashboard && self.dashboard.orchestrator) {
      self.dashboard.orchestrator.dialog = self;
      self.dashboard.orchestrator.renderScroller(panel);
    }

    // Initialize Scroller
    var scroller = new Scroller(render, {
      snapping: true
    });

    // Setup Scroller
    var rect = container.getBoundingClientRect();

    scroller.setPosition(rect.left+container.clientLeft, rect.top+container.clientTop);
    scroller.setDimensions(container.clientWidth, container.clientHeight, content.offsetWidth, content.offsetHeight);
    scroller.setSnapSize(100, 100);

    // Event Handler
    if ('ontouchstart' in window) {
      if (!!container.touchstart) {
        container.addEventListener("touchstart", function(e) {
        // Don't react if initial down happens on a form element
          if (e.target.tagName.match(/input|textarea|select/i)) {
            return;
          }

          scroller.doTouchStart(e.touches, e.timeStamp);
          e.preventDefault();
        }, false);
      }

      document.addEventListener("touchmove", function(e) {
        scroller.doTouchMove(e.touches, e.timeStamp);
      }, false);

      document.addEventListener("touchend", function(e) {
        scroller.doTouchEnd(e.timeStamp);
      }, false);

    } else {
      var mousedown = false;

      container.addEventListener("mousedown", function(e) {
        // Don't react if initial down happens on a form element
        if (e.target.tagName.match(/input|textarea|select/i)) {
          return;
        }

        scroller.doTouchStart([{
          pageX: e.pageX,
          pageY: e.pageY
        }], e.timeStamp);

        mousedown = true;
      }, false);

      document.addEventListener("mousemove", function(e) {
        if (!mousedown) {
          return;
        }

        scroller.doTouchMove([{
          pageX: e.pageX,
          pageY: e.pageY
        }], e.timeStamp);

        mousedown = true;
      }, false);

      document.addEventListener("mouseup", function(e) {
        if (!mousedown) {
          return;
        }

        scroller.doTouchEnd(e.timeStamp);
        mousedown = false;
      }, false);
    }
  };
  MDialog.prototype.activateSwiper = function(_options) {

    var self = this;

    // idangerous.swiper-2.4.2.js line 122
    var defaults = {
      slidesPerView: 2,
      centeredSlides: true,
      watchActiveIndex: false,
      grabCursor: true,
      loop: false,
      preventLinks : false,
      preventLinksPropagation: false,
      initialSlide: 0,
      autoResize : true,
      resizeReInit : true,
      visibilityFullFit : false,
      onSlideClick: function(swiperItem) {
        self.dashboard.orchestrator.events.onSlideClick(self.dashboard.orchestrator, swiperItem);
      }
    };

    _.extend(defaults, _options);

    var swiper = $('.swiper-container').swiper(defaults);

    $('.swiper-container')
      .append($('<div class="left"></div>').click( function() { swiper.swipePrev() }))
      .append($('<div class="right"></div>').click( function() { swiper.swipeNext() }));
      //.append($('<div class="top hide"></div>').click( function() { swiper.swipePrev() }))
      //.append($('<div class="bottom hide"></div>').click( function() { swiper.swipeNext() }));

    if (self.dashboard && self.dashboard.orchestrator) {
      self.dashboard.orchestrator.swiper = swiper;
      self.dashboard.orchestrator.dialog = self;
      self.dashboard.orchestrator.renderSwiper(swiper, defaults);
    }
  };
  MDialog.prototype.dealloc = function() {
    var self = this;

    self.dashboard.activeDialog = null;

    // frees scroller events
    if (self.dashboard) {

      if (self.dashboard.orchestrator) {
        self.dashboard.orchestrator.selected = null;

        if (self.dashboard.orchestrator.swiper) {
          var swiper = $('.swiper-container').data('swiper');

          if (swiper) {
            swiper.destroy();
          }
          self.dashboard.orchestrator.swiper = null;
          self.dashboard.orchestrator.swiperOptions = null;
        }

        if (self.dashboard.orchestrator.container) {
          $(self.dashboard.orchestrator.container).empty();
        }
      }
    }

    self.pages.length = 0;
    //self.dashboard.activeDialog = null;
  };

  MDialogPage = function(_options, _ownerDialog) {
    var self = this;
    this.uid = getUniqueId(globalUniqueIdLength);
    this.name = 'MDialogPage';
    this.dialog = _ownerDialog;
    _options = _options || {};

    if (this.dialog) {
      this.indexNumber = this.dialog.pages.length + 1;
    } else {
      this.indexNumber = null;
    }
    this.headerOptions = {
      name: 'Header',
      icon: 'fa-question-circle',
      align: 'left'
    };
    this.bodyOptions = {
      hasScroller: false,
      hasWell: false,
      container: $('<div id="dialog-content-id"></div>'),
      content: $('<div id="dialog-inner-content"></div>'),
      scroller: $('<div id="scroller-container"><div id="scroller-content"><div id="scroller-panel"></div></div></div>'),
      swiper: $('<ul id="swiper-parent-module"></ul><div class="swiper-container"><div class="swiper-wrapper"></div></div><ul id="swiper-show-items"></ul>')
    };
    this.footerOptions = {
      buttons: []
    };

    _.each(_options, function(option, key) {
      switch(key) {
        case 'name':
          self.name = option;
          break;
        case 'headerOptions':
          _.extend(self.headerOptions, option);
          break;
        case 'bodyOptions':
          _.extend(self.bodyOptions, option);
          break;
        case 'footerOptions':
          _.extend(self.footerOptions, option);
          break;
      }
    });
    _.extend(this.headerOptions, _options.headerOptions);

    return this;
  };
  MDialogPage.prototype.dialog = typeof MDialog;
  MDialogPage.prototype.setButtonState = function(buttonName, disable) {
    var self = this;

    _.each(self.footerOptions.buttons, function(currentButton, index) {
      if (currentButton.name === buttonName) {
        self.footerOptions.buttons[index].disabled = disable;
        self.footerOptions.buttons[index].reference.prop('disabled', disable);

        if (disable) {
          self.footerOptions.buttons[index].reference.addClass('disabled');
        } else {
          self.footerOptions.buttons[index].reference.removeClass('disabled');
        }
      }
    });
  };
  MDialogPage.prototype.enableButton = function(buttonName) {
    this.setButtonState(buttonName, false);
  };
  MDialogPage.prototype.disableButton = function(buttonName) {
    this.setButtonState(buttonName, true);
  };
  MDialogPage.prototype.setHeader = function(_options) {
    var self = this,
        _options = _options || {},
        headerClass = $('<div class="dialog-header clearfix"></div>');

    _.extend(_options, self.headerOptions);

    headerClass.append($('<i class="fa fa-4x fa-white pull-left mr05 ' + self.headerOptions.icon + '"></i>'));

    if (self.headerOptions.description) {
      headerClass.append(
        $('<div class="clearfix" style="float:left; display:inline-block; width:85%"></div>')
          .append($('<h1 style="margin:0; line-height:32px"></h1>').append(self.headerOptions.name))
          .append($('<span class="dialog-header-text"></span>').append(self.headerOptions.description)));
    } else {
      headerClass.append($('<h1 class="pull-left" style="line-height:65px;"></h1>').append(self.headerOptions.name));
    }

    switch(self.headerOptions.align) {
      case 'left':
        headerClass.addClass('pull-left');
        break;
      case 'right':
        headerClass.addClass('pull-right');
        break;
      case 'center':
        headerClass.css('text-align', 'center');
        break;
    }

    self.headerOptions.reference = headerClass;
    return headerClass;
  };
  MDialogPage.prototype.setBody = function(_options) {
    var self = this,
        _options = _options || {},
        container = self.bodyOptions.container,
        content = self.bodyOptions.content ? self.bodyOptions.content.addClass('clearfix') : null,
        swiper = self.bodyOptions.swiper,
        scroller = self.bodyOptions.scroller;

    _.extend(_options, self.bodyOptions);

    if (self.bodyOptions.hasWell) {
      content.addClass('dialog-well');
    }

    if (self.bodyOptions.hasScroller) {
      content.append(scroller);
    }

    if (self.bodyOptions.hasSwiper) {
      content.append(swiper);
    }

    var result = container.append(content);
    self.bodyOptions.reference = result;
    return result;
  };
  MDialogPage.prototype.setFooter = function(_options) {
    var self = this,
        buttons = [],
        _options = _options || {},
        footerContainer = $('<div class="dialog-footer clearfix"></div>'),
        buttonContainer = $('<div class="dialog-footer-buttons"></div>');

    _.extend(_options, self.footerOptions);

    _.each(self.footerOptions.buttons, function(button, index) {
      //var btn = $('<button type="button" class="button"></button>'),
        var btn = $('<a href="#" class="button black"></a>'),
          keys = Object.keys(button);

      _.each(keys, function(key, index) {
        switch (key) {
          case 'id':
            btn.attr('id', button.id);
            break;
          case 'icon':
            btn.append(
              //$('<div class="pull-left"></div>').append(
                $('<i class="fa fa-3x pull-left fa-white ' + button.icon + '"></i>'));
            break;
          case 'name':
            btn.append($('<div class="button-text pull-right">' + button.name + '</div>'));
            //btn.append(button.name);
            break;
          case 'class':
            btn.removeClass('black').addClass(button.class);
            break;
          case 'align':
            if (button.align === 'left') btn.addClass('pull-left');
            else if (button.align === 'center') footerContainer.css('text-align', 'center');
            else if (button.align === 'right') btn.addClass('pull-right');
            break;
          case 'click':
            btn.click(button.click);
            break;
          case 'disabled':
            if (button.disabled === true) {
              btn.addClass('disabled');
              btn.prop('disabled', true);
            }
            break;
          case 'visible':
            if (button[key] === false) {
              btn.css('display', 'none');
            }
            break;
        }
      });

      buttons.push(btn);
      buttonContainer.append(btn);
      self.footerOptions.buttons[index].reference = btn;
    });

    return footerContainer.append(buttonContainer);
  };
  MDialogPage.prototype.build = function(animationType) {
    var self = this,
        header = self.setHeader(),
        body = self.setBody(),
        footer = self.setFooter(),
        existingDialog = $('.dialog'),
        dialogIsActive = existingDialog.length > 0,
        dialogContainer = dialogIsActive ? existingDialog : $('<div class="dialog"></div>'),
        render = null;

    if (!dialogIsActive) {
      render = dialogContainer.append(header).append(body).append(footer);
      self.dialog.container = dialogContainer;
      self.dialog.boxer = $.boxer(render, {
        onClose: function(boxerDialog) {
          self.dialog.events.onDialogClosed(self.dialog);
        }
      });

    } else {
      if (animationType) {
        switch(animationType) {
          case 'slideUpDown':
            dialogContainer.slideUp(400, function() {
              render = dialogContainer.empty().append(header).append(body).append(footer);
              dialogContainer.slideDown(400, function() {
                self.dialog.container = dialogContainer;
                self.dialog.events.onPageReady(self);
              });
            });
            break;
        }
      } else {
        render = dialogContainer.empty().append(header).append(body).append(footer);
        self.dialog.container = dialogContainer;
        self.dialog.events.onPageReady(self);
      }
    }

    $(window).bind('open.boxer', function(event) {
      var contentHeight = $('.boxer-container').height() - 195,
          contentWidth = $('.boxer-container').width() - 15;

      self.dialog.width = contentWidth;
      self.dialog.height = contentHeight;

      $('#dialog-inner-content').width(contentWidth).height(contentHeight);

      if (self.bodyOptions.hasScroller) {
        $('#scroller-container').width(contentWidth).height(contentHeight);
        self.dialog.activateScroller();
      } else if (self.bodyOptions.hasSwiper) {
        $('.swiper-container').width(contentWidth);
        self.dialog.activateSwiper(self.bodyOptions.swiperOptions);
      }

      self.dialog.events.onDialogReady(self.dialog);
    });

  };

  managementDialog = new MDialog({ name:'management' });
  addItemDialog = new MDialog({ name:'user' });

  /**
   * Authorizes any component like (MModule, MService, MDialog, MWidget)
   * @param _options
   * @param owner any modules, service, dialog, chart, widget
   * @returns {*}
   * @constructor
   */
  MAuth = function(_options, owner) {
    var self = this;

    this.uid = getUniqueId(globalUniqueIdLength);
    this.name = 'MAuth';
    this.auth = { username:null, password:null };
    this.permissions = [];
    this.args = [];

    this.owner = owner;

    return this;
  };
  MAuth.prototype.serialize = function() {
    var self = this,
        serialized = {};

    serialized.uid = self.uid;
    serialized.name = self.name;
    serialized.auth = JSON.stringify(self.auth);
    serialized.permissions = self.permissions;
    serialized.args = self.args;

    serialized.owner = self.owner.uid;

    return serialized;
  };
  MAuth.prototype.deserialize = function(data, owner) {
    var self = this;

    self.uid = data.uid;
    self.name = data.name;
    self.auth = $.parseJSON(data.auth);
    self.permissions = data.permissions;
    self.args = data.args;

    self.owner = owner;

    return self;
  };

  /**
   * Holds connectors and various settings for scroller/swiper area
   * and controls/renders them
   * @return {*}
   * @constructor
   */
  MOrchestrator = function(_options, dashboard) {
    this.uid = getUniqueId(globalUniqueIdLength);
    this.name = 'MOrchestration';
    this.container = null;
    this.selected = null;
    this.swiperVisibleItems = { Modules:true, Services:true, Widgets:true };

    _.extend(this, _options);

    this.dashboard = dashboard;
    this.dialog = null; // no serialization

    return this;
  };
  MOrchestrator.prototype.serialize = function() {
    var self = this,
        serialized = {};

    serialized.uid = self.uid;
    serialized.name = self.name;
    serialized.type = self.type;
    serialized.dashboard = self.dashboard.uid;
    serialized.swiperVisibleItems = JSON.stringify(self.swiperVisibleItems);

    return serialized;
  };
  MOrchestrator.prototype.deserialize = function(data, dashboard) {
    var self = this;

    self.uid = data.uid;
    self.name = data.name;
    self.type = data.type;
    self.dashboard = dashboard;
    self.swiperVisibleItems = $.parseJSON(data.swiperVisibleItems);

    return self;
  };
  /**
   * Draws swiper component on modal dialog
   * @param swiper {Swiper}
   * @param swiperOptions {Object}
   * @param activeModule {MModule}
   */
  MOrchestrator.prototype.renderSwiper = function(swiper, swiperOptions, activeModule, cb) {

    function drawItem(item, callback) {
      function getImage(path, callback) {
        var image = new Image;
        image.onload = function() { callback(image); };
        image.src = path;
      }

      var nodeType = null,
          nodeClass = null,
          nodeName = null;

      if (item instanceof MModule) {
        nodeType = 'module-uid';
        nodeClass = 'swiper-item-module';
        nodeName = item.name;
      } else if (item instanceof MService) {
        nodeType = 'service-uid';
        nodeClass = 'swiper-item-service';
        nodeName = item.name;
      } else if (item instanceof MWidget) {
        nodeType = 'widget-uid';
        nodeClass = 'swiper-item-widget';
        nodeName = item.header;
      }

      if (item.image) {
        getImage(item.image, function(result) {
          var width = result.width,
              height = result.height,
              node = $('<img />')
                .prop('src', item.image);

          if (width > 200) {
            var ratio = 200 / width,
                newWidth = Math.ceil(width * ratio) + 'px',
                newHeight = Math.ceil(height * ratio) + 'px';

            node.css({
              width: newWidth,
              height: newHeight
            });
          }

          node.append($('<span></span>').append(nodeName));

          callback($('<div></div>')
            .append(
              $('<div class="swiper-slide-image"></div>')
                .addClass(nodeClass)
                .append(node)
                .append(
                    $('<input type="hidden" />')
                      .addClass(nodeType)
                      .val(item.uid))));
        });
      } else {
        var node = $('<i class="fa fa-3x"></i>');

        if (item.icon) {
          node.addClass(item.icon);
        } else {
          if (item instanceof MWidget) {
            item.icon = 'fa-dashboard';
          } else {
            item.icon = 'fa-question-circle';
          }
          node.addClass(item.icon);
        }

        node.append($('<span></span>').append(nodeName));

        callback($('<div></div>').append(
          $('<div class="swiper-slide-content"></div>')
            .addClass(nodeClass)
            .append(node)
            .append(
                $('<input type="hidden" />')
                  .addClass(nodeType)
                  .val(item.uid))));
      }
    }

    var self = this;

    if (swiper &&
        self.dashboard &&
        self.dashboard.modules &&
        self.dashboard.modules.length > 0) {

      self.swiper = swiper;
      self.swiperOptions = swiperOptions;

      var modules = null,
          service = null,
          widgets = [],
          modulesCount = 0,
          servicesCount = 0,
          widgetsCount = 0,
          slides = [];

      if (activeModule) {
        modules = activeModule.modules;
      } else {
        modules = self.dashboard.modules;
      }

      if (modules && modules.length > 0 && self.swiperVisibleItems.Modules) {
        modulesCount = modules.length;
        _.each(modules, function(module, index) {
          drawItem(module, function(content) {
            var newSlide = swiper.createSlide(content.html()).append();
            slides.push(newSlide);
            --modulesCount;
          });
        });
      }

      // show service items in swiper if only management dialog
      if (self.dialog.name === 'management') {
        if (activeModule && activeModule.service && self.swiperVisibleItems.Services) {
          service = activeModule.service;
          servicesCount = 1;

          drawItem(service, function(content) {
            var newSlide = swiper.createSlide(content.html()).append();
            slides.push(newSlide);
            --servicesCount;
          });
        }
      }

      if (activeModule &&
          activeModule.widgetPrototypes &&
          activeModule.widgetPrototypes.length > 0 &&
          self.swiperVisibleItems.Widgets) {

        widgetsCount = activeModule.widgetPrototypes.length;

        _.each(activeModule.widgetPrototypes, function(widgetPrototype, index) {
          drawItem(widgetPrototype, function(content) {
            var newSlide = swiper.createSlide(content.html()).append();
            slides.push(newSlide);
            --widgetsCount;
          });
        });
      }

      if (cb && _.isFunction(cb)) {
        var modulesFinished = setInterval(function() {
          if (modulesCount === 0 && servicesCount === 0 && widgetsCount === 0) {
            clearInterval(modulesFinished);
            cb(slides);
          }
        }, 100);
      }
    }
  };
  MOrchestrator.prototype.renderScroller = function(container) {
    var self = this;

    function drawModule(module, callback) {
      function getImage(path, callback) {
        var image = new Image;
        image.onload = function() { callback(image); };
        image.src = path;
      }

      var isChild = module.parent ? true : false,
          moduleId = module.uid,
          parentId = module.parent ? module.parent.uid : null;
          moduleContainer = null;

      if (!isChild) {
        moduleContainer = $('<div class="module-container"></div>').attr('data-uid', moduleId);
        managementContainer.append(moduleContainer);
      }

      if (module.image) {
        getImage(module.image, function(result) {
          var width = result.width,
              height = result.height,
              item = $('<img />')
                .prop('src', module.image)
                .attr('draggable', true)
                .addClass('m-module');

          if (width > 128) {
            var ratio = 128 / width,
                newWidth = Math.ceil(width * ratio) + 'px',
                newHeight = Math.ceil(height * ratio) + 'px';

            item.css({
              width: newWidth,
              height: newHeight
            });
          }

          item.addClass('pull-left');
          item.click(function(event) {
            if (item.hasClass('m-selected')) {
              item.removeClass('m-selected');
              self.events.onModuleDeselected(module);
            } else {
              // remove others
              $('.m-selected').removeClass('m-selected');
              item.addClass('m-selected');
              self.events.onModuleSelected(module);
            }
          });

          moduleContainer =  $('.module-container[data-uid=' + (isChild ? parentId : module.uid) + ']');
          moduleContainer.append(item);
        });
      } else {
        var item = $('<i class="fa fa-5x"></i>');

        if (module.icon) {
          item.addClass(module.icon);
        } else {
          module.icon = 'fa-question-circle';
          item.addClass(module.icon);
        }

        item.addClass('m-module').addClass('pull-left');
        item.click(function(event) {
          if (item.hasClass('m-selected')) {
            item.removeClass('m-selected');
            self.events.onModuleDeselected(module);
          } else {
            // remove others
            $('.m-selected').removeClass('m-selected');
            item.addClass('m-selected');
            self.events.onModuleSelected(module);
          }
        });

        moduleContainer =  $('.module-container[data-uid=' + (isChild ? parentId : module.uid) + ']');
        moduleContainer.append(item);
      }
    }

    if (container &&
        self.dashboard &&
        self.dashboard.modules &&
        self.dashboard.modules.length > 0) {

      $(container).empty();

      self.container = container;

      if (!d3) {
        $(container).html('<h3 style="margin:1em">Please link D3 visualization library to begin</h3>');
        return;
      }

      var managementContainer = $('<div id="management-container"></div>'),
          managementCanvas = $('<canvas id="management-canvas"></canvas>'),
          managementSvg = $('<svg id="management-svg"></svg>'),
          modules = self.dashboard.modules;

      $(container).append(managementContainer);

      /////////////// Visualization begins here

      var row = 0;

      var iterator = function iterator(moduleModules) {
        _.each(moduleModules, function(module, index) {
          drawModule(module);
          iterator(module.modules);
        });
      };

      iterator(modules);

      ///////////////

    } else if (container) {
      $(container)
        .empty()
        .html('<h3 style="margin:1em">Please create at least one module to begin</h3>');
    }
  };

  MOrchestrator.prototype.setSwiperItemsVisible = function(dialog) {
    var self = this,
        items = [],
        colors = [];

    if (dialog.name === 'management') {
      items = ['Modules', 'Services', 'Widgets'];
      colors = ['black', 'blue', 'green'];
    } else {
      items = ['Modules', 'Widgets'];
      colors = ['black', 'green'];
    }

    //if (!self.dashboard.account.isAdmin()) return;

    $('#swiper-show-items').empty().append($('<div style="margin:8px 25px 0 0;" class="dialog-header-text pull-left">Visible Items: </div>'));

    _.each(items, function(item, index) {
      var itemContainer = $('<li></li>'),
          squaredContainer = $('<div class="squared"></div>'),
          squaredId = item + '-visible',
          squaredInput = $('<input id="' + squaredId + '" type="checkbox" value="' + item + '" name="check" />'),
          squaredLabel = $('<label for="' + squaredId + '"></label>').addClass(colors[index]),
          squaredSpan = $('<span></span>').append(item);

      squaredInput.off().on('change', function(event) {
        var selectedItem = event.currentTarget.value,
            checked = $(event.currentTarget).prop('checked');

        self.swiperVisibleItems[selectedItem] = checked;

        self.swiper.removeAllSlides();
        self.events.onModuleSelected(self.selected, self);
      });

      if (self.swiperVisibleItems && self.swiperVisibleItems[item]) {
        squaredInput.attr('checked', 'checked');
      }

      $('#swiper-show-items')
        .append(
          itemContainer.append(
            squaredContainer
              .append(squaredInput)
              .append(squaredLabel)
              .append(squaredSpan)));
    });
  };

  /**
   * Sets breadcrumbs over modules swiper
   * @param selectedModule {MModule} - Selected module by the user
   */
  MOrchestrator.prototype.setBreadcrumb = function(selectedModule) {
    var getParent = function getParent(module) {
      return module ? module.parent : null;
    };
    var self = this,
        currentModule = selectedModule,
        breadcrumbs = [],
        listItem = null,
        parentModule = $('#swiper-parent-module'),
        rootItem = $('<li class="swiper-parent-item" data-module-uid="root">' +
          '<i class="fa fa-2x fa-folder-open" style="margin-left: 10px;"></i></li>');

    parentModule.empty();

    do {
      // insert item inte breadcrumb if we have one
      if (currentModule) {
        var parentListItem = $('<li></li>')
            .addClass('swiper-parent-item')
            .attr('data-module-uid', currentModule.uid),
            parentListItemContent = null;

        if (currentModule.image) {
          parentListItemContent = $('<img />').attr('src', currentModule.image);
        } else {
          if (currentModule.icon) {
            parentListItemContent = $('<i class="fa fa-3x"></i>').addClass(currentModule.icon);
          } else {
            parentListItemContent = $('<i class="fa fa-3x fa-question-circle"></i>');
          }
        }
        parentListItem.append(parentListItemContent);

        breadcrumbs.push(parentListItem);
      }
    } while (currentModule = getParent(currentModule));

    breadcrumbs.push(rootItem);

    while (listItem = breadcrumbs.pop()) {
      parentModule.append(listItem).append($('<li></li>').addClass('swiper-parent-sep'));
    }

    $('.swiper-parent-item').off().on('click', function(event) {
      self.events.onBreadcrumbSelected(self, event);
    });
  };
  MOrchestrator.prototype.events = {
    onModuleSelected: function(module, orchestrator) {
      if (!orchestrator) {
        if (module) {
          orchestrator = module.dashboard.orchestrator;
        } else {
          return;
        }
      }

      orchestrator.selected = module;

      // management dialog
      orchestrator.dashboard.activeDialog.activePage.enableButton('Create<br/>Service');
      // add widget dialog
      orchestrator.dashboard.activeDialog.activePage.enableButton('Create<br/>Widget');

      orchestrator.setBreadcrumb(module);
      orchestrator.setSwiperItemsVisible(orchestrator.dialog);

      if (orchestrator.swiper) {
        orchestrator.renderSwiper(
          orchestrator.swiper,
          orchestrator.swiperOptions,
          module,
          function(slides) {
            orchestrator.swiper.swipeTo(0);
            orchestrator.swiper.updateActiveSlide(0);
          });
      }
    },
    // deprecated on swiper version
    onModuleDeselected: function(module, orchestrator) {
      if (!orchestrator) {
        if (module) {
          orchestrator = module.dashboard.orchestrator;
        } else {
          return;
        }
      }
      orchestrator.selected = null;
      // management dialog
      orchestrator.dashboard.activeDialog.activePage.disableButton('Create<br/>Service');
      // add widget dialog
      orchestrator.dashboard.activeDialog.activePage.disableButton('Create<br/>Widget');

      orchestrator.setBreadcrumb(module);
      orchestrator.setSwiperItemsVisible(orchestrator.dialog);

      if (orchestrator.swiper) {
        orchestrator.renderSwiper(
          orchestrator.swiper,
          orchestrator.swiperOptions,
          module,
          function(slides) {
            orchestrator.swiper.swipeTo(0);
            orchestrator.swiper.updateActiveSlide(0);
          });
      }
    },
    onSlideClick: function onSlideClick(orchestrator, swiper) {
      var moduleId = $(swiper.clickedSlide).find('input.module-uid').val(),
          serviceId = $(swiper.clickedSlide).find('input.service-uid').val(),
          widgetId = $(swiper.clickedSlide).find('input.widget-uid').val(),
          collection = orchestrator.dashboard.collections[0],
          dashboard = orchestrator.dashboard;

      if (moduleId) {
        var module = dashboard.getModuleById(moduleId);
        if (module) {
          swiper.removeAllSlides();
          orchestrator.events.onModuleSelected(module);
        }
      } else if (serviceId) {
        collection.events.onCreateService(collection, serviceId);
      } else if (widgetId) {
        if (dashboard.activeDialog.name === 'user') {
          // User wants to add widget to dashboard
          // find widget prototype and create new widget using prototype
          dashboard.getWidgetPrototypeById(widgetId, function(widgetPrototype) {
            if (widgetPrototype) {
              var newWidget = _.clone(widgetPrototype);
              newWidget.uid = getUniqueId(globalUniqueIdLength);

              // TODO: should control same widget id exists or not
              newWidget.id = 'mwidget-' + (collection.widgets.length + 1);
              newWidget.isPrototype = false;
              collection.add(newWidget);

              dashboard.save(function(err, result) {
                dashboard.events.onSaved(err, result);
                window.location.reload(true);
              });

            } else {
              console.error('Widget prototype could not be found');
            }
          });
        } else if (dashboard.activeDialog.name === 'management') {
          dashboard.getWidgetPrototypeById(widgetId, function(widget) {
            if (widget) {
              collection.events.onCreateWidget(collection, widget);
            } else {
              console.error('Widget could not be found');
            }
          });
        }
      }
    },
    onBreadcrumbSelected: function(orchestrator, event) {
      if (event && event.currentTarget) {
        var moduleId = $(event.currentTarget).attr('data-module-uid');

        if (moduleId) {
          if (moduleId === 'root') {
            if (orchestrator.swiper) {
              orchestrator.swiper.removeAllSlides();
              orchestrator.selected = null;
              orchestrator.dashboard.activeDialog.activePage.disableButton('Create<br/>Service');
              orchestrator.dashboard.activeDialog.activePage.disableButton('Create<br/>Widget');
              orchestrator.setBreadcrumb();
              orchestrator.setSwiperItemsVisible(orchestrator.dialog);
              orchestrator.renderSwiper(orchestrator.swiper, orchestrator.swiperOptions);
            }
          } else {
            var module = orchestrator.dashboard.getModuleById(moduleId);
            if (module && orchestrator.swiper) {
              orchestrator.swiper.removeAllSlides();
              orchestrator.events.onModuleSelected(module);
            }
          }
        }
      }
    }
  };

  /**
   * https://github.com/erhangundogan/jstools/blob/master/lib/jstools.js#L137
   * @param len
   */
  function getUniqueId(len) {
    var buf = [],
      chars = "ABCDEF0123456789",
      charlen = chars.length,
      firstAlphaNumeric = firstAlphaNumeric || false;

    var getRandomInt = function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    for (var i = 0; i < len; ++i) {
      buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join("");
  }
  function debouncer(fn, timeout) {
    var timeoutID,
        timeout = timeout || 200;

    return function () {
      var scope = this,
        args = arguments;

      clearTimeout(timeoutID);
      timeoutID = setTimeout(function () {
        fn.apply(scope, Array.prototype.slice.call(args));
      }, timeout);
    }
  }
  /**
   * toSource
   * @param fn string function
   * @param args {Array} function arguments
   * @return {*|void}
   */
  function getSource(fn, args) {
    var decompiled = fn.substring(fn.indexOf("{")+1, fn.lastIndexOf("}"));
    args = args || [];
    args.push(decompiled);
    return Function.prototype.constructor.apply(null, args);
  }

}(window));