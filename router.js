(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("array-flatten"), require("path-to-regexp"));
	else if(typeof define === 'function' && define.amd)
		define(["array-flatten", "path-to-regexp"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("array-flatten"), require("path-to-regexp")) : factory(root["array-flatten"], root["path-to-regexp"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_8__) {
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

	var flatten = __webpack_require__(6);
	var methods = __webpack_require__(3);
	var Route = __webpack_require__(7);

	var Router = module.exports = function Router() {
	    var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';

	    if (typeof prefix !== 'string') throw new TypeError('Router.constructor() requires prefix to be a string');
	    if (!(this instanceof Router)) return new Router(prefix);

	    this.prefix = checkForwardSlashes(prefix);
	    this.routes = [];
	    this.routeIdx;
	    this.end = function () {};

	    return this;
	};

	methods.concat('all').forEach(function (method) {
	    Router.prototype[method] = function (path) {
	        for (var _len = arguments.length, fns = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	            fns[_key - 1] = arguments[_key];
	        }

	        fns = flatten(fns);
	        if (typeof path !== 'string') throw new TypeError('Router.' + method + '() requires a path as the first parameter');
	        if (!fns.length) throw new TypeError('Router.' + method + '() requires at least one function');
	        if (!fns.every(function (handler) {
	            return typeof handler === 'function';
	        })) throw new TypeError('Router.' + method + '() requires middlewares to be of type "function"');

	        path = checkForwardSlashes(path);

	        var route = new Route(this, method, path);
	        route.setHandlers(fns);
	        this.routes.push(route);

	        return this;
	    };
	});

	Router.prototype.use = function use() {
	    for (var _len2 = arguments.length, fns = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        fns[_key2] = arguments[_key2];
	    }

	    fns = flatten(fns);
	    var path = typeof fns[0] === 'string' ? checkForwardSlashes(fns.shift()) : '/';
	    if (!fns.length) throw new TypeError('Router.use() requires middleware functions');
	    if (!fns.every(function (fn) {
	        return typeof fn === 'function';
	    })) throw new TypeError('Router.use() requires middlewares to be of type "function"');

	    var route = new Route(this, 'use', path, { end: false });
	    route.setHandlers(fns);
	    this.routes.push(route);
	};

	Router.prototype.handle = function handle(req, res, parentNext) {
	    var self = this;
	    this.routeIdx = 0; // reset index
	    next();

	    function next() {
	        // no matching route found
	        if (self.routeIdx >= self.routes.length) return self.end(req, res);

	        // console.log(`next`, self.routes[self.routeIdx].path)

	        var route = self.routes[self.routeIdx];
	        var match = route.match(req.method, req.path);

	        // console.log(`match [${req.method}] ${req.url} with [${route.method}] ${route.getPath()}`, match)

	        self.routeIdx++;

	        if (!match) return next();

	        route.handle(req, res, next);
	    }
	};

	Router.prototype.setPrefix = function setPrefix(prefix) {
	    this.prefix = checkForwardSlashes(prefix);
	};

	Router.prototype.debug = function debug() {
	    var json = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

	    var data = {
	        prefix: this.prefix,
	        routes: this.routes.map(function (route) {
	            return route.debug();
	        })
	    };

	    return json ? JSON.stringify(data) : data;
	};

	// implement the middleware interface
	Router.prototype.middleware = function middleware() {
	    var handle = this.handle.bind(this);

	    function routerAsMiddleware(req, res, next) {
	        return handle(req, res, next);
	    }

	    routerAsMiddleware.debug = this.debug.bind(this);
	    routerAsMiddleware.setPrefix = this.setPrefix.bind(this);

	    return routerAsMiddleware;
	};

	function checkForwardSlashes(path) {
	    if (path !== '/') {
	        // remove forward slash suffix
	        if (path.endsWith('/')) {
	            path = path.slice(0, -1);
	        }

	        // ensure forward slash prefix
	        if (!path.startsWith('/')) {
	            path = '/' + path;
	        }
	    }

	    return path;
	}

/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports) {

	'use strict';

	module.exports = ['get', 'post', 'put', 'delete'];

/***/ },
/* 4 */,
/* 5 */,
/* 6 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var pathToRegexp = __webpack_require__(8);
	var methods = __webpack_require__(3);
	var Handler = __webpack_require__(9);

	var Route = module.exports = function Route(router, method, path) {
	    var regexpOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

	    if (router.constructor.name !== 'Router') throw new TypeError('Route.constructor() expects router to be an instance of Router');
	    if (!methods.concat(['all', 'use']).includes(method)) throw new TypeError('Route.constructor() method argument is invalid');
	    if (typeof path !== 'string') throw new TypeError('Route.constructor() requires path to be a string');

	    this.router = router;
	    this.method = method;
	    this.path = path;
	    this.params = {};
	    this.matchingUrl;
	    this.pathMatcher = createPathMatcher(this.getPath.bind(this), regexpOptions);

	    this.handlers = [];
	    this.handlerIdx;

	    return this;
	};

	Route.prototype.getPath = function getPath() {
	    return prefixPath(this.path, this.router.prefix);
	};

	Route.prototype.setHandlers = function setHandlers(fns) {
	    var _this = this;

	    this.handlers = fns.map(function (fn, fnIdx) {
	        var type = fnIdx === fns.length - 1 && fn.length < 3 ? 'callback' : 'middleware';

	        if (fn.hasOwnProperty('setPrefix')) {
	            if (_this.method !== 'use') throw new Error('Router.setHandlers() can only accept a router-as-middleware only when created by .use()');

	            fn.getRoutePrefix = _this.getPath.bind(_this);
	        }

	        return new Handler(type, fn);
	    });
	};

	Route.prototype.match = function match(method, url) {
	    // only accept requests that match the route's method
	    // or any request when this.method is set to [all] or [use]
	    if (this.method !== method && this.method !== 'all' && this.method !== 'use') return false;

	    var result = this.pathMatcher(url);

	    if (result === false) return false;

	    this.matchingUrl = result.match;
	    this.params = result.params;

	    return true;
	};

	Route.prototype.handle = function handle(req, res, routerNext) {
	    req.params = this.params;
	    this.handlerIdx = 0;

	    var self = this;
	    next();

	    function next(err) {
	        if (err === 'route') return routerNext();

	        if (self.handlerIdx >= self.handlers.length) return routerNext();

	        var handler = self.handlers[self.handlerIdx];

	        self.handlerIdx++;

	        res.next = next;

	        handler.run(req, res, next);
	    }
	};

	Route.prototype.debug = function debug() {
	    var json = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

	    var data = {
	        path: this.getPath(),
	        method: this.method,
	        handlers: this.handlers.map(function (handler) {
	            return handler.debug();
	        })
	    };

	    return json ? JSON.stringify(data) : data;
	};

	function createPathMatcher(getPath, options) {
	    options = options || {};

	    return function pathMatcher(url, params) {
	        var path = getPath();

	        var keys = [];
	        params = params || {};

	        var regexp = pathToRegexp(path, keys, options);
	        var result = regexp.exec(url);

	        if (result === null) return false;

	        var match = result.shift();

	        keys.forEach(function (key, i) {
	            params[key.name] = result[i];
	        });

	        return { match: match, params: params };
	    };
	}

	function prefixPath(path, prefix) {
	    if (path === '/') return prefix;

	    if (prefix.endsWith('/')) {
	        prefix = prefix.slice(0, -1);
	    }

	    return '' + prefix + path;
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	var Handler = module.exports = function Handler(type, handler) {
	    if (typeof type !== 'string') throw new TypeError('Handler.constructor() requires type to be a string');
	    if (typeof handler !== 'function') throw new TypeError('Handler.constructor() requires handler to be of type function');

	    // middleware, callback, router
	    this.type = handler.name === 'routerAsMiddleware' ? 'router' : type;
	    this.handler = handler;

	    return this;
	};

	Handler.prototype.debug = function debug() {
	    var json = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

	    this.setPrefix();

	    var data = void 0;

	    if (this.type === 'router') {
	        data = this.handler.debug();
	    } else {
	        data = {
	            type: this.type,
	            name: this.handler.name || '<anonymous>',
	            arguments: this.handler.length
	        };
	    }

	    return json ? JSON.stringify(data) : data;
	};

	Handler.prototype.run = function run(req, res, next) {
	    this.setPrefix();

	    this.handler(req, res, next);
	};

	Handler.prototype.setPrefix = function setPrefix() {
	    if (this.type !== 'router') return;
	    if (!this.handler.hasOwnProperty('setPrefix')) return;
	    if (!this.handler.hasOwnProperty('getRoutePrefix')) return;

	    this.handler.setPrefix(this.handler.getRoutePrefix());
	};

/***/ }
/******/ ])
});
;