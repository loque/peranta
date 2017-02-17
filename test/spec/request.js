'use strict'

import { expect } from 'chai'

import Request from '../../src/request'

const test = module.exports = function ()
{
    describe('Request', function()
    {
        it('should throw if the argumet url is not a string', function()
        {
            expect(function () { new Request() }).to.throw(`Request.constructor() requires url to be a string`)
        })

        it('should define originalUrl with the parameter given', function()
        {
            const url = '/users'
            const req = new Request(url)

            expect(req.originalUrl).to.equal(url)
        })

        it('should throw when trying to manually assign originalUrl', function()
        {
            const req = new Request('/users')

            expect(function () { req.originalUrl = 'new url' }).to.throw()
        })

        it('should contain an object with the parsed query string', function()
        {
            const req = new Request('/users/:id?limit=10')

            expect(req.query.limit).to.equal('10')
        })

        it('when no query string is sent, the property query should be an {}', function()
        {
            const req = new Request('/users/:id')

            expect(req.query).to.eql({})
        })

        it('should contain a property path that strips the query string', function()
        {
            const req = new Request('/users/:id?limit=10')

            expect(req.path).to.equal('/users/:id')
        })
    })
}

if (module.parent.exports.name === 'Mocha') test()
