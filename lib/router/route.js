'use strict'

const pathToRegexp = require('path-to-regexp')
const methods = require('../constants/methods')
const Handler = require('./handler')

const Route = module.exports = function Route(router, method, path, regexpOptions = {})
{
    if (router.constructor.name !== 'Router') throw new TypeError(`Route.constructor() expects router to be an instance of Router`)
    if (!methods.concat(['all', 'use']).includes(method)) throw new TypeError(`Route.constructor() method argument is invalid`)
    if (typeof path !== 'string') throw new TypeError(`Route.constructor() requires path to be a string`)

    this.router = router
    this.method = method
    this.path = path
    this.params = {}
    this.matchingUrl
    this.pathMatcher = createPathMatcher(this.getPath.bind(this), regexpOptions)

    this.handlers = []
    this.handlerIdx

    return this
}

Route.prototype.getPath = function getPath()
{
    return prefixPath(this.path, this.router.prefix)
}

Route.prototype.setHandlers = function setHandlers(fns)
{
    this.handlers = fns.map((fn, fnIdx) =>
    {
        let type = fnIdx === fns.length - 1 && fn.length < 3 ? 'callback' : 'middleware'

        if (fn.hasOwnProperty('setPrefix'))
        {
            if (this.method !== 'use') throw new Error(`Router.setHandlers() can only accept a router-as-middleware only when created by .use()`)

            fn.getRoutePrefix = this.getPath.bind(this)
        }

        return new Handler(type, fn)
    })
}

Route.prototype.match = function match(method, url)
{
    // only accept requests that match the route's method
    // or any request when this.method is set to [all] or [use]
    if (this.method !== method && this.method !== 'all' && this.method !== 'use') return false

    let result = this.pathMatcher(url)

    if (result === false) return false

    this.matchingUrl = result.match
    this.params = result.params

    return true
}

Route.prototype.handle = function handle(req, res, routerNext)
{
    req.params = this.params
    this.handlerIdx = 0

    let self = this
    next()

    function next(err)
    {
        if (err === 'route') return routerNext()

        if (self.handlerIdx >= self.handlers.length) return routerNext()

        let handler = self.handlers[self.handlerIdx]

        self.handlerIdx++

        res.next = next

        handler.run(req, res, next)
    }
}

Route.prototype.debug = function debug(json = false)
{
    let data = {
        path: this.getPath(),
        method: this.method,
        handlers: this.handlers.map(handler => handler.debug())
    }

    return json ? JSON.stringify(data) : data
}

function createPathMatcher(getPath, options)
{
    options = options || {}

    return function pathMatcher(url, params)
    {
        let path = getPath()

        let keys = []
        params = params || {}

        let regexp = pathToRegexp(path, keys, options)
        let result = regexp.exec(url)

        if(result === null) return false

        let match = result.shift()

        keys.forEach((key, i) =>
        {
            params[key.name] = result[i]
        })

        return { match, params }
    }
}

function prefixPath(path, prefix)
{
    if (path === '/') return prefix

    if (prefix.endsWith('/'))
    {
        prefix = prefix.slice(0, -1)
    }

    return `${prefix}${path}`
}
