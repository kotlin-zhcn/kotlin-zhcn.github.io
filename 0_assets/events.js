webpackJsonp([3],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _jquery = __webpack_require__(7);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _fixer = __webpack_require__(233);

	var _fixer2 = _interopRequireDefault(_fixer);

	var _queryString = __webpack_require__(234);

	var _queryString2 = _interopRequireDefault(_queryString);

	var _Map = __webpack_require__(236);

	var _Map2 = _interopRequireDefault(_Map);

	var _EventsStore = __webpack_require__(247);

	var _EventsStore2 = _interopRequireDefault(_EventsStore);

	var _EventsList = __webpack_require__(256);

	var _EventsList2 = _interopRequireDefault(_EventsList);

	var _emitter = __webpack_require__(237);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _eventsList = __webpack_require__(238);

	var _eventsList2 = _interopRequireDefault(_eventsList);

	var _index = __webpack_require__(260);

	var _index2 = _interopRequireDefault(_index);

	var _timeSelectItems = __webpack_require__(265);

	var _timeSelectItems2 = _interopRequireDefault(_timeSelectItems);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(267);

	function refreshMapSize(node, map) {
	  var width = Math.floor((0, _jquery2.default)(window).width() / 2);
	  (0, _jquery2.default)(node).css('width', width);
	  google.maps.event.trigger(map, 'resize');
	}

	(0, _jquery2.default)(document).ready(function () {
	  var query = _queryString2.default.parse(window.location.search);
	  var time = query.time;


	  var initialFilters = {
	    time: time in _timeSelectItems2.default ? time : 'all',
	    lang: 'all',
	    materials: 'all'
	  };

	  var store = void 0;
	  var eventsStorePromise = _EventsStore2.default.create('/data/events.json', '/data/cities.json');

	  eventsStorePromise.then(function (eventsStore) {
	    store = eventsStore;
	    return _Map2.default.create('.js-map', eventsStore);
	  }).then(function (map) {
	    var events = store.filter(initialFilters);
	    var list = new _EventsList2.default('.js-events-list', store, initialFilters);

	    _emitter2.default.emit(_eventsList2.default.EVENTS_FILTERED, initialFilters);
	    // list.applyFilteredResults(events);

	    var panel = new _index2.default('.js-filter-panel-wrap', {
	      languages: store.getLanguages(),
	      materials: store.getMaterials(),
	      store: store,
	      initialFilters: initialFilters
	    });

	    panel.onSelect(function (filters) {
	      _emitter2.default.emit(_eventsList2.default.EVENTS_FILTERED, filters);

	      if (list.mode == 'detailed') {
	        _emitter2.default.emit(_eventsList2.default.EVENT_DESELECTED);
	      }
	    });

	    var node = document.querySelector('.js-events-map-panel-wrap');
	    refreshMapSize(node, map.instance);
	    var mapPanel = new _fixer2.default().addElement('.js-events-map-panel', { stretchTo: '.global-footer' });
	    mapPanel.on('stretched', refreshMapSize.bind(null, node, map.instance));
	    (0, _jquery2.default)(window).on('resize', refreshMapSize.bind(null, node, map.instance));
	  });
	});

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var $ = __webpack_require__(7);
	var Emitter = __webpack_require__(8);

	__webpack_require__(23);
	var template = __webpack_require__(24);

	var CLASSES = {
	  OPENED: '_opened',
	  ITEM_SELECTED: '_selected'
	};

	var EVENTS = {
	  SELECT: 'select'
	};

	/**
	 * @param {HTMLElement|string} node
	 * @param {Object} config
	 * @param {number} [config.selectedIndex=0]
	 * @param {string} [config.selected]
	 * @param {Function} [config.onSelect]
	 * @constructor
	 */
	function Dropdown(node, config) {
	  if (!(this instanceof Dropdown)) return new Dropdown(node, config);

	  this._emitter = Emitter({});
	  var that = this;
	  this.config = config;
	  var $dropdown = this.render();
	  this.$dropdown = $dropdown;
	  var $items = $dropdown.find('.js-item');
	  var selectedValueNode = $dropdown.find('.js-selected-value').get(0);

	  $(document.body).on('click', function (event) {
	    event.target === selectedValueNode ? that.toggle() : that.close();
	  });

	  $items.each(function (i, elem) {
	    var $elem = $(elem);
	    if ($elem.attr('data-value') == config.selected) {
	      config.selectedIndex = i;
	    }
	    $elem.on('click', that.select.bind(that, i));
	  });

	  $(node).append($dropdown);

	  config.onSelect && this.onSelect(config.onSelect);

	  this.select(config.selectedIndex || 0, false);
	}

	Dropdown.prototype.onSelect = function (callback) {
	  this._emitter.on(EVENTS.SELECT, callback);
	};

	Dropdown.prototype.render = function () {
	  var config = this.config;
	  var data = $.extend({}, {
	    items: config.items,
	    selectedIndex: config.selectedIndex || 0
	  });

	  var rendered = template.render({ dropdown: data });
	  return $(rendered);
	};

	Dropdown.prototype.open = function () {
	  this.$dropdown.addClass(CLASSES.OPENED);
	};

	Dropdown.prototype.close = function () {
	  this.$dropdown.removeClass(CLASSES.OPENED);
	};

	Dropdown.prototype.toggle = function () {
	  this.isOpened() ? this.close() : this.open();
	};

	Dropdown.prototype.isOpened = function () {
	  return this.$dropdown.hasClass(CLASSES.OPENED);
	};

	Dropdown.prototype.select = function (index, emit) {
	  if (this.selectedIndex == index) {
	    return;
	  }
	  this.selectedIndex = index;

	  var emit = typeof emit == 'boolean' ? emit : true;
	  var $dropdown = this.$dropdown;
	  var $items = $dropdown.find('.js-item');
	  var $selectedItem = $($items.get(index));
	  var selectedValue = $selectedItem.attr('data-value');
	  var selectedText = $selectedItem.text();

	  $items.each(function (i, elem) {
	    var $item = $(elem);

	    if (i === index) $item.addClass(CLASSES.ITEM_SELECTED);else $item.removeClass(CLASSES.ITEM_SELECTED);
	  });

	  $dropdown.find('.js-selected-value').text(selectedText);

	  emit && this._emitter.emit('select', selectedValue);
	};

	module.exports = Dropdown;

/***/ },
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var d        = __webpack_require__(9)
	  , callable = __webpack_require__(22)

	  , apply = Function.prototype.apply, call = Function.prototype.call
	  , create = Object.create, defineProperty = Object.defineProperty
	  , defineProperties = Object.defineProperties
	  , hasOwnProperty = Object.prototype.hasOwnProperty
	  , descriptor = { configurable: true, enumerable: false, writable: true }

	  , on, once, off, emit, methods, descriptors, base;

	on = function (type, listener) {
		var data;

		callable(listener);

		if (!hasOwnProperty.call(this, '__ee__')) {
			data = descriptor.value = create(null);
			defineProperty(this, '__ee__', descriptor);
			descriptor.value = null;
		} else {
			data = this.__ee__;
		}
		if (!data[type]) data[type] = listener;
		else if (typeof data[type] === 'object') data[type].push(listener);
		else data[type] = [data[type], listener];

		return this;
	};

	once = function (type, listener) {
		var once, self;

		callable(listener);
		self = this;
		on.call(this, type, once = function () {
			off.call(self, type, once);
			apply.call(listener, this, arguments);
		});

		once.__eeOnceListener__ = listener;
		return this;
	};

	off = function (type, listener) {
		var data, listeners, candidate, i;

		callable(listener);

		if (!hasOwnProperty.call(this, '__ee__')) return this;
		data = this.__ee__;
		if (!data[type]) return this;
		listeners = data[type];

		if (typeof listeners === 'object') {
			for (i = 0; (candidate = listeners[i]); ++i) {
				if ((candidate === listener) ||
						(candidate.__eeOnceListener__ === listener)) {
					if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];
					else listeners.splice(i, 1);
				}
			}
		} else {
			if ((listeners === listener) ||
					(listeners.__eeOnceListener__ === listener)) {
				delete data[type];
			}
		}

		return this;
	};

	emit = function (type) {
		var i, l, listener, listeners, args;

		if (!hasOwnProperty.call(this, '__ee__')) return;
		listeners = this.__ee__[type];
		if (!listeners) return;

		if (typeof listeners === 'object') {
			l = arguments.length;
			args = new Array(l - 1);
			for (i = 1; i < l; ++i) args[i - 1] = arguments[i];

			listeners = listeners.slice();
			for (i = 0; (listener = listeners[i]); ++i) {
				apply.call(listener, this, args);
			}
		} else {
			switch (arguments.length) {
			case 1:
				call.call(listeners, this);
				break;
			case 2:
				call.call(listeners, this, arguments[1]);
				break;
			case 3:
				call.call(listeners, this, arguments[1], arguments[2]);
				break;
			default:
				l = arguments.length;
				args = new Array(l - 1);
				for (i = 1; i < l; ++i) {
					args[i - 1] = arguments[i];
				}
				apply.call(listeners, this, args);
			}
		}
	};

	methods = {
		on: on,
		once: once,
		off: off,
		emit: emit
	};

	descriptors = {
		on: d(on),
		once: d(once),
		off: d(off),
		emit: d(emit)
	};

	base = defineProperties({}, descriptors);

	module.exports = exports = function (o) {
		return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
	};
	exports.methods = methods;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var assign        = __webpack_require__(10)
	  , normalizeOpts = __webpack_require__(17)
	  , isCallable    = __webpack_require__(18)
	  , contains      = __webpack_require__(19)

	  , d;

	d = module.exports = function (dscr, value/*, options*/) {
		var c, e, w, options, desc;
		if ((arguments.length < 2) || (typeof dscr !== 'string')) {
			options = value;
			value = dscr;
			dscr = null;
		} else {
			options = arguments[2];
		}
		if (dscr == null) {
			c = w = true;
			e = false;
		} else {
			c = contains.call(dscr, 'c');
			e = contains.call(dscr, 'e');
			w = contains.call(dscr, 'w');
		}

		desc = { value: value, configurable: c, enumerable: e, writable: w };
		return !options ? desc : assign(normalizeOpts(options), desc);
	};

	d.gs = function (dscr, get, set/*, options*/) {
		var c, e, options, desc;
		if (typeof dscr !== 'string') {
			options = set;
			set = get;
			get = dscr;
			dscr = null;
		} else {
			options = arguments[3];
		}
		if (get == null) {
			get = undefined;
		} else if (!isCallable(get)) {
			options = get;
			get = set = undefined;
		} else if (set == null) {
			set = undefined;
		} else if (!isCallable(set)) {
			options = set;
			set = undefined;
		}
		if (dscr == null) {
			c = true;
			e = false;
		} else {
			c = contains.call(dscr, 'c');
			e = contains.call(dscr, 'e');
		}

		desc = { get: get, set: set, configurable: c, enumerable: e };
		return !options ? desc : assign(normalizeOpts(options), desc);
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(11)()
		? Object.assign
		: __webpack_require__(12);


/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
		var assign = Object.assign, obj;
		if (typeof assign !== 'function') return false;
		obj = { foo: 'raz' };
		assign(obj, { bar: 'dwa' }, { trzy: 'trzy' });
		return (obj.foo + obj.bar + obj.trzy) === 'razdwatrzy';
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var keys  = __webpack_require__(13)
	  , value = __webpack_require__(16)

	  , max = Math.max;

	module.exports = function (dest, src/*, …srcn*/) {
		var error, i, l = max(arguments.length, 2), assign;
		dest = Object(value(dest));
		assign = function (key) {
			try { dest[key] = src[key]; } catch (e) {
				if (!error) error = e;
			}
		};
		for (i = 1; i < l; ++i) {
			src = arguments[i];
			keys(src).forEach(assign);
		}
		if (error !== undefined) throw error;
		return dest;
	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(14)()
		? Object.keys
		: __webpack_require__(15);


/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
		try {
			Object.keys('primitive');
			return true;
		} catch (e) { return false; }
	};


/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

	var keys = Object.keys;

	module.exports = function (object) {
		return keys(object == null ? object : Object(object));
	};


/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (value) {
		if (value == null) throw new TypeError("Cannot use null or undefined");
		return value;
	};


/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';

	var forEach = Array.prototype.forEach, create = Object.create;

	var process = function (src, obj) {
		var key;
		for (key in src) obj[key] = src[key];
	};

	module.exports = function (options/*, …options*/) {
		var result = create(null);
		forEach.call(arguments, function (options) {
			if (options == null) return;
			process(Object(options), result);
		});
		return result;
	};


/***/ },
/* 18 */
/***/ function(module, exports) {

	// Deprecated

	'use strict';

	module.exports = function (obj) { return typeof obj === 'function'; };


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(20)()
		? String.prototype.contains
		: __webpack_require__(21);


/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';

	var str = 'razdwatrzy';

	module.exports = function () {
		if (typeof str.contains !== 'function') return false;
		return ((str.contains('dwa') === true) && (str.contains('foo') === false));
	};


/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';

	var indexOf = String.prototype.indexOf;

	module.exports = function (searchString/*, position*/) {
		return indexOf.call(this, searchString, arguments[1]) > -1;
	};


/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (fn) {
		if (typeof fn !== 'function') throw new TypeError(fn + " is not a function");
		return fn;
	};


/***/ },
/* 23 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var nunjucks = __webpack_require__(25);
	var env;
	if (!nunjucks.currentEnv){
		env = nunjucks.currentEnv = new nunjucks.Environment([], { autoescape: true });
	} else {
		env = nunjucks.currentEnv;
	}
	var dependencies = nunjucks.webpackDependencies || (nunjucks.webpackDependencies = {});




	var shim = __webpack_require__(26);


	(function() {(nunjucks.nunjucksPrecompiled = nunjucks.nunjucksPrecompiled || {})["static/js/com/dropdown/view.twig"] = (function() {
	function root(env, context, frame, runtime, cb) {
	var lineno = null;
	var colno = null;
	var output = "";
	try {
	var parentTemplate = null;
	output += "<div class=\"dropdown js-dropdown\">\n  <div class=\"dropdown-selected-value js-selected-value\">";
	output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "dropdown")),"items")),runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "dropdown")),"selectedIndex")), env.opts.autoescape);
	output += "</div>\n  <div class=\"dropdown-items\">\n    ";
	frame = frame.push();
	var t_3 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "dropdown")),"items");
	if(t_3) {var t_1;
	if(runtime.isArray(t_3)) {
	var t_2 = t_3.length;
	for(t_1=0; t_1 < t_3.length; t_1++) {
	var t_4 = t_3[t_1][0]
	frame.set("value", t_3[t_1][0]);
	var t_5 = t_3[t_1][1]
	frame.set("label", t_3[t_1][1]);
	frame.set("loop.index", t_1 + 1);
	frame.set("loop.index0", t_1);
	frame.set("loop.revindex", t_2 - t_1);
	frame.set("loop.revindex0", t_2 - t_1 - 1);
	frame.set("loop.first", t_1 === 0);
	frame.set("loop.last", t_1 === t_2 - 1);
	frame.set("loop.length", t_2);
	output += "\n      <div class=\"dropdown-item js-item\" data-value=\"";
	output += runtime.suppressValue(t_4, env.opts.autoescape);
	output += "\">";
	output += runtime.suppressValue(t_5, env.opts.autoescape);
	output += "</div>\n    ";
	;
	}
	} else {
	t_1 = -1;
	var t_2 = runtime.keys(t_3).length;
	for(var t_6 in t_3) {
	t_1++;
	var t_7 = t_3[t_6];
	frame.set("value", t_6);
	frame.set("label", t_7);
	frame.set("loop.index", t_1 + 1);
	frame.set("loop.index0", t_1);
	frame.set("loop.revindex", t_2 - t_1);
	frame.set("loop.revindex0", t_2 - t_1 - 1);
	frame.set("loop.first", t_1 === 0);
	frame.set("loop.last", t_1 === t_2 - 1);
	frame.set("loop.length", t_2);
	output += "\n      <div class=\"dropdown-item js-item\" data-value=\"";
	output += runtime.suppressValue(t_6, env.opts.autoescape);
	output += "\">";
	output += runtime.suppressValue(t_7, env.opts.autoescape);
	output += "</div>\n    ";
	;
	}
	}
	}
	frame = frame.pop();
	output += "\n  </div>\n</div>";
	if(parentTemplate) {
	parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
	} else {
	cb(null, output);
	}
	;
	} catch (e) {
	  cb(runtime.handleError(e, lineno, colno));
	}
	}
	return {
	root: root
	};

	})();
	})();



	module.exports = shim(nunjucks, env, nunjucks.nunjucksPrecompiled["static/js/com/dropdown/view.twig"] , dependencies)

/***/ },
/* 25 */
/***/ function(module, exports) {

	/*! Browser bundle of nunjucks 2.4.2 (slim, only works with precompiled templates) */
	var nunjucks =
	/******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};

	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {

	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;

	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};

	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;

	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}


	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;

	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;

	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";

	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';

		var lib = __webpack_require__(1);
		var env = __webpack_require__(2);
		var Loader = __webpack_require__(11);
		var loaders = __webpack_require__(3);
		var precompile = __webpack_require__(3);

		module.exports = {};
		module.exports.Environment = env.Environment;
		module.exports.Template = env.Template;

		module.exports.Loader = Loader;
		module.exports.FileSystemLoader = loaders.FileSystemLoader;
		module.exports.PrecompiledLoader = loaders.PrecompiledLoader;
		module.exports.WebLoader = loaders.WebLoader;

		module.exports.compiler = __webpack_require__(3);
		module.exports.parser = __webpack_require__(3);
		module.exports.lexer = __webpack_require__(3);
		module.exports.runtime = __webpack_require__(8);
		module.exports.lib = lib;
		module.exports.nodes = __webpack_require__(3);

		module.exports.installJinjaCompat = __webpack_require__(12);

		// A single instance of an environment, since this is so commonly used

		var e;
		module.exports.configure = function(templatesPath, opts) {
		    opts = opts || {};
		    if(lib.isObject(templatesPath)) {
		        opts = templatesPath;
		        templatesPath = null;
		    }

		    var TemplateLoader;
		    if(loaders.FileSystemLoader) {
		        TemplateLoader = new loaders.FileSystemLoader(templatesPath, {
		            watch: opts.watch,
		            noCache: opts.noCache
		        });
		    }
		    else if(loaders.WebLoader) {
		        TemplateLoader = new loaders.WebLoader(templatesPath, {
		            useCache: opts.web && opts.web.useCache,
		            async: opts.web && opts.web.async
		        });
		    }

		    e = new env.Environment(TemplateLoader, opts);

		    if(opts && opts.express) {
		        e.express(opts.express);
		    }

		    return e;
		};

		module.exports.compile = function(src, env, path, eagerCompile) {
		    if(!e) {
		        module.exports.configure();
		    }
		    return new module.exports.Template(src, env, path, eagerCompile);
		};

		module.exports.render = function(name, ctx, cb) {
		    if(!e) {
		        module.exports.configure();
		    }

		    return e.render(name, ctx, cb);
		};

		module.exports.renderString = function(src, ctx, cb) {
		    if(!e) {
		        module.exports.configure();
		    }

		    return e.renderString(src, ctx, cb);
		};

		if(precompile) {
		    module.exports.precompile = precompile.precompile;
		    module.exports.precompileString = precompile.precompileString;
		}


	/***/ },
	/* 1 */
	/***/ function(module, exports) {

		'use strict';

		var ArrayProto = Array.prototype;
		var ObjProto = Object.prototype;

		var escapeMap = {
		    '&': '&amp;',
		    '"': '&quot;',
		    '\'': '&#39;',
		    '<': '&lt;',
		    '>': '&gt;'
		};

		var escapeRegex = /[&"'<>]/g;

		var lookupEscape = function(ch) {
		    return escapeMap[ch];
		};

		var exports = module.exports = {};

		exports.prettifyError = function(path, withInternals, err) {
		    // jshint -W022
		    // http://jslinterrors.com/do-not-assign-to-the-exception-parameter
		    if (!err.Update) {
		        // not one of ours, cast it
		        err = new exports.TemplateError(err);
		    }
		    err.Update(path);

		    // Unless they marked the dev flag, show them a trace from here
		    if (!withInternals) {
		        var old = err;
		        err = new Error(old.message);
		        err.name = old.name;
		    }

		    return err;
		};

		exports.TemplateError = function(message, lineno, colno) {
		    var err = this;

		    if (message instanceof Error) { // for casting regular js errors
		        err = message;
		        message = message.name + ': ' + message.message;

		        try {
		            if(err.name = '') {}
		        }
		        catch(e) {
		            // If we can't set the name of the error object in this
		            // environment, don't use it
		            err = this;
		        }
		    } else {
		        if(Error.captureStackTrace) {
		            Error.captureStackTrace(err);
		        }
		    }

		    err.name = 'Template render error';
		    err.message = message;
		    err.lineno = lineno;
		    err.colno = colno;
		    err.firstUpdate = true;

		    err.Update = function(path) {
		        var message = '(' + (path || 'unknown path') + ')';

		        // only show lineno + colno next to path of template
		        // where error occurred
		        if (this.firstUpdate) {
		            if(this.lineno && this.colno) {
		                message += ' [Line ' + this.lineno + ', Column ' + this.colno + ']';
		            }
		            else if(this.lineno) {
		                message += ' [Line ' + this.lineno + ']';
		            }
		        }

		        message += '\n ';
		        if (this.firstUpdate) {
		            message += ' ';
		        }

		        this.message = message + (this.message || '');
		        this.firstUpdate = false;
		        return this;
		    };

		    return err;
		};

		exports.TemplateError.prototype = Error.prototype;

		exports.escape = function(val) {
		  return val.replace(escapeRegex, lookupEscape);
		};

		exports.isFunction = function(obj) {
		    return ObjProto.toString.call(obj) === '[object Function]';
		};

		exports.isArray = Array.isArray || function(obj) {
		    return ObjProto.toString.call(obj) === '[object Array]';
		};

		exports.isString = function(obj) {
		    return ObjProto.toString.call(obj) === '[object String]';
		};

		exports.isObject = function(obj) {
		    return ObjProto.toString.call(obj) === '[object Object]';
		};

		exports.groupBy = function(obj, val) {
		    var result = {};
		    var iterator = exports.isFunction(val) ? val : function(obj) { return obj[val]; };
		    for(var i=0; i<obj.length; i++) {
		        var value = obj[i];
		        var key = iterator(value, i);
		        (result[key] || (result[key] = [])).push(value);
		    }
		    return result;
		};

		exports.toArray = function(obj) {
		    return Array.prototype.slice.call(obj);
		};

		exports.without = function(array) {
		    var result = [];
		    if (!array) {
		        return result;
		    }
		    var index = -1,
		    length = array.length,
		    contains = exports.toArray(arguments).slice(1);

		    while(++index < length) {
		        if(exports.indexOf(contains, array[index]) === -1) {
		            result.push(array[index]);
		        }
		    }
		    return result;
		};

		exports.extend = function(obj, obj2) {
		    for(var k in obj2) {
		        obj[k] = obj2[k];
		    }
		    return obj;
		};

		exports.repeat = function(char_, n) {
		    var str = '';
		    for(var i=0; i<n; i++) {
		        str += char_;
		    }
		    return str;
		};

		exports.each = function(obj, func, context) {
		    if(obj == null) {
		        return;
		    }

		    if(ArrayProto.each && obj.each === ArrayProto.each) {
		        obj.forEach(func, context);
		    }
		    else if(obj.length === +obj.length) {
		        for(var i=0, l=obj.length; i<l; i++) {
		            func.call(context, obj[i], i, obj);
		        }
		    }
		};

		exports.map = function(obj, func) {
		    var results = [];
		    if(obj == null) {
		        return results;
		    }

		    if(ArrayProto.map && obj.map === ArrayProto.map) {
		        return obj.map(func);
		    }

		    for(var i=0; i<obj.length; i++) {
		        results[results.length] = func(obj[i], i);
		    }

		    if(obj.length === +obj.length) {
		        results.length = obj.length;
		    }

		    return results;
		};

		exports.asyncIter = function(arr, iter, cb) {
		    var i = -1;

		    function next() {
		        i++;

		        if(i < arr.length) {
		            iter(arr[i], i, next, cb);
		        }
		        else {
		            cb();
		        }
		    }

		    next();
		};

		exports.asyncFor = function(obj, iter, cb) {
		    var keys = exports.keys(obj);
		    var len = keys.length;
		    var i = -1;

		    function next() {
		        i++;
		        var k = keys[i];

		        if(i < len) {
		            iter(k, obj[k], i, len, next);
		        }
		        else {
		            cb();
		        }
		    }

		    next();
		};

		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf#Polyfill
		exports.indexOf = Array.prototype.indexOf ?
		    function (arr, searchElement, fromIndex) {
		        return Array.prototype.indexOf.call(arr, searchElement, fromIndex);
		    } :
		    function (arr, searchElement, fromIndex) {
		        var length = this.length >>> 0; // Hack to convert object.length to a UInt32

		        fromIndex = +fromIndex || 0;

		        if(Math.abs(fromIndex) === Infinity) {
		            fromIndex = 0;
		        }

		        if(fromIndex < 0) {
		            fromIndex += length;
		            if (fromIndex < 0) {
		                fromIndex = 0;
		            }
		        }

		        for(;fromIndex < length; fromIndex++) {
		            if (arr[fromIndex] === searchElement) {
		                return fromIndex;
		            }
		        }

		        return -1;
		    };

		if(!Array.prototype.map) {
		    Array.prototype.map = function() {
		        throw new Error('map is unimplemented for this js engine');
		    };
		}

		exports.keys = function(obj) {
		    if(Object.prototype.keys) {
		        return obj.keys();
		    }
		    else {
		        var keys = [];
		        for(var k in obj) {
		            if(obj.hasOwnProperty(k)) {
		                keys.push(k);
		            }
		        }
		        return keys;
		    }
		};

		exports.inOperator = function (key, val) {
		    if (exports.isArray(val)) {
		        return exports.indexOf(val, key) !== -1;
		    } else if (exports.isObject(val)) {
		        return key in val;
		    } else if (exports.isString(val)) {
		        return val.indexOf(key) !== -1;
		    } else {
		        throw new Error('Cannot use "in" operator to search for "'
		            + key + '" in unexpected types.');
		    }
		};


	/***/ },
	/* 2 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';

		var path = __webpack_require__(3);
		var asap = __webpack_require__(4);
		var lib = __webpack_require__(1);
		var Obj = __webpack_require__(6);
		var compiler = __webpack_require__(3);
		var builtin_filters = __webpack_require__(7);
		var builtin_loaders = __webpack_require__(3);
		var runtime = __webpack_require__(8);
		var globals = __webpack_require__(9);
		var Frame = runtime.Frame;
		var Template;

		// Unconditionally load in this loader, even if no other ones are
		// included (possible in the slim browser build)
		builtin_loaders.PrecompiledLoader = __webpack_require__(10);

		// If the user is using the async API, *always* call it
		// asynchronously even if the template was synchronous.
		function callbackAsap(cb, err, res) {
		    asap(function() { cb(err, res); });
		}

		var Environment = Obj.extend({
		    init: function(loaders, opts) {
		        // The dev flag determines the trace that'll be shown on errors.
		        // If set to true, returns the full trace from the error point,
		        // otherwise will return trace starting from Template.render
		        // (the full trace from within nunjucks may confuse developers using
		        //  the library)
		        // defaults to false
		        opts = this.opts = opts || {};
		        this.opts.dev = !!opts.dev;

		        // The autoescape flag sets global autoescaping. If true,
		        // every string variable will be escaped by default.
		        // If false, strings can be manually escaped using the `escape` filter.
		        // defaults to true
		        this.opts.autoescape = opts.autoescape != null ? opts.autoescape : true;

		        // If true, this will make the system throw errors if trying
		        // to output a null or undefined value
		        this.opts.throwOnUndefined = !!opts.throwOnUndefined;
		        this.opts.trimBlocks = !!opts.trimBlocks;
		        this.opts.lstripBlocks = !!opts.lstripBlocks;

		        this.loaders = [];

		        if(!loaders) {
		            // The filesystem loader is only available server-side
		            if(builtin_loaders.FileSystemLoader) {
		                this.loaders = [new builtin_loaders.FileSystemLoader('views')];
		            }
		            else if(builtin_loaders.WebLoader) {
		                this.loaders = [new builtin_loaders.WebLoader('/views')];
		            }
		        }
		        else {
		            this.loaders = lib.isArray(loaders) ? loaders : [loaders];
		        }

		        // It's easy to use precompiled templates: just include them
		        // before you configure nunjucks and this will automatically
		        // pick it up and use it
		        if((true) && window.nunjucksPrecompiled) {
		            this.loaders.unshift(
		                new builtin_loaders.PrecompiledLoader(window.nunjucksPrecompiled)
		            );
		        }

		        this.initCache();

		        this.globals = globals();
		        this.filters = {};
		        this.asyncFilters = [];
		        this.extensions = {};
		        this.extensionsList = [];

		        for(var name in builtin_filters) {
		            this.addFilter(name, builtin_filters[name]);
		        }
		    },

		    initCache: function() {
		        // Caching and cache busting
		        lib.each(this.loaders, function(loader) {
		            loader.cache = {};

		            if(typeof loader.on === 'function') {
		                loader.on('update', function(template) {
		                    loader.cache[template] = null;
		                });
		            }
		        });
		    },

		    addExtension: function(name, extension) {
		        extension._name = name;
		        this.extensions[name] = extension;
		        this.extensionsList.push(extension);
		        return this;
		    },

		    removeExtension: function(name) {
		        var extension = this.getExtension(name);
		        if (!extension) return;

		        this.extensionsList = lib.without(this.extensionsList, extension);
		        delete this.extensions[name];
		    },

		    getExtension: function(name) {
		        return this.extensions[name];
		    },

		    hasExtension: function(name) {
		        return !!this.extensions[name];
		    },

		    addGlobal: function(name, value) {
		        this.globals[name] = value;
		        return this;
		    },

		    getGlobal: function(name) {
		        if(typeof this.globals[name] === 'undefined') {
		            throw new Error('global not found: ' + name);
		        }
		        return this.globals[name];
		    },

		    addFilter: function(name, func, async) {
		        var wrapped = func;

		        if(async) {
		            this.asyncFilters.push(name);
		        }
		        this.filters[name] = wrapped;
		        return this;
		    },

		    getFilter: function(name) {
		        if(!this.filters[name]) {
		            throw new Error('filter not found: ' + name);
		        }
		        return this.filters[name];
		    },

		    resolveTemplate: function(loader, parentName, filename) {
		        var isRelative = (loader.isRelative && parentName)? loader.isRelative(filename) : false;
		        return (isRelative && loader.resolve)? loader.resolve(parentName, filename) : filename;
		    },

		    getTemplate: function(name, eagerCompile, parentName, ignoreMissing, cb) {
		        var that = this;
		        var tmpl = null;
		        if(name && name.raw) {
		            // this fixes autoescape for templates referenced in symbols
		            name = name.raw;
		        }

		        if(lib.isFunction(parentName)) {
		            cb = parentName;
		            parentName = null;
		            eagerCompile = eagerCompile || false;
		        }

		        if(lib.isFunction(eagerCompile)) {
		            cb = eagerCompile;
		            eagerCompile = false;
		        }

		        if (name instanceof Template) {
		             tmpl = name;
		        }
		        else if(typeof name !== 'string') {
		            throw new Error('template names must be a string: ' + name);
		        }
		        else {
		            for (var i = 0; i < this.loaders.length; i++) {
		                var _name = this.resolveTemplate(this.loaders[i], parentName, name);
		                tmpl = this.loaders[i].cache[_name];
		                if (tmpl) break;
		            }
		        }

		        if(tmpl) {
		            if(eagerCompile) {
		                tmpl.compile();
		            }

		            if(cb) {
		                cb(null, tmpl);
		            }
		            else {
		                return tmpl;
		            }
		        } else {
		            var syncResult;
		            var _this = this;

		            var createTemplate = function(err, info) {
		                if(!info && !err) {
		                    if(!ignoreMissing) {
		                        err = new Error('template not found: ' + name);
		                    }
		                }

		                if (err) {
		                    if(cb) {
		                        cb(err);
		                    }
		                    else {
		                        throw err;
		                    }
		                }
		                else {
		                    var tmpl;
		                    if(info) {
		                        tmpl = new Template(info.src, _this,
		                                            info.path, eagerCompile);

		                        if(!info.noCache) {
		                            info.loader.cache[name] = tmpl;
		                        }
		                    }
		                    else {
		                        tmpl = new Template('', _this,
		                                            '', eagerCompile);
		                    }

		                    if(cb) {
		                        cb(null, tmpl);
		                    }
		                    else {
		                        syncResult = tmpl;
		                    }
		                }
		            };

		            lib.asyncIter(this.loaders, function(loader, i, next, done) {
		                function handle(err, src) {
		                    if(err) {
		                        done(err);
		                    }
		                    else if(src) {
		                        src.loader = loader;
		                        done(null, src);
		                    }
		                    else {
		                        next();
		                    }
		                }

		                // Resolve name relative to parentName
		                name = that.resolveTemplate(loader, parentName, name);

		                if(loader.async) {
		                    loader.getSource(name, handle);
		                }
		                else {
		                    handle(null, loader.getSource(name));
		                }
		            }, createTemplate);

		            return syncResult;
		        }
		    },

		    express: function(app) {
		        var env = this;

		        function NunjucksView(name, opts) {
		            this.name          = name;
		            this.path          = name;
		            this.defaultEngine = opts.defaultEngine;
		            this.ext           = path.extname(name);
		            if (!this.ext && !this.defaultEngine) throw new Error('No default engine was specified and no extension was provided.');
		            if (!this.ext) this.name += (this.ext = ('.' !== this.defaultEngine[0] ? '.' : '') + this.defaultEngine);
		        }

		        NunjucksView.prototype.render = function(opts, cb) {
		          env.render(this.name, opts, cb);
		        };

		        app.set('view', NunjucksView);
		        return this;
		    },

		    render: function(name, ctx, cb) {
		        if(lib.isFunction(ctx)) {
		            cb = ctx;
		            ctx = null;
		        }

		        // We support a synchronous API to make it easier to migrate
		        // existing code to async. This works because if you don't do
		        // anything async work, the whole thing is actually run
		        // synchronously.
		        var syncResult = null;

		        this.getTemplate(name, function(err, tmpl) {
		            if(err && cb) {
		                callbackAsap(cb, err);
		            }
		            else if(err) {
		                throw err;
		            }
		            else {
		                syncResult = tmpl.render(ctx, cb);
		            }
		        });

		        return syncResult;
		    },

		    renderString: function(src, ctx, opts, cb) {
		        if(lib.isFunction(opts)) {
		            cb = opts;
		            opts = {};
		        }
		        opts = opts || {};

		        var tmpl = new Template(src, this, opts.path);
		        return tmpl.render(ctx, cb);
		    }
		});

		var Context = Obj.extend({
		    init: function(ctx, blocks, env) {
		        // Has to be tied to an environment so we can tap into its globals.
		        this.env = env || new Environment();

		        // Make a duplicate of ctx
		        this.ctx = {};
		        for(var k in ctx) {
		            if(ctx.hasOwnProperty(k)) {
		                this.ctx[k] = ctx[k];
		            }
		        }

		        this.blocks = {};
		        this.exported = [];

		        for(var name in blocks) {
		            this.addBlock(name, blocks[name]);
		        }
		    },

		    lookup: function(name) {
		        // This is one of the most called functions, so optimize for
		        // the typical case where the name isn't in the globals
		        if(name in this.env.globals && !(name in this.ctx)) {
		            return this.env.globals[name];
		        }
		        else {
		            return this.ctx[name];
		        }
		    },

		    setVariable: function(name, val) {
		        this.ctx[name] = val;
		    },

		    getVariables: function() {
		        return this.ctx;
		    },

		    addBlock: function(name, block) {
		        this.blocks[name] = this.blocks[name] || [];
		        this.blocks[name].push(block);
		        return this;
		    },

		    getBlock: function(name) {
		        if(!this.blocks[name]) {
		            throw new Error('unknown block "' + name + '"');
		        }

		        return this.blocks[name][0];
		    },

		    getSuper: function(env, name, block, frame, runtime, cb) {
		        var idx = lib.indexOf(this.blocks[name] || [], block);
		        var blk = this.blocks[name][idx + 1];
		        var context = this;

		        if(idx === -1 || !blk) {
		            throw new Error('no super block available for "' + name + '"');
		        }

		        blk(env, context, frame, runtime, cb);
		    },

		    addExport: function(name) {
		        this.exported.push(name);
		    },

		    getExported: function() {
		        var exported = {};
		        for(var i=0; i<this.exported.length; i++) {
		            var name = this.exported[i];
		            exported[name] = this.ctx[name];
		        }
		        return exported;
		    }
		});

		Template = Obj.extend({
		    init: function (src, env, path, eagerCompile) {
		        this.env = env || new Environment();

		        if(lib.isObject(src)) {
		            switch(src.type) {
		            case 'code': this.tmplProps = src.obj; break;
		            case 'string': this.tmplStr = src.obj; break;
		            }
		        }
		        else if(lib.isString(src)) {
		            this.tmplStr = src;
		        }
		        else {
		            throw new Error('src must be a string or an object describing ' +
		                            'the source');
		        }

		        this.path = path;

		        if(eagerCompile) {
		            var _this = this;
		            try {
		                _this._compile();
		            }
		            catch(err) {
		                throw lib.prettifyError(this.path, this.env.opts.dev, err);
		            }
		        }
		        else {
		            this.compiled = false;
		        }
		    },

		    render: function(ctx, parentFrame, cb) {
		        if (typeof ctx === 'function') {
		            cb = ctx;
		            ctx = {};
		        }
		        else if (typeof parentFrame === 'function') {
		            cb = parentFrame;
		            parentFrame = null;
		        }

		        var forceAsync = true;
		        if(parentFrame) {
		            // If there is a frame, we are being called from internal
		            // code of another template, and the internal system
		            // depends on the sync/async nature of the parent template
		            // to be inherited, so force an async callback
		            forceAsync = false;
		        }

		        var _this = this;
		        // Catch compile errors for async rendering
		        try {
		            _this.compile();
		        } catch (_err) {
		            var err = lib.prettifyError(this.path, this.env.opts.dev, _err);
		            if (cb) return callbackAsap(cb, err);
		            else throw err;
		        }

		        var context = new Context(ctx || {}, _this.blocks, _this.env);
		        var frame = parentFrame ? parentFrame.push(true) : new Frame();
		        frame.topLevel = true;
		        var syncResult = null;

		        _this.rootRenderFunc(
		            _this.env,
		            context,
		            frame || new Frame(),
		            runtime,
		            function(err, res) {
		                if(err) {
		                    err = lib.prettifyError(_this.path, _this.env.opts.dev, err);
		                }

		                if(cb) {
		                    if(forceAsync) {
		                        callbackAsap(cb, err, res);
		                    }
		                    else {
		                        cb(err, res);
		                    }
		                }
		                else {
		                    if(err) { throw err; }
		                    syncResult = res;
		                }
		            }
		        );

		        return syncResult;
		    },


		    getExported: function(ctx, parentFrame, cb) {
		        if (typeof ctx === 'function') {
		            cb = ctx;
		            ctx = {};
		        }

		        if (typeof parentFrame === 'function') {
		            cb = parentFrame;
		            parentFrame = null;
		        }

		        // Catch compile errors for async rendering
		        try {
		            this.compile();
		        } catch (e) {
		            if (cb) return cb(e);
		            else throw e;
		        }

		        var frame = parentFrame ? parentFrame.push() : new Frame();
		        frame.topLevel = true;

		        // Run the rootRenderFunc to populate the context with exported vars
		        var context = new Context(ctx || {}, this.blocks, this.env);
		        this.rootRenderFunc(this.env,
		                            context,
		                            frame,
		                            runtime,
		                            function(err) {
		        		        if ( err ) {
		        			    cb(err, null);
		        		        } else {
		        			    cb(null, context.getExported());
		        		        }
		                            });
		    },

		    compile: function() {
		        if(!this.compiled) {
		            this._compile();
		        }
		    },

		    _compile: function() {
		        var props;

		        if(this.tmplProps) {
		            props = this.tmplProps;
		        }
		        else {
		            var source = compiler.compile(this.tmplStr,
		                                          this.env.asyncFilters,
		                                          this.env.extensionsList,
		                                          this.path,
		                                          this.env.opts);

		            /* jslint evil: true */
		            var func = new Function(source);
		            props = func();
		        }

		        this.blocks = this._getBlocks(props);
		        this.rootRenderFunc = props.root;
		        this.compiled = true;
		    },

		    _getBlocks: function(props) {
		        var blocks = {};

		        for(var k in props) {
		            if(k.slice(0, 2) === 'b_') {
		                blocks[k.slice(2)] = props[k];
		            }
		        }

		        return blocks;
		    }
		});

		module.exports = {
		    Environment: Environment,
		    Template: Template
		};


	/***/ },
	/* 3 */
	/***/ function(module, exports) {

		

	/***/ },
	/* 4 */
	/***/ function(module, exports, __webpack_require__) {

		"use strict";

		// rawAsap provides everything we need except exception management.
		var rawAsap = __webpack_require__(5);
		// RawTasks are recycled to reduce GC churn.
		var freeTasks = [];
		// We queue errors to ensure they are thrown in right order (FIFO).
		// Array-as-queue is good enough here, since we are just dealing with exceptions.
		var pendingErrors = [];
		var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);

		function throwFirstError() {
		    if (pendingErrors.length) {
		        throw pendingErrors.shift();
		    }
		}

		/**
		 * Calls a task as soon as possible after returning, in its own event, with priority
		 * over other events like animation, reflow, and repaint. An error thrown from an
		 * event will not interrupt, nor even substantially slow down the processing of
		 * other events, but will be rather postponed to a lower priority event.
		 * @param {{call}} task A callable object, typically a function that takes no
		 * arguments.
		 */
		module.exports = asap;
		function asap(task) {
		    var rawTask;
		    if (freeTasks.length) {
		        rawTask = freeTasks.pop();
		    } else {
		        rawTask = new RawTask();
		    }
		    rawTask.task = task;
		    rawAsap(rawTask);
		}

		// We wrap tasks with recyclable task objects.  A task object implements
		// `call`, just like a function.
		function RawTask() {
		    this.task = null;
		}

		// The sole purpose of wrapping the task is to catch the exception and recycle
		// the task object after its single use.
		RawTask.prototype.call = function () {
		    try {
		        this.task.call();
		    } catch (error) {
		        if (asap.onerror) {
		            // This hook exists purely for testing purposes.
		            // Its name will be periodically randomized to break any code that
		            // depends on its existence.
		            asap.onerror(error);
		        } else {
		            // In a web browser, exceptions are not fatal. However, to avoid
		            // slowing down the queue of pending tasks, we rethrow the error in a
		            // lower priority turn.
		            pendingErrors.push(error);
		            requestErrorThrow();
		        }
		    } finally {
		        this.task = null;
		        freeTasks[freeTasks.length] = this;
		    }
		};


	/***/ },
	/* 5 */
	/***/ function(module, exports) {

		/* WEBPACK VAR INJECTION */(function(global) {"use strict";

		// Use the fastest means possible to execute a task in its own turn, with
		// priority over other events including IO, animation, reflow, and redraw
		// events in browsers.
		//
		// An exception thrown by a task will permanently interrupt the processing of
		// subsequent tasks. The higher level `asap` function ensures that if an
		// exception is thrown by a task, that the task queue will continue flushing as
		// soon as possible, but if you use `rawAsap` directly, you are responsible to
		// either ensure that no exceptions are thrown from your task, or to manually
		// call `rawAsap.requestFlush` if an exception is thrown.
		module.exports = rawAsap;
		function rawAsap(task) {
		    if (!queue.length) {
		        requestFlush();
		        flushing = true;
		    }
		    // Equivalent to push, but avoids a function call.
		    queue[queue.length] = task;
		}

		var queue = [];
		// Once a flush has been requested, no further calls to `requestFlush` are
		// necessary until the next `flush` completes.
		var flushing = false;
		// `requestFlush` is an implementation-specific method that attempts to kick
		// off a `flush` event as quickly as possible. `flush` will attempt to exhaust
		// the event queue before yielding to the browser's own event loop.
		var requestFlush;
		// The position of the next task to execute in the task queue. This is
		// preserved between calls to `flush` so that it can be resumed if
		// a task throws an exception.
		var index = 0;
		// If a task schedules additional tasks recursively, the task queue can grow
		// unbounded. To prevent memory exhaustion, the task queue will periodically
		// truncate already-completed tasks.
		var capacity = 1024;

		// The flush function processes all tasks that have been scheduled with
		// `rawAsap` unless and until one of those tasks throws an exception.
		// If a task throws an exception, `flush` ensures that its state will remain
		// consistent and will resume where it left off when called again.
		// However, `flush` does not make any arrangements to be called again if an
		// exception is thrown.
		function flush() {
		    while (index < queue.length) {
		        var currentIndex = index;
		        // Advance the index before calling the task. This ensures that we will
		        // begin flushing on the next task the task throws an error.
		        index = index + 1;
		        queue[currentIndex].call();
		        // Prevent leaking memory for long chains of recursive calls to `asap`.
		        // If we call `asap` within tasks scheduled by `asap`, the queue will
		        // grow, but to avoid an O(n) walk for every task we execute, we don't
		        // shift tasks off the queue after they have been executed.
		        // Instead, we periodically shift 1024 tasks off the queue.
		        if (index > capacity) {
		            // Manually shift all values starting at the index back to the
		            // beginning of the queue.
		            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
		                queue[scan] = queue[scan + index];
		            }
		            queue.length -= index;
		            index = 0;
		        }
		    }
		    queue.length = 0;
		    index = 0;
		    flushing = false;
		}

		// `requestFlush` is implemented using a strategy based on data collected from
		// every available SauceLabs Selenium web driver worker at time of writing.
		// https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593

		// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
		// have WebKitMutationObserver but not un-prefixed MutationObserver.
		// Must use `global` instead of `window` to work in both frames and web
		// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.
		var BrowserMutationObserver = global.MutationObserver || global.WebKitMutationObserver;

		// MutationObservers are desirable because they have high priority and work
		// reliably everywhere they are implemented.
		// They are implemented in all modern browsers.
		//
		// - Android 4-4.3
		// - Chrome 26-34
		// - Firefox 14-29
		// - Internet Explorer 11
		// - iPad Safari 6-7.1
		// - iPhone Safari 7-7.1
		// - Safari 6-7
		if (typeof BrowserMutationObserver === "function") {
		    requestFlush = makeRequestCallFromMutationObserver(flush);

		// MessageChannels are desirable because they give direct access to the HTML
		// task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
		// 11-12, and in web workers in many engines.
		// Although message channels yield to any queued rendering and IO tasks, they
		// would be better than imposing the 4ms delay of timers.
		// However, they do not work reliably in Internet Explorer or Safari.

		// Internet Explorer 10 is the only browser that has setImmediate but does
		// not have MutationObservers.
		// Although setImmediate yields to the browser's renderer, it would be
		// preferrable to falling back to setTimeout since it does not have
		// the minimum 4ms penalty.
		// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
		// Desktop to a lesser extent) that renders both setImmediate and
		// MessageChannel useless for the purposes of ASAP.
		// https://github.com/kriskowal/q/issues/396

		// Timers are implemented universally.
		// We fall back to timers in workers in most engines, and in foreground
		// contexts in the following browsers.
		// However, note that even this simple case requires nuances to operate in a
		// broad spectrum of browsers.
		//
		// - Firefox 3-13
		// - Internet Explorer 6-9
		// - iPad Safari 4.3
		// - Lynx 2.8.7
		} else {
		    requestFlush = makeRequestCallFromTimer(flush);
		}

		// `requestFlush` requests that the high priority event queue be flushed as
		// soon as possible.
		// This is useful to prevent an error thrown in a task from stalling the event
		// queue if the exception handled by Node.js’s
		// `process.on("uncaughtException")` or by a domain.
		rawAsap.requestFlush = requestFlush;

		// To request a high priority event, we induce a mutation observer by toggling
		// the text of a text node between "1" and "-1".
		function makeRequestCallFromMutationObserver(callback) {
		    var toggle = 1;
		    var observer = new BrowserMutationObserver(callback);
		    var node = document.createTextNode("");
		    observer.observe(node, {characterData: true});
		    return function requestCall() {
		        toggle = -toggle;
		        node.data = toggle;
		    };
		}

		// The message channel technique was discovered by Malte Ubl and was the
		// original foundation for this library.
		// http://www.nonblocking.io/2011/06/windownexttick.html

		// Safari 6.0.5 (at least) intermittently fails to create message ports on a
		// page's first load. Thankfully, this version of Safari supports
		// MutationObservers, so we don't need to fall back in that case.

		// function makeRequestCallFromMessageChannel(callback) {
		//     var channel = new MessageChannel();
		//     channel.port1.onmessage = callback;
		//     return function requestCall() {
		//         channel.port2.postMessage(0);
		//     };
		// }

		// For reasons explained above, we are also unable to use `setImmediate`
		// under any circumstances.
		// Even if we were, there is another bug in Internet Explorer 10.
		// It is not sufficient to assign `setImmediate` to `requestFlush` because
		// `setImmediate` must be called *by name* and therefore must be wrapped in a
		// closure.
		// Never forget.

		// function makeRequestCallFromSetImmediate(callback) {
		//     return function requestCall() {
		//         setImmediate(callback);
		//     };
		// }

		// Safari 6.0 has a problem where timers will get lost while the user is
		// scrolling. This problem does not impact ASAP because Safari 6.0 supports
		// mutation observers, so that implementation is used instead.
		// However, if we ever elect to use timers in Safari, the prevalent work-around
		// is to add a scroll event listener that calls for a flush.

		// `setTimeout` does not call the passed callback if the delay is less than
		// approximately 7 in web workers in Firefox 8 through 18, and sometimes not
		// even then.

		function makeRequestCallFromTimer(callback) {
		    return function requestCall() {
		        // We dispatch a timeout with a specified delay of 0 for engines that
		        // can reliably accommodate that request. This will usually be snapped
		        // to a 4 milisecond delay, but once we're flushing, there's no delay
		        // between events.
		        var timeoutHandle = setTimeout(handleTimer, 0);
		        // However, since this timer gets frequently dropped in Firefox
		        // workers, we enlist an interval handle that will try to fire
		        // an event 20 times per second until it succeeds.
		        var intervalHandle = setInterval(handleTimer, 50);

		        function handleTimer() {
		            // Whichever timer succeeds will cancel both timers and
		            // execute the callback.
		            clearTimeout(timeoutHandle);
		            clearInterval(intervalHandle);
		            callback();
		        }
		    };
		}

		// This is for `asap.js` only.
		// Its name will be periodically randomized to break any code that depends on
		// its existence.
		rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

		// ASAP was originally a nextTick shim included in Q. This was factored out
		// into this ASAP package. It was later adapted to RSVP which made further
		// amendments. These decisions, particularly to marginalize MessageChannel and
		// to capture the MutationObserver implementation in a closure, were integrated
		// back into ASAP proper.
		// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js

		/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

	/***/ },
	/* 6 */
	/***/ function(module, exports) {

		'use strict';

		// A simple class system, more documentation to come

		function extend(cls, name, props) {
		    // This does that same thing as Object.create, but with support for IE8
		    var F = function() {};
		    F.prototype = cls.prototype;
		    var prototype = new F();

		    // jshint undef: false
		    var fnTest = /xyz/.test(function(){ xyz; }) ? /\bparent\b/ : /.*/;
		    props = props || {};

		    for(var k in props) {
		        var src = props[k];
		        var parent = prototype[k];

		        if(typeof parent === 'function' &&
		           typeof src === 'function' &&
		           fnTest.test(src)) {
		            /*jshint -W083 */
		            prototype[k] = (function (src, parent) {
		                return function() {
		                    // Save the current parent method
		                    var tmp = this.parent;

		                    // Set parent to the previous method, call, and restore
		                    this.parent = parent;
		                    var res = src.apply(this, arguments);
		                    this.parent = tmp;

		                    return res;
		                };
		            })(src, parent);
		        }
		        else {
		            prototype[k] = src;
		        }
		    }

		    prototype.typename = name;

		    var new_cls = function() {
		        if(prototype.init) {
		            prototype.init.apply(this, arguments);
		        }
		    };

		    new_cls.prototype = prototype;
		    new_cls.prototype.constructor = new_cls;

		    new_cls.extend = function(name, props) {
		        if(typeof name === 'object') {
		            props = name;
		            name = 'anonymous';
		        }
		        return extend(new_cls, name, props);
		    };

		    return new_cls;
		}

		module.exports = extend(Object, 'Object', {});


	/***/ },
	/* 7 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';

		var lib = __webpack_require__(1);
		var r = __webpack_require__(8);

		function normalize(value, defaultValue) {
		    if(value === null || value === undefined || value === false) {
		        return defaultValue;
		    }
		    return value;
		}

		var filters = {
		    abs: function(n) {
		        return Math.abs(n);
		    },

		    batch: function(arr, linecount, fill_with) {
		        var i;
		        var res = [];
		        var tmp = [];

		        for(i = 0; i < arr.length; i++) {
		            if(i % linecount === 0 && tmp.length) {
		                res.push(tmp);
		                tmp = [];
		            }

		            tmp.push(arr[i]);
		        }

		        if(tmp.length) {
		            if(fill_with) {
		                for(i = tmp.length; i < linecount; i++) {
		                    tmp.push(fill_with);
		                }
		            }

		            res.push(tmp);
		        }

		        return res;
		    },

		    capitalize: function(str) {
		        str = normalize(str, '');
		        var ret = str.toLowerCase();
		        return r.copySafeness(str, ret.charAt(0).toUpperCase() + ret.slice(1));
		    },

		    center: function(str, width) {
		        str = normalize(str, '');
		        width = width || 80;

		        if(str.length >= width) {
		            return str;
		        }

		        var spaces = width - str.length;
		        var pre = lib.repeat(' ', spaces/2 - spaces % 2);
		        var post = lib.repeat(' ', spaces/2);
		        return r.copySafeness(str, pre + str + post);
		    },

		    'default': function(val, def, bool) {
		        if(bool) {
		            return val ? val : def;
		        }
		        else {
		            return (val !== undefined) ? val : def;
		        }
		    },

		    dictsort: function(val, case_sensitive, by) {
		        if (!lib.isObject(val)) {
		            throw new lib.TemplateError('dictsort filter: val must be an object');
		        }

		        var array = [];
		        for (var k in val) {
		            // deliberately include properties from the object's prototype
		            array.push([k,val[k]]);
		        }

		        var si;
		        if (by === undefined || by === 'key') {
		            si = 0;
		        } else if (by === 'value') {
		            si = 1;
		        } else {
		            throw new lib.TemplateError(
		                'dictsort filter: You can only sort by either key or value');
		        }

		        array.sort(function(t1, t2) {
		            var a = t1[si];
		            var b = t2[si];

		            if (!case_sensitive) {
		                if (lib.isString(a)) {
		                    a = a.toUpperCase();
		                }
		                if (lib.isString(b)) {
		                    b = b.toUpperCase();
		                }
		            }

		            return a > b ? 1 : (a === b ? 0 : -1);
		        });

		        return array;
		    },

		    dump: function(obj) {
		        return JSON.stringify(obj);
		    },

		    escape: function(str) {
		        if(typeof str === 'string') {
		            return r.markSafe(lib.escape(str));
		        }
		        return str;
		    },

		    safe: function(str) {
		        return r.markSafe(str);
		    },

		    first: function(arr) {
		        return arr[0];
		    },

		    groupby: function(arr, attr) {
		        return lib.groupBy(arr, attr);
		    },

		    indent: function(str, width, indentfirst) {
		        str = normalize(str, '');

		        if (str === '') return '';

		        width = width || 4;
		        var res = '';
		        var lines = str.split('\n');
		        var sp = lib.repeat(' ', width);

		        for(var i=0; i<lines.length; i++) {
		            if(i === 0 && !indentfirst) {
		                res += lines[i] + '\n';
		            }
		            else {
		                res += sp + lines[i] + '\n';
		            }
		        }

		        return r.copySafeness(str, res);
		    },

		    join: function(arr, del, attr) {
		        del = del || '';

		        if(attr) {
		            arr = lib.map(arr, function(v) {
		                return v[attr];
		            });
		        }

		        return arr.join(del);
		    },

		    last: function(arr) {
		        return arr[arr.length-1];
		    },

		    length: function(val) {
		        var value = normalize(val, '');

		        if(value !== undefined) {
		            if(
		                (typeof Map === 'function' && value instanceof Map) ||
		                (typeof Set === 'function' && value instanceof Set)
		            ) {
		                // ECMAScript 2015 Maps and Sets
		                return value.size;
		            }
		            return value.length;
		        }
		        return 0;
		    },

		    list: function(val) {
		        if(lib.isString(val)) {
		            return val.split('');
		        }
		        else if(lib.isObject(val)) {
		            var keys = [];

		            if(Object.keys) {
		                keys = Object.keys(val);
		            }
		            else {
		                for(var k in val) {
		                    keys.push(k);
		                }
		            }

		            return lib.map(keys, function(k) {
		                return { key: k,
		                         value: val[k] };
		            });
		        }
		        else if(lib.isArray(val)) {
		          return val;
		        }
		        else {
		            throw new lib.TemplateError('list filter: type not iterable');
		        }
		    },

		    lower: function(str) {
		        str = normalize(str, '');
		        return str.toLowerCase();
		    },

		    random: function(arr) {
		        return arr[Math.floor(Math.random() * arr.length)];
		    },

		    rejectattr: function(arr, attr) {
		      return arr.filter(function (item) {
		        return !item[attr];
		      });
		    },

		    selectattr: function(arr, attr) {
		      return arr.filter(function (item) {
		        return !!item[attr];
		      });
		    },

		    replace: function(str, old, new_, maxCount) {
		        var originalStr = str;

		        if (old instanceof RegExp) {
		            return str.replace(old, new_);
		        }

		        if(typeof maxCount === 'undefined'){
		            maxCount = -1;
		        }

		        var res = '';  // Output

		        // Cast Numbers in the search term to string
		        if(typeof old === 'number'){
		            old = old + '';
		        }
		        else if(typeof old !== 'string') {
		            // If it is something other than number or string,
		            // return the original string
		            return str;
		        }

		        // Cast numbers in the replacement to string
		        if(typeof str === 'number'){
		            str = str + '';
		        }

		        // If by now, we don't have a string, throw it back
		        if(typeof str !== 'string' && !(str instanceof r.SafeString)){
		            return str;
		        }

		        // ShortCircuits
		        if(old === ''){
		            // Mimic the python behaviour: empty string is replaced
		            // by replacement e.g. "abc"|replace("", ".") -> .a.b.c.
		            res = new_ + str.split('').join(new_) + new_;
		            return r.copySafeness(str, res);
		        }

		        var nextIndex = str.indexOf(old);
		        // if # of replacements to perform is 0, or the string to does
		        // not contain the old value, return the string
		        if(maxCount === 0 || nextIndex === -1){
		            return str;
		        }

		        var pos = 0;
		        var count = 0; // # of replacements made

		        while(nextIndex  > -1 && (maxCount === -1 || count < maxCount)){
		            // Grab the next chunk of src string and add it with the
		            // replacement, to the result
		            res += str.substring(pos, nextIndex) + new_;
		            // Increment our pointer in the src string
		            pos = nextIndex + old.length;
		            count++;
		            // See if there are any more replacements to be made
		            nextIndex = str.indexOf(old, pos);
		        }

		        // We've either reached the end, or done the max # of
		        // replacements, tack on any remaining string
		        if(pos < str.length) {
		            res += str.substring(pos);
		        }

		        return r.copySafeness(originalStr, res);
		    },

		    reverse: function(val) {
		        var arr;
		        if(lib.isString(val)) {
		            arr = filters.list(val);
		        }
		        else {
		            // Copy it
		            arr = lib.map(val, function(v) { return v; });
		        }

		        arr.reverse();

		        if(lib.isString(val)) {
		            return r.copySafeness(val, arr.join(''));
		        }
		        return arr;
		    },

		    round: function(val, precision, method) {
		        precision = precision || 0;
		        var factor = Math.pow(10, precision);
		        var rounder;

		        if(method === 'ceil') {
		            rounder = Math.ceil;
		        }
		        else if(method === 'floor') {
		            rounder = Math.floor;
		        }
		        else {
		            rounder = Math.round;
		        }

		        return rounder(val * factor) / factor;
		    },

		    slice: function(arr, slices, fillWith) {
		        var sliceLength = Math.floor(arr.length / slices);
		        var extra = arr.length % slices;
		        var offset = 0;
		        var res = [];

		        for(var i=0; i<slices; i++) {
		            var start = offset + i * sliceLength;
		            if(i < extra) {
		                offset++;
		            }
		            var end = offset + (i + 1) * sliceLength;

		            var slice = arr.slice(start, end);
		            if(fillWith && i >= extra) {
		                slice.push(fillWith);
		            }
		            res.push(slice);
		        }

		        return res;
		    },

		    sum: function(arr, attr, start) {
		        var sum = 0;

		        if(typeof start === 'number'){
		            sum += start;
		        }

		        if(attr) {
		            arr = lib.map(arr, function(v) {
		                return v[attr];
		            });
		        }

		        for(var i = 0; i < arr.length; i++) {
		            sum += arr[i];
		        }

		        return sum;
		    },

		    sort: r.makeMacro(['value', 'reverse', 'case_sensitive', 'attribute'], [], function(arr, reverse, caseSens, attr) {
		         // Copy it
		        arr = lib.map(arr, function(v) { return v; });

		        arr.sort(function(a, b) {
		            var x, y;

		            if(attr) {
		                x = a[attr];
		                y = b[attr];
		            }
		            else {
		                x = a;
		                y = b;
		            }

		            if(!caseSens && lib.isString(x) && lib.isString(y)) {
		                x = x.toLowerCase();
		                y = y.toLowerCase();
		            }

		            if(x < y) {
		                return reverse ? 1 : -1;
		            }
		            else if(x > y) {
		                return reverse ? -1: 1;
		            }
		            else {
		                return 0;
		            }
		        });

		        return arr;
		    }),

		    string: function(obj) {
		        return r.copySafeness(obj, obj);
		    },

		    striptags: function(input, preserve_linebreaks) {
		        input = normalize(input, '');
		        preserve_linebreaks = preserve_linebreaks || false;
		        var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>|<!--[\s\S]*?-->/gi;
		        var trimmedInput = filters.trim(input.replace(tags, ''));
		        var res = '';
		        if (preserve_linebreaks) {
		            res = trimmedInput
		                .replace(/^ +| +$/gm, '')     // remove leading and trailing spaces
		                .replace(/ +/g, ' ')          // squash adjacent spaces
		                .replace(/(\r\n)/g, '\n')     // normalize linebreaks (CRLF -> LF)
		                .replace(/\n\n\n+/g, '\n\n'); // squash abnormal adjacent linebreaks
		        } else {
		            res = trimmedInput.replace(/\s+/gi, ' ');
		        }
		        return r.copySafeness(input, res);
		    },

		    title: function(str) {
		        str = normalize(str, '');
		        var words = str.split(' ');
		        for(var i = 0; i < words.length; i++) {
		            words[i] = filters.capitalize(words[i]);
		        }
		        return r.copySafeness(str, words.join(' '));
		    },

		    trim: function(str) {
		        return r.copySafeness(str, str.replace(/^\s*|\s*$/g, ''));
		    },

		    truncate: function(input, length, killwords, end) {
		        var orig = input;
		        input = normalize(input, '');
		        length = length || 255;

		        if (input.length <= length)
		            return input;

		        if (killwords) {
		            input = input.substring(0, length);
		        } else {
		            var idx = input.lastIndexOf(' ', length);
		            if(idx === -1) {
		                idx = length;
		            }

		            input = input.substring(0, idx);
		        }

		        input += (end !== undefined && end !== null) ? end : '...';
		        return r.copySafeness(orig, input);
		    },

		    upper: function(str) {
		        str = normalize(str, '');
		        return str.toUpperCase();
		    },

		    urlencode: function(obj) {
		        var enc = encodeURIComponent;
		        if (lib.isString(obj)) {
		            return enc(obj);
		        } else {
		            var parts;
		            if (lib.isArray(obj)) {
		                parts = obj.map(function(item) {
		                    return enc(item[0]) + '=' + enc(item[1]);
		                });
		            } else {
		                parts = [];
		                for (var k in obj) {
		                    if (obj.hasOwnProperty(k)) {
		                        parts.push(enc(k) + '=' + enc(obj[k]));
		                    }
		                }
		            }
		            return parts.join('&');
		        }
		    },

		    urlize: function(str, length, nofollow) {
		        if (isNaN(length)) length = Infinity;

		        var noFollowAttr = (nofollow === true ? ' rel="nofollow"' : '');

		        // For the jinja regexp, see
		        // https://github.com/mitsuhiko/jinja2/blob/f15b814dcba6aa12bc74d1f7d0c881d55f7126be/jinja2/utils.py#L20-L23
		        var puncRE = /^(?:\(|<|&lt;)?(.*?)(?:\.|,|\)|\n|&gt;)?$/;
		        // from http://blog.gerv.net/2011/05/html5_email_address_regexp/
		        var emailRE = /^[\w.!#$%&'*+\-\/=?\^`{|}~]+@[a-z\d\-]+(\.[a-z\d\-]+)+$/i;
		        var httpHttpsRE = /^https?:\/\/.*$/;
		        var wwwRE = /^www\./;
		        var tldRE = /\.(?:org|net|com)(?:\:|\/|$)/;

		        var words = str.split(/(\s+)/).filter(function(word) {
		          // If the word has no length, bail. This can happen for str with
		          // trailing whitespace.
		          return word && word.length;
		        }).map(function(word) {
		          var matches = word.match(puncRE);
		          var possibleUrl = matches && matches[1] || word;

		          // url that starts with http or https
		          if (httpHttpsRE.test(possibleUrl))
		            return '<a href="' + possibleUrl + '"' + noFollowAttr + '>' + possibleUrl.substr(0, length) + '</a>';

		          // url that starts with www.
		          if (wwwRE.test(possibleUrl))
		            return '<a href="http://' + possibleUrl + '"' + noFollowAttr + '>' + possibleUrl.substr(0, length) + '</a>';

		          // an email address of the form username@domain.tld
		          if (emailRE.test(possibleUrl))
		            return '<a href="mailto:' + possibleUrl + '">' + possibleUrl + '</a>';

		          // url that ends in .com, .org or .net that is not an email address
		          if (tldRE.test(possibleUrl))
		            return '<a href="http://' + possibleUrl + '"' + noFollowAttr + '>' + possibleUrl.substr(0, length) + '</a>';

		          return word;

		        });

		        return words.join('');
		    },

		    wordcount: function(str) {
		        str = normalize(str, '');
		        var words = (str) ? str.match(/\w+/g) : null;
		        return (words) ? words.length : null;
		    },

		    'float': function(val, def) {
		        var res = parseFloat(val);
		        return isNaN(res) ? def : res;
		    },

		    'int': function(val, def) {
		        var res = parseInt(val, 10);
		        return isNaN(res) ? def : res;
		    }
		};

		// Aliases
		filters.d = filters['default'];
		filters.e = filters.escape;

		module.exports = filters;


	/***/ },
	/* 8 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';

		var lib = __webpack_require__(1);
		var Obj = __webpack_require__(6);

		// Frames keep track of scoping both at compile-time and run-time so
		// we know how to access variables. Block tags can introduce special
		// variables, for example.
		var Frame = Obj.extend({
		    init: function(parent, isolateWrites) {
		        this.variables = {};
		        this.parent = parent;
		        this.topLevel = false;
		        // if this is true, writes (set) should never propagate upwards past
		        // this frame to its parent (though reads may).
		        this.isolateWrites = isolateWrites;
		    },

		    set: function(name, val, resolveUp) {
		        // Allow variables with dots by automatically creating the
		        // nested structure
		        var parts = name.split('.');
		        var obj = this.variables;
		        var frame = this;

		        if(resolveUp) {
		            if((frame = this.resolve(parts[0], true))) {
		                frame.set(name, val);
		                return;
		            }
		        }

		        for(var i=0; i<parts.length - 1; i++) {
		            var id = parts[i];

		            if(!obj[id]) {
		                obj[id] = {};
		            }
		            obj = obj[id];
		        }

		        obj[parts[parts.length - 1]] = val;
		    },

		    get: function(name) {
		        var val = this.variables[name];
		        if(val !== undefined && val !== null) {
		            return val;
		        }
		        return null;
		    },

		    lookup: function(name) {
		        var p = this.parent;
		        var val = this.variables[name];
		        if(val !== undefined && val !== null) {
		            return val;
		        }
		        return p && p.lookup(name);
		    },

		    resolve: function(name, forWrite) {
		        var p = (forWrite && this.isolateWrites) ? undefined : this.parent;
		        var val = this.variables[name];
		        if(val !== undefined && val !== null) {
		            return this;
		        }
		        return p && p.resolve(name);
		    },

		    push: function(isolateWrites) {
		        return new Frame(this, isolateWrites);
		    },

		    pop: function() {
		        return this.parent;
		    }
		});

		function makeMacro(argNames, kwargNames, func) {
		    return function() {
		        var argCount = numArgs(arguments);
		        var args;
		        var kwargs = getKeywordArgs(arguments);
		        var i;

		        if(argCount > argNames.length) {
		            args = Array.prototype.slice.call(arguments, 0, argNames.length);

		            // Positional arguments that should be passed in as
		            // keyword arguments (essentially default values)
		            var vals = Array.prototype.slice.call(arguments, args.length, argCount);
		            for(i = 0; i < vals.length; i++) {
		                if(i < kwargNames.length) {
		                    kwargs[kwargNames[i]] = vals[i];
		                }
		            }

		            args.push(kwargs);
		        }
		        else if(argCount < argNames.length) {
		            args = Array.prototype.slice.call(arguments, 0, argCount);

		            for(i = argCount; i < argNames.length; i++) {
		                var arg = argNames[i];

		                // Keyword arguments that should be passed as
		                // positional arguments, i.e. the caller explicitly
		                // used the name of a positional arg
		                args.push(kwargs[arg]);
		                delete kwargs[arg];
		            }

		            args.push(kwargs);
		        }
		        else {
		            args = arguments;
		        }

		        return func.apply(this, args);
		    };
		}

		function makeKeywordArgs(obj) {
		    obj.__keywords = true;
		    return obj;
		}

		function getKeywordArgs(args) {
		    var len = args.length;
		    if(len) {
		        var lastArg = args[len - 1];
		        if(lastArg && lastArg.hasOwnProperty('__keywords')) {
		            return lastArg;
		        }
		    }
		    return {};
		}

		function numArgs(args) {
		    var len = args.length;
		    if(len === 0) {
		        return 0;
		    }

		    var lastArg = args[len - 1];
		    if(lastArg && lastArg.hasOwnProperty('__keywords')) {
		        return len - 1;
		    }
		    else {
		        return len;
		    }
		}

		// A SafeString object indicates that the string should not be
		// autoescaped. This happens magically because autoescaping only
		// occurs on primitive string objects.
		function SafeString(val) {
		    if(typeof val !== 'string') {
		        return val;
		    }

		    this.val = val;
		    this.length = val.length;
		}

		SafeString.prototype = Object.create(String.prototype, {
		    length: { writable: true, configurable: true, value: 0 }
		});
		SafeString.prototype.valueOf = function() {
		    return this.val;
		};
		SafeString.prototype.toString = function() {
		    return this.val;
		};

		function copySafeness(dest, target) {
		    if(dest instanceof SafeString) {
		        return new SafeString(target);
		    }
		    return target.toString();
		}

		function markSafe(val) {
		    var type = typeof val;

		    if(type === 'string') {
		        return new SafeString(val);
		    }
		    else if(type !== 'function') {
		        return val;
		    }
		    else {
		        return function() {
		            var ret = val.apply(this, arguments);

		            if(typeof ret === 'string') {
		                return new SafeString(ret);
		            }

		            return ret;
		        };
		    }
		}

		function suppressValue(val, autoescape) {
		    val = (val !== undefined && val !== null) ? val : '';

		    if(autoescape && typeof val === 'string') {
		        val = lib.escape(val);
		    }

		    return val;
		}

		function ensureDefined(val, lineno, colno) {
		    if(val === null || val === undefined) {
		        throw new lib.TemplateError(
		            'attempted to output null or undefined value',
		            lineno + 1,
		            colno + 1
		        );
		    }
		    return val;
		}

		function memberLookup(obj, val) {
		    obj = obj || {};

		    if(typeof obj[val] === 'function') {
		        return function() {
		            return obj[val].apply(obj, arguments);
		        };
		    }

		    return obj[val];
		}

		function callWrap(obj, name, context, args) {
		    if(!obj) {
		        throw new Error('Unable to call `' + name + '`, which is undefined or falsey');
		    }
		    else if(typeof obj !== 'function') {
		        throw new Error('Unable to call `' + name + '`, which is not a function');
		    }

		    // jshint validthis: true
		    return obj.apply(context, args);
		}

		function contextOrFrameLookup(context, frame, name) {
		    var val = frame.lookup(name);
		    return (val !== undefined && val !== null) ?
		        val :
		        context.lookup(name);
		}

		function handleError(error, lineno, colno) {
		    if(error.lineno) {
		        return error;
		    }
		    else {
		        return new lib.TemplateError(error, lineno, colno);
		    }
		}

		function asyncEach(arr, dimen, iter, cb) {
		    if(lib.isArray(arr)) {
		        var len = arr.length;

		        lib.asyncIter(arr, function(item, i, next) {
		            switch(dimen) {
		            case 1: iter(item, i, len, next); break;
		            case 2: iter(item[0], item[1], i, len, next); break;
		            case 3: iter(item[0], item[1], item[2], i, len, next); break;
		            default:
		                item.push(i, next);
		                iter.apply(this, item);
		            }
		        }, cb);
		    }
		    else {
		        lib.asyncFor(arr, function(key, val, i, len, next) {
		            iter(key, val, i, len, next);
		        }, cb);
		    }
		}

		function asyncAll(arr, dimen, func, cb) {
		    var finished = 0;
		    var len, i;
		    var outputArr;

		    function done(i, output) {
		        finished++;
		        outputArr[i] = output;

		        if(finished === len) {
		            cb(null, outputArr.join(''));
		        }
		    }

		    if(lib.isArray(arr)) {
		        len = arr.length;
		        outputArr = new Array(len);

		        if(len === 0) {
		            cb(null, '');
		        }
		        else {
		            for(i = 0; i < arr.length; i++) {
		                var item = arr[i];

		                switch(dimen) {
		                case 1: func(item, i, len, done); break;
		                case 2: func(item[0], item[1], i, len, done); break;
		                case 3: func(item[0], item[1], item[2], i, len, done); break;
		                default:
		                    item.push(i, done);
		                    // jshint validthis: true
		                    func.apply(this, item);
		                }
		            }
		        }
		    }
		    else {
		        var keys = lib.keys(arr);
		        len = keys.length;
		        outputArr = new Array(len);

		        if(len === 0) {
		            cb(null, '');
		        }
		        else {
		            for(i = 0; i < keys.length; i++) {
		                var k = keys[i];
		                func(k, arr[k], i, len, done);
		            }
		        }
		    }
		}

		module.exports = {
		    Frame: Frame,
		    makeMacro: makeMacro,
		    makeKeywordArgs: makeKeywordArgs,
		    numArgs: numArgs,
		    suppressValue: suppressValue,
		    ensureDefined: ensureDefined,
		    memberLookup: memberLookup,
		    contextOrFrameLookup: contextOrFrameLookup,
		    callWrap: callWrap,
		    handleError: handleError,
		    isArray: lib.isArray,
		    keys: lib.keys,
		    SafeString: SafeString,
		    copySafeness: copySafeness,
		    markSafe: markSafe,
		    asyncEach: asyncEach,
		    asyncAll: asyncAll,
		    inOperator: lib.inOperator
		};


	/***/ },
	/* 9 */
	/***/ function(module, exports) {

		'use strict';

		function cycler(items) {
		    var index = -1;

		    return {
		        current: null,
		        reset: function() {
		            index = -1;
		            this.current = null;
		        },

		        next: function() {
		            index++;
		            if(index >= items.length) {
		                index = 0;
		            }

		            this.current = items[index];
		            return this.current;
		        },
		    };

		}

		function joiner(sep) {
		    sep = sep || ',';
		    var first = true;

		    return function() {
		        var val = first ? '' : sep;
		        first = false;
		        return val;
		    };
		}

		// Making this a function instead so it returns a new object
		// each time it's called. That way, if something like an environment
		// uses it, they will each have their own copy.
		function globals() {
		    return {
		        range: function(start, stop, step) {
		            if(typeof stop === 'undefined') {
		                stop = start;
		                start = 0;
		                step = 1;
		            }
		            else if(!step) {
		                step = 1;
		            }

		            var arr = [];
		            var i;
		            if (step > 0) {
		                for (i=start; i<stop; i+=step) {
		                    arr.push(i);
		                }
		            } else {
		                for (i=start; i>stop; i+=step) {
		                    arr.push(i);
		                }
		            }
		            return arr;
		        },

		        // lipsum: function(n, html, min, max) {
		        // },

		        cycler: function() {
		            return cycler(Array.prototype.slice.call(arguments));
		        },

		        joiner: function(sep) {
		            return joiner(sep);
		        }
		    };
		}

		module.exports = globals;


	/***/ },
	/* 10 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';

		var Loader = __webpack_require__(11);

		var PrecompiledLoader = Loader.extend({
		    init: function(compiledTemplates) {
		        this.precompiled = compiledTemplates || {};
		    },

		    getSource: function(name) {
		        if (this.precompiled[name]) {
		            return {
		                src: { type: 'code',
		                       obj: this.precompiled[name] },
		                path: name
		            };
		        }
		        return null;
		    }
		});

		module.exports = PrecompiledLoader;


	/***/ },
	/* 11 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';

		var path = __webpack_require__(3);
		var Obj = __webpack_require__(6);
		var lib = __webpack_require__(1);

		var Loader = Obj.extend({
		    on: function(name, func) {
		        this.listeners = this.listeners || {};
		        this.listeners[name] = this.listeners[name] || [];
		        this.listeners[name].push(func);
		    },

		    emit: function(name /*, arg1, arg2, ...*/) {
		        var args = Array.prototype.slice.call(arguments, 1);

		        if(this.listeners && this.listeners[name]) {
		            lib.each(this.listeners[name], function(listener) {
		                listener.apply(null, args);
		            });
		        }
		    },

		    resolve: function(from, to) {
		        return path.resolve(path.dirname(from), to);
		    },

		    isRelative: function(filename) {
		        return (filename.indexOf('./') === 0 || filename.indexOf('../') === 0);
		    }
		});

		module.exports = Loader;


	/***/ },
	/* 12 */
	/***/ function(module, exports) {

		function installCompat() {
		  'use strict';

		  // This must be called like `nunjucks.installCompat` so that `this`
		  // references the nunjucks instance
		  var runtime = this.runtime; // jshint ignore:line
		  var lib = this.lib; // jshint ignore:line

		  var orig_contextOrFrameLookup = runtime.contextOrFrameLookup;
		  runtime.contextOrFrameLookup = function(context, frame, key) {
		    var val = orig_contextOrFrameLookup.apply(this, arguments);
		    if (val === undefined) {
		      switch (key) {
		      case 'True':
		        return true;
		      case 'False':
		        return false;
		      case 'None':
		        return null;
		      }
		    }

		    return val;
		  };

		  var orig_memberLookup = runtime.memberLookup;
		  var ARRAY_MEMBERS = {
		    pop: function(index) {
		      if (index === undefined) {
		        return this.pop();
		      }
		      if (index >= this.length || index < 0) {
		        throw new Error('KeyError');
		      }
		      return this.splice(index, 1);
		    },
		    remove: function(element) {
		      for (var i = 0; i < this.length; i++) {
		        if (this[i] === element) {
		          return this.splice(i, 1);
		        }
		      }
		      throw new Error('ValueError');
		    },
		    count: function(element) {
		      var count = 0;
		      for (var i = 0; i < this.length; i++) {
		        if (this[i] === element) {
		          count++;
		        }
		      }
		      return count;
		    },
		    index: function(element) {
		      var i;
		      if ((i = this.indexOf(element)) === -1) {
		        throw new Error('ValueError');
		      }
		      return i;
		    },
		    find: function(element) {
		      return this.indexOf(element);
		    },
		    insert: function(index, elem) {
		      return this.splice(index, 0, elem);
		    }
		  };
		  var OBJECT_MEMBERS = {
		    items: function() {
		      var ret = [];
		      for(var k in this) {
		        ret.push([k, this[k]]);
		      }
		      return ret;
		    },
		    values: function() {
		      var ret = [];
		      for(var k in this) {
		        ret.push(this[k]);
		      }
		      return ret;
		    },
		    keys: function() {
		      var ret = [];
		      for(var k in this) {
		        ret.push(k);
		      }
		      return ret;
		    },
		    get: function(key, def) {
		      var output = this[key];
		      if (output === undefined) {
		        output = def;
		      }
		      return output;
		    },
		    has_key: function(key) {
		      return this.hasOwnProperty(key);
		    },
		    pop: function(key, def) {
		      var output = this[key];
		      if (output === undefined && def !== undefined) {
		        output = def;
		      } else if (output === undefined) {
		        throw new Error('KeyError');
		      } else {
		        delete this[key];
		      }
		      return output;
		    },
		    popitem: function() {
		      for (var k in this) {
		        // Return the first object pair.
		        var val = this[k];
		        delete this[k];
		        return [k, val];
		      }
		      throw new Error('KeyError');
		    },
		    setdefault: function(key, def) {
		      if (key in this) {
		        return this[key];
		      }
		      if (def === undefined) {
		        def = null;
		      }
		      return this[key] = def;
		    },
		    update: function(kwargs) {
		      for (var k in kwargs) {
		        this[k] = kwargs[k];
		      }
		      return null;  // Always returns None
		    }
		  };
		  OBJECT_MEMBERS.iteritems = OBJECT_MEMBERS.items;
		  OBJECT_MEMBERS.itervalues = OBJECT_MEMBERS.values;
		  OBJECT_MEMBERS.iterkeys = OBJECT_MEMBERS.keys;
		  runtime.memberLookup = function(obj, val, autoescape) { // jshint ignore:line
		    obj = obj || {};

		    // If the object is an object, return any of the methods that Python would
		    // otherwise provide.
		    if (lib.isArray(obj) && ARRAY_MEMBERS.hasOwnProperty(val)) {
		      return function() {return ARRAY_MEMBERS[val].apply(obj, arguments);};
		    }

		    if (lib.isObject(obj) && OBJECT_MEMBERS.hasOwnProperty(val)) {
		      return function() {return OBJECT_MEMBERS[val].apply(obj, arguments);};
		    }

		    return orig_memberLookup.apply(this, arguments);
		  };
		}

		module.exports = installCompat;


	/***/ }
	/******/ ]);

	/*** EXPORTS FROM exports-loader ***/
	module.exports = nunjucks;

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = function (nunjucks, env, obj, dependencies){

	    var oldRoot = obj.root;

	    obj.root = function( env, context, frame, runtime, ignoreMissing, cb ) {
	        var oldGetTemplate = env.getTemplate;
	        env.getTemplate = function (name, ec, parentName, ignoreMissing, cb) {
	            if( typeof ec === "function" ) {
	                cb = ec = false;
	            }
	            var _require = function (name) {
	                try {
	                    // add a reference to the already resolved dependency here
	                    return dependencies[name];
	                }
	                catch (e) {
	                    if (frame.get("_require")) {
	                        return frame.get("_require")(name);
	                    }
	                    else {
	                        console.warn('Could not load template "%s"', name);
	                    }
	                }
	            };

	            var tmpl = _require(name);
	            frame.set("_require", _require);

	            if( ec ) tmpl.compile();
	            cb( null, tmpl );
	        };

	        oldRoot(env, context, frame, runtime, ignoreMissing, function (err, res) {
	            env.getTemplate = oldGetTemplate;
	            cb( err, res );
	        });
	    };

	    var src = {
	        obj: obj,
	        type: 'code'
	    };

	    return new nunjucks.Template(src, env);

	};

