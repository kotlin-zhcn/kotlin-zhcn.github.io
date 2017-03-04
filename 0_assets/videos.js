webpackJsonp([8],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var VideoGallery = __webpack_require__(280);
	var $ = __webpack_require__(7);

	$(document).ready(function () {
	  $.getJSON("/data/videos.json", function (videos) {
	    new VideoGallery(document.getElementById('video-gallery'), {
	      playerElem: document.getElementById('video-player'),
	      descriptionElem: document.getElementById('video-description'),
	      data: videos
	    });
	  });
	});

/***/ },

/***/ 171:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(7);
	var render = __webpack_require__(172);
	var localStorage = __webpack_require__(173);

	var templates = {},
	    helpers = {};

	function NavTree(elem, config) {
	  var that = this,
	      fromExistingNodes;

	  that.config = config = $.extend(that.defaults, config);

	  that.elem = elem;

	  that.id = elem.getAttribute('id');

	  fromExistingNodes = 'data' in config === false;

	  that.nodes = fromExistingNodes ? elem : that.render(config.data);

	  that._initEvents();

	  if (config.saveState) {
	    that.restoreItemsState();
	  }

	  if (!fromExistingNodes) {
	    elem.appendChild(that.nodes);
	    that.nodes = elem;
	  }
	}

	NavTree.STORAGE_KEY = 'nav_items';

	NavTree.prototype.elem = null;

	NavTree.prototype.nodes = null;

	NavTree.prototype.id = null;

	NavTree.prototype.config = {};

	NavTree.prototype.defaults = {
	  saveState: true
	};

	NavTree.prototype._events = {};

	NavTree.prototype.render = function (data) {
	  var templates = this.templates;
	  return render(templates.main(data));
	};

	NavTree.prototype.on = function (eventName, callback) {
	  this._events[eventName] = callback;
	};

	NavTree.prototype.fireEvent = function (eventName) {
	  var args;

	  if (eventName in this._events) {
	    args = Array.prototype.slice.call(arguments, 1);

	    return this._events[eventName].apply(this, args);
	  }
	};

	NavTree.prototype._initEvents = function () {
	  var that = this,
	      nodes = that.nodes;

	  $(nodes.querySelectorAll('.js-item-title')).on('click', function (e) {
	    var $elem = $(this),
	        branchElem = this.parentNode,
	        $branch = $(branchElem),
	        itemId = $branch.attr('data-id'),
	        isActive = $elem.hasClass('is_active'),
	        isLeaf = $branch.hasClass('js-leaf'),
	        isLeafWereSelected;

	    if (isLeaf) {
	      that._selectLeaf(this, e);
	      return;
	    }

	    if (isActive) {
	      that._closeBranch(this, e);
	    } else {
	      that._openBranch(this, e);
	    }

	    if (itemId) {
	      var states = that.getItemsStateInfo();
	      states = states === null ? {} : states;
	      states[itemId] = !isActive;
	      that.setItemsStateInfo(states);
	    }
	  });
	};

	NavTree.prototype.getItemsStateInfo = function () {
	  var storageKey = NavTree.STORAGE_KEY + '_' + this.id;
	  var stateInfo = localStorage.getItem(storageKey);
	  return stateInfo;
	};

	NavTree.prototype.setItemsStateInfo = function (info) {
	  var storageKey = NavTree.STORAGE_KEY + '_' + this.id;
	  localStorage.setItem(storageKey, info);
	};

	NavTree.prototype.restoreItemsState = function () {
	  var that = this,
	      states = that.getItemsStateInfo();

	  if (states) {
	    $(that.nodes.querySelectorAll('.js-item-title')).each(function () {
	      var $elem = $(this),
	          $parent = $elem.parent(),
	          itemId = $parent.attr('data-id');

	      if (itemId in states) {
	        if (states[itemId] === true) that._openBranch(this);else that._closeBranch(this);
	      }
	    });
	  }
	};

	NavTree.prototype._openBranch = function (branchTitleElem, e) {
	  var that = this,
	      $elem = $(branchTitleElem),
	      $parent = $elem.parent();

	  $elem.addClass('is_active');
	  $parent.addClass('_opened');
	  $parent.removeClass('_closed');

	  that.fireEvent('openBranch', e, branchTitleElem.parentNode, branchTitleElem);
	};

	NavTree.prototype._closeBranch = function (branchTitleElem, e) {
	  var that = this,
	      $elem = $(branchTitleElem),
	      $parent = $elem.parent();

	  $elem.removeClass('is_active');
	  $parent.addClass('_closed');
	  $parent.removeClass('_opened');

	  that.fireEvent('closeBranch', e, branchTitleElem.parentNode, branchTitleElem);
	};

	NavTree.prototype._selectLeaf = function (leafElem, e, branchElem) {
	  var that = this,
	      nodes = that.nodes;

	  $(nodes).find('.js-leaf-title').each(function (i, elem) {
	    var $elem = $(elem),
	        isActive = $elem.hasClass('is_active');

	    if (elem === leafElem) {
	      if (!isActive) {
	        that.fireEvent('selectLeaf', e, branchElem, elem);
	        $elem.addClass('is_active');
	      }
	    } else {
	      $elem.removeClass('is_active');
	    }
	  });

	  return true;
	};

	NavTree.prototype.templates = {};

	NavTree.prototype.templates.main = function (items) {
	  var templates = this;
	  return [['.nav-tree', templates.itemsList(items)]];
	};

	NavTree.prototype.templates.itemsList = function (items, parentId) {
	  var t = [],
	      templates = this,
	      item,
	      itemTemplate,
	      hasContent,
	      parentId = parentId || null;

	  for (var i = 0, len = items.length; i < len; i++) {
	    item = items[i];
	    hasContent = 'content' in item && item.content && item.content.length > 0;

	    itemTemplate = templates.item(item, parentId);

	    if (hasContent) {
	      itemTemplate.push(templates.itemsList(item.content, parentId === null ? item.title : parentId));
	    }

	    t.push(itemTemplate);
	  }

	  return t;
	};

	NavTree.prototype.templates.item = function (item, parentId) {
	  var templates = this,
	      hasUrl = 'url' in item,
	      hasTitle = 'title' in item,
	      hasContent = 'content' in item && item.content !== null && item.content.length > 0,
	      isBranch = hasContent,
	      isLeaf = !isBranch,
	      type = isBranch ? 'branch' : 'leaf',
	      itemId,
	      itemUrl = hasUrl ? item.url : null,
	      itemTitle = hasTitle ? item.title : null;

	  if (!hasTitle) {
	    for (itemUrl in item) {
	      itemTitle = item[itemUrl];
	    }
	    hasUrl = !!itemUrl;
	  }

	  itemId = parentId !== null ? parentId + '.' + itemTitle : itemTitle;

	  item.id = itemId;
	  item.title = itemTitle;
	  item.url = itemUrl;

	  var t = isBranch ? templates.branchItem(item) : templates.leafItem(item);
	  return t;
	};

	NavTree.prototype.templates.branchItem = function (item) {
	  var t = ['.tree-item.tree-branch.js-item.js-branch._closed', { 'data-id': item.id }, ['.tree-item-title.tree-branch-title.js-item-title.js-branch-title', ['span.marker'], ['span.text', item.title]]];

	  return t;
	};

	NavTree.prototype.templates.leafItem = function (item) {
	  var hasUrl = 'url' in item;
	  var t = ['.tree-item.tree-leaf.js-item.js-leaf', [(hasUrl ? 'a' : 'div') + '.tree-item-title.tree-leaf-title.js-item-title.js-leaf-title', hasUrl ? { href: item.url } : null, ['span.marker'], ['span.text', item.title]]];

	  return t;
	};

	module.exports = NavTree;

