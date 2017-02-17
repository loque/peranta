'use strict'

import Server from '../../src/server'
import Router from '../../src/router'

function Transport(emitter)
{
    this.receivers = {}
    this.emitter = emitter

    this.emitter.on('request', message =>
    {
        if (!Array.isArray(message)) throw new TypeError(`message from client is not an array`)

        let channel = message.shift()
        let req = message.shift()

        if (this.receivers.hasOwnProperty(channel))
        {
            let event = {
                sender:
                {
                    send: (channel, res) => this.emitter.emit('response', [channel, res])
                }
            }
            this.receivers[channel].callback(event, req)
        }
    })

    return this
}

Transport.prototype.on = function on(channel, callback)
{
    this.receivers[channel] = { channel, callback }
}

function create(emitter)
{
    return new Server(new Transport(emitter), new Router())
}

export default { create }
