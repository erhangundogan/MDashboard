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
      };

  /**
   * MDashboard
   * @returns {*}
   * @constructor
   */
  MDashboard = function () {
    this.uid = getUniqueId(globalUniqueIdLength);
    this.userId = 499;
    this.isAdmin = true; // TODO
    this.options = {};
    this.collections = [];
    this.modules = [];
    this.data = localStorage['dashboard' + this.userId]
      ? $.parseJSON('dashboard' + this.userId)
      : null;
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

  MDashboard.prototype.save = function() {

    var self = this,
        dataId = 'dashboard' + this.userId;

    function saveImage(itemName) {
      var img = new Image();
      img.src = 'mypicture.png';
      img.load = function() {
        var canvas = $('<canvas></canvas>');
        var context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);
        var data = context.getImageData(x, y, img.width, img.height).data;
        localStorage.setItem(itemName, data);
      };
    }

    function loadImage(itemName) {
      var picture = localStorage.getItem(itemName);
      $('<img />').attr('src', picture);
    }

    localStorage.setItem(dataId, JSON.stringify(self));
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
      container.slideUp(500, function() {
        var module = new MModule();

        module.dashboard = collection.dashboard;
        var form = module.createForm();

        container.empty().append(form).slideDown(500);
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
          content = $('<div class="mt10 clearfix"></div>'),
          modules = collection.dashboard.modules,
          noModuleMessage = $('<div class="ml10">Please add some modules, services and bind your data to widgets and charts.</div>'),
          createModuleButton = $('<button type="button" class="button">Create Module</button>')
            .click(function(event) {
              event.preventDefault();
              collection.events.onCreateModule(collection, content);
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
        swiper.reInit();
      });
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
    this.description = null;
    this.parent = module;
    this.modules = [];
    this.tags = [];
    this.service = null;
    this.dashboard = null;

    this.css = {};
    this.class = null;
    //this.content = $('<img src="#" />');

    return this;
  };
  MModule.prototype.parent = typeof MModule;
  MModule.prototype.service = typeof MService;
  MModule.prototype.dashboard = typeof MDashboard;

  MModule.prototype.createForm = function() {
    var self = this,
        formContainer = $('<div class="module-container"></div>'),
        form = $('<form class="form"></form>'),
        formRow = $('<form class="form-row"></form>');

    _.each(self, function(value, key) {
      var propertyRequired = false,
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
          item.append($('<textarea class="item-textarea" rows="3"></textarea>'));
          propertyRequired = true;
          break;
        case 'image':
          label.append($('<span>Image</span>'));
          item.append($('<input class="item-image" type="file" />'));
          propertyRequired = true;
          break;
      }

      if (propertyRequired) {
        formRow.append(label).append(columnBreak).append(item)
        form.append(formRow);
      }
    });

    var saveModuleButton = $('<button type="button" class="button">Save Module</button>')
      .click(function(event) {
        event.preventDefault();
        debugger;
        self.dashboard.modules.push(self);
        self.dashboard.save();
      })
      .append($('<i class="fa fa-save fa-2x fa-white pull-left"></i>'));

    formContainer.append(form).append(saveModuleButton);

    return formContainer;
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

    switch (owner) {
      case (typeof MModule):
        self.module = owner;
        owner.service.push(self);
        break;
      default:
        owner.service = self;
        break;
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