'use strict'

const expect = require('chai').expect
const methods = require('../../src/constants/methods')
const Route = require('../../src/router/route')
const Router = require('../../src/router')

module.exports = function()
{
    describe('Route', function()
    {
        it(`should throw if the argument router is not an instance of Router`, function()
        {
            expect(function()
            {
                const route = new Route(function(){})
            })
            .to.throw(`Route.constructor() expects router to be an instance of Router`)
        })

        it(`should throw if the argument method is invalid`, function()
        {
            expect(function()
            {
                const route = new Route(new Router(), 'GET')
            })
            .to.throw(`Route.constructor() method argument is invalid`)
        })

        it('should throw if the argument path is not a string', function()
        {
            expect(function () { new Route(new Router(), 'get', 1) }).to.throw(`Route.constructor() requires path to be a string`)
        })

        it('should throw if trying to set a router-as-middleware when Route is not created by .use()', function()
        {
            const users = new Router()
            const root = new Router()

            expect(function () { root.all('/users', users.middleware()) }).to.throw(`Router.setHandlers() can only accept a router-as-middleware only when created by .use()`)
        })

        const interfaceMethods = ['getPath', 'setHandlers', 'match', 'handle', 'debug']
        interfaceMethods.forEach(method =>
        {
            it(`should implement .${method}()`, function()
            {
                const router = new Route(new Router(), 'get', 'path')
                expect(router[method]).to.be.a('function')
            })
        })
    })
}
