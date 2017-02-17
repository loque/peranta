'use strict'

import { channels, methods } from './constants'
import Response from './response'

const supportedOutputHandlers = ['send', 'broadcast']

const Server = function Server(transport, router)
{
    if (typeof transport !== 'object') throw new TypeError(`Server.constructor() expects transport to be an object`)
    if (typeof router !== 'object') throw new TypeError(`Server.constructor() expects router to be an object`)
    if (typeof router.handle !== 'function') throw new TypeError(`Server.constructor() expects router to implement the method .handle()`)
    if (!(this instanceof Server)) return new Server(transport, router)

    this.router = router
    this.transport = transport

    // add output handlers defined on transport
    supportedOutputHandlers.forEach(outputHandlerName =>
    {
        createOutputHandler.call(this, outputHandlerName)
    })

    // listen to the http channel
    this.transport.on(channels.HTTP, (event, req) =>
    {
        let res = new Response({ channel: channels.HTTP, sender: event.sender })
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
        if (typeof this.router[method] !== 'function') return

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

export default Server