/***/ },
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(103)
	  , core    = __webpack_require__(3)
	  , fails   = __webpack_require__(113);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 184 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 185 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(186);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ },
/* 186 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(187), __esModule: true };

/***/ },
/* 187 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(188);
	var $Object = __webpack_require__(3).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ },
/* 188 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(103);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(112), 'Object', {defineProperty: __webpack_require__(108).f});

/***/ },
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(203), __esModule: true };

/***/ },
/* 203 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(204);
	module.exports = __webpack_require__(3).Object.keys;

/***/ },
/* 204 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(139)
	  , $keys    = __webpack_require__(123);

	__webpack_require__(183)('keys', function(){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ },
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */,
/* 211 */,
/* 212 */,
/* 213 */,
/* 214 */,
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */,
/* 219 */,
/* 220 */,
/* 221 */,
/* 222 */,
/* 223 */,
/* 224 */,
/* 225 */,
/* 226 */,
/* 227 */,
/* 228 */,
/* 229 */,
/* 230 */,
/* 231 */,
/* 232 */,
/* 233 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define([], factory);
		else {
			var a = factory();
			for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
		}
	})(this, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};

	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {

	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;

	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};

	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;

	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}


	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;

	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;

	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";

	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {

		'use strict';

		var _fixer = __webpack_require__(1);

		var _fixer2 = _interopRequireDefault(_fixer);

		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

		module.exports = _fixer2.default;

	/***/ },
	/* 1 */
	/***/ function(module, exports, __webpack_require__) {

		"use strict";

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});

		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

		var _element = __webpack_require__(2);

		var _element2 = _interopRequireDefault(_element);

		var _utils = __webpack_require__(3);

		var _debounce = __webpack_require__(5);

		var _debounce2 = _interopRequireDefault(_debounce);

		var _throttleit = __webpack_require__(7);

		var _throttleit2 = _interopRequireDefault(_throttleit);

		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

		var documentSize = void 0;
		var windowSize = void 0;

		/**
		 * Class representing a fixer.
		 * @class
		 */

		var Fixer = function () {

		  /**
		   * Create fixer.
		   */
		  function Fixer() {
		    var _this = this;

		    _classCallCheck(this, Fixer);

		    // Save initial document height value
		    documentSize = (0, _utils.getDocumentSize)();
		    windowSize = (0, _utils.getWindowSize)();

		    // Create an array for registering elements to fix
		    this.elements = [];

		    // Listen to the page load and scroll
		    var onScroll = (0, _throttleit2.default)(function () {
		      return _this._onScroll((0, _utils.getScrolledPosition)());
		    }, 16);
		    window.addEventListener("scroll", onScroll);
		    window.addEventListener("load", onScroll);

		    // Listen to the page resize and recalculate elements width
		    var onResize = (0, _debounce2.default)(function () {
		      var currentWindowSize = (0, _utils.getWindowSize)();

		      if (windowSize.width !== currentWindowSize.width || windowSize.height !== currentWindowSize.height) {
		        // Update screen size value
		        windowSize = currentWindowSize;

		        // Reset all elements if screen was resized
		        _this.resetElements();
		      }
		    }, 4);
		    window.addEventListener("resize", onResize);

		    // Provide 'addElement' method for Element class to make possible chaining this method
		    _element2.default.prototype.addElement = this.addElement.bind(this);
		  }

		  /**
		   * Add an element to Fixer.
		   * @public
		   * @param {String|HTMLElement|jQuery} selector
		   * @param {defaults=} options
		   * @return {Fixer}
		   */


		  _createClass(Fixer, [{
		    key: "addElement",
		    value: function addElement(selector, options) {
		      var element = null;

		      if (selector) {
		        element = new _element2.default(selector, options);

		        if (element.node && element.node.tagName) {
		          // Add new element to array
		          this.elements.push(element);

		          // Sort elements array by top-offset for correct calculation of limit on scrolling
		          this.elements.sort(function (a, b) {
		            return a.offset.top - b.offset.top;
		          });
		        } else {
		          throw new Error("Can't add element '" + selector);
		        }
		      } else {
		        throw new Error("Please, provide selector or node to add new Fixer element");
		      }

		      // Re-fix elements in stack if needed
		      this._onScroll((0, _utils.getScrolledPosition)(), true);

		      return element;
		    }

		    /**
		     * Remove an element from Fixer.
		     * @public
		     * @param {String|HTMLElement|jQuery} selector
		     * @return {Fixer}
		     */

		  }, {
		    key: "removeElement",
		    value: function removeElement(selector) {
		      var element = (0, _utils.defineElement)(selector);
		      var i = this.elements.length;

		      while (i--) {
		        var item = this.elements[i];

		        if (item && item.hasOwnProperty('node') && item.node === element) {
		          var placeholder = item.placeholder;

		          item.unFix();
		          this.elements.splice(i, 1);

		          placeholder.parentNode.removeChild(placeholder);
		          placeholder = item.placeholder = null;

		          this.resetElements();

		          break;
		        }
		      }
		    }

		    /**
		     * Reset all elements position and calculated values.
		     * @public
		     */

		  }, {
		    key: "resetElements",
		    value: function resetElements() {
		      // UnFix all elements and update they values
		      this._unfixAll();

		      // Call onScroll method to reFix elements
		      this._onScroll((0, _utils.getScrolledPosition)(), true);
		    }

		    /**
		     * Getting height of the fixed element.
		     *
		     * There are two options for using:
		     * — You get current fixed height if the arguments did not assign.
		     * — You get height of elements that will fixed on the provided offset. It useful for scrolling to anchor.
		     *
		     * @public
		     * @param {String|Number|Function} [position = DEFAULTS.position] The side of the screen where elements should be fixed
		     * @param {Number|Function=} [offset = scrolled.top] The offset value relative to the document for which to calculate the height of the fixed elements
		     */

		  }, {
		    key: "getHeight",
		    value: function getHeight() {
		      var position = arguments.length <= 0 || arguments[0] === undefined ? _element.DEFAULTS.position : arguments[0];
		      var offset = arguments[1];

		      var elements = void 0;
		      var sum = 0;
		      var scrolled = (0, _utils.getScrolledPosition)();

		      // Check arguments and reassign them if necessary
		      if (typeof position === "number" || typeof position === "function") {
		        offset = position;
		        position = _element.DEFAULTS.position;
		      }

		      if (typeof offset === "undefined") {
		        return this._getCurrentHeight(position);
		      }
		      // Get offset value if provided function
		      else if (typeof offset === "function") {
		          offset = offset();
		        }
		        // Use current scroll position as offset if it doesn't provided
		        else if (typeof offset !== "number") {
		            offset = scrolled.top;
		          }

		      // Offset can't be larger than documentHeight, so choose a smaller value between them
		      offset = Math.min(offset, documentSize.height - windowSize.height);

		      // Unfix all elements to properly recalculate offset values
		      this._unfixAll();

		      // Filter and sort elements by position and scroll direction
		      elements = this.elements.filter(function (element) {
		        return element.options.position === position && element.options.stack === true;
		      }).sort(function (a, b) {
		        return position === _element.POSITION.top ? b.offset.top - a.offset.top : a.offset.top - b.offset.top;
		      });

		      // Iterate through the elements
		      var i = elements.length;
		      while (i--) {
		        var element = elements[i];

		        // Update value of the limit for the element to get accurate calculations
		        element.updateLimit();

		        // Get values for an element
		        var limit = element.limit;
		        var height = element.node.offsetHeight;
		        var stack = this._getStackHeight(element, { top: offset, left: scrolled.left });

		        var limitDiff = limit !== null ? limit - offset - stack : null;

		        // Check conditions
		        var isNeedToFix = element.options.position === _element.POSITION.top ? element.offset.top <= offset + stack : element.offset.bottom >= offset - stack + windowSize.height;

		        var isLimited = limitDiff !== null ? limitDiff < height : false;
		        var isHideByLimit = limitDiff !== null ? limitDiff <= 0 : false;

		        if (isLimited && !isHideByLimit) {
		          sum += limitDiff;
		        } else if (isNeedToFix && !isHideByLimit) {
		          sum += height;
		        }
		      }

		      // Clear elements variable
		      elements = null;

		      // Call onScroll method to reFix elements
		      this._onScroll((0, _utils.getScrolledPosition)(), true);

		      return sum;
		    }

		    /**
		     * Function listening scroll.
		     * @protected
		     * @param {Scrolled} scrolled Document scrolled values in pixels
		     * @param {Boolean=} forceFix Option to fix elements even if they're fixed
		     */

		  }, {
		    key: "_onScroll",
		    value: function _onScroll(scrolled, forceFix) {
		      // Check document height (needs to update element values if the document height has dynamically changed)
		      this._checkDocumentSize();

		      // Update document size
		      documentSize = (0, _utils.getDocumentSize)();

		      // Update offsets of limits before fix/unFix elements (to prevent fix limit of each element before it offset was calculated)
		      var i = this.elements.length;
		      while (i--) {
		        this.elements[i].updateLimit();
		      } // Iterate trough the elements to fix/unFix
		      i = this.elements.length;
		      while (i--) {
		        this._fixToggle(this.elements[i], scrolled, forceFix);
		      }
		    }

		    /**
		     * Function to fix/unFix an element.
		     * @protected
		     * @param {Element} element Element instance
		     * @param {Scrolled} scrolled Document scrolled values in pixels
		     * @param {Boolean=} [forceFix = element.state === STATE.default] Option to fix an element even if it fixed
		     */

		  }, {
		    key: "_fixToggle",
		    value: function _fixToggle(element, scrolled) {
		      var forceFix = arguments.length <= 2 || arguments[2] === undefined ? element.state === _element.STATE.default : arguments[2];

		      // Get values for an element
		      var offset = element.offset;
		      var limit = element.limit;
		      var stack = this._getStackHeight(element, scrolled);

		      // Check conditions
		      var isNeedToFix = element.options.position === _element.POSITION.top ? offset.top <= scrolled.top + stack : offset.bottom >= scrolled.top - stack + windowSize.height;
		      var isNeedToLimit = limit !== null ? limit <= scrolled.top + element.node.offsetHeight + stack : false;

		      // Check current state
		      var isLimited = element.state === _element.STATE.limited;
		      var isNotFixed = forceFix || isLimited;

		      // Fix/unFix or limit an element to its container or Set it to absolute (to limit)
		      if (isNeedToLimit && !isLimited) {
		        element.setLimited();
		      } else if (isNeedToFix && isNotFixed && !isNeedToLimit) {
		        element.fix(stack);
		      } else if (!isNeedToFix && element.state !== _element.STATE.default) {
		        element.unFix();
		      }

		      // Update horizontal position on horizontal scrolling
		      if (element.state === _element.STATE.fixed) {
		        element.adjustHorizontal(scrolled.left);
		      }

		      // Stretch element if is needed (experimental feature)
		      if (element.options.stretchTo !== null) {
		        element.stretch(scrolled);
		      }
		    }

		    /**
		     * Get stack height for an element.
		     * @protected
		     * @param {Element} element
		     * @param {Scrolled} scrolled Document scrolled values in pixels
		     */

		  }, {
		    key: "_getStackHeight",
		    value: function _getStackHeight(element, scrolled) {
		      var sum = 0;
		      var i = this.elements.length;

		      // Iterate through registered elements to determine whether they should be added to the element's stack
		      while (i--) {
		        var item = this.elements[i];

		        // Consider only items with the same position
		        if (element.options.position === item.options.position && item.options.stack === true) {

		          // Check if the item is on the way of element, when scrolling (up or down) - this will affect fixing the element
		          var isItemOnTheWay = element.options.position === _element.POSITION.top ? item.offset.top < element.offset.top : item.offset.top > element.offset.bottom;

		          if (isItemOnTheWay) {
		            // Check if an item will be hidden when reaching its 'limit' coordinate
		            var willHideByLimit = item.limit !== null && (element.options.position === _element.POSITION.top ? item.limit <= element.offset.top + scrolled.top : item.limit >= element.offset.bottom);

		            // If an item is on the way and it will not be limited, then add it's height to sum
		            if (!willHideByLimit) sum += item.node.offsetHeight || 0;
		          }
		        }
		      }

		      return sum;
		    }

		    /**
		     * Getting current height of a fixed elements by the provided position.
		     * @public
		     * @param {String=} [position = DEFAULTS.position]
		     * @return {Number}
		     */

		  }, {
		    key: "_getCurrentHeight",
		    value: function _getCurrentHeight() {
		      var position = arguments.length <= 0 || arguments[0] === undefined ? _element.DEFAULTS.position : arguments[0];

		      var fixedHeight = 0;
		      var limitedHeight = 0;
		      var i = this.elements.length;

		      // Iterate trough registered elements
		      while (i--) {
		        var element = this.elements[i];

		        // Check only elements attached to the provided side of the screen
		        if (position === element.options.position && element.options.stack === true) {

		          // Make sure the item state is fixed and then add it height to calculation
		          if (element.state === _element.STATE.fixed) {
		            fixedHeight += element.node.offsetHeight || 0;
		          }
		          // If item is limited then calculate it coordinate relative to the window.
		          // Depending on the item position we need to use top or bottom coordinate.
		          // Since a limited element may have a negative coordinate, we need to take positive value or 0 by Math.max method.
		          else if (element.state === _element.STATE.limited) {
		              var offset = element.node.getBoundingClientRect();
		              var height = position === _element.POSITION.top ? offset.bottom : offset.top;

		              limitedHeight = Math.max(limitedHeight, height);
		            }
		        }
		      }

		      // Return a larger value between sum of heights of fixed and limited elements.
		      return Math.max(fixedHeight, limitedHeight);
		    }

		    /**
		     * Update offsets of elements if the document's height has changed.
		     * @protected
		     */

		  }, {
		    key: "_checkDocumentSize",
		    value: function _checkDocumentSize() {
		      var currentDocumentSize = (0, _utils.getDocumentSize)();
		      var isWidthEqual = currentDocumentSize.width === documentSize.width || Math.abs(currentDocumentSize.width - documentSize.width) > 1;
		      var isHeightEqual = currentDocumentSize.height === documentSize.height || Math.abs(currentDocumentSize.height - documentSize.height) > 1;

		      // Check is the document size was changed
		      if (!isWidthEqual || !isHeightEqual) {
		        // Save current height of the document
		        documentSize = currentDocumentSize;

		        // Update values for each element
		        var i = this.elements.length;
		        while (i--) {
		          this.elements[i].updateValues();
		        }
		      }
		    }

		    /**
		     * UnFix all elements and update they values.
		     * @protected
		     */

		  }, {
		    key: "_unfixAll",
		    value: function _unfixAll() {
		      // UnFix all elements
		      var i = this.elements.length;
		      while (i--) {
		        this.elements[i].unFix();
		      }

		      // Update values of the elements
		      i = this.elements.length;
		      while (i--) {
		        this.elements[i].updateValues();
		      }
		    }
		  }]);

		  return Fixer;
		}();

		exports.default = Fixer;

	/***/ },
	/* 2 */
	/***/ function(module, exports, __webpack_require__) {

		"use strict";

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports.DEFAULTS = exports.EVENT = exports.STATE = exports.POSITION = undefined;

		var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

		var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

		var _utils = __webpack_require__(3);

		var _objectAssign = __webpack_require__(4);

		var _objectAssign2 = _interopRequireDefault(_objectAssign);

		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

		function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

		function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

		/**
		 * Position string values.
		 * @readonly
		 * @enum {string}
		 */
		var POSITION = exports.POSITION = {
		  top: "top",
		  bottom: "bottom"
		};

		/**
		 * State string values.
		 * @readonly
		 * @enum {string}
		 */
		var STATE = exports.STATE = {
		  default: "default",
		  fixed: "fixed",
		  limited: "limited"
		};

		/**
		 * Event string values.
		 * @readonly
		 * @enum {string}
		 */
		var EVENT = exports.EVENT = {
		  init: "init",
		  update: "update",
		  fixed: "fixed",
		  preFixed: "preFixed",
		  unfixed: "unfixed",
		  preUnfixed: "preUnfixed",
		  limited: "limited",
		  preLimited: "preLimited",
		  stretched: "stretched"
		};

		/**
		 * Default element options.
		 * @readonly
		 *
		 * @typedef {Object} defaults
		 * @property {String} position Screen side to fix an element ("top"|"bottom")
		 * @property {Boolean} placeholder Indicates whether placeholder is needed
		 * @property {String} placeholderClass Classname to generate the placeholder
		 * @property {String} fixedClass Classname to add for a fixed element
		 * @property {Boolean} setWidth Property indicates whether to automatically calculate the width of the element on fixing
		 * @property {Boolean} stack Property indicates whether the height of the element count for fixing other elements
		 * @property {HTMLElement|String|Function} limit Selector, node or function of the limit for an element
		 * @property {HTMLElement|String|Function} stretchTo EXPERIMENTAL feature – Selector, node or function of the coordinate to stretch element vertically to it
		 */
		var DEFAULTS = exports.DEFAULTS = {
		  position: POSITION.top,
		  placeholder: true,
		  placeholderClass: "fixer-placeholder",
		  fixedClass: "_fixed",
		  setWidth: true,
		  stack: true,
		  limit: null,
		  stretchTo: null
		};

		/**
		 * Class representing an element.
		 * @class
		 *
		 * @property {defaults} options Custom options for an element, extends DEFAULTS with initial options
		 * @property {STATE} state Current element state
		 *
		 * @property {HTMLElement} node Node of an element
		 * @property {Offset} offset Calculated offsets of an element node from each side of the document
		 * @property {Object} styles Saved initial styles of an element node
		 *
		 * @property {HTMLElement} placeholder Link for placeholder node
		 *
		 * @property {Number} limit Actual limit offset value (top/bottom depending on the position)
		 * @property {HTMLElement} parent Offset parent of an element; needs for properly positioning limited element to the parent
		 *
		 */

		var Element = function () {

		  /**
		   * Create an element.
		   * @param {string|HTMLElement} selector
		   * @param {defaults} options
		   */
		  function Element(selector, options) {
		    _classCallCheck(this, Element);

		    // Extend element's options with initial- and default-options
		    (0, _objectAssign2.default)(this.options = {}, DEFAULTS, options);

		    if (options) {
		      this.options.limit = (0, _utils.defineElement)(this.options.limit);
		      this.options.stretchTo = (0, _utils.defineElement)(this.options.stretchTo);

		      // do not count element height for fixing other elements if it has option 'stretchTo'
		      this.options.stack = this.options.stretchTo === null;
		    }

		    // Init basic parameters
		    (0, _objectAssign2.default)(this, {
		      state: STATE.default,
		      node: (0, _utils.defineElement)(selector),
		      limit: null,
		      parent: null
		    });

		    if (this.node && this.node.tagName) {
		      // Saving original styles of an element node
		      this.styles = (0, _utils.calculateStyles)(this.node);

		      // Saving original offsets of an element node
		      this.offset = (0, _utils.calculateOffset)(this.node, this.styles);

		      // Creating placeholder if needed
		      this.placeholder = this.options.placeholder ? this._createPlaceholder() : null;

		      // Set offset parent of the node
		      this.parent = this.node.offsetParent;

		      // Dispatch the event
		      this.node.dispatchEvent((0, _utils.createEvent)(EVENT.init));

		      // Hack for mobile Safari to properly fix element while user scrolls a page
		      if (this.styles.transform === "none") {
		        (0, _utils.setStyle)(this.node, { transform: "translateZ(0)" });
		      }
		    }
		  }

		  /**
		   * Create placeholder node.
		   * @protected
		   * @return {HTMLElement}
		   */


		  _createClass(Element, [{
		    key: "_createPlaceholder",
		    value: function _createPlaceholder() {
		      var placeholder = document.createElement("span");

		      // Set placeholder className
		      placeholder.className = this.options.placeholderClass;

		      // Init styles for placeholder
		      var cssProperties = {
		        zIndex: "-1", // for buggy Safari
		        float: this.styles.float,
		        clear: this.styles.clear,
		        display: "none",
		        position: this.styles.position,
		        top: this.styles.top,
		        right: this.styles.right,
		        bottom: this.styles.bottom,
		        left: this.styles.left,
		        marginTop: this.styles.marginTop,
		        marginRight: this.styles.marginRight,
		        marginBottom: this.styles.marginBottom,
		        marginLeft: this.styles.marginLeft,
		        height: this.node.offsetHeight + "px",
		        maxWidth: this.styles.maxWidth
		      };

		      // Add width property if needed
		      if (this.options.setWidth) {
		        cssProperties.width = this.node.offsetWidth + "px";
		      }

		      // Add styles for placeholder node
		      (0, _utils.setStyle)(placeholder, cssProperties);

		      // Insert placeholder into document
		      this.node.parentNode.insertBefore(placeholder, this.node.nextSibling);

		      return placeholder;
		    }

		    /**
		     * Fix an element's node.
		     * @param {number} offset
		     */

		  }, {
		    key: "fix",
		    value: function fix(offset) {
		      var _cssProperties;

		      var element = this.node;
		      var placeholder = this.placeholder;

		      // Dispatch the event

		      this.node.dispatchEvent((0, _utils.createEvent)(EVENT.preFixed));

		      // Init styles for the element node
		      var cssProperties = (_cssProperties = {
		        position: "fixed"
		      }, _defineProperty(_cssProperties, this.options.position, offset + "px"), _defineProperty(_cssProperties, "left", this.offset.left + "px"), _defineProperty(_cssProperties, "zIndex", this.styles.zIndex === "auto" ? "100" : this.styles.zIndex), _defineProperty(_cssProperties, "marginTop", 0), _defineProperty(_cssProperties, "marginBottom", 0), _defineProperty(_cssProperties, "width", this.styles.width), _cssProperties);

		      // Set styles for a node
		      (0, _utils.setStyle)(element, cssProperties);

		      // Set styles for placeholder node
		      if (placeholder) {
		        (0, _utils.setStyle)(placeholder, {
		          display: this.styles.display,
		          width: this.options.setWidth ? this.node.offsetWidth + "px" : ""
		        });
		      }

		      // Add fixed className for the element node
		      (0, _utils.addClass)(element, this.options.fixedClass);

		      // Set fixed state for the element
		      this.state = STATE.fixed;

		      // Dispatch the event
		      this.node.dispatchEvent((0, _utils.createEvent)(EVENT.fixed));
		    }

		    /**
		     * Unfix an element's node (return its state to initial) and update properties.
		     */

		  }, {
		    key: "unFix",
		    value: function unFix() {
		      var _setStyle;

		      var element = this.node;
		      var placeholder = this.placeholder;

		      // Dispatch the event

		      this.node.dispatchEvent((0, _utils.createEvent)(EVENT.preUnfixed));

		      (0, _utils.setStyle)(element, (_setStyle = {
		        position: ""
		      }, _defineProperty(_setStyle, this.options.position, ""), _defineProperty(_setStyle, "left", ""), _defineProperty(_setStyle, "zIndex", ""), _defineProperty(_setStyle, "marginTop", ""), _defineProperty(_setStyle, "marginBottom", ""), _defineProperty(_setStyle, "width", ""), _setStyle));

		      if (placeholder) {
		        (0, _utils.setStyle)(placeholder, {
		          display: "none"
		        });
		      }

		      (0, _utils.removeClass)(element, this.options.fixedClass);

		      // Update state
		      this.state = STATE.default;

		      // Dispatch the event
		      this.node.dispatchEvent((0, _utils.createEvent)(EVENT.unfixed));
		    }
		  }, {
		    key: "setLimited",


		    /**
		     * Set position absolute with correct coordinates relative to parent to properly fix an element by its limiter.
		     */
		    value: function setLimited() {
		      var element = this.node;
		      var offset = this.offset;
		      var limit = this.limit;
		      var parent = this.parent;
		      var placeholder = this.placeholder;
		      var styles = this.styles;


		      var parentOffset = (0, _utils.calculateOffset)(parent);
		      var offsetTop = limit - parentOffset.top - element.offsetHeight;
		      var offsetLeft = offset.left - parentOffset.left;

		      // Dispatch the event
		      this.node.dispatchEvent((0, _utils.createEvent)(EVENT.preLimited));

		      // Init styles for the element
		      var cssProperties = {
		        position: "absolute",
		        top: offsetTop + "px",
		        left: offsetLeft + "px",
		        bottom: "auto",
		        right: "auto",
		        zIndex: this.styles.zIndex === "auto" ? "100" : this.styles.zIndex,
		        marginTop: 0,
		        marginBottom: 0
		      };

		      // Add width property if needed
		      if (this.options.setWidth) {
		        cssProperties.width = this.styles.width;
		      }

		      // Set styles for the element node
		      (0, _utils.setStyle)(element, cssProperties);

		      // Set styles for placeholder node
		      if (placeholder) {
		        (0, _utils.setStyle)(placeholder, {
		          display: styles.display
		        });
		      }

		      // Add fixed className for an element node
		      (0, _utils.addClass)(element, this.options.fixedClass);

		      // Update state
		      this.state = STATE.limited;

		      // Dispatch the event
		      this.node.dispatchEvent((0, _utils.createEvent)(EVENT.limited));
		    }
		  }, {
		    key: "stretch",


		    /**
		     * Stretch element vertically to the provided element or offset value.
		     */
		    value: function stretch(scrolled) {
		      var stretchTo = getStretchOffset(this.options.stretchTo, this.options.position) - scrolled.top;

		      var _node$getBoundingClie = this.node.getBoundingClientRect();

		      var height = _node$getBoundingClie.height;
		      var top = _node$getBoundingClie.top;

		      var _getWindowSize = (0, _utils.getWindowSize)();

		      var windowHeight = _getWindowSize.height;


		      stretchTo = (windowHeight - stretchTo < 0 ? windowHeight : stretchTo) - top;

		      (0, _utils.setStyle)(this.node, {
		        height: stretchTo + "px"
		      });

		      // Dispatch the event if element height changed
		      if (height !== stretchTo) {
		        this.node.dispatchEvent((0, _utils.createEvent)(EVENT.stretched));
		      }

		      // Calculate stretch offset
		      function getStretchOffset(limit, position) {
		        var value = void 0;

		        // Call function if it represented
		        if (typeof limit === "function") {
		          limit = limit();
		        }

		        // Set limit value
		        if (typeof limit === "number") {
		          value = limit;
		        }
		        // If limit is {HTMLElement} then set it offset for the value
		        else if (limit !== null && (typeof limit === "undefined" ? "undefined" : _typeof(limit)) === "object" && limit.tagName !== "undefined") {
		            value = (0, _utils.calculateOffset)(limit)[position];
		          }

		        return typeof value === "number" ? value : null;
		      }
		    }

		    /**
		     * Adjusting horizontal position of an element relative to scrollLeft if page is scrolled horizontally.
		     * @param {Number} scrollLeft
		     */

		  }, {
		    key: "adjustHorizontal",
		    value: function adjustHorizontal(scrollLeft) {
		      var leftDiff = Math.round(this.offset.left - scrollLeft);
		      var rightDiff = scrollLeft + document.documentElement.offsetWidth - this.offset.right;
		      var currentLeft = parseInt(this.node.style.left) || null;

		      var left = null;

		      // check if the left side of the element is out of the page
		      if (leftDiff < 0) {
		        left = leftDiff;
		      }
		      // check if the right side of the element is out of the page
		      else if (leftDiff > 0 && rightDiff < 0) {
		          left = this.offset.left - scrollLeft;
		        }
		        // check if all is OK and needs to return left position back
		        else if (scrollLeft >= 0 && leftDiff >= 0 && currentLeft !== null) {
		            left = "";

		            // Set left coordinate if element is floated to the left/right
		            if (this.styles.float !== "none") {
		              left = leftDiff;

		              // do not change left position if the current is the same
		              if (left === Math.round(currentLeft)) {
		                left = null;
		              }
		            }
		          }

		      if (left !== null) {
		        (0, _utils.setStyle)(this.node, {
		          left: left + "px"
		        });
		      }
		    }

		    /**
		     * Update actual value of limit for en element.
		     */

		  }, {
		    key: "updateLimit",
		    value: function updateLimit() {
		      var limit = this.options.limit;
		      var value = void 0;

		      // Call function if it represented
		      if (typeof limit === "function") {
		        limit = limit();
		      }

		      // Set limit value
		      if (typeof limit === "number") {
		        value = limit;
		      }
		      // If limit is {HTMLElement} then set it offset for the value
		      else if (limit !== null && (typeof limit === "undefined" ? "undefined" : _typeof(limit)) === "object" && limit.tagName !== "undefined") {
		          value = (0, _utils.calculateOffset)(limit)[this.options.position];
		        }

		      this.limit = typeof value === "number" ? value : null;
		    }
		  }, {
		    key: "updateValues",


		    /**
		     * Update original values for element, such as styles and offset.
		     */
		    value: function updateValues() {
		      // Update styles of an element node
		      this.styles = (0, _utils.calculateStyles)(this.node);

		      // Update offset
		      this.offset = (0, _utils.calculateOffset)(this.state === STATE.default ? this.node : this.placeholder, this.styles);

		      // Dispatch the event
		      this.node.dispatchEvent((0, _utils.createEvent)(EVENT.update));
		    }

		    /**
		     * Attach an event listener function for one event to the element node.
		     * @public
		     * @param {String} event One or more space-separated event types to listen for
		     * @param {Function} listener A function to execute when the event is triggered
		     */

		  }, {
		    key: "on",
		    value: function on(event, listener) {
		      var events = event.split(" ");
		      events = events.length > 1 ? events : event.split(",");

		      if (events.length) {
		        var i = events.length;
		        while (i--) {
		          addEvent.call(this, events[i], listener);
		        }
		      } else if (typeof event === "string") {
		        addEvent.call(this, event, listener);
		      } else if (typeof event !== "string" && typeof listener === "undefined") {
		        throw new Error("Can't add listener for the element, please provide the correct type of event", this.node);
		      }

		      function addEvent(event, listener) {
		        if ((0, _utils.objectHasValue)(EVENT, event)) {
		          this.node.addEventListener(event, listener, false);
		        } else {
		          throw new Error("Unknown event type: " + event);
		        }
		      }

		      return this;
		    }

		    /**
		     * Remove an event listener.
		     * @public
		     * @param {String=} event One event type to stop listen for
		     * @param {Function=} listener A listener function previously attached for the event node
		     */

		  }, {
		    key: "off",
		    value: function off(event, listener) {
		      if (typeof event === "string" && typeof listener === "function") {
		        this.node.removeEventListener(event, listener, false);
		      } else if (typeof event !== "string") {
		        var cloneNode = this.node.cloneNode(true);

		        this.node.parentNode.replaceChild(cloneNode, this.node);
		        this.node = cloneNode;
		      } else if (typeof listener === "undefined") {
		        throw new Error("Can't remove listener for event: " + event + ". Please provide the listener.");
		      }

		      return this;
		    }
		  }]);

		  return Element;
		}();

		exports.default = Element;

	/***/ },
	/* 3 */
	/***/ function(module, exports, __webpack_require__) {

		"use strict";

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});

		var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

		exports.getDocumentSize = getDocumentSize;
		exports.getWindowSize = getWindowSize;
		exports.defineElement = defineElement;
		exports.calculateStyles = calculateStyles;
		exports.calculateOffset = calculateOffset;
		exports.getScrolledPosition = getScrolledPosition;
		exports.setStyle = setStyle;
		exports.addClass = addClass;
		exports.removeClass = removeClass;
		exports.objectHasValue = objectHasValue;
		exports.createEvent = createEvent;

		var _objectAssign = __webpack_require__(4);

		var _objectAssign2 = _interopRequireDefault(_objectAssign);

		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

		/**
		 * Get actual width and height of the document.
		 * @return {Object}
		 */
		function getDocumentSize() {
		  var body = document.body;
		  var html = document.documentElement;
		  var _document = document;
		  var width = _document.width;
		  var height = _document.height;


		  if (typeof width === "undefined" && typeof height === "undefined" && body && html) {
		    width = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
		    height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
		  } else if (!body && !html) {
		    throw new Error("Can't calculate document size. Make sure that the method is called when the document is ready.");
		  }

		  return { width: width, height: height };
		}

		/**
		 * Get width and height of the viewport.
		 * @return {Object}
		 */
		function getWindowSize() {
		  var body = document.body;
		  var html = document.documentElement;
		  var width = void 0,
		      height = void 0;

		  if (window || body || html) {
		    width = window.innerWidth || html.clientWidth || body.clientWidth;
		    height = window.innerHeight || html.clientHeight || body.clientHeight;
		  } else {
		    throw new Error("Can't calculate screen size. Make sure that the method is called when the document is ready.");
		  }

		  return { width: width, height: height };
		}

		/**
		 * Defining an element.
		 * @param {String|jQuery|HTMLElement|Function} element
		 * @return {HTMLElement}
		 */
		function defineElement(element) {
		  if (typeof element === "string") {
		    element = document.querySelector(element);
		  } else if ((typeof element === "undefined" ? "undefined" : _typeof(element)) === "object" && element !== null && typeof element.jquery !== "undefined" && element.length || (typeof $ === "undefined" ? "undefined" : _typeof($)) === "object" && element instanceof $ && element.length) {
		    element = element[0];
		  }

		  return element;
		}

		/**
		 * Calculating browser styles for an element.
		 * @param {HTMLElement} element
		 */
		function calculateStyles(element) {
		  // Get computed browser styles
		  var styles = window.getComputedStyle(element, null);

		  // IE computed width
		  var currentStyle = element.currentStyle;

		  // Set computed width from IE or from other browser
		  var width = currentStyle && currentStyle.width !== "auto" ? currentStyle.width : styles.width;

		  // Return new object with selected styles properties
		  return (0, _objectAssign2.default)({}, {
		    position: styles.position,
		    top: styles.top,
		    zIndex: styles.zIndex,
		    float: styles.float,
		    clear: styles.clear,
		    display: styles.display,
		    marginTop: styles.marginTop,
		    marginRight: styles.marginRight,
		    marginBottom: styles.marginBottom,
		    marginLeft: styles.marginLeft,
		    width: width,
		    maxWidth: styles.maxWidth
		  });
		}

		/**
		 * Calculating offsets of the element from each side of the document.
		 * @param {HTMLElement} element
		 * @param {Object=} styles
		 *
		 * @typedef {Object} Offset
		 * @property {Number} top
		 * @property {Number} bottom
		 * @property {Number} left
		 * @property {Number} right
		 *
		 * @return {Offset}
		 */
		function calculateOffset(element, styles) {
		  var rect = element.getBoundingClientRect();
		  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		  var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
		  var marginLeft = styles ? parseInt(styles.marginLeft) : 0;

		  return {
		    top: rect.top + scrollTop,
		    bottom: rect.bottom + scrollTop,
		    left: rect.left + scrollLeft - marginLeft,
		    right: rect.right + scrollLeft - marginLeft
		  };
		}

		/**
		 * Getting scrollbar position.
		 *
		 * @typedef {Object} Scrolled
		 * @property {Number} top
		 * @property {Number} left
		 *
		 * @return {Scrolled}
		 */
		function getScrolledPosition() {
		  return {
		    top: window.pageYOffset || document.documentElement.scrollTop,
		    left: window.pageXOffset || document.documentElement.scrollLeft
		  };
		}

		/**
		 * Set styles for the node of an element.
		 * @param {HTMLElement} element
		 * @param {Object} properties
		 */
		function setStyle(element, properties) {
		  (0, _objectAssign2.default)(element.style, properties);
		}

		/**
		 * Add className for element node.
		 * @param {HTMLElement} element
		 * @param {String} className
		 */
		function addClass(element, className) {
		  if (document.documentElement.classList && !element.classList.contains(className)) {
		    element.classList.add(className);
		  } else if (element.className.indexOf(className) === -1) {
		    element.className += " " + className;
		  }
		}

		/**
		 * Remove className from element node.
		 * @param {HTMLElement} element
		 * @param {String} className
		 */
		function removeClass(element, className) {
		  if (document.documentElement.classList) {
		    element.classList.remove(className);
		  } else {
		    element.className = element.className.replace(className, "");
		  }
		}

		/**
		 * Checks does object contains provided value.
		 * @param {Object} object
		 * @param {*} value
		 */
		function objectHasValue(object, value) {
		  for (var key in object) {
		    if (object.hasOwnProperty(key) && object[key] === value) {
		      return true;
		    }
		  }

		  return false;
		}

		/**
		 * Create cross-browser event.
		 * @param {String} type
		 * @return {Event}
		 */
		function createEvent(type) {
		  var event = null;

		  try {
		    event = new Event(type);
		  } catch (error) {
		    event = document.createEvent("Event");
		    event.initEvent(type, { bubbles: false, cancelable: false });
		  }

		  return event;
		}

	/***/ },
	/* 4 */
	/***/ function(module, exports) {

		'use strict';
		/* eslint-disable no-unused-vars */
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		var propIsEnumerable = Object.prototype.propertyIsEnumerable;

		function toObject(val) {
			if (val === null || val === undefined) {
				throw new TypeError('Object.assign cannot be called with null or undefined');
			}

			return Object(val);
		}

		function shouldUseNative() {
			try {
				if (!Object.assign) {
					return false;
				}

				// Detect buggy property enumeration order in older V8 versions.

				// https://bugs.chromium.org/p/v8/issues/detail?id=4118
				var test1 = new String('abc');  // eslint-disable-line
				test1[5] = 'de';
				if (Object.getOwnPropertyNames(test1)[0] === '5') {
					return false;
				}

				// https://bugs.chromium.org/p/v8/issues/detail?id=3056
				var test2 = {};
				for (var i = 0; i < 10; i++) {
					test2['_' + String.fromCharCode(i)] = i;
				}
				var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
					return test2[n];
				});
				if (order2.join('') !== '0123456789') {
					return false;
				}

				// https://bugs.chromium.org/p/v8/issues/detail?id=3056
				var test3 = {};
				'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
					test3[letter] = letter;
				});
				if (Object.keys(Object.assign({}, test3)).join('') !==
						'abcdefghijklmnopqrst') {
					return false;
				}

				return true;
			} catch (e) {
				// We don't expect any of the above to throw, but better to be safe.
				return false;
			}
		}

		module.exports = shouldUseNative() ? Object.assign : function (target, source) {
			var from;
			var to = toObject(target);
			var symbols;

			for (var s = 1; s < arguments.length; s++) {
				from = Object(arguments[s]);

				for (var key in from) {
					if (hasOwnProperty.call(from, key)) {
						to[key] = from[key];
					}
				}

				if (Object.getOwnPropertySymbols) {
					symbols = Object.getOwnPropertySymbols(from);
					for (var i = 0; i < symbols.length; i++) {
						if (propIsEnumerable.call(from, symbols[i])) {
							to[symbols[i]] = from[symbols[i]];
						}
					}
				}
			}

			return to;
		};


	/***/ },
	/* 5 */
	/***/ function(module, exports, __webpack_require__) {

		
		/**
		 * Module dependencies.
		 */

		var now = __webpack_require__(6);

		/**
		 * Returns a function, that, as long as it continues to be invoked, will not
		 * be triggered. The function will be called after it stops being called for
		 * N milliseconds. If `immediate` is passed, trigger the function on the
		 * leading edge, instead of the trailing.
		 *
		 * @source underscore.js
		 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
		 * @param {Function} function to wrap
		 * @param {Number} timeout in ms (`100`)
		 * @param {Boolean} whether to execute at the beginning (`false`)
		 * @api public
		 */

		module.exports = function debounce(func, wait, immediate){
		  var timeout, args, context, timestamp, result;
		  if (null == wait) wait = 100;

		  function later() {
		    var last = now() - timestamp;

		    if (last < wait && last > 0) {
		      timeout = setTimeout(later, wait - last);
		    } else {
		      timeout = null;
		      if (!immediate) {
		        result = func.apply(context, args);
		        if (!timeout) context = args = null;
		      }
		    }
		  };

		  return function debounced() {
		    context = this;
		    args = arguments;
		    timestamp = now();
		    var callNow = immediate && !timeout;
		    if (!timeout) timeout = setTimeout(later, wait);
		    if (callNow) {
		      result = func.apply(context, args);
		      context = args = null;
		    }

		    return result;
		  };
		};


	/***/ },
	/* 6 */
	/***/ function(module, exports) {

		module.exports = Date.now || now

		function now() {
		    return new Date().getTime()
		}


	/***/ },
	/* 7 */
	/***/ function(module, exports) {

		module.exports = throttle;

		/**
		 * Returns a new function that, when invoked, invokes `func` at most once per `wait` milliseconds.
		 *
		 * @param {Function} func Function to wrap.
		 * @param {Number} wait Number of milliseconds that must elapse between `func` invocations.
		 * @return {Function} A new function that wraps the `func` function passed in.
		 */

		function throttle (func, wait) {
		  var ctx, args, rtn, timeoutID; // caching
		  var last = 0;

		  return function throttled () {
		    ctx = this;
		    args = arguments;
		    var delta = new Date() - last;
		    if (!timeoutID)
		      if (delta >= wait) call();
		      else timeoutID = setTimeout(call, wait - delta);
		    return rtn;
		  };

		  function call () {
		    timeoutID = 0;
		    last = +new Date();
		    rtn = func.apply(ctx, args);
		    ctx = null;
		    args = null;
		  }
		}


	/***/ }
	/******/ ])
	});
	;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ },
