'use strict'

const channels = require('./constants/channels')
const methods = require('./constants/methods')
const Response = require('./response')
const Router = require('./router')

const supportedOutputHandlers = ['send', 'broadcast']

const Server = module.exports = function Server(transport, root = '/')
{
    if (typeof transport !== 'object') throw new TypeError(`Server.constructor() expects transport to be an object`)
    if (typeof root !== 'string') throw new TypeError(`Server.constructor() requires root to be a string`)
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
        let res = new Response({ channel: channels.HTTP, send: event.sender.send.bind(event) })
        // let res = new Response({ channel: channels.HTTP, sender: event.sender })
        res.id = req.id

        this.router.handle(req, res)
    })

    return this
}

// Delegate all .VERB(), .use() and debug() calls to the routerssss
methods.concat(['all', 'use', 'debug']).forEach(method =>
{
    Server.prototype[method] = function (...args)
    {
        return this.router[method](...args)
    }
})

function createOutputHandler(outputHandlerName)
{
    if (typeof this.transport[outputHandlerName] === 'function')
    {
        this[outputHandlerName] = function (url, body)
        {
            let res = new Response({ channel: channels.EVENT }, true)
            res.url = url
            res.body = body

            this.transport[outputHandlerName](channels.EVENT, res)
        }
    }
}
