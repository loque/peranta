'use strict'

const expect = require('chai').expect
const methods = require('../../lib/constants/methods')
const Router = require('../../lib/router')

describe('[spec] Router', function()
{
    it('should throw if the argumet root is not a string', function()
    {
        expect(function () { new Router(1) }).to.throw(`Router.constructor() requires root to be a string`)
    })

    methods.concat('all').forEach(method =>
    {
        it(`should implement .${method}()`, function()
        {
            let router = new Router()
            expect(router[method]).to.be.a('function')
        })
    })

    let interfaceMethods = ['use', 'handle', 'middleware', 'debug', 'setRoot', 'end']
    interfaceMethods.forEach(method =>
    {
        it(`should implement .${method}()`, function()
        {
            let router = new Router()
            expect(router[method]).to.be.a('function')
        })
    })

    describe('.VERB', function()
    {
        it('should throw if a path was not sent', function()
        {
            let router = new Router()
            let method = 'get'

            expect(function () { router[method]() }).to.throw(`Router.${method}() requires a path as the first parameter`)
        })

        it('should throw no function is sent', function()
        {
            let router = new Router()
            let method = 'get'

            expect(function () { router[method]('path') }).to.throw(`Router.${method}() requires at least one function`)
        })

        it('should throw if middlewares are not functions', function()
        {
            let router = new Router()
            let method = 'get'

            expect(function () { router[method]('path', 'not a function') }).to.throw(`Router.${method}() requires middlewares to be of type "function"`)
        })
    })

    describe('.use', function()
    {
        it('should throw if no middlewares are sent', function()
        {
            let router = new Router()

            expect(function () { router.use() }).to.throw(`Router.use() requires middleware functions`)
        })

        it('should throw if middlewares are not functions', function()
        {
            let router = new Router()

            expect(function () { router.use('path', 'not a function') }).to.throw(`Router.use() requires middlewares to be of type "function"`)
        })
    })

    describe('Root-path validation', function()
    {
        it('remove forward slash suffix', function()
        {
            let router = new Router('/home/')

            expect(router.root).to.equal(`/home`)
        })

        it('ensure forward slash prefix', function()
        {
            let router = new Router('home')

            expect(router.root).to.equal(`/home`)
        })
    })

    describe('Router as middleware', function()
    {
        it('should return a function that accepts 3 arguments', function()
        {
            let router = new Router()

            expect(router.middleware().length).to.equal(3)
        })

        let interfaceMethods = ['debug', 'setRoot']

        interfaceMethods.forEach(method =>
        {
            it(`should implement .${method}()`, function()
            {
                let router = new Router()

                expect(router.middleware()[method]).to.be.a('function')
            })
        })

    })

    // describe('debugging', function()
    // {
    //     it(`should return an object with complete router`, function()
    //     {
    //         let handlers = [
    //             function middle(req, res, next){},
    //             function cb(req, res){},
    //         ]
    //
    //         let router = new Router()
    //
    //         router.get('/home', ...handlers)
    //         router.get('/about', ...handlers)
    //
    //         let debug = router.debug(true)
    //
    //         let expected = `{"routes":[{"method":"get","path":"/home","handlers":[{"type":"middleware","name":"middle","arguments":3},{"type":"callback","name":"cb","arguments":2}]},{"method":"get","path":"/about","handlers":[{"type":"middleware","name":"middle","arguments":3},{"type":"callback","name":"cb","arguments":2}]}]}`
    //
    //         expect(debug).to.equal(expected)
    //     })
    // })
})