/* 234 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strictUriEncode = __webpack_require__(235);

	exports.extract = function (str) {
		return str.split('?')[1] || '';
	};

	exports.parse = function (str) {
		if (typeof str !== 'string') {
			return {};
		}

		str = str.trim().replace(/^(\?|#|&)/, '');

		if (!str) {
			return {};
		}

		return str.split('&').reduce(function (ret, param) {
			var parts = param.replace(/\+/g, ' ').split('=');
			// Firefox (pre 40) decodes `%3D` to `=`
			// https://github.com/sindresorhus/query-string/pull/37
			var key = parts.shift();
			var val = parts.length > 0 ? parts.join('=') : undefined;

			key = decodeURIComponent(key);

			// missing `=` should be `null`:
			// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
			val = val === undefined ? null : decodeURIComponent(val);

			if (!ret.hasOwnProperty(key)) {
				ret[key] = val;
			} else if (Array.isArray(ret[key])) {
				ret[key].push(val);
			} else {
				ret[key] = [ret[key], val];
			}

			return ret;
		}, {});
	};

	exports.stringify = function (obj) {
		return obj ? Object.keys(obj).sort().map(function (key) {
			var val = obj[key];

			if (val === undefined) {
				return '';
			}

			if (val === null) {
				return key;
			}

			if (Array.isArray(val)) {
				return val.sort().map(function (val2) {
					return strictUriEncode(key) + '=' + strictUriEncode(val2);
				}).join('&');
			}

			return strictUriEncode(key) + '=' + strictUriEncode(val);
		}).filter(function (x) {
			return x.length > 0;
		}).join('&') : '';
	};


/***/ },
/* 235 */
/***/ function(module, exports) {

	'use strict';
	module.exports = function (str) {
		return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
			return '%' + c.charCodeAt(0).toString(16).toUpperCase();
		});
	};