/***/ },

/***/ 172:
/***/ function(module, exports) {

	'use strict';

	var util = {
	  isObject: function isObject(object) {
	    return Object.prototype.toString.call(object) === '[object Object]';
	  },

	  isArray: function isArray(object) {
	    return Object.prototype.toString.call(object) === '[object Array]';
	  },

	  selectorPatterns: [{
	    name: 'class',
	    regex: new RegExp('\\.([a-zA-Z0-9-_])*')
	  }, {
	    name: 'id',
	    regex: new RegExp('#([a-zA-Z0-9-_])*')
	  }],

	  parseSelector: function parseSelector(selector) {
	    var patterns = util.selectorPatterns,
	        props = {},
	        value = '';

	    for (var i = 0, len = patterns.length; i < len; i++) {
	      var pattern = patterns[i];
	      var regex = pattern.regex;

	      while (regex.test(selector)) {
	        var matches = regex.exec(selector);
	        selector = selector.replace(matches[0], '');
	        value = matches[0].substring(1);

	        if (pattern.name in props) {
	          props[pattern.name] += ' ' + value;
	        } else {
	          props[pattern.name] = value;
	        }
	      }
	    }

	    if (selector !== '') {
	      props['tag'] = selector;
	    } else {
	      props['tag'] = 'div';
	    }

	    return props;
	  }
	};

	/**
	 * @param {Array} data
	 * @param {HTMLElement} target [optional]
	 * @returns {DocumentFragment}
	 */
	function render(data, target) {
	  var context = target || document.createDocumentFragment(),
	      dataLength = data.length,
	      i,
	      item,
	      elem,
	      props,
	      attrName,
	      isNull;

	  for (i = 0; i < dataLength; i++) {
	    item = data[i];
	    isNull = item === null || item === undefined || item === false;

	    if (isNull) {
	      continue;
	    }

	    // text node
	    if (typeof item === 'string' || typeof item === 'number') {
	      context.appendChild(document.createTextNode(item));
	      continue;
	    }

	    // _elem
	    if (typeof item[0] === 'string') {
	      props = util.parseSelector(item[0]);
	      elem = document.createElement(props.tag);

	      item.shift();
	      delete props.tag;

	      if (util.isObject(item[0])) {
	        for (attrName in item[0]) {
	          props[attrName] = item[0][attrName];
	        }
	      }

	      for (attrName in props) {
	        elem.setAttribute(attrName, props[attrName]);
	        delete props[attrName];
	      }

	      context.appendChild(render(item, elem));

	      continue;
	    }

	    // node
	    if (item.nodeType !== undefined) {
	      context.appendChild(item);
	      continue;
	    }

	    render(item, context);
	  }

	  return context;
	}

	module.exports = render;

/***/ },

