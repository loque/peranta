'use strict'

const expect = require('chai').expect
const Handler = require('../../lib/router/handler')

describe('[spec] Handler', function()
{
    it('should throw if the argument type is not a string', function()
    {
        expect(function(){ new Handler(1) }).to.throw(`Handler.constructor() requires type to be a string`)
    })

    it('should throw if the argument handler is not a function', function()
    {
        expect(function(){ new Handler('type', 'not-a-function') }).to.throw(`Handler.constructor() requires handler to be of type function`)
    })

    let interfaceMethods = ['run', 'debug']
    interfaceMethods.forEach(method =>
    {
        it(`should implement .${method}()`, function()
        {
            let handler = new Handler('type', function(){})

            expect(handler[method]).to.be.a('function')
        })
    })
})
