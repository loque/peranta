'use strict'

const expect = require('chai').expect
const Handler = require('../../lib/router/handler')

module.exports = function()
{
    describe('Handler', function()
    {
        it('should throw if the argument type is not a string', function()
        {
            expect(function(){ new Handler(1) }).to.throw(`Handler.constructor() requires type to be a string`)
        })

        it('should throw if the argument handler is not a function', function()
        {
            expect(function(){ new Handler('type', 'not-a-function') }).to.throw(`Handler.constructor() requires handler to be of type function`)
        })

        const interfaceMethods = ['run', 'debug']
        interfaceMethods.forEach(method =>
        {
            it(`should implement .${method}()`, function()
            {
                const handler = new Handler('type', function(){})

                expect(handler[method]).to.be.a('function')
            })
        })
    })
}