/***/ },
/* 236 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(184);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(185);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _jquery = __webpack_require__(7);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _emitter = __webpack_require__(237);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _eventsList = __webpack_require__(238);

	var _eventsList2 = _interopRequireDefault(_eventsList);

	var _Marker = __webpack_require__(239);

	var _Marker2 = _interopRequireDefault(_Marker);

	var _limitMapBounds = __webpack_require__(245);

	var _limitMapBounds2 = _interopRequireDefault(_limitMapBounds);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var MAP_API_URL = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAMF-gJllft62W5l9xfgE6DBhaa6YmIJs0';

	var mapOptions = {
	  center: {
	    lat: 20,
	    lng: 0
	  },
	  zoom: 2,
	  disableDefaultUI: true,
	  zoomControl: true,
	  maxZoom: 12,
	  minZoom: 2,
	  styles: __webpack_require__(246)
	};

	var Map = function () {
	  /**
	   * @param {HTMLElement} node
	   * @param {EventsStore} store
	   * @param {Object} initialFilters
	   */
	  function Map(node, store) {
	    var _this = this;

	    var initialFilters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	    (0, _classCallCheck3.default)(this, Map);

	    var $mapNode = (0, _jquery2.default)(node);
	    var that = this;
	    this.node = $mapNode.get(0);
	    this.store = store;
	    this.markers = [];
	    this.initialFilters = initialFilters;

	    var instance = new google.maps.Map($mapNode.get(0), mapOptions);
	    this.instance = instance;

	    // Restore state after user clicks anywhere except of event marker
	    instance.addListener('click', function () {
	      _this.reset();
	      _emitter2.default.emit(_eventsList2.default.EVENT_DESELECTED);
	    });

	    // Emit bounds change event
	    var isFirstBoundsChangedEvent = true;
	    instance.addListener('bounds_changed', function () {
	      if (isFirstBoundsChangedEvent) {
	        isFirstBoundsChangedEvent = false;
	        return;
	      }

	      setTimeout(function () {
	        _emitter2.default.emit(_eventsList2.default.MAP_BOUNDS_CHANGED, instance.getBounds());
	      }, 200);
	    });

	    // Restore state when marker deselected
	    _emitter2.default.on(_eventsList2.default.EVENT_DESELECTED, function () {
	      _this.reset();
	    });

	    // Filter markers when filtering event fired
	    _emitter2.default.on(_eventsList2.default.EVENTS_FILTERED, function (filters) {
	      var filteredEvents = store.filter(filters);
	      _this.applyFilteredResults(filteredEvents);
	    });

	    _emitter2.default.on(_eventsList2.default.EVENT_HIGHLIGHTED, function (event) {
	      event.marker.highlight();
	    });

	    _emitter2.default.on(_eventsList2.default.EVENT_UNHIGHLIGHTED, function (event) {
	      event.marker.unhighlight();
	    });

	    // MARKERS
	    this._createMarkers(store.events);
	    var markers = this.markers;

	    _emitter2.default.on(_eventsList2.default.EVENT_SELECTED, function (event) {
	      var currentMarker = event.marker;

	      markers.forEach(function (marker) {
	        if (marker === currentMarker) {
	          marker.activate();
	          marker.openWindow();
	        } else {
	          marker.deactivate();
	          marker.closeWindow();
	        }
	      });

	      instance.panTo(event.getBounds());
	    });

	    if (this.initialFilters) {
	      var filtered = this.store.filter(this.initialFilters);
	      this.applyFilteredResults(filtered);
	    }
	  }

	  /**
	   * @static
	   * @param {HTMLElement} node
	   * @param {EventsStore} store
	   * @param {Object} initialFilters
	   * @returns {Deferred}
	   */


	  (0, _createClass3.default)(Map, [{
	    key: "_createMarkers",


	    /**
	     * @param {Array<Event>} events
	     */
	    value: function _createMarkers(events) {
	      var map = this;
	      var markers = [];

	      events.forEach(function (event) {
	        if (!event.city) {
	          return;
	        }
	        markers.push(new _Marker2.default(event, map));
	      });

	      this.markers = markers;
	    }
	  }, {
	    key: "_limitWorldBounds",
	    value: function _limitWorldBounds() {
	      var map = this.instance;

	      var maxBounds = new google.maps.LatLngBounds(new google.maps.LatLng(-85, -175), new google.maps.LatLng(85, 175));

	      (0, _limitMapBounds2.default)(map, maxBounds);
	    }
	  }, {
	    key: "reset",
	    value: function reset() {
	      this.markers.forEach(function (marker) {
	        marker.activate();
	        marker.closeWindow();
	      });
	    }
	  }, {
	    key: "applyFilteredResults",
	    value: function applyFilteredResults(filteredEvents) {
	      var map = this.instance;

	      this.store.events.forEach(function (event) {
	        filteredEvents.indexOf(event) > -1 ? event.marker.show() : event.marker.hide();
	      });

	      var eventsBounds = new google.maps.LatLngBounds(null);

	      filteredEvents.forEach(function (event) {
	        return eventsBounds.extend(event.getBounds());
	      });

	      if (filteredEvents.length == 0) {
	        return;
	      }

	      map.fitBounds(eventsBounds);

	      var zoom = map.getZoom();
	      if (zoom <= 2) {
	        map.setCenter({ lat: 39.90971744298563, lng: -49.34941524999998 });
	      }
	    }
	  }], [{
	    key: "create",
	    value: function create(node, store) {
	      var initialFilters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

	      return _jquery2.default.getScript(MAP_API_URL).then(function () {
	        return new Map(node, store, initialFilters);
	      });
	    }
	  }]);
	  return Map;
	}();

	exports.default = Map;
	module.exports = exports["default"];

