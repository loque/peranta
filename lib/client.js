'use strict'

const uuid = require('uuid')
const channels = require('./constants/channels')
const methods = require('./constants/methods')
const Request = require('./request')

const Client = module.exports = function Client(transport)
{
    if (transport === undefined) throw new TypeError(`Client.constructor() expects to receive a transport`)
    if (!(this instanceof Client)) return new Client(transport)

    if (
        transport.on === undefined || typeof transport.on != 'function'
        || transport.emit === undefined || typeof transport.emit != 'function'
    )
    {
        throw new TypeError(`Client.constructor() expects transport to implement the method .on() and .emit()`)
    }

    this.id = uuid.v4()
    this.transport = transport
    this.httpHandlers = {}
    this.eventHandlers = []

    this.transport.on(channels.HTTP, (event, res) =>
    {
        let promiseResult = res.status >= 200 && res.status < 300 ? 'resolve' : 'reject'
        this.httpHandlers[res.id].promise[promiseResult](res)
        delete this.httpHandlers[res.id]
    })

    this.transport.on(channels.EVENT, (event, res) =>
    {
        this.eventHandlers.forEach(handler =>
        {
            if (handler.url != res.url) return

            handler.callback(res)
        })
    })

    this.transport.emit(channels.CONNECT, { id: this.id })

    return this
}

methods.forEach(method =>
{
    Client.prototype[method] = function (url, body)
    {
        let promise = exposePromise()

        let req = new Request({ id: this.id })
        req.method = method
        req.url = req.originalUrl = url

        if (['post', 'put'].includes(req.method))
        {
            req.body = body
        }

        this.httpHandlers[req.id] = { req, promise }

        this.transport.emit(channels.HTTP, req)

        return promise
    }
})

Client.prototype.on = function on(url, callback)
{
    this.eventHandlers.push({ url, callback })
}

function exposePromise()
{
    let resolver,
        rejector,
        promise = new Promise((resolve, reject) =>
        {
            resolver = resolve
            rejector = reject
        })

    promise.resolve = resolver
    promise.reject = rejector

    return promise
}
