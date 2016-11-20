'use strict'

const expect = require('chai').expect
const methods = require('../../lib/constants/methods')
const Route = require('../../lib/router/route')
const Router = require('../../lib/router')

describe('[spec] Route', function()
{
    it(`should throw if the argument router is not an instance of Router`, function()
    {
        expect(function()
        {
            let route = new Route(function(){})
        })
        .to.throw(`Route.constructor() expects router to be an instance of Router`)
    })

    it(`should throw if the argument method is invalid`, function()
    {
        expect(function()
        {
            let route = new Route(new Router(), 'GET')
        })
        .to.throw(`Route.constructor() method argument is invalid`)
    })

    it('should throw if the argumet path is not a string', function()
    {
        expect(function () { new Route(new Router(), 'get', 1) }).to.throw(`Route.constructor() requires path to be a string`)
    })

    let interfaceMethods = ['getPath', 'setHandlers', 'match', 'handle', 'debug']
    interfaceMethods.forEach(method =>
    {
        it(`should implement .${method}()`, function()
        {
            let router = new Route(new Router(), 'get', 'path')
            expect(router[method]).to.be.a('function')
        })
    })
})