/***/ },
/* 237 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var emitter = __webpack_require__(8);

	module.exports = emitter({});

/***/ },
/* 238 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var events = {
	  /**
	   * @param {Object} Filters request
	   */
	  EVENTS_FILTERED: 'events_filtered',

	  /**
	   * @param {Event}
	   */
	  EVENT_HIGHLIGHTED: 'event_highlighted',

	  /**
	   * @param {Event}
	   */
	  EVENT_UNHIGHLIGHTED: 'event_unhighlighted',

	  /**
	   * @param {Event}
	   */
	  EVENT_SELECTED: 'event_selected',

	  /**
	   * No params
	   */
	  EVENT_DESELECTED: 'event_deselected',

	  /**
	   * @param {google.maps.LatLng} New map bounds
	   */
	  MAP_BOUNDS_CHANGED: 'map_bounds_changed'
	};

	exports.default = events;
	module.exports = exports['default'];

/***/ },
/* 239 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(184);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(185);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _eventsList = __webpack_require__(238);

	var _eventsList2 = _interopRequireDefault(_eventsList);

	var _emitter = __webpack_require__(237);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _marker = __webpack_require__(240);

	var _marker2 = _interopRequireDefault(_marker);

	var _markerInactive = __webpack_require__(241);

	var _markerInactive2 = _interopRequireDefault(_markerInactive);

	var _markerHighlighted = __webpack_require__(242);

	var _markerHighlighted2 = _interopRequireDefault(_markerHighlighted);

	var _markerTagged = __webpack_require__(243);

	var _markerTagged2 = _interopRequireDefault(_markerTagged);

	var _markerTaggedHighlighted = __webpack_require__(244);

	var _markerTaggedHighlighted2 = _interopRequireDefault(_markerTaggedHighlighted);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Marker = function () {
	  /**
	   * @param {Event} event
	   * @param {Object} map Google Map instance
	   */
	  function Marker(event, map) {
	    (0, _classCallCheck3.default)(this, Marker);

	    var marker = event.marker = this;
	    this.event = event;
	    this.map = map;
	    this.isActive = true;
	    this.isHighlighted = false;

	    var markerInstance = new google.maps.Marker({
	      title: event.title,
	      position: event.city.position,
	      draggable: false,
	      visible: true,
	      icon: this.getIcon(),
	      map: map ? map.instance : null
	    });

	    this.marker = markerInstance;

	    markerInstance.addListener('click', function () {
	      _emitter2.default.emit(_eventsList2.default.EVENT_SELECTED, event);
	    });

	    markerInstance.addListener('mouseover', function () {
	      marker.highlight();
	      _emitter2.default.emit(_eventsList2.default.EVENT_HIGHLIGHTED, event);
	    });

	    markerInstance.addListener('mouseout', function () {
	      marker.unhighlight();
	      _emitter2.default.emit(_eventsList2.default.EVENT_UNHIGHLIGHTED, event);
	    });

	    // Info window
	    var infoWindow = new google.maps.InfoWindow({
	      content: event.title
	    });

	    infoWindow.addListener('closeclick', function () {
	      _emitter2.default.emit(_eventsList2.default.EVENT_DESELECTED);
	    });

	    this.infoWindow = infoWindow;
	  }

	  (0, _createClass3.default)(Marker, [{
	    key: "getIcon",
	    value: function getIcon() {
	      var isActive = this.isActive,
	          isHighlighted = this.isHighlighted;

	      var mapZoom = this.map.instance.getZoom();
	      var hasTags = this.event.tags.length > 0;
	      var iconUrl = isActive ? hasTags ? _markerTagged2.default : _marker2.default : _markerInactive2.default;

	      if (isHighlighted) {
	        iconUrl = hasTags ? _markerTaggedHighlighted2.default : _markerHighlighted2.default;
	      }

	      return {
	        scaledSize: {
	          width: 15,
	          height: 15
	        },
	        opacity: 1,
	        url: iconUrl
	      };
	    }
	  }, {
	    key: "openWindow",
	    value: function openWindow() {
	      this.infoWindow.open(this.map.instance, this.marker);
	    }
	  }, {
	    key: "closeWindow",
	    value: function closeWindow() {
	      this.infoWindow.close();
	    }
	  }, {
	    key: "highlight",
	    value: function highlight() {
	      var marker = this.marker;

	      this.isHighlighted = true;
	      marker.setIcon(this.getIcon());
	      marker.setZIndex(30);
	    }
	  }, {
	    key: "unhighlight",
	    value: function unhighlight() {
	      var marker = this.marker;

	      this.isHighlighted = false;
	      marker.setIcon(this.getIcon());
	      marker.setZIndex(this.isActive ? 2 : 1);
	    }
	  }, {
	    key: "activate",
	    value: function activate() {
	      var marker = this.marker;

	      this.isActive = true;
	      this.isHighlighted = false;
	      marker.setIcon(this.getIcon());
	      marker.setZIndex(2);
	    }
	  }, {
	    key: "deactivate",
	    value: function deactivate() {
	      var marker = this.marker;

	      this.isActive = false;
	      this.isHighlighted = false;
	      marker.setIcon(this.getIcon());
	      marker.setZIndex(1);
	    }
	  }, {
	    key: "show",
	    value: function show() {
	      this.marker.setVisible(true);
	    }
	  }, {
	    key: "hide",
	    value: function hide() {
	      this.marker.setVisible(false);
	    }
	  }]);
	  return Marker;
	}();

	exports.default = Marker;
	module.exports = exports["default"];