/***/ 173:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _stringify = __webpack_require__(1);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _typeof2 = __webpack_require__(94);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	module.exports = {
	    /**
	     * @param {string} key
	     * @param {*} value
	     * @returns {*}
	     */
	    setItem: function setItem(key, value) {
	        var type = typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value);

	        if (type !== 'string' || type !== 'number' || type !== 'boolean' || type === null) {
	            value = (0, _stringify2.default)(value);
	        }

	        localStorage.setItem(key, value);

	        return arguments[1];
	    },

	    /**
	     * @param {string} key
	     * @returns {*}
	     */
	    getItem: function getItem(key) {
	        var value = localStorage.getItem(key),
	            valueLength,
	            isNeedToParse;

	        if (value !== null) {
	            valueLength = value.length;
	            isNeedToParse = value.substring(0, 1) === '[' && value.substring(valueLength - 1, valueLength) === ']' || value.substring(0, 1) === '{' && value.substring(valueLength - 1, valueLength) === '}';

	            if (isNeedToParse) {
	                value = JSON.parse(value);
	            }
	        }

	        return value;
	    },

	    /**
	     * @param {string} key
	     */
	    removeItem: function removeItem(key) {
	        localStorage.removeItem(key);
	    },

	    /**
	     * @returns {object|null}
	     */
	    getAllItems: function getAllItems() {
	        var key,
	            items = {},
	            i = 0;

	        for (key in localStorage) {
	            items[key] = localStorage[key];
	            i++;
	        }

	        return i > 0 ? items : null;
	    },

	    /**
	     * @returns void
	     */
	    clear: function clear() {
	        localStorage.clear();
	    }
	};

/***/ },

