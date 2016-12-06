'use strict'

const uuid = require('uuid')
const channels = require('./constants/channels')
const values = require('object.values')

const Response = module.exports = function Response(ipc, autoGenerateId)
{
    if (typeof ipc !== 'object') throw new TypeError(`Response.constructor() expects the argument ipc to be an object`)
    if (!ipc.hasOwnProperty('channel')) throw new TypeError(`Response.constructor() expects the argument ipc to contain the property 'channel'`)
    if (!values(channels).includes(ipc.channel)) throw new TypeError(`Response.constructor() expects a supported ipc.channel`)
    if (
        ipc.channel === channels.HTTP
        && (!ipc.hasOwnProperty('sender') || typeof ipc.sender.send !== 'function')
    )
    {
        throw new TypeError(`Response.constructor() expects ipc.sender.send to be a function when ipc.channel is 'HTTP'`)
    }

    this.id = autoGenerateId === true ? uuid.v4() : undefined
    this.statusCode
    this.ipc = ipc

    return this
}

Response.prototype.status = function status(code)
{
    this.statusCode = code
    return this
}

Response.prototype.send = function send(body)
{
    this.body = body
    this.status = this.statusCode
    this.ipc.sender.send(this.ipc.channel+'', this)
}
