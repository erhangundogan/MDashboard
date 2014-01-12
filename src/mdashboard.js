/*
 Merlon Dashboard
 HTML5 Dashboards & Widgets
 Created by Erhan Gundogan <erhan.gundogan@gmail.com>
 MIT License
 */

var MDashboard, MWidgetCollection, MWidget, MChart, MService, MModule;
(function (global) {

  var globalUniqueIdLength = 32,
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

  /**
   * MDashboard
   * @returns {*}
   * @constructor
   */
  MDashboard = function () {
    this.uid = getUniqueId(globalUniqueIdLength);
    this.userId = 499;
    this.isAdmin = true; // TODO
    this.isLoaded = false;
    this.options = {};
    this.collections = [];
    this.modules = [];
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

    if (self.userId) {
      var dataId = 'dashboard' + self.userId,
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
        dataId = 'dashboard' + this.userId,
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
    serialized.userId = self.userId;
    serialized.isAdmin = self.isAdmin;
    serialized.options = self.options;

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
      var addButton = $('<a href="#" class="btn"><i class="fa fa-3x fa-plus-square"></i></a>')
        .attr('title', 'Add Widget')
        .click(function () {
          self.events.onAddWidget(self);
        });
      buttons.push(addButton);

      // Add management button
      if (self.dashboard.isAdmin) {
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
    onCreateModule: function (collection, container) {
      container.slideUp(400, function() {
        var module = new MModule();

        $('#dialog-inner-content').height($('.boxer-container').height() - 150);

        module.dashboard = collection.dashboard;

        // creates management dialog new module form
        var form = module.createForm();

        var section = container.find('#dialog-inner-content');
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
    onCreateService: function (swiper) {
      var moduleId = $(swiper.clickedSlide).attr('data-uid');
      if (!moduleId) {
        debugger;
      }
    },
    onManageServices: function(collection) {
      var managementDialog = $('<div class="dialog management"></div>'),
          serviceIcon = $('<i class="fa fa-cogs fa-4x fa-white pull-left mr05"></i>'),
          container = $('<div id="dialog-content-id"></div>'),
          content = $('<div id="dialog-inner-content" class="mt10 clearfix"></div>'),
          modules = collection.dashboard.modules,
          noModuleMessage = $('<div class="ml10">Please add some modules, services and bind your data to widgets and charts.</div>'),
          createModuleButton = $('<button type="button" class="button">Create Module</button>')
            .click(function(event) {
              event.preventDefault();
              collection.events.onCreateModule(collection, container);
            })
            .append($('<i class="fa fa-puzzle-piece fa-2x fa-white pull-left"></i>'));

      // header
      managementDialog.append(
        $('<div class="dialog-header clearfix"></div>')
          .append(serviceIcon)
          .append($('<h1 class="pull-left">Management Services</h1>')));

      // no module
      if (modules.length === 0) {
        $.boxer(managementDialog.append(
          container.append(
            content.append(noModuleMessage)
                   .append(createModuleButton))));

        $(window).bind('open.boxer', function(event) {
          var dialogHeight = $('.boxer-container').height();
          $('#dialog-inner-content').height(dialogHeight - 150);
          if (swiper) swiper.reInit();
        });

        return;
      }

      var roller = $('<div class="swiper-container"></div>'),
          wrapper = $('<div class="swiper-wrapper"></div>'),
          dialogBody = $('<div class="dialog-body"></div>');

      // adding modules to slider
      if (modules && modules.length > 0) {
        _.each(modules, function(module, index) {
          var item = $('<div class="swiper-slide"></div>').attr('data-uid', module.uid);
          if (module.css) {
            item.css(module.css)
          }
          if (module.class) {
            item.addClass(module.class);
          }
          if (module.content) {
            item.append(module.content);
          }
          wrapper.append(item);
        });
      }

      // nav buttons
      container.append(
        $('<a href="#" class="btn pull-left swiper-button mr025"><i class="fa fa-3x fa-chevron-circle-left"></i></a>')
        .click( function() { swiper.swipePrev() }));
      container.append(dialogBody.append(roller.append(wrapper)));
      container.append(
        $('<a href="#" class="btn pull-left swiper-button ml025"><i class="fa fa-3x fa-chevron-circle-right"></i></a>')
        .click( function() { swiper.swipeNext() }));

      container.append(createModuleButton.css('margin-left', '45px'));

      $.boxer(managementDialog.append(container));

      // http://www.idangero.us/sliders/swiper/api.php
      var swiper = roller.swiper({
        slidesPerView: 2,
        loop: false,
        onSlideClick: collection.events.onCreateService
      });

      $(window).bind('open.boxer', function(event) {
        var dialogHeight = $('.boxer-container').height();
        $('#dialog-inner-content').height(dialogHeight - 150);
        if (swiper) swiper.reInit();
      });
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
      this.chart = new MChart(this, this.chart);
    }

    var self = this;
    var collectionInitialized = setInterval(function () {
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
          var headerText = (self.header && _.isString(self.header) ? self.header :
            (self.header && self.header instanceof jQuery ? self.header.text() : ''));
          var header = $('<' + widgetHandle + '>' + headerText + '</' + widgetHandle + '>').attr('id', 'mwidget-header-' + self.order);
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

    if (self.header) {
      var headerHeight = self.header.height();
      self.height = self.height - headerHeight;

      if (self.header.css) {
        var headerPaddingTop = parseInt(self.header.css('padding-top')) || 0;
        var headerPaddingBottom = parseInt(self.header.css('padding-bottom')) || 0;
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

    // html content
    if (self.html) {
      serialized.html = JSON.stringify(self.html);
    }

    // charts
    if (self.chart) {
      serialized.chart = self.chart.serialize();
    }

    return serialized;
  };
  MWidget.prototype.deserialize = function(data, owner) {
    var self = this;

    self.contentType = data.contentType;
    self.col = data.col;
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

    if (data.html) {
      self.html = $.parseJSON(data.html);
    }

    if (data.chart) {
      var newChart = new MChart(self);
      self.chart = newChart.deserialize(data.chart, self);
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

    if (data.dataset && /function/.test(data.dataset)) {
      self.dataset = new Function(['widget'], data.dataset);
    } else {
      self.dataset = $.parseJSON(data.dataset);
    }

    if (data.render && /function/.test(data.render)) {
      self.render = new Function(['widget', 'callback'], data.render);
    } else {
      self.render = $.parseJSON(data.render);
    }

    if (data.style && /function/.test(data.style)) {
      self.style = new Function(['widget'], data.style);
    } else {
      self.style = $.parseJSON(data.style);
    }

    if (data.config) {
      self.options = $.parseJSON(data.config);
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
    this.name = "MModule";
    this.image = null;
    this.icon = null;
    this.description = null;
    this.parent = module;
    this.modules = [];
    this.tags = [];
    this.service = null;
    this.dashboard = null;

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
            if (uploadControl.files[0].size > 3000000) { // ~3MB
              message = 'Image file size should be less than 3MB';
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
          message = 'File not found or not an image file';
          callback(message);
        }
        //localStorage.setItem('image', data); // save image data
    }
  };
  /**
   * Creates module generation form fields
   * @return {*|jQuery|HTMLElement}
   */
  MModule.prototype.createForm = function() {
    var self = this,
        formContainer = $('<div class="module-container"></div>'),
        form = $('<form class="form"></form>');

    _.each(self, function(value, key) {
      var propertyRequired = false,
          formRow = $('<div class="form-row"></div>'),
          label = $('<div class="form-label"></div>'),
          item = $('<div class="form-item"></div>'),
          columnBreak = $('<div class="form-break"><span>&nbsp;:&nbsp;</span></div>');

      switch(key) {
        case 'uid':
          label.append($('<span>ID</span>'));
          item.append($('<span class="item-uid">' + value + '</span>'));
          propertyRequired = true;
          break;
        case 'name':
          label.append($('<span>Name</span>'));
          item.append($('<input class="item-name" type="text" required autofocus />'));
          propertyRequired = true;
          break;
        case 'tags':
          label.append($('<span>Tags</span>'));
          item.append($('<input class="item-tags" type="text" />'));
          propertyRequired = true;
          break;
        case 'description':
          label.append($('<span>Description</span>')).css('vertical-align', 'top');
          columnBreak.css('vertical-align', 'top');
          item.append($('<textarea class="item-description" rows="3"></textarea>'));
          propertyRequired = true;
          break;
        case 'image':
          label.append($('<span>Image</span>'));
          item.append($('<input class="item-image" type="file" />'));
          propertyRequired = true;
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
          break;
      }

      if (propertyRequired) {
        formRow.append(label).append(columnBreak).append(item);
        form.append(formRow);
      }
    });

    var saveModuleButton = $('<button type="button" class="button">Save Module</button>')
      .click(function(event) {
        event.preventDefault();
        $('.dialog').prop('disabled', true).addClass('passive-dialog loading');

        // Save dashboard
        self.events.onSave(self);
      })
      .append($('<i class="fa fa-save fa-2x fa-white pull-left"></i>'));

    formContainer.append(form.append(saveModuleButton));

    return formContainer;
  };
  MModule.prototype.events = {
    onSave: function (collection) {
      collection.loadForm(function(err, result) {
        if (err) {
          console.error(err);
        } else {
          if (result) {
            result.dashboard.modules.push(collection);
            result.dashboard.save(result.dashboard.events.onSaved);
          } else {
            console.error('Could not load form values');
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

    self.dashboard = dashboard;

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
    this.requests = [];
    this.responses = [];
    this.isInitialized = false;
    this.isScheduled = false;
    this.module = null;

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
    serialized.schedule = self.schedule;
    serialized.isScheduled = self.isScheduled;
    serialized.ajaxOptions = self.ajaxOptions;

    // parent module
    serialized.module = self.module ? self.module.uid : null;

    return serialized;
  };
  MService.prototype.deserialize = function(data, owner) {
    var self = this;

    self.uid = data.uid;
    self.name = data.name;
    self.schedule = data.schedule;
    self.isScheduled = data.isScheduled;
    self.ajaxOptions = data.ajaxOptions;
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
      var requestItem = {
        id: getUniqueId(globalUniqueIdLength),
        time: new Date()
      };

      self.requests.push(requestItem);
      _.extend(self.ajaxOptions, {
        context: requestItem
      });

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
   * MService ajaxOptions .error
   * @param request
   * @param status
   */
  MService.prototype.fail = function (request, status, error) {
    var self = this;
    self.responses.push({
      id: getUniqueId(globalUniqueIdLength),
      time: new Date(),
      requestId: request.id,
      requestTime: request.time,
      ajaxRequest: request,
      status: status,
      error: error
    });
    self.isInitialized = true;
  };
  /**
   * MService ajaxOptions .success
   * @param data
   * @param status
   * @param request
   */
  MService.prototype.done = function (data, status, request) {
    var self = this;

    self.responses.push({
      id: getUniqueId(globalUniqueIdLength),
      time: new Date(),
      requestId: request.id,
      requestTime: request.time,
      request: request,
      status: status,
      data: data
    });

    self.isInitialized = true;
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

}(this));