/***/ 265:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(7);

	/**
	 * @param {HTMLElement|string} elem HTML node or node ID
	 * @param {object} config
	 * @returns {Player}
	 * @constructor
	 */
	function Player(elem, config) {
	  var that = this,
	      playerElem;

	  playerElem = document.createElement('div');
	  elem = typeof elem === 'string' ? document.getElementById(elem) : elem;
	  elem.appendChild(playerElem);

	  that._elem = playerElem;

	  that._config = Player.getConfig(config);

	  if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
	    $.getScript('https://www.youtube.com/iframe_api', function () {
	      if ('onYouTubeIframeAPIReady' in window) {
	        var prev = window.onYouTubeIframeAPIReady;
	        window.onYouTubeIframeAPIReady = function () {
	          prev();
	          that._createPlayer();
	        };
	      } else {
	        window.onYouTubeIframeAPIReady = function () {
	          that._createPlayer();
	        };
	      }
	    });
	  } else {
	    that._createPlayer();
	  }

	  return that;
	}

	Player.EVENT = {
	  READY: 'ready',
	  PLAYING: 'play',
	  ENDED: 'end',
	  PAUSED: 'pause',
	  BUFFERING: 'buffering',
	  CUED: 'cued'
	};

	Player.THEME = {
	  DARK: 'dark',
	  LIGHT: 'light'
	};

	Player.QUALITY = {
	  DEFAULT: 'default',
	  SMALL: 'small', // max 640х360
	  MEDIUM: 'medium', // min 640x360
	  LARGE: 'large', // min 854x80
	  HD720: 'hd720' // min 1280x720
	};

	Player.VIDEO_ID_REGEXP = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;

	Player.VIDEO_EMBED_URL = '//www.youtube.com/embed/{video_id}';

	Player._defaults = {
	  width: 450,
	  height: 390,
	  videoId: null,
	  autoPlay: false,
	  autoHide: false,
	  showControls: true,
	  showInfo: true,
	  showRelativeVideos: false,
	  quality: Player.QUALITY.DEFAULT,
	  startTime: 0,
	  disableBranding: true,
	  inlinePlayback: false,
	  theme: Player.THEME.DARK
	};

	/**
	 * @static
	 * @param videoUrl
	 * @returns {string}
	 */
	Player.getVideoIdFromUrl = function (videoUrl) {
	  var videoId = null;
	  var match = videoUrl.match(Player.VIDEO_ID_REGEXP);

	  if (match !== null && typeof match[7] !== 'undefined') {
	    videoId = match[7];
	  }

	  return videoId;
	};

	/**
	 *  Creates Player config using defaults and merges them with another config (if specified).
	 *
	 * @param {object} config [optional]
	 * @returns {object}
	 */
	Player.getConfig = function (config) {
	  var config = config || {};
	  return $.extend({}, Player._defaults, config);
	};

	/**
	 * Create YouTube player config using Player config format.
	 *
	 * @param config
	 * @returns {object} Config object for native YouTube player
	 */
	Player.createConfigForYTPlayer = function (config) {
	  var config = config || Player.getConfig(config),
	      ytPlayerConfig;

	  ytPlayerConfig = {
	    width: config.width,
	    height: config.height,
	    videoId: config.videoId,
	    playerVars: {
	      vq: config.quality,
	      rel: config.showRelativeVideos ? 1 : 0,
	      autoplay: config.autoPlay ? 1 : 0,
	      controls: config.showControls ? 1 : 0,
	      showinfo: config.showInfo ? 1 : 0,
	      autohide: config.autoHide ? 1 : 0,
	      start: config.startTime,
	      modestbranding: config.disableBranding ? 1 : 0,
	      playsinline: config.inlinePlayback ? 1 : 0,
	      theme: config.theme
	    }
	  };

	  return ytPlayerConfig;
	};

	Player.prototype._elem = null;

	Player.prototype._config = null;

	Player.prototype._player = null;

	Player.prototype._events = {};

	Player.prototype.isReady = false;

	Player.prototype._createPlayer = function () {
	  var that = this,
	      elem = that._elem,
	      player;

	  player = new YT.Player(elem, Player.createConfigForYTPlayer(that._config));

	  player.addEventListener('onReady', function () {
	    that.isReady = true;
	    that.fireEvent(Player.EVENT.READY);
	  });

	  player.addEventListener('onStateChange', function (currentState) {
	    var events = that._events,
	        eventName = Player.EVENT;

	    switch (currentState.data) {
	      case YT.PlayerState.ENDED:
	        that.fireEvent(eventName.ENDED);
	        break;

	      case YT.PlayerState.PLAYING:
	        that.fireEvent(eventName.PLAYING);
	        break;

	      case YT.PlayerState.PAUSED:
	        that.fireEvent(eventName.PAUSED);
	        break;

	      case YT.PlayerState.BUFFERING:
	        that.fireEvent(eventName.BUFFERING);
	        break;

	      case YT.PlayerState.CUED:
	        that.fireEvent(eventName.CUED);
	        break;
	    }
	  });

	  that._player = player;
	};

	Player.prototype.fireEvent = function (eventName) {
	  if (eventName in this._events) {
	    return this._events[eventName].call(this);
	  }
	};

	Player.prototype.on = function (eventName, callback) {
	  this._events[eventName] = callback;
	};

	Player.prototype.play = function () {
	  this._player.playVideo();
	};

	Player.prototype.pause = function () {
	  this._player.pauseVideo();
	};

	Player.prototype.stop = function () {
	  this._player.stopVideo();
	};

	/**
	 * @param {string} quality Video quality
	 * @see Player.QUALITY
	 */
	Player.prototype.setQuality = function (quality) {
	  this._player.setPlaybackQuality(quality);
	};

	/**
	 * Loads video and starts playback.
	 *
	 * @param {string} videoId
	 */
	Player.prototype.loadVideo = function (videoId) {
	  this._player.cueVideoById(videoId);
	};

	/**
	 * Loads video thumbnail and prepare player for playback.
	 *
	 * @param {string} videoId
	 */
	Player.prototype.playVideo = function (videoId) {
	  var isIOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false;

	  if (isIOS) {
	    this.loadVideo(videoId);
	  } else {
	    this._player.loadVideoById(videoId);
	  }
	};

	module.exports = Player;

