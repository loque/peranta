(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("uuid"), require("url-parse"));
	else if(typeof define === 'function' && define.amd)
		define(["uuid", "url-parse"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("uuid"), require("url-parse")) : factory(root["uuid"], root["url-parse"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_5__) {
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

	var uuid = __webpack_require__(1);
	var channels = __webpack_require__(2);
	var methods = __webpack_require__(3);
	var Request = __webpack_require__(4);

	var Client = module.exports = function Client(transport) {
	    var _this = this;

	    if (transport === undefined) throw new TypeError('Client.constructor() expects to receive a transport');
	    if (!(this instanceof Client)) return new Client(transport);

	    if (transport.on === undefined || typeof transport.on !== 'function' || transport.emit === undefined || typeof transport.emit !== 'function') {
	        throw new TypeError('Client.constructor() expects transport to implement the method .on() and .emit()');
	    }

	    this.id = uuid.v4();
	    this.transport = transport;
	    this.httpHandlers = {};
	    this.eventHandlers = [];

	    this.transport.on(channels.HTTP, function (event, res) {
	        var promiseResult = res.status >= 200 && res.status < 300 ? 'resolve' : 'reject';
	        _this.httpHandlers[res.id].promise[promiseResult](res);
	        delete _this.httpHandlers[res.id];
	    });

	    this.transport.on(channels.EVENT, function (event, res) {
	        _this.eventHandlers.forEach(function (handler) {
	            if (handler.url !== res.url) return;

	            handler.callback(res);
	        });
	    });

	    this.transport.emit(channels.CONNECT, { id: this.id });

	    return this;
	};

	methods.forEach(function (method) {
	    Client.prototype[method] = function (url, body) {
	        var promise = exposePromise();
	        var req = new Request(url);

	        req.method = method;

	        if (['post', 'put'].includes(req.method)) {
	            req.body = body;
	        }

	        this.httpHandlers[req.id] = { req: req, promise: promise };

	        this.transport.emit(channels.HTTP, req);

	        return promise;
	    };
	});

	Client.prototype.on = function on(url, callback) {
	    this.eventHandlers.push({ url: url, callback: callback });
	};

	function exposePromise() {
	    var resolver = void 0,
	        rejector = void 0,
	        promise = new Promise(function (resolve, reject) {
	        resolver = resolve;
	        rejector = reject;
	    });

	    promise.resolve = resolver;
	    promise.reject = rejector;

	    return promise;
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	    HTTP: 0,
	    EVENT: 1,
	    CONNECT: 2
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	module.exports = ['get', 'post', 'put', 'delete'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var uuid = __webpack_require__(1);
	var urlparse = __webpack_require__(5);

	var Request = module.exports = function Request(url) {
	    if (typeof url !== 'string') throw new TypeError('Request.constructor() requires url to be a string');

	    this.id = uuid.v4();

	    this.method = null;
	    this.url = url;

	    this.body = {};
	    this.params = {};

	    Object.defineProperty(this, 'originalUrl', {
	        configurable: false,
	        enumerable: true,
	        value: url
	    });

	    Object.defineProperty(this, 'path', {
	        configurable: false,
	        enumerable: true,
	        get: function path() {
	            try {
	                return urlparse(this.url).pathname;
	            } catch (err) {
	                return undefined;
	            }
	        }
	    });

	    Object.defineProperty(this, 'query', {
	        configurable: true,
	        enumerable: true,
	        get: function qs() {
	            try {
	                return urlparse(this.url, true).query;
	            } catch (err) {
	                return {};
	            }
	        }
	    });

	    return this;
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }
/******/ ])
});
;