/* 
 * Boxer v3.0.0 - 2014-01-04 
 * A jQuery plugin for displaying images, videos or content in a modal overlay. Part of the Formstone Library. 
 * http://formstone.it/boxer/ 
 * 
 * Copyright 2014 Ben Plum; MIT Licensed 
 */ 

/** 
 * @plugin 
 * @name Boxer 
 * @description A jQuery plugin for displaying images, videos or content in a modal overlay. Part of the Formstone Library. 
 * @version 3.0.0 
 */ 

;(function ($, window) {
	"use strict";
	
	var data = {},
		trueMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test((window.navigator.userAgent||window.navigator.vendor||window.opera));
	
	/**
	 * @options
	 * @param callback [function] <$.noop> "Funciton called after opening instance"
	 * @param customClass [string] <''> "Class applied to instance"
	 * @param duration [int] <250> "Animation duration"
	 * @param fixed [boolean] <false> "Flag for fixed positioning"
	 * @param formatter [function] <$.noop> "Caption format function"
	 * @param height [int] <100> "Initial height (while loading)"
	 * @param labels.close [string] <'Close'> "Close button text"
	 * @param labels.count [string] <'of'> "Gallery count separator text"
	 * @param labels.next [string] <'Next'> "Gallery control text"
	 * @param labels.previous [string] <'Previous'> "Gallery control text"
	 * @param margin [int] <100> "Margin subtracted when sizing"
	 * @param minHeight [int] <100> "Minimum height of modal"
	 * @param minWidth [int] <100> "Minimum width of modal"
	 * @param mobile [boolean] <false> "Flag to force 'mobile' rendering"
	 * @param opacity [number] <0.75> "Overlay target opacity"
	 * @param retina [boolean] <false> "Use 'retina' sizing (half's natural sizes)"
	 * @param requestKey [string] <'boxer'> "GET variable for ajax / iframe requests"
	 * @param top [int] <0> "Opacity of overlay"
	 * @param videoRadio [number] <0.5625> "Video height / width ratio (9 / 16 = 0.5625)"
	 * @param videoWidth [int] <600> "Video target width"
	 * @param width [int] <100> "Initial height (while loading)"
	 */ 
	var options = {
		callback: $.noop,
		customClass: "",
		duration: 250,
		fixed: false,
		formatter: $.noop,
		height: 100,
		labels: {
			close: "Close",
			count: "of",
			next: "Next",
			previous: "Previous"
		},
		margin: 100,
		minHeight: 100,
		minWidth: 100,
		mobile: false,
		opacity: 0.75,
		retina: false,
		requestKey: "boxer",
		top: 0,
		videoRatio: 0.5625,
		videoWidth: 600,
		width: 100
	};
	
	/**
	 * @events
	 * @event open.boxer "Modal opened"
	 * @event close.boxer "Modal closed"
	 */
	
	var pub = {
		
		/**
		 * @method 
		 * @name defaults
		 * @description Sets default plugin options
		 * @param opts [object] <{}> "Options object"
		 * @example $.boxer("defaults", opts);
		 */
		defaults: function(opts) {
			options = $.extend(options, opts || {});
			return $(this);
		},
		
		/**
		 * @method 
		 * @name destroy
		 * @description Removes instance of plugin
		 * @example $.boxer("destroy");
		 */
		destroy: function() {
			_onClose();
			return $(this).off(".boxer");
		},
		
		/**
		 * @method 
		 * @name resize
		 * @description Triggers resize of instance
		 * @example $.boxer("resize");
		 */
		resize: function(e /* , height, width */) { 
			// removing custom size support - will return later
			if (typeof data.$boxer !== "undefined") {
				if (data.type === "element") {
					_sizeContent(data.$content.find(">:first-child"));
				} else if (data.type === "image") {
					_sizeImage(0);
				} else if (data.type === "video") {
					_sizeVideo();
				}
				_size();
			}
			
			return $(this);
		}
	};
	
	/**
	 * @method private
	 * @name _init
	 * @description Initializes plugin
	 * @param opts [object] "Initialization options"
	 */
	function _init(opts) {
		options.formatter = _formatCaption;
		return $(this).on("click.boxer", $.extend({}, options, opts || {}), _build);
	}
	
	/**
	 * @method private
	 * @name _build
	 * @description Builds target instance
	 * @param e [object] "Event data"
	 */
	function _build(e) {
		_killEvent(e);
		
		// Check target type
		var $target = $(this),
			$object = e.data.$object,
			source = ($target[0].attributes) ? $target.attr("href") || "" : "",
			checkExt = source.toLowerCase().split("."),
			extension = checkExt[ checkExt.length - 1 ],
			type = $target.data("type") || "";
		
		var isImage    = ( (type === "image") || (extension === "jpeg" || extension === "jpg" || extension === "gif" || extension === "png" || source.substr(0, 10) === "data:image") ),
			isVideo    = ( source.indexOf("youtube.com/embed") > -1 || source.indexOf("player.vimeo.com/video") > -1 ),
			isUrl      = ( (type === "url") || (!isImage && !isVideo && source.substr(0, 4) === "http") ),
			isElement  = ( (type === "element") || (!isImage && !isVideo && !isUrl && source.substr(0, 1) === "#") ),
			isObject   = ( (typeof $object !== "undefined") );
		
		// Check if one already exists
		if ($("#boxer").length < 1 && (isImage || isVideo || isUrl || isElement || isObject)) {
			// Cache internal data
			data = {
				$window: $(window),
				$body: $("body"),
				$target: $target,
				$object: $object,
				visible: false,
				resizeTimer: null,
				touchTimer: null,
				gallery: {
					active: false
				},
				options: e.data,
				isMobile: ((trueMobile || e.data.mobile) /* && !isUrl */ && !isElement /* && !isObject */)
			};
			
			if (isImage) {
				data.type = "image";
			} else if (isVideo) {
				data.type = "video";
			} else {
				data.type = "element";
			}
			
			if (isImage || isVideo) {
				// Check for gallery
				var rel = data.$target.attr("rel");
				if (typeof rel !== "undefined" && rel !== false) {
					data.gallery.active = true;
					data.gallery.rel = rel;
					data.gallery.$items = $("a[rel= " + data.gallery.rel + "]");
					data.gallery.index = data.gallery.$items.index(data.$target);
					data.gallery.total = data.gallery.$items.length - 1;
				}
			}
			
			// Assemble HTML
			var html = '';
			if (!data.isMobile) {
				html += '<div id="boxer-overlay" class="' + data.options.customClass + '" style="opacity: 0"></div>';
			}
			html += '<div id="boxer" class="loading ' + data.options.customClass;
			if (data.isMobile) {
				html += ' mobile';
			}
			if (isUrl) {
				html += ' iframe';
			}
			if (isElement || isObject) {
				html += ' inline';
			}
			html += '" style="opacity: 0;';
			if (data.options.fixed === true) {
				html += ' position: fixed;';
			}
			html += '">';
			html += '<span class="boxer-close">' + data.options.labels.close + '</span>';
			html += '<div class="boxer-container" style="';
			if (data.isMobile) {
				html += 'height: 100%; width: 100%';
			} else {
				html += 'height: ' + data.options.height + 'px; width: ' + data.options.width + 'px';
			}
			html += '">';
			html += '<div class="boxer-content" style="opacity: 0;">';
			if (isImage || isVideo) {
				html += '<div class="boxer-meta">';
				
				if (data.gallery.active) {
					html += '<div class="boxer-arrow previous">' + data.options.labels.previous + '</div>';
					html += '<div class="boxer-arrow next">' + data.options.labels.next + '</div>';
					html += '<p class="boxer-position"';
					if (data.gallery.total < 1) { 
						html += ' style="display: none;"'; 
					}
					html += '>';
					html += '<span class="current">' + (data.gallery.index + 1) + '</span> ' + data.options.labels.count + ' <span class="total">' + (data.gallery.total + 1) + '</span>';
					html += '</p>';
					html += '<div class="boxer-caption gallery">';
				} else {
					html += '<div class="boxer-caption">';
				}
				
				html += data.options.formatter.apply(data.$body, [data.$target]);
				html += '</div></div>'; // caption, meta
			}
			html += '</div></div></div>'; //container, content, boxer
			
			// Modify Dom
			data.$body.append(html);
			
			// Cache jquery objects
			data.$overlay = $("#boxer-overlay");
			data.$boxer = $("#boxer");
			data.$container = data.$boxer.find(".boxer-container");
			data.$content = data.$boxer.find(".boxer-content");
			data.$meta = data.$boxer.find(".boxer-meta");
			data.$position = data.$boxer.find(".boxer-position");
			data.$caption = data.$boxer.find(".boxer-caption");
			data.$arrows = data.$boxer.find(".boxer-arrow");
			data.$animatables = $("#boxer-overlay, #boxer, .boxer-container");
			data.paddingVertical = parseInt(data.$boxer.css("paddingTop"), 10) + parseInt(data.$boxer.css("paddingBottom"), 10);
			data.paddingHorizontal = parseInt(data.$boxer.css("paddingLeft"), 10) + parseInt(data.$boxer.css("paddingRight"), 10);
			
			// Center / update gallery
			_center();
			if (data.gallery.active) {
				_updateControls();
			}
			
			// Bind events
			data.$window.on("resize.boxer", pub.resize)
						.on("keydown.boxer", _onKeypress);
			data.$body.on("touchstart.boxer click.boxer", "#boxer-overlay, #boxer .boxer-close", _onClose)
					  .on("touchmove.boxer", _killEvent);
			
			if (data.gallery.active) {
				data.$boxer.on("touchstart.boxer click.boxer", ".boxer-arrow", _advanceGallery);
			}
			
			data.$overlay.stop().animate({ opacity: data.options.opacity }, data.options.duration);
			data.$boxer.stop().animate({ opacity: 1 }, data.options.duration, function() { 
				if (isImage) {
					_loadImage(source);
				} else if (isVideo) {
					_loadVideo(source);
				} else if (isUrl) {
					_loadURL(source);
				} else if (isElement) {
					_cloneElement(source);
				} else if (isObject) {
					_appendObject(data.$object);
				} else {
					$.error("BOXER: '" +  source + "' is not valid.");
				}
			});
		}
		if (isObject) {
			return data.$boxer;
		}
	}
	
	/**
	 * @method private
	 * @name _open
	 * @description Opens active instance
	 */
	function _open() {
		var newLeft = 0,
			newTop = 0,
			arrowHeight = 0,
			durration = data.isMobile ? 0 : data.options.duration;
			
		if (!data.isMobile) {
			newLeft = (data.$window.width() - data.contentWidth - data.paddingHorizontal) / 2;
			newTop = (data.options.top <= 0) ? ((data.$window.height() - data.contentHeight - data.paddingVertical) / 2) : data.options.top;
			arrowHeight = data.$arrows.outerHeight();
			
			if (data.options.fixed !== true) {
				newTop += data.$window.scrollTop();
			}
			
			data.$arrows.css({ 
				marginTop: ((data.contentHeight - data.metaHeight - arrowHeight) / 2) 
			});
		}
		
		// 
		if (!data.visible && data.isMobile && data.gallery.active) {
			data.$content.on("touchstart.boxer", ".boxer-image", _onTouchStart);
		}
		
		if (data.isMobile || data.options.fixed) {
			data.$body.addClass("boxer-open");
		}
		
		data.$boxer.stop().animate({ left: newLeft, top: newTop }, durration);
		data.$container.show().stop().animate({ height: data.containerHeight, width: data.containerWidth }, durration, function(e) {
			data.$content.stop().animate({ opacity: 1 }, data.options.duration);
			data.$boxer.removeClass("loading")
					   .find(".boxer-close").stop().animate({ opacity: 1 }, data.options.duration);
			
			data.visible = true;
			
			// Fire callback + event
			data.options.callback.apply(data.$boxer);
			data.$window.trigger("open.boxer");
			
			// Start preloading
			if (data.gallery.active) {
				_preloadGallery();
			}
		});
	}
	
	/**
	 * @method private
	 * @name _size
	 * @description Sizes active instance
	 * @param animate [boolean] <false> "Flag to animate sizing"
	 */
	function _size(animate) {
		animate = animate || false;
		
		if (data.visible) {
			var newLeft = 0,
				newTop = 0,
				arrowHeight = 0;
			
			if (!data.isMobile) {
				newLeft = (data.$window.width() - data.contentWidth - data.paddingHorizontal) / 2;
				newTop = (data.options.top <= 0) ? ((data.$window.height() - data.contentHeight - data.paddingVertical) / 2) : data.options.top;
				arrowHeight = data.$arrows.outerHeight();
				
				if (data.options.fixed !== true) {
					newTop += data.$window.scrollTop();
				}
				
				data.$arrows.css({ 
					marginTop: ((data.contentHeight - data.metaHeight - arrowHeight) / 2) 
				});
			}
			
			if (animate) {
				data.$boxer.stop().animate({ left: newLeft, top: newTop }, data.options.duration);
				data.$container.show().stop().animate({ height: data.containerHeight, width: data.containerWidth });
			} else {
				data.$boxer.css({ left: newLeft, top: newTop });
				data.$container.css({ height: data.containerHeight, width: data.containerWidth });
			}
		}
	}
	
	/**
	 * @method private
	 * @name _onClose
	 * @description Closes active instance
	 * @param e [object] "Event data"
	 */
	function _onClose(e) {
		_killEvent(e);
		
		if (typeof data.$animatables !== "undefined") {
			data.$animatables.stop().animate({ opacity: 0 }, data.options.duration, function() {
				$(this).remove();
			});
			
			_clearTimer(data.resizeTimer);
			
			// Clean up
			data.$window.off(".boxer");
			data.$body.off(".boxer")
					  .removeClass("boxer-open");
			
			if (data.gallery.active) {
				data.$boxer.off(".boxer");
			}
			
			if (data.isMobile) {
				if (data.type === "image" && data.gallery.active) {
					data.$container.off(".boxer");
				}
			}
			
			data.$window.trigger("close.boxer");
			
			data = {};
		}
	}
	
	/**
	 * @method private
	 * @name _center
	 * @description Centers instance
	 */
	function _center() {
		var newLeft = 0,
			newTop  = 0;
		
		if (!data.isMobile) {
			newLeft = (data.$window.width() - data.$boxer.width() - data.paddingHorizontal) / 2;
			newTop  = (data.options.top <= 0) ? ((data.$window.height() - data.$boxer.height() - data.paddingVertical) / 2) : data.options.top;
			
			if (data.options.fixed !== true) {
				newTop += data.$window.scrollTop();
			}
		}
		
		data.$boxer.css({ 
			left: newLeft, 
			top:  newTop 
		});
	}
	
	/**
	 * @method private
	 * @name _loadImage
	 * @description Loads source image
	 * @param source [string] "Source image URL"
	 */
	function _loadImage(source) {
		// Cache current image
		data.$image = $("<img />");
		
		data.$image.one("load.boxer", function() {
			var naturalSize = _naturalSize(data.$image);
			
			data.naturalHeight = naturalSize.naturalHeight;
			data.naturalWidth  = naturalSize.naturalWidth;
			
			if (data.options.retina) {
				data.naturalHeight /= 2;
				data.naturalWidth  /= 2;
			}
			
			data.$content.prepend(data.$image);
			if (data.$caption.html() === "") { 
				data.$caption.hide(); 
			} else { 
				data.$caption.show(); 
			}
			
			// Size content to be sure it fits the viewport
			if (_sizeImage(0)) {
				_open();
			}
		}).attr("src", source)
		  .addClass("boxer-image");
		
		// If image has already loaded into cache, trigger load event
		if (data.$image[0].complete || data.$image[0].readyState === 4) {
			data.$image.trigger("load");
		}
	}
	
	/**
	 * @method private
	 * @name _loadVideo
	 * @description Loads source video
	 * @param source [string] "Source video URL"
	 */
	function _loadVideo(source) {
		data.$videoWrapper = $('<div class="boxer-video-wrapper" />');
		data.$video = $('<iframe class="boxer-video" />');
		
		data.$video.attr("src", source)
				   .addClass("boxer-video")
				   .prependTo(data.$videoWrapper);
		
		data.$content.prepend(data.$videoWrapper);
		
		_sizeVideo();
		
		_open();
	}
	
	/**
	 * @method private
	 * @name _formatCaption
	 * @description Formats caption
	 * @param $target [jQuery object] "Target element"
	 */
	function _formatCaption($target) {
		var title = $target.attr("title");
		return (title !== "" && title !== undefined) ? '<p class="caption">' + title + '</p>' : "";
	}
	
	/**
	 * @method private
	 * @name _sizeImage
	 * @description Sizes image to fit in viewport
	 * @param count [int] "Number of resize attempts"
	 * @return [boolean] "True once sized"
	 */
	function _sizeImage(count) {
		data.windowHeight = data.viewportHeight = (count === 0) ? data.$window.height() : data.windowHeight;
		data.windowWidth  = data.viewportWidth  = (count === 0) ? data.$window.width()  : data.windowWidth;
		
		data.imageHeight  = (count === 0) ? data.naturalHeight : data.$image.outerHeight();
		data.imageWidth   = (count === 0) ? data.naturalWidth  : data.$image.outerWidth();
		data.metaHeight   = (count === 0) ? 0 : data.metaHeight;
		
		if (count === 0) {
			data.ratioHorizontal = data.imageHeight / data.imageWidth;
			data.ratioVertical   = data.imageWidth  / data.imageHeight;
			
			data.isWide = (data.imageWidth > data.imageHeight);
		}
		
		// Double check min and max
		if (data.imageHeight < data.options.minHeight) {
			data.options.minHeight = data.imageHeight;
		}
		if (data.imageWidth < data.options.minWidth) {
			data.options.minWidth = data.imageWidth;
		}
		
		if (data.isMobile) {
			data.containerHeight = data.viewportHeight - data.paddingVertical;
			data.containerWidth  = data.viewportWidth  - data.paddingHorizontal;
			
			data.contentHeight = data.containerHeight - data.metaHeight;
			data.contentWidth  = data.containerWidth;
			
			//data = _fitImage(data); 
			_fitImage(data); 
			
			data.imageMarginTop  = (data.contentHeight - data.targetImageHeight) / 2;
			data.imageMarginLeft = (data.contentWidth  - data.targetImageWidth) / 2;
		} else {
			data.viewportHeight -= data.options.margin + data.paddingVertical + data.metaHeight;
			data.viewportWidth  -= data.options.margin + data.paddingHorizontal;
			
			//data = _fitImage(data);
			_fitImage(data); 
			
			data.containerHeight = data.contentHeight = data.targetImageHeight;
			data.containerWidth  = data.contentWidth  = data.targetImageWidth;
			
			data.imageMarginTop = 0;
			data.imageMarginLeft = 0;
		}
		
		// Modify DOM
		data.$content.css({ 
			height: (data.isMobile) ? data.contentHeight : "auto",
			width: data.contentWidth 
		});
		data.$meta.css({ 
			width: data.contentWidth 
		});
		data.$image.css({ 
			height: data.targetImageHeight, 
			width: data.targetImageWidth,
			marginTop:  data.imageMarginTop,
			marginLeft: data.imageMarginLeft
		});
		
		data.metaHeight = data.$meta.outerHeight(true);
		data.contentHeight += data.metaHeight;
		
		if (!data.isMobile) {
			data.containerHeight += data.metaHeight;
		}
		
		if (data.contentHeight > data.viewportHeight && count < 2) {
			return _sizeImage(count+1);
		}
		
		return true;
	}
	
	/**
	 * @method private
	 * @name _fitImage
	 * @description Calculates target image size
	 */
	function _fitImage() {
		var height = (data.isMobile) ? data.contentHeight - data.options.margin : data.viewportHeight,
			width  = (data.isMobile) ? data.contentWidth - data.options.margin  : data.viewportWidth;
		
		if (data.isWide) {
			//WIDE
			data.targetImageWidth  = width;
			data.targetImageHeight = data.targetImageWidth * data.ratioHorizontal;
			
			if (data.targetImageHeight > height) {
				data.targetImageHeight = height;
				data.targetImageWidth  = data.targetImageHeight * data.ratioVertical;
			}
		} else {
			//TALL
			data.targetImageHeight = height;
			data.targetImageWidth = data.targetImageHeight * data.ratioVertical;
			
			if (data.targetImageWidth > width) {
				data.targetImageWidth = width;
				data.targetImageHeight = data.targetImageWidth * data.ratioHorizontal;
			}
		}
		
		// MAX
		if (data.targetImageWidth > data.imageWidth || data.targetImageHeight > data.imageHeight) {
			data.targetImageWidth = data.imageWidth;
			data.targetImageHeight = data.imageHeight;
		}
		
		// MIN
		if (data.targetImageWidth < data.options.minWidth || data.targetImageHeight < data.options.minHeight) {
			if (data.targetImageWidth < data.options.minWidth) {
				data.targetImageWidth = data.options.minWidth;
				data.targetImageHeight = data.targetImageWidth * data.ratioHorizontal;
			} else {
				data.targetImageHeight = data.options.minHeight;
				data.targetImageWidth = data.targetImageHeight * data.ratioVertical;
			}
		}
	}
	
	/**
	 * @method private
	 * @name _sizeVideo
	 * @description Sizes video to fit in viewport
	 */
	function _sizeVideo() {
		data.windowHeight = data.$window.height() - data.paddingVertical;
		data.windowWidth  = data.$window.width()  - data.paddingHorizontal;
		data.videoMarginTop = 0;
		data.videoMarginLeft = 0;
		
		if (data.isMobile) {
			data.$meta.css({ 
				width: data.windowWidth
			});
			data.metaHeight = data.$meta.outerHeight(true);
			
			data.contentHeight = data.windowHeight;
			data.contentWidth  = data.windowWidth;
			
			data.videoWidth  = data.windowWidth;
			data.videoHeight = data.videoWidth * data.options.videoRatio;
			
			if (data.videoHeight > data.windowHeight - data.metaHeight) {
				data.videoHeight = data.windowHeight - data.metaHeight;
				data.videoWidth  = data.videoHeight * data.options.videoRatio;
			}
			
			data.videoMarginTop = (data.contentHeight - data.videoHeight) / 2;
			data.videoMarginLeft = (data.contentWidth - data.videoWidth) / 2;
		} else {
			data.windowHeight -= data.options.margin;
			data.windowWidth  -= data.options.margin;
			
			data.videoWidth  = (data.options.videoWidth > data.windowWidth) ? data.windowWidth : data.options.videoWidth;
			data.videoHeight = data.videoWidth * data.options.videoRatio;
			
			data.contentHeight = data.videoHeight;
			data.contentWidth  = data.videoWidth;
		}
		
		data.$content.css({ 
			height: (data.isMobile) ? data.contentHeight : "auto",
			width: data.contentWidth 
		});
		data.$meta.css({ 
			width: data.contentWidth 
		});
		data.$videoWrapper.css({ 
			height: data.videoHeight, 
			width: data.videoWidth,
			marginTop: data.videoMarginTop,
			marginLeft: data.videoMarginLeft
		});
		
		if (!data.isMobile) {
			data.metaHeight = data.$meta.outerHeight(true);
			data.contentHeight = data.videoHeight + data.metaHeight;
		}
		
		data.containerHeight = data.contentHeight;
		data.containerWidth = data.contentWidth = data.videoWidth;
	}
	
	/**
	 * @method private
	 * @name _preloadGallery
	 * @description Preloads previous and next images in gallery for faster rendering
	 * @param e [object] "Event Data"
	 */
	function _preloadGallery(e) {
		var source = '';
		
		if (data.gallery.index > 0) {
			source = data.gallery.$items.eq(data.gallery.index - 1).attr("href");
			if (source.indexOf("youtube.com/embed") < 0 && source.indexOf("player.vimeo.com/video") < 0) {
				$('<img src="' + source + '">');
			}
		}
		if (data.gallery.index < data.gallery.total) {
			source = data.gallery.$items.eq(data.gallery.index + 1).attr("href");
			if (source.indexOf("youtube.com/embed") < 0 && source.indexOf("player.vimeo.com/video") < 0) {
				$('<img src="' + source + '">');
			}
		}
	}
	
	/**
	 * @method private
	 * @name _advanceGallery
	 * @description Advances gallery base on direction
	 * @param e [object] "Event Data"
	 */
	function _advanceGallery(e) {
		_killEvent(e);
		
		// Click target
		var $arrow = $(this);
		
		if (!$arrow.hasClass("disabled")) {
			data.$boxer.addClass("loading");
			
			data.gallery.index += ($arrow.hasClass("next")) ? 1 : -1;
			if (data.gallery.index > data.gallery.total) {
				data.gallery.index = data.gallery.total;
			}
			if (data.gallery.index < 0) {
				data.gallery.index = 0;
			}
			
			data.$content.stop().animate({ opacity: 0 }, data.options.duration, function() {
				if (typeof data.$image !== 'undefined') {
					data.$image.remove();
				}
				if (typeof data.$videoWrapper !== 'undefined') {
					data.$videoWrapper.remove();
				}
				data.$target = data.gallery.$items.eq(data.gallery.index);
				
				data.$caption.html(data.options.formatter.apply(data.$body, [data.$target]));
				data.$position.find(".current").html(data.gallery.index + 1);
				
				var source = data.$target.attr("href"),
					isVideo = ( source.indexOf("youtube.com/embed") > -1 || source.indexOf("player.vimeo.com/video") > -1 );
				
				if (isVideo) {
					_loadVideo(source);
				} else {
					_loadImage(source);
				}
				_updateControls();
			});
		}
	}
	
	/**
	 * @method private
	 * @name _updateControls
	 * @description Updates gallery control states
	 */
	function _updateControls() {
		data.$arrows.removeClass("disabled");
		if (data.gallery.index === 0) { 
			data.$arrows.filter(".previous").addClass("disabled");
		}
		if (data.gallery.index === data.gallery.total) {
			data.$arrows.filter(".next").addClass("disabled");
		}
	}
	
	/**
	 * @method private
	 * @name _onKeypress
	 * @description Handles keypress in gallery
	 * @param e [object] "Event data"
	 */
	function _onKeypress(e) {
		if (data.gallery.active && (e.keyCode === 37 || e.keyCode === 39)) {
			_killEvent(e);
			
			data.$arrows.filter((e.keyCode === 37) ? ".previous" : ".next").trigger("click");
		} else if (e.keyCode === 27) {
			data.$boxer.find(".boxer-close").trigger("click");
		}
	}
	
	/**
	 * @method private
	 * @name _cloneElement
	 * @description Clones target inline element
	 * @param id [string] "Target element id"
	 */
	function _cloneElement(id) {
		var $clone = $(id).find(">:first-child").clone();
		_appendObject($clone);
	}
	
	/**
	 * @method private
	 * @name _loadURL
	 * @description Load URL into iframe
	 * @param source [string] "Target URL"
	 */
	function _loadURL(source) {
		source = source + ((source.indexOf("?") > -1) ? "&"+options.requestKey+"=true" : "?"+options.requestKey+"=true");
		var $iframe = $('<iframe class="boxer-iframe" src="' + source + '" />');
		_appendObject($iframe);
	}
	
	/**
	 * @method private
	 * @name _appendObject
	 * @description Appends and sizes object
	 * @param $object [jQuery Object] "Object to append"
	 */
	function _appendObject($object) {
		data.$content.append($object);
		_sizeContent($object);
		_open();
	}
	
	/**
	 * @method private
	 * @name _sizeContent
	 * @description Sizes jQuery object to fir in viewport
	 * @param $object [jQuery Object] "Object to size"
	 */
	function _sizeContent($object) {
		data.objectHeight     = $object.outerHeight(true);
		data.objectWidth      = $object.outerWidth(true);
		data.windowHeight     = data.$window.height() - data.paddingVertical;
		data.windowWidth      = data.$window.width() - data.paddingHorizontal;
		data.dataHeight       = data.$target.data("height");
		data.dataWidth        = data.$target.data("width");
		data.maxHeight        = (data.windowHeight < 0) ? options.minHeight : data.windowHeight;
		data.isIframe         = $object.is("iframe");
		data.objectMarginTop  = 0;
		data.objectMarginLeft = 0;
			
		if (!data.isMobile) {
			data.windowHeight -= data.options.margin;
			data.windowWidth  -= data.options.margin;
		}
		
		data.contentHeight = (data.dataHeight !== undefined) ? data.dataHeight : (data.isIframe) ? data.windowHeight : data.objectHeight;
		data.contentWidth  = (data.dataWidth !== undefined)  ? data.dataWidth  : (data.isIframe) ? data.windowWidth  : data.objectWidth;
		
		if (data.isIframe && data.isMobile) {
			data.contentHeight = data.windowHeight;
			data.contentWidth  = data.windowWidth;
		}
		
		data.containerHeight = data.contentHeight;
		data.containerWidth  = data.contentWidth;
		
		data.$content.css({ 
			height: data.contentHeight, 
			width:  data.contentWidth
		});
	}
	
	/**
	 * @method private
	 * @name _onTouchStart
	 * @description Handle touch start event
	 * @param e [object] "Event data"
	 */
	function _onTouchStart(e) {
		_killEvent(e);
		_clearTimer(data.touchTimer);
		
		if (!data.isAnimating) {
			var touch = (typeof e.originalEvent.targetTouches !== "undefined") ? e.originalEvent.targetTouches[0] : null;
			data.xStart = (touch) ? touch.pageX : e.clientX;
			data.leftPosition = 0;
			
			data.touchMax = Infinity;
			data.touchMin = -Infinity;
			data.edge = data.contentWidth * 0.25;
			
			if (data.gallery.index === 0) {
				data.touchMax = 0;
			}
			if (data.gallery.index === data.gallery.total) {
				data.touchMin = 0;
			}
			
			data.$boxer.on("touchmove.boxer", _onTouchMove)
					   .one("touchend.boxer", _onTouchEnd);
		}
	}
	
	/**
	 * @method private
	 * @name _onTouchMove
	 * @description Handles touchmove event
	 * @param e [object] "Event data"
	 */
	function _onTouchMove(e) {
		var touch = (typeof e.originalEvent.targetTouches !== "undefined") ? e.originalEvent.targetTouches[0] : null;
		
		data.delta = data.xStart - ((touch) ? touch.pageX : e.clientX);
		
		// Only prevent event if trying to swipe
		if (data.delta > 20) {
			_killEvent(e);
		}
		
		data.canSwipe = true;
		
		var newLeft = -data.delta;
		if (newLeft < data.touchMin) {
			newLeft = data.touchMin;
			data.canSwipe = false;
		}
		if (newLeft > data.touchMax) {
			newLeft = data.touchMax;
			data.canSwipe = false;
		}
		
		data.$image.css({ transform: "translate3D("+newLeft+"px,0,0)" });
		
		data.touchTimer = _startTimer(data.touchTimer, 300, function() { _onTouchEnd(e); });
	}
	
	/**
	 * @method private
	 * @name _onTouchEnd
	 * @description Handles touchend event
	 * @param e [object] "Event data"
	 */
	function _onTouchEnd(e) {
		_killEvent(e);
		
		_clearTimer(data.touchTimer);
			
		data.$boxer.off("touchmove.boxer touchend.boxer");
		
		if (data.delta) {
			data.$boxer.addClass("animated");
			data.swipe = false;
			
			if (data.canSwipe && (data.delta > data.edge || data.delta < -data.edge)) {
				data.swipe = true;
				if (data.delta <= data.leftPosition) {
					data.$image.css({ transform: "translate3D("+(data.contentWidth)+"px,0,0)" });
				} else {
					data.$image.css({ transform: "translate3D("+(-data.contentWidth)+"px,0,0)" });
				}
			} else {
				data.$image.css({ transform: "translate3D(0,0,0)" });
			}
			
			if (data.swipe) {
				data.$arrows.filter( (data.delta <= data.leftPosition) ? ".previous" : ".next" ).trigger("click");
			}
			_startTimer(data.resetTimer, data.options.duration, function() { 
				data.$boxer.removeClass("animated");
			});
		}
	}
	
	/**
	 * @method private
	 * @name _startTimer
	 * @description Starts an internal timer
	 * @param timer [int] "Timer ID"
	 * @param time [int] "Time until execution"
	 * @param callback [int] "Function to execute"
	 */
	function _startTimer(timer, time, callback) {
		_clearTimer(timer);
		return setTimeout(callback, time);
	}
	
	/**
	 * @method private
	 * @name _clearTimer
	 * @description Clears an internal timer
	 * @param timer [int] "Timer ID"
	 */
	function _clearTimer(timer) {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	}
	
	/**
	 * @method private
	 * @name _naturalSize
	 * @description Determines natural size of target image
	 * @param $img [jQuery object] "Source image object"
	 * @return [object | boolean] "Object containing natural height and width values or false"
	 */
	function _naturalSize($img) {
		var node = $img[0],
			img = new Image();
		
		if (typeof node.naturalHeight !== "undefined") {
			return {
				naturalHeight: node.naturalHeight,
				naturalWidth:  node.naturalWidth
			};
		} else {
			if (node.tagName.toLowerCase() === 'img') {
				img.src = node.src;
				return {
					naturalHeight: img.height,
					naturalWidth:  img.width
				};
			}
		}
		return false;
	}
	
	/**
	 * @method private
	 * @name _killEvent
	 * @description Prevents default and stops propagation on event
	 * @param e [object] "Event data"
	 */
	function _killEvent(e) {
		if (e.preventDefault) {
			e.stopPropagation();
			e.preventDefault();
		}
	}
	
	$.fn.boxer = function(method) {
		if (pub[method]) {
			return pub[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return _init.apply(this, arguments);
		}
		return this;	
	};
	
	$.boxer = function($target, opts) {
		if (pub[$target]) {
			return pub[$target].apply(window, Array.prototype.slice.call(arguments, 1));
		} else {
			return _build.apply(window, [ $.Event("click", { data: $.extend({
				$object: $target
			}, options, opts || {}) })] );
		}
	};
})(jQuery, window);