/***/ },

/***/ 280:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(7);
	var NavTree = __webpack_require__(171);
	var Player = __webpack_require__(265);

	NavTree.prototype.templates.leafItem = function (item) {
	  var hasUrl = 'url' in item,
	      hasDuration = 'duration' in item,
	      hasDescription = 'description' in item,
	      isExternal = hasUrl && Player.getVideoIdFromUrl(item.url) === null,
	      itemClassNames,
	      itemLinkClassNames,
	      attrs = {};

	  itemClassNames = ['tree-item', 'tree-leaf', 'js-item', 'js-leaf', 'video-item'];
	  itemLinkClassNames = ['tree-item-title', 'tree-leaf-title', 'js-item-title', 'js-leaf-title', 'video-item-title'];

	  if (isExternal) itemLinkClassNames.push('is_external');

	  if (hasUrl) {
	    attrs['href'] = item.url;
	  }

	  if (hasDescription) {
	    attrs['data-description'] = item.description;
	  }

	  var t = ['.' + itemClassNames.join('.'), [(hasUrl ? 'a.' : 'div.') + itemLinkClassNames.join('.'), attrs, ['span.marker'], ['span.text', item.title], hasDuration ? ['span.duration', item.duration] : null]];

	  return t;
	};

	function VideoGallery(elem, config) {

	  var tree = new NavTree(elem, { data: config.data });

	  var player = new Player(config.playerElem, {
	    width: '100%',
	    height: 480,
	    videoId: 'viiDaLpPfN4'
	  });

	  tree.on('selectLeaf', function (e, branch, elem) {
	    var videoUrl = elem.href,
	        videoId,
	        description = elem.getAttribute('data-description') || '',
	        $elem = $(elem);

	    videoId = Player.getVideoIdFromUrl(videoUrl);

	    if (videoId) {
	      player.playVideo(videoId);

	      config.descriptionElem.innerHTML = description;
	    }
	  });

	  $(elem).find('a').on('click', function (e) {
	    var $el = $(this);
	    var isExternal = $el.hasClass('is_external');

	    if (isExternal) $el.attr('target', '_blank');else e.preventDefault();
	  });
	}

	module.exports = VideoGallery;

/***/ }

});