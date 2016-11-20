'use strict'

const channels = require('./constants/channels')
const methods = require('./constants/methods')
const Response = require('./response')
const Router = require('./router')

const supportedOutputHandlers = ['send', 'broadcast']

const Server = module.exports = function Server(transport, root = '/')
{
    if (transport === undefined) throw new TypeError(`Server.constructor() expects to receive a transport`)
    // TODO: check typeof transport!!!
    if (typeof root != 'string') throw new TypeError(`Server.constructor() requires root to be a string`)
    if (!(this instanceof Server)) return new Server(transport, root)

    this.router = new Router(root)
    this.transport = transport

    // add output handlers defined on transport
    supportedOutputHandlers.forEach(outputHandlerName =>
    {
        createOutputHandler.call(this, outputHandlerName)
    })

    // listen to the http channel
    this.transport.on(channels.HTTP, (event, req) =>
    {
        let res = new Response()
        res.ipc = { channel: channels.HTTP, sender: event.sender }
        res.id = req.id

        this.router.handle(req, res)
    })

    return this
}

// Delegate all http verbs calls to the router
methods.concat(['all', 'use']).forEach(method =>
{
    Server.prototype[method] = function (...args)
    {
        return this.router[method](...args)
    }
})

function createOutputHandler(outputHandlerName)
{
    if (typeof this.transport[outputHandlerName] == 'function')
    {
        this[outputHandlerName] = function (url, body)
        {
            let res = new Response(true)
            res.ipc = { channel: channels.EVENT }
            res.url = url
            res.body = body

            this.transport[outputHandlerName](channels.EVENT, res)
        }
    }
}
