/*
 Merlon Dashboard
 HTML5 Dashboards & Widgets
 Created by Erhan Gundogan <erhan.gundogan@gmail.com>
 MIT License
 */

var MDashboard, MWidgetCollection, MWidget, MChart, MService,
    MModule, MDialog, MDialogPage, MAuth, MAccount, MOrchestrator;
(function (global) {

  var managementDialog = null,
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
      widget_margins: [10, 10],
      widget_base_dimensions: [400, 225],
      extra_rows: 0,
      extra_cols: 0,
      min_cols: 1,
      max_cols: null,
      min_rows: 15,
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
        distance: 4
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
  MDashboard.prototype.save = function(callback) {
    var self = this,
        userId = self.account && self.account.userId ? self.account.userId : '',
        dataId = 'dashboard' + userId,
        oldItem = localStorage.getItem(dataId),
        newItem = null;

    // first remove old one
    if (oldItem) localStorage.removeItem(dataId);

    // begin to check if storage is written
    var storageCheck = setInterval(function() {
      if (newItem = localStorage.getItem(dataId) !== null) {
        clearInterval(storageCheck);
        callback(null, newItem);
      }
    }, 100);

    try {
      // lazy code section about json/serialization
      var data = self.serialize();
      localStorage.setItem(dataId, JSON.stringify(data));
    } catch (exception) {
      // oldies but goldies
      if (oldItem) localStorage.setItem(oldItem);
      else if (storageCheck) clearInterval(storageCheck);

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
      self.isAdmin = data.isAdmin;
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

    var requestedModule = _.find(allModules, function(item) {
      return item.uid === moduleId;
    });

    return requestedModule;
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
              var childModules = module.modules.concat(searchModule.modules);
              searchModule.modules = childModules;
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
    this.service = null;
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
        stop: function (e, ui, $widget) {
          var resizedWidgetId = $widget.attr('id'),
              resizedWidget = _.find(self.widgets, function (item) {
                return item.id === resizedWidgetId;
              });

          if (resizedWidget) {
            resizedWidget.invalidate();
          }
        }
      },
      draggable: {
        handle: widgetHandle
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
   * Rearrange widget collection
   * @returns {*} self
   */
  MWidgetCollection.prototype.invalidate = function () {
    var self = this;

    self.width = $(self.container).width();
    self.height = self.container.is('body') ? $(window).height() : $(self.container).height();
    self.columnMargin = self.collectionOptions.widget_margins[0];
    self.rowMargin = self.collectionOptions.widget_margins[1];
    self.collectionOptions.widget_base_dimensions = [self.width, self.height];

    var xCount = yCount = 0;
    _.each(self.widgets, function (widget, index) {
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

      // Add management button
      if (self.dashboard.account && self.dashboard.account.roles.indexOf('admin') >= 0) {
        var manageButton = $('<a href="#" class="btn"><i class="fa fa-3x fa-cogs"></i></a>')
          .attr('title', 'Manage Services')
          .click(function () {
            self.events.onManageServices(self);
          });
        buttons.push(manageButton);
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

    if (self.widgets.length == 0) return;

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
      debugger;
    },
    onCreateModule: function (collection) {
      var module = new MModule();
      module.dashboard = collection.dashboard;

      if (collection.selectedModule) {
        var selectedModule = collection.dashboard.getModuleById(collection.selectedModule);
        if (selectedModule) {
          module.parent = selectedModule;
        }
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
            .css({ 'height':'425px', 'padding-top':'2em' }) // resize inner panel and center content
            .append(form)
        },
        footerOptions: {
          buttons: [{
            name: 'Go<br/>Back',
            icon: 'fa-arrow-left',
            click: function(event) {
              event.preventDefault();
              managementDialog.getPage('module|main', 'slideUpDown');
            }
          }, {
            name: 'Add Key/Value',
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

              keyValueLabel.append($('<input class="param-key" type="text" />').attr('data-order', paramOrder));
              keyValueItem.append($('<input class="param-value" type="text" />').attr('data-order', paramOrder));
              formRow.append(keyValueLabel)
                     .append(keyValueColumnBreak)
                     .append(keyValueItem)
                     .append(removeButton)
                     .attr('data-order', paramOrder);
              form.append(formRow);
              ++paramOrder;
            }
          }, {
            name: 'Save Module',
            icon: 'fa-save',
            click: function(event) {
              event.preventDefault();
              $('.dialog').prop('disabled', true).addClass('passive-dialog loading');

              // Save dashboard
              module.events.onSave(module);
            }
          }]
        }
      };

      managementDialog.events.onPageReady = function(page) {
        $('ul.item-icons').on('click', 'li', function(event) {
          // remove old selected
          var item = $('ul.item-icons li.selected');
          if (item && item.length > 0) {
            item.removeClass('selected');
          }

          // add new selected icon
          if (event.currentTarget != item[0]) {
            $(event.currentTarget).addClass('selected');
          }
        });
      };

      managementDialog.dashboard = collection.dashboard;
      managementDialog.pages.push(new MDialogPage(editModulePage, managementDialog));
      managementDialog.getPage('module|edit', 'slideUpDown');

    },
    onCreateService: function (collection, container) {
      container.slideUp(400, function() {
        var service = new MService();

        service.module = collection.dashboard.getModuleById(collection.selectedModule);

        // creates management dialog new service form
        var form = service.createForm(collection, container),
            section = container.find('#dialog-inner-content');

        if (section) {
          section.empty().append(form);

          $('ul.item-icons').on('click', 'li', function(event) {

            // remove old selected
            var item = $('ul.item-icons li.selected');
            if (item && item.length > 0) {
              item.removeClass('selected');
            }

            // add new selected icon
            if (event.currentTarget != item[0]) {
              $(event.currentTarget).addClass('selected');
            }
          });

          container.slideDown(400);
        }
      });
    },
    onCreateServiceConnection: function (collection, container, service) {
      container.slideUp(400, function() {

       var form = service.createConnectionForm(collection, container, service),
           section = container.find('#dialog-inner-content');

       if (section) {
         section.empty().append(form);
         container.slideDown(400);
       }
      });
    },
    onManageModuleSelected: function(collection, swiperItem) {
      //var selectedModule = $('.swiper-slide.selected');

      // if module is selected, clicking again removes selection
      if (selectedModule && selectedModule.length > 0) {
        $('#service-create-button').prop('disabled', true).addClass('disabled');
        selectedModule.removeClass('selected');
        collection.selectedModule = null;
      } else {
        var currentSelectedModule = $(swiperItem.clickedSlide),
            currentSelectedModuleId = currentSelectedModule.attr('data-uid');

        currentSelectedModule.addClass('selected');
        collection.selectedModule = currentSelectedModuleId;
        $('#service-create-button').prop('disabled', false).removeClass('disabled');
      }
    },
    onManageServices: function(collection) {
      var subHeader = 'Please add, remove or modify your modules and connections from this dialog.' +
        ' <strong>You can create new module clicking button below.</strong> When you have saved your new module, it would' +
        ' be placed in scroller section as you may see below. Create modules as many as you like. ' +
        ' It is possible to create child modules and/or services. When you have finished creating services,' +
        ' you may gather data for your widgets and charts.';

      var entrancePage = {
        name: 'module|main',
        headerOptions: {
          name: 'Management Section',
          description: subHeader,
          icon: 'fa-cogs',
          align: 'left'
        },
        bodyOptions: {
          hasScroller: true,
          hasWell: true
        },
        footerOptions: {
          buttons: [{
            name: 'Create Module',
            icon: 'fa-puzzle-piece',
            click: function(event) {
              event.preventDefault();
              var container = $('#dialog-content-id');
              collection.events.onCreateModule(collection);
            }
          }, {
            name: 'Create Service',
            icon: 'fa-cloud-download',
            disabled: true,
            click: function(event) {
              event.preventDefault();
              var container = $('#dialog-content-id');
              if (collection.selectedModule) {
                collection.events.onCreateService(collection);
              } else {
                console.error('Module not specified.');
              }
            }
          }, {
            name: 'Close Dialog',
            icon: 'fa-sign-out',
            click: function(event) {
              event.preventDefault();
              managementDialog.close();
            }
          }]
        }
      };

      managementDialog.dashboard = collection.dashboard;
      managementDialog.pages.push(new MDialogPage(entrancePage, managementDialog));
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
   * @param ownerCollection Owner MCollection
   * @param _options Widget options (optional)
   * @returns {*} Widget itself
   * @constructor
   */
  MWidget = function (ownerCollection, _options) {
    this.uid = getUniqueId(globalUniqueIdLength);
    this.xSize = 1;
    this.ySize = 1;
    this.settings = true;
    this.collection = ownerCollection;
    this.isInitialized = false;
    this.isClosable = true;
    this.isLocked = false;
    this.isRendered = false;
    this.order = this.collection.widgets.length + 1;
    this.id = 'mwidget-' + this.order;
    this.service = null;

    _.extend(this, _options);

    if (this.contentType === "chart") {
      if (this.chart.widget) delete this.chart.widget;
      this.chart = new MChart(this, this.chart);
    }

    var self = this;
    var collectionInitialized = setInterval(function () {
      if (self.collection.isInitialized) {
        clearInterval(collectionInitialized);
        if (self.headerItem) {
          var headerHeight = self.headerItem.height();
          self.height = self.height - headerHeight;

          if (self.headerItem.css) {
            var headerPaddingTop = parseInt(self.headerItem.css('padding-top')) || 0;
            var headerPaddingBottom = parseInt(self.headerItem.css('padding-bottom')) || 0;
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
      contentSection = $('<div></div>').addClass('mwidget-content').addClass('loading'),
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
          if (self.contentType === "html" && self.html.render) {
            contentSection.append(self.html.render(self));
          }
          //contentSection.append(self.content);
          break;
        case 'settings':
          if (self.settings) {
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
    self.container.height(self.height).addClass('loading');

    var widgetIsRendered = setInterval(function () {
      if (self.isRendered) {
        clearInterval(widgetIsRendered);
        self.container.removeClass('loading');
      }
    }, 100);

    if (self.contentType === "chart" && self.chart) {
      self.chart.render(self);
    } else if (self.contentType === "html" && self.html) {
      self.container.append(self.html.render(self));
    }

  };
  /**
   * Widget events
   * @type {{onSettingsOpen: Function, onClose: Function}}
   */
  MWidget.prototype.events = {
    onSettingsOpen: function (event, widget) {
      widget.createDialog();
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
    }
  };
  MWidget.prototype.serialize = function() {
    var self = this,
        serialized = {};

    serialized.mType = 'MWidget';
    serialized.contentType = self.contentType;
    serialized.col = self.col;
    serialized.header = self.header;
    serialized.height = self.height;
    serialized.id = self.id;
    serialized.isClosable = self.isClosable;
    serialized.isLocked = self.isLocked;
    serialized.order = self.order;
    serialized.row = self.row;
    serialized.settings = self.settings;
    serialized.uid = self.uid;
    serialized.width = self.width;
    serialized.xSize = self.xSize;
    serialized.ySize = self.ySize;

    // collection
    serialized.collection = self.collection.uid;

    switch (self.contentType) {
      case 'html':
        serialized.html = {};
        if (self.html.dataset) {
          serialized.html.dataset = _.isFunction(self.html.dataset)
            ? self.html.dataset.toString()
            : JSON.stringify(self.html.dataset);
        }

        if (self.html.render) {
          serialized.html.render = _.isFunction(self.html.render)
            ? self.html.render.toString()
            : JSON.stringify(self.html.render);
        }

        if (self.html.style) {
          serialized.html.style = _.isFunction(self.html.style)
            ? self.html.style.toString()
            : JSON.stringify(self.html.style);
        }
        break;
      case 'chart':
        serialized.chart = self.chart.serialize();
        break;
    }

    return serialized;
  };
  MWidget.prototype.deserialize = function(data, owner) {
    var self = this;

    self.contentType = data.contentType;
    self.col = data.col;
    self.header = data.header;
    self.height = data.height;
    self.id = data.id;
    self.isClosable = data.isClosable;
    self.isLocked = data.isLocked;
    self.order = data.order;
    self.row = data.row;
    self.settings = data.settings;
    self.uid = data.uid;
    self.width = data.width;
    self.xSize = data.xSize;
    self.ySize = data.ySize;
    self.collection = owner;

    switch (data.contentType) {
      case 'html':
        self.html = {};
        if (data.html.dataset) {
          if (/function/.test(data.html.dataset)) {
            self.html.dataset = getSource(data.html.dataset, ['widget']);
          } else {
            self.html.dataset = $.parseJSON(data.html.dataset);
          }
        }

        if (data.html.render) {
          if (/function/.test(data.html.render)) {
            self.html.render = getSource(data.html.render, ['widget', 'callback']);
          } else {
            self.html.render = $.parseJSON(data.html.render);
          }
        }

        if (data.html.style) {
          if (/function/.test(data.html.style)) {
            self.html.style = getSource(data.html.style, ['widget']);
          } else {
            self.html.style = $.parseJSON(data.html.style);
          }
        }
        break;
      case 'chart':
        var newChart = new MChart(self);
        self.chart = newChart.deserialize(data.chart, self);
        break;
    }

    return self;
  };
  /**
   * Owned service
   * @type {string}
   */
  MWidget.prototype.service = typeof MService;

  /**
   * Chart item would be placed into widget
   * @param ownerWidget MWidget
   * @param _options
   * @returns {*}
   * @constructor
   */
  MChart = function (ownerWidget, _options) {
    this.uid = getUniqueId(globalUniqueIdLength);
    this.library = 'highcharts'; // default
    this.widget = ownerWidget;
    this.service = null;
    this.isInitialized = false;

    if (_options) {
      this.config = JSON.stringify(_options);
    }
    _.extend(this, _options);

    var self = this;
    var widgetInitialized = setInterval(function () {
      if (self.widget.isInitialized) {
        clearInterval(widgetInitialized);
        if (self.render) {
          self.render(self.widget);
        }
      }
    }, 100);

    return this;
  };
  MChart.prototype.serialize = function() {
    var self = this,
        serialized = {};

    serialized.mType = 'MChart';
    serialized.library = self.library;
    serialized.type = self.type;
    serialized.uid = self.uid;

    if (self.dataset) {
      serialized.dataset = _.isFunction(self.dataset)
        ? self.dataset.toString()
        : JSON.stringify(self.dataset);
    }

    if (self.render) {
      serialized.render = _.isFunction(self.render)
        ? self.render.toString()
        : JSON.stringify(self.render);
    }

    if (self.style) {
      serialized.style = _.isFunction(self.style)
        ? self.style.toString()
        : JSON.stringify(self.style);
    }

    // parent widget
    serialized.widget = self.widget ? self.widget.uid : null;

    // if chart has base options
    if (self.config) {
      serialized.config = self.config;
    }

    return serialized;
  };
  MChart.prototype.deserialize = function(data, owner) {
    var self = this;

    self.library = data.library;
    self.type = data.type;
    self.uid = data.uid;
    self.widget = owner;

    if (data.dataset) {
      if (/function/.test(data.dataset)) {
        self.dataset = getSource(data.dataset, ['widget']);
      } else {
        self.dataset = $.parseJSON(data.dataset);
      }
    }

    if (data.render) {
      if (/function/.test(data.render)) {
        self.render = getSource(data.render, ['widget', 'callback']);
      } else {
        self.render = $.parseJSON(data.render);
      }
    }

    if (data.style) {
      if (/function/.test(data.style)) {
        self.style = getSource(data.style, ['widget']);
      } else {
        self.style = $.parseJSON(data.style);
      }
    }

    if (data.config) {
      var config = $.parseJSON(data.config);
      _.extend(self, config);
    }

    return self;
  };
  MChart.prototype.widget = typeof MWidget;

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
          var orderId = $(this).attr('data-order'),
              value = $('.param-value[data-order=' + orderId + ']').val();

        param[key] = value;
        self.params.push(param);
      }
    });

    // get icon or image
    var item = $('ul.item-icons li.selected');
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
          self.icon = 'fa-question';
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
          item.append($('<input class="item-name" type="text" required autofocus />'));
          propertyRequired = true;
          order = 2 + orderOffset;
          break;
        case 'tags':
          label.append($('<span>Tags</span>'));
          item.append($('<input class="item-tags" type="text" />'));
          propertyRequired = true;
          order = 3 + orderOffset;
          break;
        case 'description':
          label.append($('<span>Description</span>')).css('vertical-align', 'top');
          columnBreak.css('vertical-align', 'top');
          item.append($('<textarea class="item-description" rows="3"></textarea>'));
          propertyRequired = true;
          order = 4 + orderOffset;
          break;
        case 'image':
          label.append($('<span>Image</span>'));
          item.append($('<input class="item-image" type="file" />'));
          propertyRequired = true;
          order = 5 + orderOffset;
          break;
        case 'icon':
          label.append($('<span>Icon</span>')).css('vertical-align', 'top');
          columnBreak.css('vertical-align', 'top');
          var itemIcons = $('<ul class="item-icons"></ul>');
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
        formRow.append(currentRowItem.label).append(currentRowItem.columnBreak).append(currentRowItem.item);
        form.append(formRow);
      }
    }

    formContainer.append(form);

    return formContainer;
  };
  MModule.prototype.events = {
    onSave: function (module) {
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
            result.dashboard.save(result.dashboard.events.onSaved);
          } else {
            console.error('Could not load module form values');
          }
        }
      });
    },
    onSelected: function(module) {
      module.dashboard.collections[0].selectedModule = module.uid;
      debugger;
    },
    onDeselected: function(module) {
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

    if (data.modules && data.modules > 0) {
      self.modules = _.map(data.modules, function(moduleData, index) {
        var newModule = new MModule();
        return newModule.deserialize(moduleData, self);
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
      async: true,
      cache: true,
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
      timeout: 30000, // 30sn
      type: 'GET',
      //username: ''
      url: ''
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
    var self = this,
        message = null;

    self.ajaxOptions.url = $('.form-row .form-item .item-url').val();
    self.ajaxOptions.type = $('.form-row .form-item .item-type').val();

    var dataValue = $('.form-row .form-item .item-data').val();
    self.ajaxOptions.data = dataValue ? $.parseJSON(dataValue) : {};

    self.ajaxOptions.crossDomain  = $('.form-row .form-item .item-crossDomain').prop('checked');
    self.ajaxOptions.async        = $('.form-row .form-item .item-async').prop('checked');
    self.ajaxOptions.cache        = $('.form-row .form-item .item-cache').prop('checked');
    self.ajaxOptions.processData  = $('.form-row .form-item .item-processData').prop('checked');
    self.ajaxOptions.global       = $('.form-row .form-item .item-global').prop('checked');
    self.ajaxOptions.ifModified   = $('.form-row .form-item .item-ifModified').prop('checked');

    self.ajaxOptions.contentType = $('.form-row .form-item .item-contentType').val();

    var timeoutValue = $('.form-row .form-item .item-timeout').val();
    self.ajaxOptions.timeout = timeoutValue ? parseInt(timeoutValue) : 30000;

    var headersValue = $('.form-row .form-item .item-headers').val();
    self.ajaxOptions.headers = headersValue ? $.parseJSON(headersValue) : {};

    return self;
  };
  MService.prototype.createConnectionForm = function(collection, container, service) {
    var self = service,
        formContainer = $('<div class="service-ajax-container"></div>'),
        rows = [],
        form = $('<form class="form"></form>');

    _.each(self.ajaxOptions, function(value, key) {
      var propertyRequired = false,
          order = null,
          label = $('<div class="form-label"></div>'),
          item = $('<div class="form-item"></div>'),
          columnBreak = $('<div class="form-break"><span>&nbsp;:&nbsp;</span></div>');

      switch(key) {
        case 'url':
          label.append($('<span>Url</span>'));
          item.append($('<input class="item-url" type="text" required placeholder="http://test.merlon.com.tr/Service/Task/TaskService.svc/GetLatestTasks" />'));
          propertyRequired = true;
          order = 2;
          break;
        case 'type':
          label.append($('<span>Method</span>'));
          var types = $('<select class="item-type"></select>')
            .append($('<option value="GET" selected>GET</option>'))
            .append($('<option value="POST">POST</option>'));
          item.append(types);
          propertyRequired = true;
          order = 1;
          break;
        case 'data':
          label.append($('<span>Arguments</span>'));
          item.append($('<input class="item-data" type="text" placeholder="{ count:10 }" />'));
          propertyRequired = true;
          order = 3;
          break;
        case 'crossDomain':
          label.append($('<span>Cross Domain</span>'));
          item.append($('<input class="item-crossDomain" type="checkbox" />'));
          propertyRequired = true;
          order = 4;
          break;
        case 'async':
          label.append($('<span>Asynchronous</span>'));
          item.append($('<input class="item-async" type="checkbox" checked="checked" />'));
          propertyRequired = true;
          order = 5;
          break;
        case 'cache':
          label.append($('<span>Cache Results</span>'));
          item.append($('<input class="item-cache" type="checkbox" checked="checked" />'));
          propertyRequired = true;
          order = 6;
          break;
        case 'processData':
          label.append($('<span>Process Arguments</span>'));
          item.append($('<input class="item-processData" type="checkbox" />'));
          propertyRequired = true;
          order = 7;
          break;
        case 'global':
          label.append($('<span>Global</span>'));
          item.append($('<input class="item-global" type="checkbox" checked="checked" />'));
          propertyRequired = true;
          order = 8;
          break;
        case 'ifModified':
          label.append($('<span>If Modified</span>'));
          item.append($('<input class="item-ifModified" type="checkbox" />'));
          propertyRequired = true;
          order = 9;
          break;
        case 'contentType':
          label.append($('<span>Content Type</span>'));
          item.append($('<input class="item-contentType" type="text" placeholder="application/x-www-form-urlencoded; charset=UTF-8" />')
            .val('application/x-www-form-urlencoded; charset=UTF-8'));
          propertyRequired = true;
          order = 10;
          break;
        case 'timeout':
          label.append($('<span>Timeout</span>'));
          item.append($('<input class="item-timeout" type="text" placeholder="30000 (30 seconds)" />'));
          propertyRequired = true;
          order = 12;
          break;
        case 'headers':
          label.append($('<span>Headers</span>')).css('vertical-align', 'top');
          columnBreak.css('vertical-align', 'top');
          item.append($('<textarea rows="2" class="item-headers" type="text" placeholder="{ \'User-Agent\':\'foo\', \'Accept\':\'text/html\', ... }"></textarea>'));
          propertyRequired = true;
          order = 11;
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
        formRow.append(currentRowItem.label).append(currentRowItem.columnBreak).append(currentRowItem.item);
        form.append(formRow);
      }
    }

    var saveConnectionButton = $('<button id="connection-save-button" type="button" class="button pull-left"></button>')
      .click(function(event) {
        event.preventDefault();

        if (self.ajaxOptions.url) {
          self.events.onConnectionSave(self);
        }
      })
      .append($('<div class="pull-left"><i class="fa fa-save fa-3x fa-white"></i></div>'))
      .append($('<div class="button-text pull-left">Save Connection</div>'));

    var testConnectionButton = $('<button id="connection-test-button" type="button" class="button pull-left""></button>')
      .click(function(event) {
        event.preventDefault();
        //$('.dialog').prop('disabled', true).addClass('passive-dialog loading');
        self.events.onConnectionTest(self);
      })
      .append($('<div class="pull-left"><i class="fa fa-bolt fa-3x fa-white"></i></div>'))
      .append($('<div class="button-text pull-left">Test Connection</div>'));

    formContainer
      .append(form)
      .append('<hr class="mtb05" />')
      .append(saveConnectionButton)
      .append(testConnectionButton);

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
          var orderId = $(this).attr('data-order'),
              value = $('.param-value[data-order=' + orderId + ']').val();

        param[key] = value;
        self.params.push(param);
      }
    });

    // get icon or image
    var item = $('ul.item-icons li.selected');
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
              reader.onload = function(e) {
                self.image = e.target.result;
                self.icon = null;
                callback(null, self);
              };
              reader.readAsDataURL(uploadControl.files[0]);
            }
        } else {
          self.image = null;
          self.icon = 'fa-question';
          callback(null, self);
        }
    }
  };
  MService.prototype.createForm = function(collection, container) {
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
          item.append($('<span class="item-uid">' + value + '</span>'));
          propertyRequired = true;
          order = 2;
          break;
        case 'description':
          label.append($('<span>Description</span>')).css('vertical-align', 'top');
          columnBreak.css('vertical-align', 'top');
          item.append($('<textarea class="item-description" rows="2"></textarea>'));
          propertyRequired = true;
          order = 4;
          break;
        case 'name':
          label.append($('<span>Name</span>'));
          item.append($('<input class="item-name" type="text" required autofocus />'));
          propertyRequired = true;
          order = 3;
          break;
        case 'schedule':
          label.append($('<span>Schedule</span>'));
          item.append($('<input class="item-schedule" type="text" placeholder="*/5 * * * * (every 5 minute, cron string)" />'));
          propertyRequired = true;
          order = 5;
          break;
        case 'isScheduled':
          label.append($('<span>Scheduled</span>'));
          item.append($('<input class="item-scheduled" type="checkbox" />'));
          propertyRequired = true;
          order = 6;
          break;
        case 'module':
          label.append($('<span>Module</span>'));
          item.append($('<span class="item-module">' + (value.name ? value.name : '') + '</span>'));
          propertyRequired = true;
          order = 1;
          break;
        case 'image':
          label.append($('<span>Image</span>'));
          item.append($('<input class="item-image" type="file" />'));
          propertyRequired = true;
          order = 7;
          break;
        case 'icon':
          label.append($('<span>Icon</span>')).css('vertical-align', 'top');
          columnBreak.css('vertical-align', 'top');
          var itemIcons = $('<ul class="item-icons"></ul>');
          _.each(faIcons, function(faIcon, index) {
            var listItem = $('<li class="item-icon" data-icon="' + faIcon + '"></li>');
            listItem.append($('<i class="fa fa-2x fa-white ' + faIcon + '"></i>'));
            itemIcons.append(listItem);
          });
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
        formRow.append(currentRowItem.label).append(currentRowItem.columnBreak).append(currentRowItem.item);
        form.append(formRow);
      }
    }

    var createConnectionButton = $('<button id="add-connection-button" type="button" class="button pull-left"></button>')
      .click(function(event) {
        event.preventDefault();
        collection.events.onCreateServiceConnection(collection, container, self);
      })
      .append($('<div class="pull-left"><i class="fa fa-chain fa-3x fa-white"></i></div>'))
      .append($('<div class="button-text pull-left">Create Connection</div>'));

    var paramOrder = 1;
    var keyValueButton = $('<button id="key-value-button" type="button" class="button pull-left"></button>')
      .click(function(event) {
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

        keyValueLabel.append($('<input class="param-key" type="text" />').attr('data-order', paramOrder));
        keyValueItem.append($('<input class="param-value" type="text" />').attr('data-order', paramOrder));
        formRow.append(keyValueLabel)
               .append(keyValueColumnBreak)
               .append(keyValueItem)
               .append(removeButton)
               .attr('data-order', paramOrder);
        form.append(formRow);
        ++paramOrder;
      })
      .append($('<div class="pull-left"><i class="fa fa-key fa-3x fa-white"></i></div>'))
      .append($('<div class="button-text pull-left">Add Key/Values</div>'));

    var saveServiceButton = $('<button id="service-save-button" type="button" class="button pull-left disabled" disabled="disabled"></button>')
      .click(function(event) {
        event.preventDefault();
        $('.dialog').prop('disabled', true).addClass('passive-dialog loading');

        // Save dashboard
        self.events.onSave(self);
      })
      .append($('<div class="pull-left"><i class="fa fa-save fa-3x fa-white"></i></div>'))
      .append($('<div class="button-text pull-left">Save Service</div>'));

    formContainer
      .append(form)
      .append('<hr class="mtb05" />')
      .append(createConnectionButton)
      .append(keyValueButton)
      .append(saveServiceButton);

    return formContainer;
  };
  MService.prototype.events = {
    onSave: function (service) {
      service.loadForm(function(err, result) {
        if (err) {
          console.error(err);
        } else {
          if (result) {
            result.module.service = service;
            result.module.dashboard.save(result.module.dashboard.events.onSaved);
          } else {
            console.error('Could not load form values');
          }
        }
      });
    },
    onConnectionSave: function (service) {
      service = service.loadConnectionForm();
    }
  };

  MDialog = function(_options, owner) {
    var self = this;
    this.uid = getUniqueId(globalUniqueIdLength);
    this.name = 'MDialog';
    this.dashboard = null;
    this.activePage = null;
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
  MDialog.prototype.events = {
    onDialogReady: function(dialog) {
      // when the first time dialgo showed up
    },
    onPageReady: function(dialogPage) {
      // when dialog page changed
    },
    onDialogClosed: function(dialog) {
      dialog.dealloc();
    }
  };
  MDialog.prototype.getPage = function(identifier, animationType) {
    var self = this;

    if (identifier && _.isNumber(identifier)) {
      if (self.pages && self.pages.length > identifier) {
        selectedPage = self.pages[index];
        selectedPage.dialog.activePage = selectedPage.uid;
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
          selectedPage.dialog.activePage = selectedPage.uid;
        }

        if (page) {
          return page.build(animationType);
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
   	var sizeX = 200, sizeY = 177;
   	var frag = document.createDocumentFragment();
   	for (var row = 0, rl = content.clientHeight/sizeY; row < rl; row++) {
   		for (var cell = 0, cl = content.clientWidth/sizeX; cell < cl; cell++) {
   			elem = document.createElement("div");
   			elem.className = "scroller-cell";
   			//elem.style.backgroundColor = row%2 + cell%2 > 0 ? "#ccc" : "";
   			elem.innerHTML = '&nbsp;';
   			frag.appendChild(elem);
   		}
   	}
   	content.appendChild(frag);


    if (self.dashboard && self.dashboard.orchestrator) {
      self.dashboard.orchestrator.render(panel);
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
   		container.addEventListener("touchstart", function(e) {
   			// Don't react if initial down happens on a form element
   			if (e.target.tagName.match(/input|textarea|select/i)) {
   				return;
   			}

   			scroller.doTouchStart(e.touches, e.timeStamp);
   			e.preventDefault();
   		}, false);

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
  MDialog.prototype.dealloc = function() {
    var self = this;

    // frees scroller events
    if (self.dashboard && self.dashboard.orchestrator) {
      self.dashboard.orchestrator.clear();
    }
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
      icon: 'fa-question',
      align: 'left'
    };
    this.bodyOptions = {
      hasScroller: false,
      hasWell: false,
      container: $('<div id="dialog-content-id"></div>'),
      content: $('<div id="dialog-inner-content"></div>'),
      scroller: $('<div id="scroller-container"><div id="scroller-content"><div id="scroller-panel"></div></div></div>')
    };
    this.footerOptions = {
      buttons: [{
        name: 'Close Dialog',
        icon: 'fa-sign-out'
      }]
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
    return headerClass;
  };
  MDialogPage.prototype.setBody = function(_options) {
    var self = this,
        _options = _options || {},
        container = self.bodyOptions.container,
        content = self.bodyOptions.content ? self.bodyOptions.content.addClass('clearfix') : null,
        scroller = self.bodyOptions.scroller;

    _.extend(_options, self.bodyOptions);

    if (self.bodyOptions.hasWell) {
      content.addClass('dialog-well');
    }
    if (self.bodyOptions.hasScroller) {
      content.append(scroller);
    }
    return container.append(content);
  };
  MDialogPage.prototype.setFooter = function(_options) {
    var self = this,
        buttons = [],
        _options = _options || {},
        footerContainer = $('<div class="dialog-footer clearfix"></div>');

    _.extend(_options, self.footerOptions);

    _.each(self.footerOptions.buttons, function(button, index) {
      var btn = $('<button type="button" class="button"></button>'),
          keys = Object.keys(button);

      _.each(keys, function(key, index) {
        switch (key) {
          case 'id':
            btn.attr('id', button.id);
            break;
          case 'icon':
            btn.append(
              $('<div class="pull-left"></div>').append(
                $('<i class="fa fa-3x fa-white ' + button.icon + '"></i>')));
            break;
          case 'name':
            btn.append($('<div class="button-text pull-right">' + button.name + '</div>'));
            break;
          case 'class':
            btn.addClass(button.class);
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
        }
      });

      buttons.push(btn);
      footerContainer.append(btn);
    });

    return footerContainer;
  };
  MDialogPage.prototype.build = function(animationType) {
    var self = this,
        header = self.setHeader(),
        body = self.setBody(),
        footer = self.setFooter(),
        existingDialog = $('.dialog'),
        dialogIsActive = existingDialog.length > 0,
        dialogContainer = dialogIsActive ? existingDialog : $('<div class="dialog"></div>');

    self.dialog.container = dialogContainer;
    var render = null;

    if (!dialogIsActive) {
      render = dialogContainer.append(header).append(body).append(footer);
      self.dialog.boxer = $.boxer(render);
    } else {
      if (animationType) {
        switch(animationType) {
          case 'slideUpDown':
            dialogContainer.slideUp(400, function() {
              render = dialogContainer.empty().append(header).append(body).append(footer);
              dialogContainer.slideDown(400, function() {
                self.dialog.events.onPageReady(self);
              });
            });
            break;
        }
      } else {
        render = dialogContainer.empty().append(header).append(body).append(footer);
        self.dialog.events.onPageReady(self);
      }
    }

    $(window).bind('open.boxer', function(event) {
      var contentHeight = $('.boxer-container').height() - 215;
          contentWidth = $('.boxer-container').width() - 15;

      self.dialog.width = contentWidth;
      self.dialog.height = contentHeight;

      $('#dialog-inner-content').width(contentWidth).height(contentHeight);
      $('#scroller-container').width(contentWidth).height(contentHeight);

      if (self.bodyOptions.hasScroller) {
        self.dialog.activateScroller();
      }

      self.dialog.events.onDialogReady(self.dialog);
    });
  };

  managementDialog = new MDialog();

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
   * Holds connectors and various settings for scroller area
   * Combines visualization library, connector and user function
   * renders them
   * @return {*}
   * @constructor
   */
  MOrchestrator = function(_options, dashboard) {
    this.uid = getUniqueId(globalUniqueIdLength);
    this.name = 'MOrchestration';
    this.container = null;

    _.extend(this, _options);

    this.dashboard = dashboard;

    return this;
  };
  MOrchestrator.prototype.serialize = function() {
    var self = this,
        serialized = {};

    serialized.uid = self.uid;
    serialized.name = self.name;
    serialized.dashboard = self.dashboard.uid;

    return serialized;
  };
  MOrchestrator.prototype.deserialize = function(data, dashboard) {
    var self = this;

    self.uid = data.uid;
    self.name = data.name;
    self.dashboard = dashboard;

    return self;
  };
  MOrchestrator.prototype.render = function(container) {
    if (container &&
        self.dashboard &&
        self.dashboard.modules &&
        self.dashboard.modules.length > 0) {

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

      function drawModule(module, index) {
        function getImage(path, callback) {
          var image = new Image;
          image.onload = function() { callback(image); };
          image.src = path;
        }

        getImage(module.image, function(result) {
          var width = result.width,
              height = result.height,
              item = $('<img />').attr('src', module.image).addClass('m-module');

          if (width > 128) {
            var ratio = 128 / width,
                newWidth = Math.ceil(width * ratio) + 'px',
                newHeight = Math.ceil(height * ratio) + 'px';

            item.css({
              width: newWidth,
              height: newHeight
            });
          }

          item.click(function(event) {
            item.toggleClass('m-selected');
            if (item.hasClass('m-selected')) {
              module.onSelected(module);
            } else {
              module.onDeselected(module);
            }
          });

          managementContainer.append(item);

        });
      }

      _.each(modules, function(module, index) {
        drawModule(module, index);
      });

      ///////////////

    } else if (container) {
      $(container).html('<h3 style="margin:1em">Please create at least one module to begin</h3>');
    }
  };
  MOrchestrator.prototype.clear = function() {
    var self = this;
    if (self.container) {
      $(self.container).empty();
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

}(this));