'use strict'

const expect = require('chai').expect
const Router = require('../../router')
const Route = require('../../src/router/route')

module.exports = function()
{
    describe('Route', function()
    {
        const handlers = [
            function middle(req, res, next){},
            function cb(req, res){},
        ]

        const expected = {
            path: '/home',
            method: 'get',
            handlers:
            [
                { type: 'middleware', name: 'middle', arguments: 3 },
                { type: 'callback', name: 'cb', arguments: 2 }
            ]
        }

        it(`should return an object with route's description`, function()
        {
            let route = new Route(new Router(), 'get', '/home')
            route.setHandlers(handlers)

            let debug = route.debug()

            expect(debug).to.deep.equal(expected)
        })

        it(`should return an object with route's description as JSON`, function()
        {
            let route = new Route(new Router(), 'get', '/home')
            route.setHandlers(handlers)

            let debug = route.debug(true)

            expect(debug).to.deep.equal(JSON.stringify(expected))
        })
    })
}
