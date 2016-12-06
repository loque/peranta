'use strict'

const expect = require('chai').expect
const methods = require('../../src/constants/methods')
const Router = require('../../src/router')

module.exports = function()
{
    describe('Router', function()
    {
        it('should throw if the argumet prefix is not a string', function()
        {
            expect(function () { new Router(1) }).to.throw(`Router.constructor() requires prefix to be a string`)
        })

        methods.concat('all').forEach(method =>
        {
            it(`should implement .${method}()`, function()
            {
                const router = new Router()
                expect(router[method]).to.be.a('function')
            })
        })

        const interfaceMethods = ['use', 'handle', 'middleware', 'debug', 'setPrefix', 'end']
        interfaceMethods.forEach(method =>
        {
            it(`should implement .${method}()`, function()
            {
                const router = new Router()
                expect(router[method]).to.be.a('function')
            })
        })

        describe('.VERB', function()
        {
            it('should throw if a path was not sent', function()
            {
                const router = new Router()
                const method = 'get'

                expect(function () { router[method]() }).to.throw(`Router.${method}() requires a path as the first parameter`)
            })

            it('should throw no function is sent', function()
            {
                const router = new Router()
                const method = 'get'

                expect(function () { router[method]('path') }).to.throw(`Router.${method}() requires at least one function`)
            })

            it('should throw if middlewares are not functions', function()
            {
                const router = new Router()
                const method = 'get'

                expect(function () { router[method]('path', 'not a function') }).to.throw(`Router.${method}() requires middlewares to be of type "function"`)
            })
        })

        describe('.use', function()
        {
            it('should throw if no middlewares are sent', function()
            {
                const router = new Router()

                expect(function () { router.use() }).to.throw(`Router.use() requires middleware functions`)
            })

            it('should throw if middlewares are not functions', function()
            {
                const router = new Router()

                expect(function () { router.use('path', 'not a function') }).to.throw(`Router.use() requires middlewares to be of type "function"`)
            })
        })

        describe('Root-path validation', function()
        {
            it('remove forward slash suffix', function()
            {
                const router = new Router('/home/')

                expect(router.prefix).to.equal(`/home`)
            })

            it('ensure forward slash prefix', function()
            {
                const router = new Router('home')

                expect(router.prefix).to.equal(`/home`)
            })
        })

        describe('Router as middleware', function()
        {
            it('should return a function that accepts 3 arguments', function()
            {
                const router = new Router()

                expect(router.middleware().length).to.equal(3)
            })

            const interfaceMethods = ['debug', 'setPrefix']

            interfaceMethods.forEach(method =>
            {
                it(`should implement .${method}()`, function()
                {
                    const router = new Router()

                    expect(router.middleware()[method]).to.be.a('function')
                })
            })

        })
    })
}
