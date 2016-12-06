(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("uuid"), require("object.values"));
	else if(typeof define === 'function' && define.amd)
		define(["uuid", "object.values"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("uuid"), require("object.values")) : factory(root["uuid"], root["object.values"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_11__) {
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

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var channels = __webpack_require__(2);
	var methods = __webpack_require__(3);
	var Response = __webpack_require__(10);

	var supportedOutputHandlers = ['send', 'broadcast'];

	var Server = module.exports = function Server(transport, router) {
	    var _this = this;

	    if ((typeof transport === 'undefined' ? 'undefined' : _typeof(transport)) !== 'object') throw new TypeError('Server.constructor() expects transport to be an object');
	    if ((typeof router === 'undefined' ? 'undefined' : _typeof(router)) !== 'object') throw new TypeError('Server.constructor() expects router to be an object');
	    if (typeof router.handle !== 'function') throw new TypeError('Server.constructor() expects router to implement the method .handle()');
	    if (!(this instanceof Server)) return new Server(transport, router);

	    this.router = router;
	    this.transport = transport;

	    // add output handlers defined on transport
	    supportedOutputHandlers.forEach(function (outputHandlerName) {
	        createOutputHandler.call(_this, outputHandlerName);
	    });

	    // listen to the http channel
	    this.transport.on(channels.HTTP, function (event, req) {
	        var res = new Response({ channel: channels.HTTP, sender: event.sender });
	        res.id = req.id;

	        _this.router.handle(req, res);
	    });

	    return this;
	};

	// Delegate all .VERB(), .use() and debug() calls to the routerssss
	methods.concat(['all', 'use', 'debug']).forEach(function (method) {
	    Server.prototype[method] = function () {
	        var _router;

	        if (typeof this.router[method] !== 'function') return;

	        return (_router = this.router)[method].apply(_router, arguments);
	    };
	});

	function createOutputHandler(outputHandlerName) {
	    if (typeof this.transport[outputHandlerName] === 'function') {
	        this[outputHandlerName] = function (url, body) {
	            var res = new Response({ channel: channels.EVENT }, true);
	            res.url = url;
	            res.body = body;

	            this.transport[outputHandlerName](channels.EVENT, res);
	        };
	    }
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
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var uuid = __webpack_require__(1);
	var channels = __webpack_require__(2);
	var values = __webpack_require__(11);

	var Response = module.exports = function Response(ipc, autoGenerateId) {
	    if ((typeof ipc === 'undefined' ? 'undefined' : _typeof(ipc)) !== 'object') throw new TypeError('Response.constructor() expects the argument ipc to be an object');
	    if (!ipc.hasOwnProperty('channel')) throw new TypeError('Response.constructor() expects the argument ipc to contain the property \'channel\'');
	    if (!values(channels).includes(ipc.channel)) throw new TypeError('Response.constructor() expects a supported ipc.channel');
	    if (ipc.channel === channels.HTTP && (!ipc.hasOwnProperty('sender') || typeof ipc.sender.send !== 'function')) {
	        throw new TypeError('Response.constructor() expects ipc.sender.send to be a function when ipc.channel is \'HTTP\'');
	    }

	    this.id = autoGenerateId === true ? uuid.v4() : undefined;
	    this.statusCode;
	    this.ipc = ipc;

	    return this;
	};

	Response.prototype.status = function status(code) {
	    this.statusCode = code;
	    return this;
	};

	Response.prototype.send = function send(body) {
	    this.body = body;
	    this.status = this.statusCode;
	    this.ipc.sender.send(this.ipc.channel + '', this);
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_11__;

/***/ }
/******/ ])
});
;