/***/ },
/* 240 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDREQzI1NjRDODY2MTFFNkIxQjJFQUQ3MDRGQzVGNDUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDREQzI1NjVDODY2MTFFNkIxQjJFQUQ3MDRGQzVGNDUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpENERDMjU2MkM4NjYxMUU2QjFCMkVBRDcwNEZDNUY0NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpENERDMjU2M0M4NjYxMUU2QjFCMkVBRDcwNEZDNUY0NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pu8kvhoAAAEdSURBVHjaYvj//z8DGnYF4gVAfAeIf0LpBVBxFLXIHFMgPvMfPzgDVYei2QyIP/4nDnyEqodrPguX+vPt//+bdf//71X+/38b2///+5QhfJA4AoDUMzACCTcGBoadDCDw9xsDw3FXBoZ3xxgYGBkgAEYLWjEwWOxmYGDmggowuDIBiSgYj+FmBwPDa6DGvwwQ/A+JfgsUv9PFgARiQZpt4NyHyxAasRnwaDGyZhsWICEL535+DAwEJOcyorG/PkHWLAOy+TGcyw405w8Dpu0wzCqNrPkpSPMROFc+ElXxHzS2XCyy5iMgzcvhXJ1KBgYRK0z/grAQUFyzHFnzYuzxfBYYr6uB8bsAGM9rgPQ57PFMlRRGUdomK1cBBBgA22PnG6kCJJEAAAAASUVORK5CYII="

/***/ },
/* 241 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDREQzI1NkNDODY2MTFFNkIxQjJFQUQ3MDRGQzVGNDUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6REZFMDlDQ0NDODY2MTFFNkIxQjJFQUQ3MDRGQzVGNDUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpENERDMjU2QUM4NjYxMUU2QjFCMkVBRDcwNEZDNUY0NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpENERDMjU2QkM4NjYxMUU2QjFCMkVBRDcwNEZDNUY0NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnJIETYAAAFFSURBVHjapFMxa4NAGH0aEYekGQRRbAWdMre0U8amP6KQ39U10KG/oXumkHTM1ExixOCiiEGC2vvsXbi0JRTy4HHf0/e+u/NOtW1b/OCEccb4yVjxccafn3hlcc+4bM9jyX0n4QfGrP0fMu6Hhm+8MF5R0TQN4jhGmqY4HA7QdR2macJxHKiqCu4j/53COjyx4l0E1+s1iqLoOiqKchz7/T5Go5FoQJhQ9SxUGIbIsgx1XXeNZOZ5ju12CwlTCo+FSpLkGKRRrmnc7XZyeEx7vhGqLMvuA8rLlev9fi+Hr2nmUChN044z/kV6LyGi8Fwo27bPhi3LksNzCr8J5fs+hsPhr30TB4MBPM+Tw69Kd1OAFeMtFWTcbDaIoghVVcEwDLiuiyAI0Ov1RPCDzvmiGyZOfMH4yFdwDivuW3Tqkr/qS4ABAMsPtTbiv1/WAAAAAElFTkSuQmCC"

/***/ },
/* 242 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDREQzI1NjhDODY2MTFFNkIxQjJFQUQ3MDRGQzVGNDUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDREQzI1NjlDODY2MTFFNkIxQjJFQUQ3MDRGQzVGNDUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpENERDMjU2NkM4NjYxMUU2QjFCMkVBRDcwNEZDNUY0NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpENERDMjU2N0M4NjYxMUU2QjFCMkVBRDcwNEZDNUY0NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqBIRlgAAAD/SURBVHjarJO9CsIwFEZv/EEHF3GTOjiKTopOrvUhBN9NcPAZ3LsI6uKoKCo6KVJQodAav5Q0NrUoqIGT5JZ7btImJc45abhkgj5YAkeOff95JDcsNcEE8DdM/DxNdqkF7A9igO3nw2N+BY9NiahOonlgBQ7AAVlQBGWQpKDNKMkbDFU6CEZKHIMzYDItGPOgqRUwE+i6KlyAoywiuIfGk9zRs/WE3FbhJiTGFdhqcjuFrqTCC+Ch7bLI/KbJhlh5p8IMcGNWD0hr8l7IlgpLkWQ3Mjc02RLyUIVVUIh5X09+7YomD+LPeQ7W4Apy8oxrr+f80w37w93+8q96CDAAS8tJ7FUFwroAAAAASUVORK5CYII="

/***/ },
/* 243 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAKRWlDQ1BJQ0MgcHJvZmlsZQAAeNqdU2dUU+kWPffe9EJLiICUS29SFQggUkKLgBSRJiohCRBKiCGh2RVRwRFFRQQbyKCIA46OgIwVUSwMigrYB+Qhoo6Do4iKyvvhe6Nr1rz35s3+tdc+56zznbPPB8AIDJZIM1E1gAypQh4R4IPHxMbh5C5AgQokcAAQCLNkIXP9IwEA+H48PCsiwAe+AAF40wsIAMBNm8AwHIf/D+pCmVwBgIQBwHSROEsIgBQAQHqOQqYAQEYBgJ2YJlMAoAQAYMtjYuMAUC0AYCd/5tMAgJ34mXsBAFuUIRUBoJEAIBNliEQAaDsArM9WikUAWDAAFGZLxDkA2C0AMElXZkgAsLcAwM4QC7IACAwAMFGIhSkABHsAYMgjI3gAhJkAFEbyVzzxK64Q5yoAAHiZsjy5JDlFgVsILXEHV1cuHijOSRcrFDZhAmGaQC7CeZkZMoE0D+DzzAAAoJEVEeCD8/14zg6uzs42jrYOXy3qvwb/ImJi4/7lz6twQAAA4XR+0f4sL7MagDsGgG3+oiXuBGheC6B194tmsg9AtQCg6dpX83D4fjw8RaGQudnZ5eTk2ErEQlthyld9/mfCX8BX/Wz5fjz89/XgvuIkgTJdgUcE+ODCzPRMpRzPkgmEYtzmj0f8twv//B3TIsRJYrlYKhTjURJxjkSajPMypSKJQpIpxSXS/2Ti3yz7Az7fNQCwaj4Be5EtqF1jA/ZLJxBYdMDi9wAA8rtvwdQoCAOAaIPhz3f/7z/9R6AlAIBmSZJxAABeRCQuVMqzP8cIAABEoIEqsEEb9MEYLMAGHMEF3MEL/GA2hEIkxMJCEEIKZIAccmAprIJCKIbNsB0qYC/UQB00wFFohpNwDi7CVbgOPXAP+mEInsEovIEJBEHICBNhIdqIAWKKWCOOCBeZhfghwUgEEoskIMmIFFEiS5E1SDFSilQgVUgd8j1yAjmHXEa6kTvIADKC/Ia8RzGUgbJRPdQMtUO5qDcahEaiC9BkdDGajxagm9BytBo9jDah59CraA/ajz5DxzDA6BgHM8RsMC7Gw0KxOCwJk2PLsSKsDKvGGrBWrAO7ifVjz7F3BBKBRcAJNgR3QiBhHkFIWExYTthIqCAcJDQR2gk3CQOEUcInIpOoS7QmuhH5xBhiMjGHWEgsI9YSjxMvEHuIQ8Q3JBKJQzInuZACSbGkVNIS0kbSblIj6SypmzRIGiOTydpka7IHOZQsICvIheSd5MPkM+Qb5CHyWwqdYkBxpPhT4ihSympKGeUQ5TTlBmWYMkFVo5pS3aihVBE1j1pCraG2Uq9Rh6gTNHWaOc2DFklLpa2ildMaaBdo92mv6HS6Ed2VHk6X0FfSy+lH6JfoA/R3DA2GFYPHiGcoGZsYBxhnGXcYr5hMphnTixnHVDA3MeuY55kPmW9VWCq2KnwVkcoKlUqVJpUbKi9Uqaqmqt6qC1XzVctUj6leU32uRlUzU+OpCdSWq1WqnVDrUxtTZ6k7qIeqZ6hvVD+kfln9iQZZw0zDT0OkUaCxX+O8xiALYxmzeCwhaw2rhnWBNcQmsc3ZfHYqu5j9HbuLPaqpoTlDM0ozV7NS85RmPwfjmHH4nHROCecop5fzforeFO8p4ikbpjRMuTFlXGuqlpeWWKtIq1GrR+u9Nq7tp52mvUW7WfuBDkHHSidcJ0dnj84FnedT2VPdpwqnFk09OvWuLqprpRuhu0R3v26n7pievl6Ankxvp955vef6HH0v/VT9bfqn9UcMWAazDCQG2wzOGDzFNXFvPB0vx9vxUUNdw0BDpWGVYZfhhJG50Tyj1UaNRg+MacZc4yTjbcZtxqMmBiYhJktN6k3umlJNuaYppjtMO0zHzczNos3WmTWbPTHXMueb55vXm9+3YFp4Wiy2qLa4ZUmy5FqmWe62vG6FWjlZpVhVWl2zRq2drSXWu627pxGnuU6TTque1mfDsPG2ybaptxmw5dgG2662bbZ9YWdiF2e3xa7D7pO9k326fY39PQcNh9kOqx1aHX5ztHIUOlY63prOnO4/fcX0lukvZ1jPEM/YM+O2E8spxGmdU5vTR2cXZ7lzg/OIi4lLgssulz4umxvG3ci95Ep09XFd4XrS9Z2bs5vC7ajbr+427mnuh9yfzDSfKZ5ZM3PQw8hD4FHl0T8Ln5Uwa9+sfk9DT4FntecjL2MvkVet17C3pXeq92HvFz72PnKf4z7jPDfeMt5ZX8w3wLfIt8tPw2+eX4XfQ38j/2T/ev/RAKeAJQFnA4mBQYFbAvv4enwhv44/Ottl9rLZ7UGMoLlBFUGPgq2C5cGtIWjI7JCtIffnmM6RzmkOhVB+6NbQB2HmYYvDfgwnhYeFV4Y/jnCIWBrRMZc1d9HcQ3PfRPpElkTem2cxTzmvLUo1Kj6qLmo82je6NLo/xi5mWczVWJ1YSWxLHDkuKq42bmy+3/zt84fineIL43sXmC/IXXB5oc7C9IWnFqkuEiw6lkBMiE44lPBBECqoFowl8hN3JY4KecIdwmciL9E20YjYQ1wqHk7ySCpNepLskbw1eSTFM6Us5bmEJ6mQvEwNTN2bOp4WmnYgbTI9Or0xg5KRkHFCqiFNk7Zn6mfmZnbLrGWFsv7Fbou3Lx6VB8lrs5CsBVktCrZCpuhUWijXKgeyZ2VXZr/Nico5lqueK83tzLPK25A3nO+f/+0SwhLhkralhktXLR1Y5r2sajmyPHF52wrjFQUrhlYGrDy4irYqbdVPq+1Xl65+vSZ6TWuBXsHKgsG1AWvrC1UK5YV969zX7V1PWC9Z37Vh+oadGz4ViYquFNsXlxV/2CjceOUbh2/Kv5nclLSpq8S5ZM9m0mbp5t4tnlsOlqqX5pcObg3Z2rQN31a07fX2Rdsvl80o27uDtkO5o788uLxlp8nOzTs/VKRU9FT6VDbu0t21Ydf4btHuG3u89jTs1dtbvPf9Psm+21UBVU3VZtVl+0n7s/c/romq6fiW+21drU5tce3HA9ID/QcjDrbXudTVHdI9VFKP1ivrRw7HH77+ne93LQ02DVWNnMbiI3BEeeTp9wnf9x4NOtp2jHus4QfTH3YdZx0vakKa8ppGm1Oa+1tiW7pPzD7R1ureevxH2x8PnDQ8WXlK81TJadrpgtOTZ/LPjJ2VnX1+LvncYNuitnvnY87fag9v77oQdOHSRf+L5zu8O85c8rh08rLb5RNXuFearzpfbep06jz+k9NPx7ucu5quuVxrue56vbV7ZvfpG543zt30vXnxFv/W1Z45Pd2983pv98X39d8W3X5yJ/3Oy7vZdyfurbxPvF/0QO1B2UPdh9U/W/7c2O/cf2rAd6Dz0dxH9waFg8/+kfWPD0MFj5mPy4YNhuueOD45OeI/cv3p/KdDz2TPJp4X/qL+y64XFi9++NXr187RmNGhl/KXk79tfKX96sDrGa/bxsLGHr7JeDMxXvRW++3Bd9x3He+j3w9P5Hwgfyj/aPmx9VPQp/uTGZOT/wQDmPP87zWUggAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAMoaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkI0QkMyMDUxRjk0MjExRTZCODBEQUYxRDY1QUNFRTVBIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkI0QkMyMDUwRjk0MjExRTZCODBEQUYxRDY1QUNFRTVBIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDREQzI1NjRDODY2MTFFNkIxQjJFQUQ3MDRGQzVGNDUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RDREQzI1NjVDODY2MTFFNkIxQjJFQUQ3MDRGQzVGNDUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4dz8HdAAABPUlEQVR42qyTTUvDQBCGn6almIuoKIJoQQXx1IO2PUg91h8h+N8KHvwNnjxYBKF60IMVqohiseBXqoc2aYyzcZd0WxBRB57MvmHfYTK7IYoihqgIVaEp9HSu6vfW3kFRFOrR91HX+yxzSfCin4Wn95OKK8CJsKYWYQjXl9C6hW4XXBfmcrC4Auk0Jk6FdWXeksV+bOzD0QG8PEEqZTM5DaVNq0DFkce2UY1zaLcg8L/oBwmPD3B1wWDsKHPZqGYD/F5i9jWxlgI3TctczshjwajXZxngBziObleyo7PSndAyzyvznbCsVDYLb96oyRQbcy3zvWq7ZpSaaNxmT7c8lHNLlrmmzHtGFTZgZjb55mCg0JRMO1+wzLsj56wme3wokz+D9w6MT8BqHooy1kzGPuc/3bB/udu/+qs+BRgAu3Or4z4WplwAAAAASUVORK5CYII="

/***/ },
/* 244 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAKRWlDQ1BJQ0MgcHJvZmlsZQAAeNqdU2dUU+kWPffe9EJLiICUS29SFQggUkKLgBSRJiohCRBKiCGh2RVRwRFFRQQbyKCIA46OgIwVUSwMigrYB+Qhoo6Do4iKyvvhe6Nr1rz35s3+tdc+56zznbPPB8AIDJZIM1E1gAypQh4R4IPHxMbh5C5AgQokcAAQCLNkIXP9IwEA+H48PCsiwAe+AAF40wsIAMBNm8AwHIf/D+pCmVwBgIQBwHSROEsIgBQAQHqOQqYAQEYBgJ2YJlMAoAQAYMtjYuMAUC0AYCd/5tMAgJ34mXsBAFuUIRUBoJEAIBNliEQAaDsArM9WikUAWDAAFGZLxDkA2C0AMElXZkgAsLcAwM4QC7IACAwAMFGIhSkABHsAYMgjI3gAhJkAFEbyVzzxK64Q5yoAAHiZsjy5JDlFgVsILXEHV1cuHijOSRcrFDZhAmGaQC7CeZkZMoE0D+DzzAAAoJEVEeCD8/14zg6uzs42jrYOXy3qvwb/ImJi4/7lz6twQAAA4XR+0f4sL7MagDsGgG3+oiXuBGheC6B194tmsg9AtQCg6dpX83D4fjw8RaGQudnZ5eTk2ErEQlthyld9/mfCX8BX/Wz5fjz89/XgvuIkgTJdgUcE+ODCzPRMpRzPkgmEYtzmj0f8twv//B3TIsRJYrlYKhTjURJxjkSajPMypSKJQpIpxSXS/2Ti3yz7Az7fNQCwaj4Be5EtqF1jA/ZLJxBYdMDi9wAA8rtvwdQoCAOAaIPhz3f/7z/9R6AlAIBmSZJxAABeRCQuVMqzP8cIAABEoIEqsEEb9MEYLMAGHMEF3MEL/GA2hEIkxMJCEEIKZIAccmAprIJCKIbNsB0qYC/UQB00wFFohpNwDi7CVbgOPXAP+mEInsEovIEJBEHICBNhIdqIAWKKWCOOCBeZhfghwUgEEoskIMmIFFEiS5E1SDFSilQgVUgd8j1yAjmHXEa6kTvIADKC/Ia8RzGUgbJRPdQMtUO5qDcahEaiC9BkdDGajxagm9BytBo9jDah59CraA/ajz5DxzDA6BgHM8RsMC7Gw0KxOCwJk2PLsSKsDKvGGrBWrAO7ifVjz7F3BBKBRcAJNgR3QiBhHkFIWExYTthIqCAcJDQR2gk3CQOEUcInIpOoS7QmuhH5xBhiMjGHWEgsI9YSjxMvEHuIQ8Q3JBKJQzInuZACSbGkVNIS0kbSblIj6SypmzRIGiOTydpka7IHOZQsICvIheSd5MPkM+Qb5CHyWwqdYkBxpPhT4ihSympKGeUQ5TTlBmWYMkFVo5pS3aihVBE1j1pCraG2Uq9Rh6gTNHWaOc2DFklLpa2ildMaaBdo92mv6HS6Ed2VHk6X0FfSy+lH6JfoA/R3DA2GFYPHiGcoGZsYBxhnGXcYr5hMphnTixnHVDA3MeuY55kPmW9VWCq2KnwVkcoKlUqVJpUbKi9Uqaqmqt6qC1XzVctUj6leU32uRlUzU+OpCdSWq1WqnVDrUxtTZ6k7qIeqZ6hvVD+kfln9iQZZw0zDT0OkUaCxX+O8xiALYxmzeCwhaw2rhnWBNcQmsc3ZfHYqu5j9HbuLPaqpoTlDM0ozV7NS85RmPwfjmHH4nHROCecop5fzforeFO8p4ikbpjRMuTFlXGuqlpeWWKtIq1GrR+u9Nq7tp52mvUW7WfuBDkHHSidcJ0dnj84FnedT2VPdpwqnFk09OvWuLqprpRuhu0R3v26n7pievl6Ankxvp955vef6HH0v/VT9bfqn9UcMWAazDCQG2wzOGDzFNXFvPB0vx9vxUUNdw0BDpWGVYZfhhJG50Tyj1UaNRg+MacZc4yTjbcZtxqMmBiYhJktN6k3umlJNuaYppjtMO0zHzczNos3WmTWbPTHXMueb55vXm9+3YFp4Wiy2qLa4ZUmy5FqmWe62vG6FWjlZpVhVWl2zRq2drSXWu627pxGnuU6TTque1mfDsPG2ybaptxmw5dgG2662bbZ9YWdiF2e3xa7D7pO9k326fY39PQcNh9kOqx1aHX5ztHIUOlY63prOnO4/fcX0lukvZ1jPEM/YM+O2E8spxGmdU5vTR2cXZ7lzg/OIi4lLgssulz4umxvG3ci95Ep09XFd4XrS9Z2bs5vC7ajbr+427mnuh9yfzDSfKZ5ZM3PQw8hD4FHl0T8Ln5Uwa9+sfk9DT4FntecjL2MvkVet17C3pXeq92HvFz72PnKf4z7jPDfeMt5ZX8w3wLfIt8tPw2+eX4XfQ38j/2T/ev/RAKeAJQFnA4mBQYFbAvv4enwhv44/Ottl9rLZ7UGMoLlBFUGPgq2C5cGtIWjI7JCtIffnmM6RzmkOhVB+6NbQB2HmYYvDfgwnhYeFV4Y/jnCIWBrRMZc1d9HcQ3PfRPpElkTem2cxTzmvLUo1Kj6qLmo82je6NLo/xi5mWczVWJ1YSWxLHDkuKq42bmy+3/zt84fineIL43sXmC/IXXB5oc7C9IWnFqkuEiw6lkBMiE44lPBBECqoFowl8hN3JY4KecIdwmciL9E20YjYQ1wqHk7ySCpNepLskbw1eSTFM6Us5bmEJ6mQvEwNTN2bOp4WmnYgbTI9Or0xg5KRkHFCqiFNk7Zn6mfmZnbLrGWFsv7Fbou3Lx6VB8lrs5CsBVktCrZCpuhUWijXKgeyZ2VXZr/Nico5lqueK83tzLPK25A3nO+f/+0SwhLhkralhktXLR1Y5r2sajmyPHF52wrjFQUrhlYGrDy4irYqbdVPq+1Xl65+vSZ6TWuBXsHKgsG1AWvrC1UK5YV969zX7V1PWC9Z37Vh+oadGz4ViYquFNsXlxV/2CjceOUbh2/Kv5nclLSpq8S5ZM9m0mbp5t4tnlsOlqqX5pcObg3Z2rQN31a07fX2Rdsvl80o27uDtkO5o788uLxlp8nOzTs/VKRU9FT6VDbu0t21Ydf4btHuG3u89jTs1dtbvPf9Psm+21UBVU3VZtVl+0n7s/c/romq6fiW+21drU5tce3HA9ID/QcjDrbXudTVHdI9VFKP1ivrRw7HH77+ne93LQ02DVWNnMbiI3BEeeTp9wnf9x4NOtp2jHus4QfTH3YdZx0vakKa8ppGm1Oa+1tiW7pPzD7R1ureevxH2x8PnDQ8WXlK81TJadrpgtOTZ/LPjJ2VnX1+LvncYNuitnvnY87fag9v77oQdOHSRf+L5zu8O85c8rh08rLb5RNXuFearzpfbep06jz+k9NPx7ucu5quuVxrue56vbV7ZvfpG543zt30vXnxFv/W1Z45Pd2983pv98X39d8W3X5yJ/3Oy7vZdyfurbxPvF/0QO1B2UPdh9U/W/7c2O/cf2rAd6Dz0dxH9waFg8/+kfWPD0MFj5mPy4YNhuueOD45OeI/cv3p/KdDz2TPJp4X/qL+y64XFi9++NXr187RmNGhl/KXk79tfKX96sDrGa/bxsLGHr7JeDMxXvRW++3Bd9x3He+j3w9P5Hwgfyj/aPmx9VPQp/uTGZOT/wQDmPP87zWUggAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAMoaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjhGOTQxNzMwRkE3RjExRTZCODBEQUYxRDY1QUNFRTVBIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkI0QkMyMDU0Rjk0MjExRTZCODBEQUYxRDY1QUNFRTVBIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDREQzI1NjRDODY2MTFFNkIxQjJFQUQ3MDRGQzVGNDUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RDREQzI1NjVDODY2MTFFNkIxQjJFQUQ3MDRGQzVGNDUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4fGT4PAAABcElEQVR42qRTMS9EQRD+dt+6uESOQqJBQXKVKBwKOd2dWk38AL/ofoCIklYUClcRCgokKkI0iIvEee/tW9++7N5bRC5hkm9ndne+2dnZWWGMQSh76Dap1ok6MUHcEW1iexWDB6Gv8GSSFqhaRA2/yymxySAnPTKJi7Rt1Ar6S4doMsCxcgutHlED0bVCdBtBdAVQNtCTGmk15UbuUfEZil3zvkJjP1/mvjgsQTxJCPJCmNEMyXLsA1hpSg5rfqYvFJIHiYQ+FmlSIHuUkJcqTH9DuarmEl9FMB+AlO5Ep6W3b3iVmdS715V7jly6zwIi+0qWYRAtUCpOHlfuHafztEsG2av4SXJasXgB+V66BshloKoR2/sydavjbxpTOrxz25J3/KyylCIay3oFS4JAYLXL82lI3vJNYjtnzq4YVvblSOHtPILuCAyMGAzNagzXU4ii2Gdsktq/OsymDWtQNVzvok9vN5x/8TH+8qs+BRgAjmuZogyCsPYAAAAASUVORK5CYII="

/***/ },
/* 245 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = limit;
	/**
	 * Partially taken from https://github.com/ubilabs/google-map-bounds-limit
	 */

	var ignoreNextMapMove = false;
	var lastValidCenter = null;

	/**
	 * Limits panning on the map beyond the given latitude.
	 * @param  {google.maps.Map} map  The google maps instance
	 * @param  {google.maps.LatLngBounds} maxBounds The maximum visible bounds
	 */
	function limitMapMove(map, maxBounds) {
	  if (ignoreNextMapMove) {
	    ignoreNextMapMove = false;
	    return;
	  }

	  var bounds = map.getBounds();

	  if (maxBounds.contains(bounds.getNorthEast()) && maxBounds.contains(bounds.getSouthWest())) {
	    lastValidCenter = map.getCenter();
	    return;
	  }

	  ignoreNextMapMove = true;

	  if (lastValidCenter) {
	    map.setCenter(lastValidCenter);
	    return;
	  }

	  lastValidCenter = recalculateMapCenter(map, maxBounds);
	  map.setCenter(lastValidCenter);
	}

	/**
	 * Calculate a new map-center such that the visible area of the map is
	 * completely within given max bounds.
	 * @param  {google.maps.Map} map  The google maps instance
	 * @param  {google.maps.LatLngBounds} maxBounds The maximum visible bounds
	 * @return {google.maps.LatLng}  The recalculated map center
	 */
	function recalculateMapCenter(map, maxBounds) {
	  var center = map.getCenter();
	  var bounds = map.getBounds();
	  var offsets = getBoundsOffsets(bounds, maxBounds);
	  var newCenter = {
	    lat: center.lat(),
	    lng: center.lng()
	  };

	  if (offsets.north > 0) {
	    newCenter.lat = center.lat() - offsets.n;
	  }

	  if (offsets.east > 0) {
	    newCenter.lng = center.lng() - offsets.e;
	  }

	  if (offsets.south > 0) {
	    newCenter.lat = center.lat() + offsets.s;
	  }

	  if (offsets.west > 0) {
	    newCenter.lng = center.lng() + offsets.w;
	  }

	  return new google.maps.LatLng(newCenter.lat, newCenter.lng);
	}

	/**
	 * Calculates the boundary-offsets in every direction for the given pair of
	 * LatLngBounds. Returned values are > 0 if inner is smaller than outer in
	 * that direction (when all values are >= 0, inner is a true subset of outer).
	 * @param {google.maps.LatLngBounds} inner The first bounds
	 * @param {google.maps.LatLngBounds} outer The second bounds
	 * @return {Object} The numeric offset per direction.
	 */
	function getBoundsOffsets(inner, outer) {
	  return {
	    north: inner.getNorthEast().lat() - outer.getNorthEast().lat(),
	    east: inner.getNorthEast().lng() - outer.getNorthEast().lng(),
	    south: outer.getSouthWest().lat() - inner.getSouthWest().lat(),
	    west: outer.getSouthWest().lng() - inner.getSouthWest().lng()
	  };
	}

	/**
	 * Limits latitude panning to a given limit.
	 * @param  {google.maps.Map} map  The google map object
	 * @param  {google.maps.LatLngBounds} maxBounds  The bounds limit
	 */
	function limit(map, maxBounds) {
	  map.addListener('center_changed', function () {
	    return limitMapMove(map, maxBounds);
	  });
	}
	module.exports = exports['default'];

/***/ },
/* 246 */
/***/ function(module, exports) {

	'use strict';

	module.exports = [{
	  featureType: 'all',
	  'stylers': [{ 'visibility': 'on' }, { 'hue': '#0044ff' }, { 'saturation': -80 }]
	}, {
	  'featureType': 'road.arterial',
	  'stylers': [{ 'visibility': 'on' }, { 'color': '#ffffff' }]
	}, {
	  'featureType': 'water',
	  'stylers': [{ 'color': '#d1dbe1' }, { 'visibility': 'on' }]
	}, {
	  'featureType': 'water',
	  'elementType': 'labels.text.fill',
	  'stylers': [{ 'color': '#456184' }]
	}, {
	  'featureType': 'water',
	  'elementType': 'labels.text.stroke',
	  'stylers': [{ 'weight': 2 }]
	}];

/***/ },
/* 247 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _keys = __webpack_require__(202);

	var _keys2 = _interopRequireDefault(_keys);

	var _classCallCheck2 = __webpack_require__(184);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(185);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _jquery = __webpack_require__(7);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _Event = __webpack_require__(248);

	var _Event2 = _interopRequireDefault(_Event);

	var _City = __webpack_require__(254);

	var _City2 = _interopRequireDefault(_City);

	var _lang2 = __webpack_require__(255);

	var _lang3 = _interopRequireDefault(_lang2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var EventsStore = function () {

	  /**
	   * @param {Object} eventsData Raw events data
	   * @param {Object} citiesData Raw cities data
	   */
	  function EventsStore(eventsData, citiesData) {
	    (0, _classCallCheck3.default)(this, EventsStore);

	    var store = this;
	    this.events = [];
	    this.cities = [];

	    var citiesNames = citiesData.map(function (data) {
	      return data.name;
	    });
	    var citiesMissedInDict = [];

	    eventsData.filter(function (data) {
	      return typeof data.location !== 'undefined';
	    }).map(function (data) {
	      return data.location;
	    }).filter(function (value, index, self) {
	      return self.indexOf(value) === index;
	    }).forEach(function (eventCity) {
	      if (citiesNames.indexOf(eventCity) === -1) {
	        citiesMissedInDict.push(eventCity);
	      }
	    });

	    if (citiesMissedInDict.length > 0) {
	      console.warn('Cities missed in cities.yml:\n' + citiesMissedInDict.join('\n'));
	    }

	    citiesData.forEach(function (data) {
	      return store.cities.push(new _City2.default(data));
	    });

	    eventsData.forEach(function (data, i) {
	      var eventCityExistInDict = data.location && citiesNames.indexOf(data.location) !== -1;

	      if (!eventCityExistInDict) {
	        return;
	      }

	      data.id = i.toString();
	      store.events.push(new _Event2.default(data));
	    });

	    store.events.forEach(function (event) {
	      event.city = store.cities.filter(function (city) {
	        return city.name === event.city;
	      })[0];
	    });

	    this.sort();
	  }

	  /**
	   * @param {string} eventsUrl
	   * @param {string} citiesUrl
	   * @returns {Deferred}
	   */


	  (0, _createClass3.default)(EventsStore, [{
	    key: "sort",
	    value: function sort() {
	      this.events.sort(function (a, b) {
	        var compareA = a.endDate;
	        var compareB = b.endDate;

	        if (b.pinned) {
	          return -1;
	        }

	        if (compareA === compareB) {
	          return 0;
	        }

	        return compareA < compareB ? 1 : -1;
	      });
	    }

	    /**
	     * @param {Array<Event>} [events]
	     * @returns {Array<Event>}
	     */

	  }, {
	    key: "getUpcomingEvents",
	    value: function getUpcomingEvents(events) {
	      var filtered = (events || this.events).filter(function (event) {
	        return event.isUpcoming();
	      }).sort(function (eventA, eventB) {
	        var startA = eventA.startDate;
	        var startB = eventB.startDate;

	        if (eventA.pinned) {
	          return -1;
	        }

	        if (startA === startB) {
	          return 0;
	        }

	        return startA < startB ? -1 : 1;
	      });

	      return filtered;
	    }

	    /**
	     * @param {Array<Event>} [events]
	     * @returns {Array<Event>}
	     */

	  }, {
	    key: "getPastEvents",
	    value: function getPastEvents(events) {
	      return (events || this.events).filter(function (event) {
	        return !event.isUpcoming();
	      });
	    }

	    /**
	     * @param {Object} constraints
	     * @param {string} constraints.time
	     * @param {string} constraints.lang
	     * @param {string} constraints.materials
	     * @param {google.maps.LatLng} constraints.bounds
	     * @param {Array<Event>} [evts]
	     * @returns {Array<Event>}
	     */

	  }, {
	    key: "filter",
	    value: function filter(constraints, evts) {
	      var events = evts || this.events;
	      var filtered = [];
	      var constraintNames = (0, _keys2.default)(constraints);

	      events.forEach(function (event) {
	        var performedConstraintsCount = 0;

	        constraintNames.forEach(function (name) {
	          var constraint = constraints[name];
	          var filter = EventsStore.FILTERS[name];
	          if (filter(constraint, event)) {
	            performedConstraintsCount++;
	          }
	        });

	        if (performedConstraintsCount === constraintNames.length) {
	          filtered.push(event);
	        }
	      });

	      return filtered;
	    }

	    /**
	     * @returns {Object<string, string>}
	     */

	  }, {
	    key: "getLanguages",
	    value: function getLanguages() {
	      var idsList = _jquery2.default.unique(this.events.map(function (event) {
	        return event.lang;
	      }));
	      var map = {};

	      idsList.forEach(function (langId) {
	        if (langId in _lang3.default) {
	          map[langId] = _lang3.default[langId].name;
	        }
	      });

	      return map;
	    }

	    /**
	     * @see EventsStore.materialsDict
	     * @returns {Object<string, string>}
	     */

	  }, {
	    key: "getMaterials",
	    value: function getMaterials() {
	      var list = [];

	      this.events.forEach(function (event) {
	        if (event.content) {
	          list = list.concat((0, _keys2.default)(event.content));
	        }
	      });

	      var listMap = {};
	      list = _jquery2.default.unique(list);
	      list.forEach(function (materialId) {
	        return listMap[materialId] = EventsStore.MATERIAL_TYPE[materialId];
	      });

	      return listMap;
	    }
	  }], [{
	    key: "create",
	    value: function create(eventsUrl, citiesUrl) {
	      var events = void 0;
	      var cities = void 0;

	      return _jquery2.default.getJSON(eventsUrl).then(function (result) {
	        return events = result;
	      }).then(function () {
	        return _jquery2.default.getJSON(citiesUrl);
	      }).then(function (result) {
	        return cities = result;
	      }).then(function () {
	        return new EventsStore(events, cities);
	      });
	    }
	  }]);
	  return EventsStore;
	}();

	EventsStore.FILTERS = {
	  time: function time(_time, event) {
	    var matched = false;
	    var hasTag = event.hasTag('kotlin1.1');

	    switch (_time) {
	      case 'upcoming':
	        matched = (!hasTag || event.pinned) && event.isUpcoming();
	        break;

	      case 'past':
	        matched = (!hasTag || event.pinned) && !event.isUpcoming();
	        break;

	      case 'all':
	        matched = !hasTag || event.pinned;
	        break;

	      // TODO refactor this
	      case 'kotlin':
	        matched = event.hasTag('kotlin1.1');
	        break;

	      case null:
	      default:
	        matched = false;
	        break;
	    }

	    return matched;
	  },

	  lang: function lang(_lang, event) {
	    return _lang === 'all' || event.lang === _lang;
	  },

	  materials: function materials(materialType, event) {
	    return materialType === 'all' || event.content && event.content.hasOwnProperty(materialType);
	  },

	  bounds: function bounds(_bounds, event) {
	    return _bounds.contains(event.getBounds());
	  }
	};
	EventsStore.MATERIAL_TYPE = {
	  examples: 'Examples',
	  slides: 'Slides',
	  video: 'Video',
	  pdf: 'PDF',
	  article: 'Article'
	};
	exports.default = EventsStore;
	module.exports = exports["default"];

