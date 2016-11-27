'use strict'

const handler = require('./debugging/handler')
const route = require('./debugging/route')
const router = require('./debugging/router')

describe('Debugging', function()
{
    handler()
    route()
    router()
})
