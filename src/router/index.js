// @flow

'use strict'

import flatten from 'array-flatten'

import { methods } from '../constants'
import Route from './route'

const Router = function Router(prefix = '/')
{
    if (typeof prefix !== 'string') throw new TypeError(`Router.constructor() requires prefix to be a string`)
    if (!(this instanceof Router)) return new Router(prefix)

    this.prefix = checkForwardSlashes(prefix)
    this.routes = []
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
        if (!fns.every(handler => typeof handler === 'function'))
        {
            if (process.env.NODE_ENV !== 'production')
            {
                console.log(`path`, path)
                console.log(`fns`, fns)
                console.log(`method`, method)
            }
            throw new TypeError(`Router.${method}() requires middlewares to be of type "function"`)
        }

        path = checkForwardSlashes(path)

        const route = new Route(this, method, path)
        route.setHandlers(fns)
        this.routes.push(route)

        return this
    }
})

Router.prototype.use = function use(...fns)
{
    fns = flatten(fns)
    const path = typeof fns[0] === 'string' ? checkForwardSlashes(fns.shift()) : '/'
    if (!fns.length) throw new TypeError(`Router.use() requires middleware functions`)
    if (!fns.every(fn => typeof fn === 'function')) throw new TypeError(`Router.use() requires middlewares to be of type "function"`)

    const route = new Route(this, 'use', path, { end: false })
    route.setHandlers(fns)
    this.routes.push(route)
}

Router.prototype.handle = function handle(req, res, parentNext)
{
    const self = this
    this.routeIdx = 0 // reset index
    next()

    function next()
    {
        // no matching route found
        if (self.routeIdx >= self.routes.length) return self.end(req, res)

        const route = self.routes[self.routeIdx]
        const match = route.match(req.method, req.path)

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
    const data = {
        prefix: this.prefix,
        routes: this.routes.map(route => route.debug())
    }

    return json ? JSON.stringify(data) : data
}

// implement the middleware interface
Router.prototype.middleware = function middleware()
{
    const handle = this.handle.bind(this)

    function routerAsMiddleware(req, res, next)
    {
        return handle(req, res, next)
    }

    routerAsMiddleware.debug = this.debug.bind(this)
    routerAsMiddleware.setPrefix = this.setPrefix.bind(this)
    routerAsMiddleware.isMiddleware = true

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

export default Router
