'use strict'

const flatten = require('array-flatten')
const methods = require('../constants/methods')
const Route = require('./route')

const Router = module.exports = function Router(prefix = '/')
{
    if (typeof prefix !== 'string') throw new TypeError(`Router.constructor() requires prefix to be a string`)
    if (!(this instanceof Router)) return new Router(prefix)

    this.prefix = checkForwardSlashes(prefix)
    this.routes = []
    this.routeIdx
    this.end = () => {}

    return this
}

methods.concat('all').forEach(method =>
{
    Router.prototype[method] = function (path, ...fns)
    {
        fns = flatten(fns)
        if (typeof path !== 'string') throw new TypeError(`Router.${method}() requires a path as the first parameter`)
        if (!fns.length) throw new TypeError(`Router.${method}() requires at least one function`)
        if (!fns.every(handler => typeof handler === 'function')) throw new TypeError(`Router.${method}() requires middlewares to be of type "function"`)

        path = checkForwardSlashes(path)

        let route = new Route(this, method, path)
        route.setHandlers(fns)
        this.routes.push(route)

        return this
    }
})

Router.prototype.use = function use(...fns)
{
    fns = flatten(fns)
    let path = typeof fns[0] === 'string' ? checkForwardSlashes(fns.shift()) : '/'
    if (!fns.length) throw new TypeError(`Router.use() requires middleware functions`)
    if (!fns.every(fn => typeof fn === 'function')) throw new TypeError(`Router.use() requires middlewares to be of type "function"`)

    let route = new Route(this, 'use', path, { end: false })
    route.setHandlers(fns)
    this.routes.push(route)
}

Router.prototype.handle = function handle(req, res, parentNext)
{
    let self = this
    this.routeIdx = 0 // reset index
    next()

    function next()
    {
        // no matching route found
        if (self.routeIdx >= self.routes.length) return self.end(req, res)

        let route = self.routes[self.routeIdx]
        let match = route.match(req.method, req.path)

        self.routeIdx++

        if (!match) return next()

        route.handle(req, res, next)
    }
}

Router.prototype.setPrefix = function setPrefix(prefix)
{
    this.prefix = checkForwardSlashes(prefix)
}

Router.prototype.debug = function debug(json = false)
{
    let data = {
        prefix: this.prefix,
        routes: this.routes.map(route => route.debug())
    }

    return json ? JSON.stringify(data) : data
}

// implement the middleware interface
Router.prototype.middleware = function middleware()
{
    let handle = this.handle.bind(this)

    function routerAsMiddleware(req, res, next)
    {
        return handle(req, res, next)
    }

    routerAsMiddleware.debug = this.debug.bind(this)
    routerAsMiddleware.setPrefix = this.setPrefix.bind(this)

    return routerAsMiddleware
}

function checkForwardSlashes(path)
{
    if (path !== '/')
    {
        // remove forward slash suffix
        if (path.endsWith('/'))
        {
            path = path.slice(0, -1)
        }

        // ensure forward slash prefix
        if (!path.startsWith('/'))
        {
            path = `/${path}`
        }
    }

    return path
}
