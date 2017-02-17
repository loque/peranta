'use strict'

import client from './spec/client'
import handler from './spec/handler'
import request from './spec/request'
import response from './spec/response'
import route from './spec/route'
import router from './spec/router'
import server from './spec/server'

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
