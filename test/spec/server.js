'use strict'

const expect = require('chai').expect
const methods = require('../../lib/constants/methods')
const Server = require('../../lib/server')

const test = module.exports = function()
{
    describe('Server', function()
    {
        it('should throw if the argumet root is not a string', function()
        {
            expect(function () { new Server({ on: function(){} }, 1) }).to.throw(`Server.constructor() requires root to be a string`)
        })

        describe('Transport', function()
        {
            it('should throw if no transport was sent', function()
            {
                expect(function(){ const server = new Server() }).to.throw(`Server.constructor() expects transport to be an object`)
            })

            it('should implement .send() with 2 arguemnts if it exists in transport', function()
            {
                const transport = { on: function(){}, send: function(){} }
                const server = new Server(transport)

                expect(server.send).to.be.a('function')
                expect(server.send.length).to.equal(2)
            })

            it('should implement .broadcast() with 2 arguemnts if it exists in transport', function()
            {
                const transport = { on: function(){}, broadcast: function(){} }
                const server = new Server(transport)

                expect(server.broadcast).to.be.a('function')
                expect(server.broadcast.length).to.equal(2)
            })
        })

        methods.concat(['all', 'use', 'debug']).forEach(method =>
        {
            it(`should implement .${method}()`, function()
            {
                const transport = { on: function(){} }
                const server = new Server(transport)

                expect(server[method]).to.be.a('function')
            })
        })
    })
}

if (module.parent.exports.name === 'Mocha') test()
