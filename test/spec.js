'use strict'

const client = require('./spec/client')
const handler = require('./spec/handler')
const request = require('./spec/request')
const response = require('./spec/response')
const route = require('./spec/route')
const router = require('./spec/router')
const server = require('./spec/server')

describe('Spec', function()
{
    client()
    handler()
    request()
    response()
    route()
    router()
    server()
})