/***/ },
/* 248 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(184);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(185);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _view = __webpack_require__(249);

	var _view2 = _interopRequireDefault(_view);

	var _jquery = __webpack_require__(7);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _date = __webpack_require__(250);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(251);

	var DEFAULT_LANG = 'en';

	var Event = function () {
	  /**
	   * @param {Object} data
	   */
	  function Event(data) {
	    (0, _classCallCheck3.default)(this, Event);

	    this.id = data.id;
	    this.title = data.title;
	    this.url = data.url;
	    this.subject = data.subject;
	    this.speaker = data.speaker;
	    this.description = data.description;
	    this.tags = data.tags ? data.tags.split(',').map(function (t) {
	      return t.trim();
	    }) : [];

	    if (!data.location) {
	      console.warn(data.title + ' has no location');
	    }

	    this.city = data.location;
	    this.lang = data.lang || DEFAULT_LANG;
	    this.content = data.content;
	    this.image = data.image;
	    this.pinned = !!(data.pinned && data.pinned === 'true');

	    this.startDate = new Date(data.startDate + ' 0:0:0');
	    this.endDate = new Date(data.endDate + ' 0:0:0');
	    this.formattedDate = (0, _date.formatDate)(this.startDate, this.endDate);
	  }

	  (0, _createClass3.default)(Event, [{
	    key: 'isUpcoming',
	    value: function isUpcoming() {
	      return this.endDate >= new Date();
	    }
	  }, {
	    key: 'getBounds',
	    value: function getBounds() {
	      return this.city.getBounds();
	    }
	  }, {
	    key: 'hasTag',
	    value: function hasTag(tag) {
	      return this.tags.indexOf(tag) > -1;
	    }
	  }, {
	    key: 'render',
	    value: function render(mountNode) {
	      var rendered = _view2.default.render({ event: this, mode: 'normal' });

	      if (mountNode) {
	        var tempElement = document.createElement('div');
	        tempElement.innerHTML = rendered;
	        var node = tempElement.childNodes[0];
	        this.node = node;
	        mountNode.appendChild(node);
	      }

	      return rendered;
	    }
	  }, {
	    key: 'renderDetailed',
	    value: function renderDetailed() {
	      return _view2.default.render({ event: this, mode: 'detailed' });
	    }
	  }, {
	    key: 'highlight',
	    value: function highlight() {
	      (0, _jquery2.default)(this.node).addClass('_highlighted');
	    }
	  }, {
	    key: 'unhighlight',
	    value: function unhighlight() {
	      (0, _jquery2.default)(this.node).removeClass('_highlighted');
	    }
	  }, {
	    key: 'show',
	    value: function show() {
	      (0, _jquery2.default)(this.node).show();
	    }
	  }, {
	    key: 'hide',
	    value: function hide() {
	      (0, _jquery2.default)(this.node).hide();
	    }
	  }]);
	  return Event;
	}();

	exports.default = Event;
	module.exports = exports['default'];

/***/ },
/* 249 */
/***/ function(module, exports, __webpack_require__) {

	var nunjucks = __webpack_require__(25);
	var env;
	if (!nunjucks.currentEnv){
		env = nunjucks.currentEnv = new nunjucks.Environment([], { autoescape: true });
	} else {
		env = nunjucks.currentEnv;
	}
	var dependencies = nunjucks.webpackDependencies || (nunjucks.webpackDependencies = {});




	var shim = __webpack_require__(26);


	(function() {(nunjucks.nunjucksPrecompiled = nunjucks.nunjucksPrecompiled || {})["static/js/page/events/event/view.twig"] = (function() {
	function root(env, context, frame, runtime, cb) {
	var lineno = null;
	var colno = null;
	var output = "";
	try {
	var parentTemplate = null;
	output += "<div class=\"event _";
	output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "mode"), env.opts.autoescape);
	output += " ";
	if(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "event")),"tags")),"length") > 0) {
	output += "_tagged";
	;
	}
	output += "\" data-id=\"";
	output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "event")),"id"), env.opts.autoescape);
	output += "\">\n    ";
	if(runtime.contextOrFrameLookup(context, frame, "mode") == "detailed") {
	output += "\n        <span class=\"event-close js-close\"></span>\n    ";
	;
	}
	output += "\n\n    ";
	if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "event")),"image")) {
	output += "\n        <div class=\"event-image\">\n            <img src=\"";
	output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "event")),"image"), env.opts.autoescape);
	output += "\" alt=\"";
	output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "event")),"title"), env.opts.autoescape);
	output += "\">\n        </div>\n    ";
	;
	}
	output += "\n\n    <div class=\"event-date\">";
	output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "event")),"formattedDate"), env.opts.autoescape);
	output += "</div>\n    <div class=\"event-title\">\n        ";
	if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "event")),"url")) {
	output += "\n            <a class=\"event-url\" href=\"";
	output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "event")),"url"), env.opts.autoescape);
	output += "\" target=\"_blank\">";
	output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "event")),"title"), env.opts.autoescape);
	output += "</a>,\n        ";
	;
	}
	else {
	output += "\n            ";
	output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "event")),"title"), env.opts.autoescape);
	output += "\n        ";
	;
	}
	output += "\n        ";
	if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "event")),"city")) {
	output += "\n            <span class=\"event-location\">";
	output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "event")),"city"), env.opts.autoescape);
	output += "</span>\n        ";
	;
	}
	output += "\n\n        ";
	if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "event")),"subject") == runtime.contextOrFrameLookup(context, frame, "undefined")) {
	output += "\n            <div class=\"event-info-indicators\">\n                ";
	if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "event")),"lang")) {
	output += "\n                    <div class=\"event-lang\">";
	output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "event")),"lang"), env.opts.autoescape);
	output += "</div>\n                ";
	;
	}
	output += "\n                ";
	if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "event")),"content")) {
	output += "\n                    ";
	frame = frame.push();
	var t_3 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "event")),"content");
	if(t_3) {var t_1;
	if(runtime.isArray(t_3)) {
	var t_2 = t_3.length;
	for(t_1=0; t_1 < t_3.length; t_1++) {
	var t_4 = t_3[t_1][0]
	frame.set("type", t_3[t_1][0]);
	var t_5 = t_3[t_1][1]
	frame.set("href", t_3[t_1][1]);
	frame.set("loop.index", t_1 + 1);
	frame.set("loop.index0", t_1);
	frame.set("loop.revindex", t_2 - t_1);
	frame.set("loop.revindex0", t_2 - t_1 - 1);
	frame.set("loop.first", t_1 === 0);
	frame.set("loop.last", t_1 === t_2 - 1);
	frame.set("loop.length", t_2);
	output += "\n                        <a class=\"event-content-item _";
	output += runtime.suppressValue(t_4, env.opts.autoescape);
	output += "\" href=\"";
	output += runtime.suppressValue(t_5, env.opts.autoescape);
	output += "\" target=\"_blank\" title=\"";
	output += runtime.suppressValue(env.getFilter("capitalize").call(context, t_4), env.opts.autoescape);
	output += "\"></a>\n                    ";
	;
	}
	} else {
	t_1 = -1;
	var t_2 = runtime.keys(t_3).length;
	for(var t_6 in t_3) {
	t_1++;
	var t_7 = t_3[t_6];
	frame.set("type", t_6);
	frame.set("href", t_7);
	frame.set("loop.index", t_1 + 1);
	frame.set("loop.index0", t_1);
	frame.set("loop.revindex", t_2 - t_1);
	frame.set("loop.revindex0", t_2 - t_1 - 1);
	frame.set("loop.first", t_1 === 0);
	frame.set("loop.last", t_1 === t_2 - 1);
	frame.set("loop.length", t_2);
	output += "\n                        <a class=\"event-content-item _";
	output += runtime.suppressValue(t_6, env.opts.autoescape);
	output += "\" href=\"";
	output += runtime.suppressValue(t_7, env.opts.autoescape);
	output += "\" target=\"_blank\" title=\"";
	output += runtime.suppressValue(env.getFilter("capitalize").call(context, t_6), env.opts.autoescape);
	output += "\"></a>\n                    ";
	;
	}
	}
	}
	frame = frame.pop();
	output += "\n                ";
	;
	}
	output += "\n            </div>\n        ";
	;
	}
	output += "\n    </div>\n\n    ";
	if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "event")),"subject")) {
	output += "\n        <div class=\"event-subject\">\n            <span class=\"text\">";
	output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "event")),"subject"), env.opts.autoescape);
	output += "</span>\n\n            <div class=\"event-info-indicators\">\n                ";
	if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "event")),"lang")) {
	output += "\n                    <div class=\"event-lang\">";
	output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "event")),"lang"), env.opts.autoescape);
	output += "</div>\n                ";
	;
	}
	output += "\n                ";
	if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "event")),"content")) {
	output += "\n                    ";
	frame = frame.push();
	var t_10 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "event")),"content");
	if(t_10) {var t_8;
	if(runtime.isArray(t_10)) {
	var t_9 = t_10.length;
	for(t_8=0; t_8 < t_10.length; t_8++) {
	var t_11 = t_10[t_8][0]
	frame.set("type", t_10[t_8][0]);
	var t_12 = t_10[t_8][1]
	frame.set("href", t_10[t_8][1]);
	frame.set("loop.index", t_8 + 1);
	frame.set("loop.index0", t_8);
	frame.set("loop.revindex", t_9 - t_8);
	frame.set("loop.revindex0", t_9 - t_8 - 1);
	frame.set("loop.first", t_8 === 0);
	frame.set("loop.last", t_8 === t_9 - 1);
	frame.set("loop.length", t_9);
	output += "\n                        <a class=\"event-content-item _";
	output += runtime.suppressValue(t_11, env.opts.autoescape);
	output += "\" href=\"";
	output += runtime.suppressValue(t_12, env.opts.autoescape);
	output += "\" target=\"_blank\" title=\"";
	output += runtime.suppressValue(env.getFilter("capitalize").call(context, t_11), env.opts.autoescape);
	output += "\"></a>\n                    ";
	;
	}
	} else {
	t_8 = -1;
	var t_9 = runtime.keys(t_10).length;
	for(var t_13 in t_10) {
	t_8++;
	var t_14 = t_10[t_13];
	frame.set("type", t_13);
	frame.set("href", t_14);
	frame.set("loop.index", t_8 + 1);
	frame.set("loop.index0", t_8);
	frame.set("loop.revindex", t_9 - t_8);
	frame.set("loop.revindex0", t_9 - t_8 - 1);
	frame.set("loop.first", t_8 === 0);
	frame.set("loop.last", t_8 === t_9 - 1);
	frame.set("loop.length", t_9);
	output += "\n                        <a class=\"event-content-item _";
	output += runtime.suppressValue(t_13, env.opts.autoescape);
	output += "\" href=\"";
	output += runtime.suppressValue(t_14, env.opts.autoescape);
	output += "\" target=\"_blank\" title=\"";
	output += runtime.suppressValue(env.getFilter("capitalize").call(context, t_13), env.opts.autoescape);
	output += "\"></a>\n                    ";
	;
	}
	}
	}
	frame = frame.pop();
	output += "\n                ";
	;
	}
	output += "\n            </div>\n        </div>\n    ";
	;
	}
	output += "\n\n    <div class=\"event-speaker\">\n        ";
	output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "event")),"speaker"), env.opts.autoescape);
	output += "\n    </div>\n\n    ";
	if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "event")),"description")) {
	output += "\n        <div class=\"event-description\">\n            ";
	output += runtime.suppressValue(env.getFilter("safe").call(context, runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "event")),"description")), env.opts.autoescape);
	output += "\n        </div>\n    ";
	;
	}
	output += "\n</div>";
	if(parentTemplate) {
	parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
	} else {
	cb(null, output);
	}
	;
	} catch (e) {
	  cb(runtime.handleError(e, lineno, colno));
	}
	}
	return {
	root: root
	};

	})();
	})();



	module.exports = shim(nunjucks, env, nunjucks.nunjucksPrecompiled["static/js/page/events/event/view.twig"] , dependencies)

/***/ },
/* 250 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.formatDate = formatDate;
	function formatDate(startDate, endDate) {
	  var formatted = '';
	  var year = void 0,
	      month = void 0,
	      day = void 0;
	  var isRange = startDate.getTime() !== endDate.getTime();
	  var nowYear = new Date().getFullYear();

	  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	  if (isRange) {
	    console.log(startDate, endDate);

	    month = [months[startDate.getMonth()], months[endDate.getMonth()]];
	    year = [startDate.getFullYear(), endDate.getFullYear()];
	    day = [startDate.getDate(), endDate.getDate()];

	    if (month[0] !== month[1]) {
	      formatted = month[0] + ' ' + day[0] + '-' + month[1] + ' ' + day[1];
	    } else {
	      formatted = month[0] + ' ' + day[0] + '-' + day[1];
	    }

	    if (year[0] !== nowYear || year[1] !== nowYear) {
	      formatted += ', ' + year[1];
	    }
	  } else {
	    year = startDate.getFullYear();
	    month = months[startDate.getMonth()];
	    day = startDate.getDate();

	    formatted = month + ' ' + day;
	    if (year !== nowYear) {
	      formatted += ', ' + year;
	    }
	  }

	  return formatted;
	}

/***/ },
/* 251 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 252 */,
/* 253 */,
/* 254 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(184);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(185);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var City = function () {
	  /**
	   * @param {Object} data
	   * @param {string} data.name
	   * @param {Object} data.position
	   * @param {Number} data.position.lat
	   * @param {Number} data.position.lng
	   */
	  function City(data) {
	    (0, _classCallCheck3.default)(this, City);

	    this.name = data.name;
	    this.position = data.geo;
	    this.bounds = null;
	  }

	  (0, _createClass3.default)(City, [{
	    key: "toString",
	    value: function toString() {
	      return this.name;
	    }
	  }, {
	    key: "getBounds",
	    value: function getBounds() {
	      var position = this.position;

	      if (!this.bounds) this.bounds = new google.maps.LatLng(position.lat, position.lng);

	      return this.bounds;
	    }
	  }]);
	  return City;
	}();

	exports.default = City;
	module.exports = exports["default"];

/***/ },
/* 255 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  "ab": {
	    "name": "Abkhaz",
	    "nativeName": "аҧсуа"
	  },
	  "aa": {
	    "name": "Afar",
	    "nativeName": "Afaraf"
	  },
	  "af": {
	    "name": "Afrikaans",
	    "nativeName": "Afrikaans"
	  },
	  "ak": {
	    "name": "Akan",
	    "nativeName": "Akan"
	  },
	  "sq": {
	    "name": "Albanian",
	    "nativeName": "Shqip"
	  },
	  "am": {
	    "name": "Amharic",
	    "nativeName": "አማርኛ"
	  },
	  "ar": {
	    "name": "Arabic",
	    "nativeName": "العربية"
	  },
	  "an": {
	    "name": "Aragonese",
	    "nativeName": "Aragonés"
	  },
	  "hy": {
	    "name": "Armenian",
	    "nativeName": "Հայերեն"
	  },
	  "as": {
	    "name": "Assamese",
	    "nativeName": "অসমীয়া"
	  },
	  "av": {
	    "name": "Avaric",
	    "nativeName": "авар мацӀ, магӀарул мацӀ"
	  },
	  "ae": {
	    "name": "Avestan",
	    "nativeName": "avesta"
	  },
	  "ay": {
	    "name": "Aymara",
	    "nativeName": "aymar aru"
	  },
	  "az": {
	    "name": "Azerbaijani",
	    "nativeName": "azərbaycan dili"
	  },
	  "bm": {
	    "name": "Bambara",
	    "nativeName": "bamanankan"
	  },
	  "ba": {
	    "name": "Bashkir",
	    "nativeName": "башҡорт теле"
	  },
	  "eu": {
	    "name": "Basque",
	    "nativeName": "euskara, euskera"
	  },
	  "be": {
	    "name": "Belarusian",
	    "nativeName": "Беларуская"
	  },
	  "bn": {
	    "name": "Bengali",
	    "nativeName": "বাংলা"
	  },
	  "bh": {
	    "name": "Bihari",
	    "nativeName": "भोजपुरी"
	  },
	  "bi": {
	    "name": "Bislama",
	    "nativeName": "Bislama"
	  },
	  "bs": {
	    "name": "Bosnian",
	    "nativeName": "bosanski jezik"
	  },
	  "br": {
	    "name": "Breton",
	    "nativeName": "brezhoneg"
	  },
	  "bg": {
	    "name": "Bulgarian",
	    "nativeName": "български език"
	  },
	  "my": {
	    "name": "Burmese",
	    "nativeName": "ဗမာစာ"
	  },
	  "ca": {
	    "name": "Catalan; Valencian",
	    "nativeName": "Català"
	  },
	  "ch": {
	    "name": "Chamorro",
	    "nativeName": "Chamoru"
	  },
	  "ce": {
	    "name": "Chechen",
	    "nativeName": "нохчийн мотт"
	  },
	  "ny": {
	    "name": "Chichewa; Chewa; Nyanja",
	    "nativeName": "chiCheŵa, chinyanja"
	  },
	  "zh": {
	    "name": "Chinese",
	    "nativeName": "中文 (Zhōngwén), 汉语, 漢語"
	  },
	  "cv": {
	    "name": "Chuvash",
	    "nativeName": "чӑваш чӗлхи"
	  },
	  "kw": {
	    "name": "Cornish",
	    "nativeName": "Kernewek"
	  },
	  "co": {
	    "name": "Corsican",
	    "nativeName": "corsu, lingua corsa"
	  },
	  "cr": {
	    "name": "Cree",
	    "nativeName": "ᓀᐦᐃᔭᐍᐏᐣ"
	  },
	  "hr": {
	    "name": "Croatian",
	    "nativeName": "hrvatski"
	  },
	  "cs": {
	    "name": "Czech",
	    "nativeName": "česky, čeština"
	  },
	  "da": {
	    "name": "Danish",
	    "nativeName": "dansk"
	  },
	  "dv": {
	    "name": "Divehi; Dhivehi; Maldivian;",
	    "nativeName": "ދިވެހި"
	  },
	  "nl": {
	    "name": "Dutch",
	    "nativeName": "Nederlands, Vlaams"
	  },
	  "en": {
	    "name": "English",
	    "nativeName": "English"
	  },
	  "eo": {
	    "name": "Esperanto",
	    "nativeName": "Esperanto"
	  },
	  "et": {
	    "name": "Estonian",
	    "nativeName": "eesti, eesti keel"
	  },
	  "ee": {
	    "name": "Ewe",
	    "nativeName": "Eʋegbe"
	  },
	  "fo": {
	    "name": "Faroese",
	    "nativeName": "føroyskt"
	  },
	  "fj": {
	    "name": "Fijian",
	    "nativeName": "vosa Vakaviti"
	  },
	  "fi": {
	    "name": "Finnish",
	    "nativeName": "suomi, suomen kieli"
	  },
	  "fr": {
	    "name": "French",
	    "nativeName": "français, langue française"
	  },
	  "ff": {
	    "name": "Fula; Fulah; Pulaar; Pular",
	    "nativeName": "Fulfulde, Pulaar, Pular"
	  },
	  "gl": {
	    "name": "Galician",
	    "nativeName": "Galego"
	  },
	  "ka": {
	    "name": "Georgian",
	    "nativeName": "ქართული"
	  },
	  "de": {
	    "name": "German",
	    "nativeName": "Deutsch"
	  },
	  "el": {
	    "name": "Greek, Modern",
	    "nativeName": "Ελληνικά"
	  },
	  "gn": {
	    "name": "Guaraní",
	    "nativeName": "Avañeẽ"
	  },
	  "gu": {
	    "name": "Gujarati",
	    "nativeName": "ગુજરાતી"
	  },
	  "ht": {
	    "name": "Haitian; Haitian Creole",
	    "nativeName": "Kreyòl ayisyen"
	  },
	  "ha": {
	    "name": "Hausa",
	    "nativeName": "Hausa, هَوُسَ"
	  },
	  "he": {
	    "name": "Hebrew (modern)",
	    "nativeName": "עברית"
	  },
	  "hz": {
	    "name": "Herero",
	    "nativeName": "Otjiherero"
	  },
	  "hi": {
	    "name": "Hindi",
	    "nativeName": "हिन्दी, हिंदी"
	  },
	  "ho": {
	    "name": "Hiri Motu",
	    "nativeName": "Hiri Motu"
	  },
	  "hu": {
	    "name": "Hungarian",
	    "nativeName": "Magyar"
	  },
	  "ia": {
	    "name": "Interlingua",
	    "nativeName": "Interlingua"
	  },
	  "id": {
	    "name": "Indonesian",
	    "nativeName": "Bahasa Indonesia"
	  },
	  "ie": {
	    "name": "Interlingue",
	    "nativeName": "Originally called Occidental; then Interlingue after WWII"
	  },
	  "ga": {
	    "name": "Irish",
	    "nativeName": "Gaeilge"
	  },
	  "ig": {
	    "name": "Igbo",
	    "nativeName": "Asụsụ Igbo"
	  },
	  "ik": {
	    "name": "Inupiaq",
	    "nativeName": "Iñupiaq, Iñupiatun"
	  },
	  "io": {
	    "name": "Ido",
	    "nativeName": "Ido"
	  },
	  "is": {
	    "name": "Icelandic",
	    "nativeName": "Íslenska"
	  },
	  "it": {
	    "name": "Italian",
	    "nativeName": "Italiano"
	  },
	  "iu": {
	    "name": "Inuktitut",
	    "nativeName": "ᐃᓄᒃᑎᑐᑦ"
	  },
	  "ja": {
	    "name": "Japanese",
	    "nativeName": "日本語 (にほんご／にっぽんご)"
	  },
	  "jv": {
	    "name": "Javanese",
	    "nativeName": "basa Jawa"
	  },
	  "kl": {
	    "name": "Kalaallisut, Greenlandic",
	    "nativeName": "kalaallisut, kalaallit oqaasii"
	  },
	  "kn": {
	    "name": "Kannada",
	    "nativeName": "ಕನ್ನಡ"
	  },
	  "kr": {
	    "name": "Kanuri",
	    "nativeName": "Kanuri"
	  },
	  "ks": {
	    "name": "Kashmiri",
	    "nativeName": "कश्मीरी, كشميري‎"
	  },
	  "kk": {
	    "name": "Kazakh",
	    "nativeName": "Қазақ тілі"
	  },
	  "km": {
	    "name": "Khmer",
	    "nativeName": "ភាសាខ្មែរ"
	  },
	  "ki": {
	    "name": "Kikuyu, Gikuyu",
	    "nativeName": "Gĩkũyũ"
	  },
	  "rw": {
	    "name": "Kinyarwanda",
	    "nativeName": "Ikinyarwanda"
	  },
	  "ky": {
	    "name": "Kirghiz, Kyrgyz",
	    "nativeName": "кыргыз тили"
	  },
	  "kv": {
	    "name": "Komi",
	    "nativeName": "коми кыв"
	  },
	  "kg": {
	    "name": "Kongo",
	    "nativeName": "KiKongo"
	  },
	  "ko": {
	    "name": "Korean",
	    "nativeName": "한국어 (韓國語), 조선말 (朝鮮語)"
	  },
	  "ku": {
	    "name": "Kurdish",
	    "nativeName": "Kurdî, كوردی‎"
	  },
	  "kj": {
	    "name": "Kwanyama, Kuanyama",
	    "nativeName": "Kuanyama"
	  },
	  "la": {
	    "name": "Latin",
	    "nativeName": "latine, lingua latina"
	  },
	  "lb": {
	    "name": "Luxembourgish, Letzeburgesch",
	    "nativeName": "Lëtzebuergesch"
	  },
	  "lg": {
	    "name": "Luganda",
	    "nativeName": "Luganda"
	  },
	  "li": {
	    "name": "Limburgish, Limburgan, Limburger",
	    "nativeName": "Limburgs"
	  },
	  "ln": {
	    "name": "Lingala",
	    "nativeName": "Lingála"
	  },
	  "lo": {
	    "name": "Lao",
	    "nativeName": "ພາສາລາວ"
	  },
	  "lt": {
	    "name": "Lithuanian",
	    "nativeName": "lietuvių kalba"
	  },
	  "lu": {
	    "name": "Luba-Katanga",
	    "nativeName": ""
	  },
	  "lv": {
	    "name": "Latvian",
	    "nativeName": "latviešu valoda"
	  },
	  "gv": {
	    "name": "Manx",
	    "nativeName": "Gaelg, Gailck"
	  },
	  "mk": {
	    "name": "Macedonian",
	    "nativeName": "македонски јазик"
	  },
	  "mg": {
	    "name": "Malagasy",
	    "nativeName": "Malagasy fiteny"
	  },
	  "ms": {
	    "name": "Malay",
	    "nativeName": "bahasa Melayu, بهاس ملايو‎"
	  },
	  "ml": {
	    "name": "Malayalam",
	    "nativeName": "മലയാളം"
	  },
	  "mt": {
	    "name": "Maltese",
	    "nativeName": "Malti"
	  },
	  "mi": {
	    "name": "Māori",
	    "nativeName": "te reo Māori"
	  },
	  "mr": {
	    "name": "Marathi (Marāṭhī)",
	    "nativeName": "मराठी"
	  },
	  "mh": {
	    "name": "Marshallese",
	    "nativeName": "Kajin M̧ajeļ"
	  },
	  "mn": {
	    "name": "Mongolian",
	    "nativeName": "монгол"
	  },
	  "na": {
	    "name": "Nauru",
	    "nativeName": "Ekakairũ Naoero"
	  },
	  "nv": {
	    "name": "Navajo, Navaho",
	    "nativeName": "Diné bizaad, Dinékʼehǰí"
	  },
	  "nb": {
	    "name": "Norwegian Bokmål",
	    "nativeName": "Norsk bokmål"
	  },
	  "nd": {
	    "name": "North Ndebele",
	    "nativeName": "isiNdebele"
	  },
	  "ne": {
	    "name": "Nepali",
	    "nativeName": "नेपाली"
	  },
	  "ng": {
	    "name": "Ndonga",
	    "nativeName": "Owambo"
	  },
	  "nn": {
	    "name": "Norwegian Nynorsk",
	    "nativeName": "Norsk nynorsk"
	  },
	  "no": {
	    "name": "Norwegian",
	    "nativeName": "Norsk"
	  },
	  "ii": {
	    "name": "Nuosu",
	    "nativeName": "ꆈꌠ꒿ Nuosuhxop"
	  },
	  "nr": {
	    "name": "South Ndebele",
	    "nativeName": "isiNdebele"
	  },
	  "oc": {
	    "name": "Occitan",
	    "nativeName": "Occitan"
	  },
	  "oj": {
	    "name": "Ojibwe, Ojibwa",
	    "nativeName": "ᐊᓂᔑᓈᐯᒧᐎᓐ"
	  },
	  "cu": {
	    "name": "Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic",
	    "nativeName": "ѩзыкъ словѣньскъ"
	  },
	  "om": {
	    "name": "Oromo",
	    "nativeName": "Afaan Oromoo"
	  },
	  "or": {
	    "name": "Oriya",
	    "nativeName": "ଓଡ଼ିଆ"
	  },
	  "os": {
	    "name": "Ossetian, Ossetic",
	    "nativeName": "ирон æвзаг"
	  },
	  "pa": {
	    "name": "Panjabi, Punjabi",
	    "nativeName": "ਪੰਜਾਬੀ, پنجابی‎"
	  },
	  "pi": {
	    "name": "Pāli",
	    "nativeName": "पाऴि"
	  },
	  "fa": {
	    "name": "Persian",
	    "nativeName": "فارسی"
	  },
	  "pl": {
	    "name": "Polish",
	    "nativeName": "polski"
	  },
	  "ps": {
	    "name": "Pashto, Pushto",
	    "nativeName": "پښتو"
	  },
	  "pt": {
	    "name": "Portuguese",
	    "nativeName": "Português"
	  },
	  "qu": {
	    "name": "Quechua",
	    "nativeName": "Runa Simi, Kichwa"
	  },
	  "rm": {
	    "name": "Romansh",
	    "nativeName": "rumantsch grischun"
	  },
	  "rn": {
	    "name": "Kirundi",
	    "nativeName": "kiRundi"
	  },
	  "ro": {
	    "name": "Romanian, Moldavian, Moldovan",
	    "nativeName": "română"
	  },
	  "ru": {
	    "name": "Russian",
	    "nativeName": "русский язык"
	  },
	  "sa": {
	    "name": "Sanskrit (Saṁskṛta)",
	    "nativeName": "संस्कृतम्"
	  },
	  "sc": {
	    "name": "Sardinian",
	    "nativeName": "sardu"
	  },
	  "sd": {
	    "name": "Sindhi",
	    "nativeName": "सिन्धी, سنڌي، سندھی‎"
	  },
	  "se": {
	    "name": "Northern Sami",
	    "nativeName": "Davvisámegiella"
	  },
	  "sm": {
	    "name": "Samoan",
	    "nativeName": "gagana faa Samoa"
	  },
	  "sg": {
	    "name": "Sango",
	    "nativeName": "yângâ tî sängö"
	  },
	  "sr": {
	    "name": "Serbian",
	    "nativeName": "српски језик"
	  },
	  "gd": {
	    "name": "Scottish Gaelic; Gaelic",
	    "nativeName": "Gàidhlig"
	  },
	  "sn": {
	    "name": "Shona",
	    "nativeName": "chiShona"
	  },
	  "si": {
	    "name": "Sinhala, Sinhalese",
	    "nativeName": "සිංහල"
	  },
	  "sk": {
	    "name": "Slovak",
	    "nativeName": "slovenčina"
	  },
	  "sl": {
	    "name": "Slovene",
	    "nativeName": "slovenščina"
	  },
	  "so": {
	    "name": "Somali",
	    "nativeName": "Soomaaliga, af Soomaali"
	  },
	  "st": {
	    "name": "Southern Sotho",
	    "nativeName": "Sesotho"
	  },
	  "es": {
	    "name": "Spanish",
	    "nativeName": "español, castellano"
	  },
	  "su": {
	    "name": "Sundanese",
	    "nativeName": "Basa Sunda"
	  },
	  "sw": {
	    "name": "Swahili",
	    "nativeName": "Kiswahili"
	  },
	  "ss": {
	    "name": "Swati",
	    "nativeName": "SiSwati"
	  },
	  "sv": {
	    "name": "Swedish",
	    "nativeName": "svenska"
	  },
	  "ta": {
	    "name": "Tamil",
	    "nativeName": "தமிழ்"
	  },
	  "te": {
	    "name": "Telugu",
	    "nativeName": "తెలుగు"
	  },
	  "tg": {
	    "name": "Tajik",
	    "nativeName": "тоҷикӣ, toğikī, تاجیکی‎"
	  },
	  "th": {
	    "name": "Thai",
	    "nativeName": "ไทย"
	  },
	  "ti": {
	    "name": "Tigrinya",
	    "nativeName": "ትግርኛ"
	  },
	  "bo": {
	    "name": "Tibetan Standard, Tibetan, Central",
	    "nativeName": "བོད་ཡིག"
	  },
	  "tk": {
	    "name": "Turkmen",
	    "nativeName": "Türkmen, Түркмен"
	  },
	  "tl": {
	    "name": "Tagalog",
	    "nativeName": "Wikang Tagalog, ᜏᜒᜃᜅ᜔ ᜆᜄᜎᜓᜄ᜔"
	  },
	  "tn": {
	    "name": "Tswana",
	    "nativeName": "Setswana"
	  },
	  "to": {
	    "name": "Tonga (Tonga Islands)",
	    "nativeName": "faka Tonga"
	  },
	  "tr": {
	    "name": "Turkish",
	    "nativeName": "Türkçe"
	  },
	  "ts": {
	    "name": "Tsonga",
	    "nativeName": "Xitsonga"
	  },
	  "tt": {
	    "name": "Tatar",
	    "nativeName": "татарча, tatarça, تاتارچا‎"
	  },
	  "tw": {
	    "name": "Twi",
	    "nativeName": "Twi"
	  },
	  "ty": {
	    "name": "Tahitian",
	    "nativeName": "Reo Tahiti"
	  },
	  "ug": {
	    "name": "Uighur, Uyghur",
	    "nativeName": "Uyƣurqə, ئۇيغۇرچە‎"
	  },
	  "uk": {
	    "name": "Ukrainian",
	    "nativeName": "українська"
	  },
	  "ur": {
	    "name": "Urdu",
	    "nativeName": "اردو"
	  },
	  "uz": {
	    "name": "Uzbek",
	    "nativeName": "zbek, Ўзбек, أۇزبېك‎"
	  },
	  "ve": {
	    "name": "Venda",
	    "nativeName": "Tshivenḓa"
	  },
	  "vi": {
	    "name": "Vietnamese",
	    "nativeName": "Tiếng Việt"
	  },
	  "vo": {
	    "name": "Volapük",
	    "nativeName": "Volapük"
	  },
	  "wa": {
	    "name": "Walloon",
	    "nativeName": "Walon"
	  },
	  "cy": {
	    "name": "Welsh",
	    "nativeName": "Cymraeg"
	  },
	  "wo": {
	    "name": "Wolof",
	    "nativeName": "Wollof"
	  },
	  "fy": {
	    "name": "Western Frisian",
	    "nativeName": "Frysk"
	  },
	  "xh": {
	    "name": "Xhosa",
	    "nativeName": "isiXhosa"
	  },
	  "yi": {
	    "name": "Yiddish",
	    "nativeName": "ייִדיש"
	  },
	  "yo": {
	    "name": "Yoruba",
	    "nativeName": "Yorùbá"
	  },
	  "za": {
	    "name": "Zhuang, Chuang",
	    "nativeName": "Saɯ cueŋƅ, Saw cuengh"
	  }
	};
	module.exports = exports["default"];

/***/ },
/* 256 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(184);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(185);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _jquery = __webpack_require__(7);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _inViewport = __webpack_require__(257);

	var _inViewport2 = _interopRequireDefault(_inViewport);

	var _emitter = __webpack_require__(237);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _eventsList = __webpack_require__(238);

	var _eventsList2 = _interopRequireDefault(_eventsList);

	var _view = __webpack_require__(258);

	var _view2 = _interopRequireDefault(_view);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(259);

	var EventsList = function () {
	  /**
	   * @param {HTMLElement|string} node
	   * @param {EventsStore} store
	   * @param {Object} initialFilters
	   */
	  function EventsList(node, store) {
	    var _this = this;

	    (0, _classCallCheck3.default)(this, EventsList);

	    this.store = store;
	    this.currentFilters = {};
	    this.$node = (0, _jquery2.default)(node);
	    this.mode = 'list';

	    _emitter2.default.on(_eventsList2.default.EVENTS_FILTERED, function (filters) {
	      var filteredEvents = store.filter(filters);
	      _this.currentFilters = filters;
	      _this.applyFilteredResults(filteredEvents);
	    });

	    _emitter2.default.on(_eventsList2.default.EVENT_SELECTED, function (selectedEvent) {
	      _this.showEventDetails(selectedEvent);
	      _this.mode = 'detailed';
	    });

	    _emitter2.default.on(_eventsList2.default.EVENT_DESELECTED, function () {
	      _this.hideEventDetails();
	      _this.mode = 'list';
	    });

	    _emitter2.default.on(_eventsList2.default.EVENT_HIGHLIGHTED, function (event) {
	      event.highlight();
	    });

	    _emitter2.default.on(_eventsList2.default.EVENT_UNHIGHLIGHTED, function (event) {
	      event.unhighlight();
	    });

	    // Filter events when map zoomed
	    _emitter2.default.on(_eventsList2.default.MAP_BOUNDS_CHANGED, function (bounds) {
	      return;
	      var request = _jquery2.default.extend({}, _this.currentFilters, { bounds: bounds });
	      _this.currentFilters = request;
	      var filteredEvents = store.filter(request);
	      _this.applyFilteredResults(filteredEvents);
	    });

	    this.render();
	  }

	  (0, _createClass3.default)(EventsList, [{
	    key: "render",
	    value: function render() {
	      var $content = (0, _jquery2.default)(_view2.default.render());
	      this.$content = $content;

	      var upcomingEvents = this.store.getUpcomingEvents();
	      var pastEvents = this.store.getPastEvents();

	      var $upcoming = $content.find('.js-upcoming-events');
	      var $past = $content.find('.js-past-events');
	      this.$upcomingGroup = $content.find('.js-upcoming-events-group');
	      this.$pastGroup = $content.find('.js-past-events-group');

	      upcomingEvents.forEach(function (event) {
	        return event.render($upcoming.get(0));
	      });
	      pastEvents.forEach(function (event) {
	        return event.render($past.get(0));
	      });

	      this.store.events.forEach(function (event) {
	        var $node = (0, _jquery2.default)(event.node);

	        $node.on('click', function () {
	          _emitter2.default.emit(_eventsList2.default.EVENT_DESELECTED);
	          _emitter2.default.emit(_eventsList2.default.EVENT_SELECTED, event);
	        });

	        $node.on('mouseenter', function (e) {
	          e.stopPropagation();
	          _emitter2.default.emit(_eventsList2.default.EVENT_HIGHLIGHTED, event);
	        });

	        $node.on('mouseleave', function (e) {
	          e.stopPropagation();
	          _emitter2.default.emit(_eventsList2.default.EVENT_UNHIGHLIGHTED, event);
	        });
	      });

	      this.$node.append($content);
	    }

	    /**
	     * @param {Array<Event>} filteredEvents
	     */

	  }, {
	    key: "applyFilteredResults",
	    value: function applyFilteredResults(filteredEvents) {
	      var store = this.store;
	      var upcomingEventsInResults = store.getUpcomingEvents(filteredEvents);
	      var pastEventsInResults = store.getPastEvents(filteredEvents);

	      store.events.forEach(function (event) {
	        filteredEvents.indexOf(event) > -1 ? event.show() : event.hide();
	      });

	      upcomingEventsInResults.length > 0 ? this.$upcomingGroup.show() : this.$upcomingGroup.hide();

	      pastEventsInResults.length > 0 ? this.$pastGroup.show() : this.$pastGroup.hide();
	    }

	    /**
	     * @param {Event} event
	     */

	  }, {
	    key: "showEventDetails",
	    value: function showEventDetails(event) {
	      var $node = (0, _jquery2.default)(event.node);
	      var inViewport = (0, _inViewport2.default)(event.node);
	      this.currentEvent = event;

	      $node.addClass('_detailed').removeClass('_normal');

	      if (!inViewport) {
	        (0, _jquery2.default)('html,body').animate({ scrollTop: $node.offset().top });
	      }
	    }
	  }, {
	    key: "hideEventDetails",
	    value: function hideEventDetails() {
	      if (!this.currentEvent) {
	        return;
	      }

	      var event = this.currentEvent;
	      (0, _jquery2.default)(event.node).addClass('_normal').removeClass('_detailed');

	      this.currentEvent = null;
	    }
	  }]);
	  return EventsList;
	}();

	exports.default = EventsList;
	module.exports = exports["default"];

