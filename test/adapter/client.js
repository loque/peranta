'use strict'

import Client from '../../dist/client'

function Transport(emitter)
{
    this.receivers = {}
    this.emitter = emitter

    this.emitter.on('response', message =>
    {
        if (!Array.isArray(message)) throw new TypeError(`message from server is not an array`)

        const channel = message.shift()
        const res = message.shift()

        if (this.receivers.hasOwnProperty(channel))
        {
            this.receivers[channel].callback(null, res)
        }
    })

    return this
}

Transport.prototype.on = function on(channel, callback)
{
    this.receivers[channel] = { channel, callback }
}

Transport.prototype.emit = function emit(channel, req)
{
    this.emitter.emit('request', [channel, req])
}

function create(emitter)
{
    return new Client(new Transport(emitter))
}

export default { create }
