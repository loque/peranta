'use strict'

const expect = require('chai').expect
const methods = require('../../src/constants/methods')
const Server = require('../../src/server')
const Router = require('../../src/router')

const test = module.exports = function()
{
    describe('Server', function()
    {
        describe('Transport', function()
        {
            it('should throw if no transport was sent', function()
            {
                expect(function(){ const server = new Server(undefined, new Router()) }).to.throw(`Server.constructor() expects transport to be an object`)
            })

            it('should implement .send() with 2 arguments if it exists in transport', function()
            {
                const transport = { on: function(){}, send: function(){} }
                const server = new Server(transport, new Router())

                expect(server.send).to.be.a('function')
                expect(server.send.length).to.equal(2)
            })

            it('should implement .broadcast() with 2 arguments if it exists in transport', function()
            {
                const transport = { on: function(){}, broadcast: function(){} }
                const server = new Server(transport, new Router())

                expect(server.broadcast).to.be.a('function')
                expect(server.broadcast.length).to.equal(2)
            })
        })

        describe('Router', function()
        {
            const transport = { on: function(){} }

            it('should throw if no router was sent', function()
            {
                expect(function(){ const server = new Server(transport) }).to.throw(`Server.constructor() expects router to be an object`)
            })

            it('should throw if router.handle() is not defined', function()
            {
                expect(function(){ const server = new Server(transport, {}) }).to.throw(`Server.constructor() expects router to implement the method .handle()`)
            })
        })

        methods.concat(['all', 'use', 'debug']).forEach(method =>
        {
            it(`should implement .${method}()`, function()
            {
                const transport = { on: function(){} }
                const server = new Server(transport, new Router())

                expect(server[method]).to.be.a('function')
            })
        })
    })
}

if (module.parent.exports.name === 'Mocha') test()