/***/ },
/* 257 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = inViewport;

	var instances = [];
	var supportsMutationObserver = typeof global.MutationObserver === 'function';

	function inViewport(elt, params, cb) {
	  var opts = {
	    container: global.document.body,
	    offset: 0
	  };

	  if (params === undefined || typeof params === 'function') {
	    cb = params;
	    params = {};
	  }

	  var container = opts.container = params.container || opts.container;
	  var offset = opts.offset = params.offset || opts.offset;

	  for (var i = 0; i < instances.length; i++) {
	    if (instances[i].container === container) {
	      return instances[i].isInViewport(elt, offset, cb);
	    }
	  }

	  return instances[
	    instances.push(createInViewport(container)) - 1
	  ].isInViewport(elt, offset, cb);
	}

	function addEvent(el, type, fn) {
	  if (el.attachEvent) {
	    el.attachEvent('on' + type, fn);
	  } else {
	    el.addEventListener(type, fn, false);
	  }
	}

	function debounce(func, wait, immediate) {
	  var timeout;
	  return function () {
	    var context = this, args = arguments;
	    var callNow = immediate && !timeout;
	    clearTimeout(timeout);
	    timeout = setTimeout(later, wait);
	    if (callNow) func.apply(context, args);

	    function later() {
	      timeout = null;
	      if (!immediate) func.apply(context, args);
	    }
	  };
	}

	// https://github.com/jquery/sizzle/blob/3136f48b90e3edc84cbaaa6f6f7734ef03775a07/sizzle.js#L708
	var contains = function() {
	  if (!global.document) {
	    return true;
	  }
	  return global.document.documentElement.compareDocumentPosition ?
	    function (a, b) {
	      return !!(a.compareDocumentPosition(b) & 16);
	    } :
	    global.document.documentElement.contains ?
	      function (a, b) {
	        return a !== b && ( a.contains ? a.contains(b) : false );
	      } :
	      function (a, b) {
	        while (b = b.parentNode) {
	          if (b === a) {
	            return true;
	          }
	        }
	        return false;
	      };
	}

	function createInViewport(container) {
	  var watches = createWatches();

	  var scrollContainer = container === global.document.body ? global : container;
	  var debouncedCheck = debounce(watches.checkAll(watchInViewport), 15);

	  addEvent(scrollContainer, 'scroll', debouncedCheck);

	  if (scrollContainer === global) {
	    addEvent(global, 'resize', debouncedCheck);
	  }

	  if (supportsMutationObserver) {
	    observeDOM(watches, container, debouncedCheck);
	  }

	  // failsafe check, every 200ms we check for visible images
	  // usecase: a hidden parent containing eleements
	  // when the parent becomes visible, we have no event that the children
	  // became visible
	  setInterval(debouncedCheck, 150);

	  function isInViewport(elt, offset, cb) {
	    if (!cb) {
	      return isVisible(elt, offset);
	    }

	    var remote = createRemote(elt, offset, cb);
	    remote.watch();
	    return remote;
	  }

	  function createRemote(elt, offset, cb) {
	    function watch() {
	      watches.add(elt, offset, cb);
	    }

	    function dispose() {
	      watches.remove(elt);
	    }

	    return {
	      watch: watch,
	      dispose: dispose
	    };
	  }

	  function watchInViewport(elt, offset, cb) {
	    if (isVisible(elt, offset)) {
	      watches.remove(elt);
	      cb(elt);
	    }
	  }

	  function isVisible(elt, offset) {
	    if (!contains(global.document.documentElement, elt) || !contains(global.document.documentElement, container)) {
	      return false;
	    }

	    // Check if the element is visible
	    // https://github.com/jquery/jquery/blob/740e190223d19a114d5373758127285d14d6b71e/src/css/hiddenVisibleSelectors.js
	    if (!elt.offsetWidth || !elt.offsetHeight) {
	      return false;
	    }

	    var eltRect = elt.getBoundingClientRect();
	    var viewport = {};

	    if (container === global.document.body) {
	      viewport = {
	        top: -offset,
	        left: -offset,
	        right: global.document.documentElement.clientWidth + offset,
	        bottom: global.document.documentElement.clientHeight + offset
	      };
	    } else {
	      var containerRect = container.getBoundingClientRect();
	      viewport = {
	        top: containerRect.top - offset,
	        left: containerRect.left - offset,
	        right: containerRect.right + offset,
	        bottom: containerRect.bottom + offset
	      };
	    }

	    // The element must overlap with the visible part of the viewport
	    var visible =
	      (
	        eltRect.right >= viewport.left &&
	        eltRect.left <= viewport.right &&
	        eltRect.bottom >= viewport.top &&
	        eltRect.top <= viewport.bottom
	      );

	    return visible;
	  }

	  return {
	    container: container,
	    isInViewport: isInViewport
	  };
	}

	function createWatches() {
	  var watches = [];

	  function add(elt, offset, cb) {
	    if (!isWatched(elt)) {
	      watches.push([elt, offset, cb]);
	    }
	  }

	  function remove(elt) {
	    var pos = indexOf(elt);
	    if (pos !== -1) {
	      watches.splice(pos, 1);
	    }
	  }

	  function indexOf(elt) {
	    for (var i = watches.length - 1; i >= 0; i--) {
	      if (watches[i][0] === elt) {
	        return i;
	      }
	    }
	    return -1;
	  }

	  function isWatched(elt) {
	    return indexOf(elt) !== -1;
	  }

	  function checkAll(cb) {
	    return function () {
	      for (var i = watches.length - 1; i >= 0; i--) {
	        cb.apply(this, watches[i]);
	      }
	    };
	  }

	  return {
	    add: add,
	    remove: remove,
	    isWatched: isWatched,
	    checkAll: checkAll
	  };
	}

	function observeDOM(watches, container, cb) {
	  var observer = new MutationObserver(watch);
	  var filter = Array.prototype.filter;
	  var concat = Array.prototype.concat;

	  observer.observe(container, {
	    childList: true,
	    subtree: true,
	    // changes like style/width/height/display will be catched
	    attributes: true
	  });

	  function watch(mutations) {
	    // some new DOM nodes where previously watched
	    // we should check their positions
	    if (mutations.some(knownNodes) === true) {
	      setTimeout(cb, 0);
	    }
	  }

	  function knownNodes(mutation) {
	    var nodes = concat.call([],
	      Array.prototype.slice.call(mutation.addedNodes),
	      mutation.target
	    );
	    return filter.call(nodes, watches.isWatched).length > 0;
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 258 */
/***/ function(module, exports, __webpack_require__) {

	var nunjucks = __webpack_require__(25);
	var env;
	if (!nunjucks.currentEnv){
		env = nunjucks.currentEnv = new nunjucks.Environment([], { autoescape: true });
	} else {
		env = nunjucks.currentEnv;
	}
	var dependencies = nunjucks.webpackDependencies || (nunjucks.webpackDependencies = {});




	var shim = __webpack_require__(26);


	(function() {(nunjucks.nunjucksPrecompiled = nunjucks.nunjucksPrecompiled || {})["static/js/page/events/events-list/view.twig"] = (function() {
	function root(env, context, frame, runtime, cb) {
	var lineno = null;
	var colno = null;
	var output = "";
	try {
	var parentTemplate = null;
	output += "<div class=\"events-list\">\n\n  <div class=\"filter-panel-wrap js-filter-panel-wrap\"></div>\n\n  <div class=\"event-overview js-event-details\">\n\n  </div>\n\n  <div class=\"list js-list\">\n    <div class=\"list-group js-upcoming-events-group\">\n      <div class=\"list-group-title\">Upcoming Events</div>\n      <div class=\"list-group-content js-upcoming-events\">\n\n      </div>\n    </div>\n\n    <div class=\"list-group js-past-events-group\">\n      <div class=\"list-group-title\">Past Events</div>\n      <div class=\"list-group-content js-past-events\">\n\n      </div>\n    </div>\n  </div>\n\n</div>";
	if(parentTemplate) {
	parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
	} else {
	cb(null, output);
	}
	;
	} catch (e) {
	  cb(runtime.handleError(e, lineno, colno));
	}
	}
	return {
	root: root
	};

	})();
	})();



	module.exports = shim(nunjucks, env, nunjucks.nunjucksPrecompiled["static/js/page/events/events-list/view.twig"] , dependencies)

/***/ },
/* 259 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 260 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _keys = __webpack_require__(202);

	var _keys2 = _interopRequireDefault(_keys);

	var _classCallCheck2 = __webpack_require__(184);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(185);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _jquery = __webpack_require__(7);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _eventEmitter = __webpack_require__(8);

	var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

	var _switcher = __webpack_require__(261);

	var _switcher2 = _interopRequireDefault(_switcher);

	var _index = __webpack_require__(6);

	var _index2 = _interopRequireDefault(_index);

	var _view = __webpack_require__(264);

	var _view2 = _interopRequireDefault(_view);

	var _timeSelectItems = __webpack_require__(265);

	var _timeSelectItems2 = _interopRequireDefault(_timeSelectItems);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(266);

	var EVENTS = {
	  SELECT: 'select'
	};

	var FilterPanel = function () {
	  /**
	   * @param {HTMLElement|string} node
	   * @param {Object} config
	   * @param {Object} config.languages
	   * @param {Object} config.materials
	   * @param {Object} config.initialFilters
	   * @param {EventsStore} config.store
	   */
	  function FilterPanel(node, config) {
	    var _this = this;

	    (0, _classCallCheck3.default)(this, FilterPanel);

	    this.$node = (0, _jquery2.default)(node);
	    this.$panel = this.render();
	    this._emitter = (0, _eventEmitter2.default)({});

	    var $timeSelector = this.$panel.find('.js-time-selector');
	    var $languageSelectorNode = this.$panel.find('.js-language-selector');
	    var $materialSelectorNode = this.$panel.find('.js-material-selector');

	    // Initial filters
	    // TODO: values from hash
	    var initialFilters = config.initialFilters;

	    var timeSelectSelectedIndex = (0, _keys2.default)(_timeSelectItems2.default).indexOf(initialFilters.time);

	    var handleSelect = function handleSelect(type, value) {
	      var eventData = {};
	      eventData[type] = value;
	      _jquery2.default.extend(initialFilters, eventData);
	      _this._emitter.emit(EVENTS.SELECT, initialFilters);
	    };

	    this.timeSelector = new _switcher2.default($timeSelector, {
	      items: _timeSelectItems2.default,
	      selectedIndex: timeSelectSelectedIndex,
	      onSelect: function onSelect(time) {
	        handleSelect('time', time);
	        history.replaceState(null, null, "?time=" + time);
	      }
	    });

	    // setTimeout(() => this.timeSelector.select(1), 300);

	    this.languageSelector = new _index2.default($languageSelectorNode, {
	      items: _jquery2.default.extend({ all: 'All' }, config.languages),
	      onSelect: function onSelect(lang) {
	        return handleSelect('lang', lang);
	      }
	    });

	    this.materialsSelector = new _index2.default($materialSelectorNode, {
	      items: _jquery2.default.extend({ all: 'All' }, config.materials),
	      onSelect: function onSelect(materials) {
	        return handleSelect('materials', materials);
	      }
	    });
	  }

	  (0, _createClass3.default)(FilterPanel, [{
	    key: "onSelect",
	    value: function onSelect(callback) {
	      this._emitter.on(EVENTS.SELECT, callback);
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var rendered = _view2.default.render();
	      var $rendered = (0, _jquery2.default)(rendered);
	      this.$node.append($rendered);
	      return $rendered;
	    }
	  }]);
	  return FilterPanel;
	}();

	exports.default = FilterPanel;
	module.exports = exports["default"];

/***/ },
/* 261 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(184);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(185);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _jquery = __webpack_require__(7);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _eventEmitter = __webpack_require__(8);

	var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

	var _view = __webpack_require__(262);

	var _view2 = _interopRequireDefault(_view);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(263);

	var CLASSES = {
	  ITEM_SELECTED: '_selected'
	};

	var EVENTS = {
	  SELECT: 'select'
	};

	var Switcher = function () {
	  /**
	   * @param {HTMLElement|string} node
	   * @param {Object} config
	   * @param {Object<string, string>} config.items Values.
	   * @param {number} [config.selectedIndex=0]
	   * @param {Function} [config.onSelect]
	   */
	  function Switcher(node, config) {
	    (0, _classCallCheck3.default)(this, Switcher);

	    var that = this;
	    var $node = (0, _jquery2.default)(node);

	    this.config = config;
	    this.items = config.items;
	    this.$node = $node;
	    this.$switcher = this.render();
	    this._emitter = (0, _eventEmitter2.default)({});

	    var $items = this.$switcher.find('.js-item');

	    $items.each(function (i, elem) {
	      (0, _jquery2.default)(elem).on('click', that.select.bind(that, i));
	    });

	    config.onSelect && this.onSelect(config.onSelect);

	    this.select(config.selectedIndex || 0, false);
	  }

	  (0, _createClass3.default)(Switcher, [{
	    key: "onSelect",
	    value: function onSelect(callback) {
	      this._emitter.on(EVENTS.SELECT, callback);
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var rendered = _view2.default.render({ switcher: this });
	      var $rendered = (0, _jquery2.default)(rendered);
	      this.$node.append($rendered);

	      return $rendered;
	    }
	  }, {
	    key: "select",
	    value: function select(index, emit) {
	      if (this.selectedIndex == index) {
	        return;
	      }
	      this.selectedIndex = index;

	      var shouldEmit = typeof emit == 'boolean' ? emit : true;
	      var $switcher = this.$switcher;
	      var $items = $switcher.find('.js-item');
	      var $selectedItem = (0, _jquery2.default)($items.get(index));
	      var selectedValue = $selectedItem.attr('data-value');

	      $items.each(function (i, elem) {
	        var $item = (0, _jquery2.default)(elem);

	        if (i === index) {
	          $item.addClass(CLASSES.ITEM_SELECTED);
	        } else {
	          $item.removeClass(CLASSES.ITEM_SELECTED);
	        }
	      });

	      shouldEmit && this._emitter.emit('select', selectedValue);
	    }
	  }]);
	  return Switcher;
	}();

	exports.default = Switcher;
	module.exports = exports["default"];

/***/ },
/* 262 */
/***/ function(module, exports, __webpack_require__) {

	var nunjucks = __webpack_require__(25);
	var env;
	if (!nunjucks.currentEnv){
		env = nunjucks.currentEnv = new nunjucks.Environment([], { autoescape: true });
	} else {
		env = nunjucks.currentEnv;
	}
	var dependencies = nunjucks.webpackDependencies || (nunjucks.webpackDependencies = {});




	var shim = __webpack_require__(26);


	(function() {(nunjucks.nunjucksPrecompiled = nunjucks.nunjucksPrecompiled || {})["static/js/page/events/switcher/view.twig"] = (function() {
	function root(env, context, frame, runtime, cb) {
	var lineno = null;
	var colno = null;
	var output = "";
	try {
	var parentTemplate = null;
	output += "<div class=\"switcher\">\n  ";
	frame = frame.push();
	var t_3 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "switcher")),"items");
	if(t_3) {var t_1;
	if(runtime.isArray(t_3)) {
	var t_2 = t_3.length;
	for(t_1=0; t_1 < t_3.length; t_1++) {
	var t_4 = t_3[t_1][0]
	frame.set("value", t_3[t_1][0]);
	var t_5 = t_3[t_1][1]
	frame.set("label", t_3[t_1][1]);
	frame.set("loop.index", t_1 + 1);
	frame.set("loop.index0", t_1);
	frame.set("loop.revindex", t_2 - t_1);
	frame.set("loop.revindex0", t_2 - t_1 - 1);
	frame.set("loop.first", t_1 === 0);
	frame.set("loop.last", t_1 === t_2 - 1);
	frame.set("loop.length", t_2);
	output += "\n    <div class=\"switcher-item js-item\" data-value=\"";
	output += runtime.suppressValue(t_4, env.opts.autoescape);
	output += "\">";
	output += runtime.suppressValue(t_5, env.opts.autoescape);
	output += "</div>\n  ";
	;
	}
	} else {
	t_1 = -1;
	var t_2 = runtime.keys(t_3).length;
	for(var t_6 in t_3) {
	t_1++;
	var t_7 = t_3[t_6];
	frame.set("value", t_6);
	frame.set("label", t_7);
	frame.set("loop.index", t_1 + 1);
	frame.set("loop.index0", t_1);
	frame.set("loop.revindex", t_2 - t_1);
	frame.set("loop.revindex0", t_2 - t_1 - 1);
	frame.set("loop.first", t_1 === 0);
	frame.set("loop.last", t_1 === t_2 - 1);
	frame.set("loop.length", t_2);
	output += "\n    <div class=\"switcher-item js-item\" data-value=\"";
	output += runtime.suppressValue(t_6, env.opts.autoescape);
	output += "\">";
	output += runtime.suppressValue(t_7, env.opts.autoescape);
	output += "</div>\n  ";
	;
	}
	}
	}
	frame = frame.pop();
	output += "\n</div>";
	if(parentTemplate) {
	parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
	} else {
	cb(null, output);
	}
	;
	} catch (e) {
	  cb(runtime.handleError(e, lineno, colno));
	}
	}
	return {
	root: root
	};

	})();
	})();



	module.exports = shim(nunjucks, env, nunjucks.nunjucksPrecompiled["static/js/page/events/switcher/view.twig"] , dependencies)

/***/ },
/* 263 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 264 */
/***/ function(module, exports, __webpack_require__) {

	var nunjucks = __webpack_require__(25);
	var env;
	if (!nunjucks.currentEnv){
		env = nunjucks.currentEnv = new nunjucks.Environment([], { autoescape: true });
	} else {
		env = nunjucks.currentEnv;
	}
	var dependencies = nunjucks.webpackDependencies || (nunjucks.webpackDependencies = {});




	var shim = __webpack_require__(26);


	(function() {(nunjucks.nunjucksPrecompiled = nunjucks.nunjucksPrecompiled || {})["static/js/page/events/filter-panel/view.twig"] = (function() {
	function root(env, context, frame, runtime, cb) {
	var lineno = null;
	var colno = null;
	var output = "";
	try {
	var parentTemplate = null;
	output += "<div class=\"filter-panel\">\n  <div class=\"filter-panel-time-selector js-time-selector\"></div>\n\n  <div class=\"filter-panel-language-selector\">\n    <div class=\"label\">Language:</div><div class=\"selector js-language-selector\"></div>\n  </div>\n\n  <div class=\"filter-panel-material-selector\">\n    <div class=\"label\">Materials:</div><div class=\"selector js-material-selector\"></div>\n  </div>\n</div>";
	if(parentTemplate) {
	parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
	} else {
	cb(null, output);
	}
	;
	} catch (e) {
	  cb(runtime.handleError(e, lineno, colno));
	}
	}
	return {
	root: root
	};

	})();
	})();



	module.exports = shim(nunjucks, env, nunjucks.nunjucksPrecompiled["static/js/page/events/filter-panel/view.twig"] , dependencies)

/***/ },
/* 265 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  all: 'All',
	  upcoming: 'Upcoming',
	  past: 'Past',
	  kotlin: 'Kotlin 1.1 Event'
	};
	module.exports = exports['default'];

/***/ },
/* 266 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 267 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
]);