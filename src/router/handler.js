'use strict'

const Handler = function Handler(type, handler)
{
    if (typeof type !== 'string') throw new TypeError(`Handler.constructor() requires type to be a string`)
    if (typeof handler !== 'function') throw new TypeError(`Handler.constructor() requires handler to be of type function`)

    // middleware, callback, router
    this.type = handler.name === 'routerAsMiddleware' ? 'router' : type
    this.handler = handler

    return this
}

Handler.prototype.debug = function debug(json = false)
{
    this.setPrefix()

    let data

    if (this.type === 'router')
    {
        data = this.handler.debug()
    }
    else
    {
        data = {
            type: this.type,
            name: this.handler.name || '<anonymous>',
            arguments: this.handler.length,
        }
    }

    return json ? JSON.stringify(data) : data
}

Handler.prototype.run = function run(req, res, next)
{
    this.setPrefix()

    this.handler(req, res, next)
}

Handler.prototype.setPrefix = function setPrefix()
{
    if (this.type !== 'router') return
    if (!this.handler.hasOwnProperty('setPrefix')) return
    if (!this.handler.hasOwnProperty('getRoutePrefix')) return

    this.handler.setPrefix(this.handler.getRoutePrefix())
}

export default Handler
