'use strict'

import { expect } from 'chai'

import { methods } from '../../src/constants'
import Client from '../../src/client'

export default function test()
{
    describe('Client', function()
    {
        describe('Transport', function()
        {
            it('should throw if no transport was sent', function()
            {
                expect(function(){ const client = new Client() }).to.throw(`Client.constructor() expects to receive a transport`)
            })

            it('should throw if .on() is not set', function()
            {
                expect(function()
                {
                    new Client({ emit: function(){} })
                })
                .to.throw(`Client.constructor() expects transport to implement the method .on() and .emit()`)
            })

            it('should throw if .emit() is not set', function()
            {
                expect(function()
                {
                    new Client({ on: function(){} })
                })
                .to.throw(`Client.constructor() expects transport to implement the method .on() and .emit()`)
            })

            it('should throw if neither .on() or .emit() are set', function()
            {
                expect(function()
                {
                    new Client({})
                })
                .to.throw(`Client.constructor() expects transport to implement the method .on() and .emit()`)
            })
        })

        methods.forEach(method =>
        {
            it(`should implement .${method}()`, function()
            {
                const client = new Client({ on: function(){}, emit: function() {} })
                expect(client[method]).to.be.a('function')
            })
        })

        it('should implement .on()', function()
        {
            const client = new Client({ on: function(){}, emit: function() {} })

            expect(client.on).to.be.a('function')
            expect(client.on.length).to.equal(2)
        })
    })
}
