'use strict'

import { expect } from 'chai'

import Handler from '../../src/router/handler'
import Router from '../../src/router'

export default function()
{
    describe('Handler', function()
    {
        let expected = {
            type: 'callback',
            name: 'callbackName',
            arguments: 3,
        }

        let callbackName = (req, res, next) => {}
        let handler = new Handler('callback', callbackName)

        it(`should return an object with handler's description`, function()
        {
            let debug = handler.debug()
            expect(debug).to.deep.equal(expected)
        })

        it(`should return an object with handler's description as JSON`, function()
        {
            let debug = handler.debug(true)
            expect(debug).to.equal(JSON.stringify(expected))
        })

        it(`should return an object with handler's name "<anonymous>"`, function()
        {
            let callbacks = [(req, res, next) => {}]
            let handler = new Handler('callback', callbacks[0])
            let debug = handler.debug()

            let _expected = JSON.parse(JSON.stringify(expected))
            _expected.name = '<anonymous>'

            expect(debug).to.deep.equal(_expected)
        })

        it('should return child router', function()
        {
            let router = new Router()
            router.get('/', () => {})

            let handler = new Handler('middleware', router.middleware())
            let debug = handler.debug()

            expect(debug).to.deep.equal({
                prefix: '/',
                routes:
                [
                    {
                        method: 'get',
                        path: '/',
                        handlers:
                        [
                            {
                                type: 'callback',
                                name: '<anonymous>',
                                arguments: 0,
                            },
                        ],
                    },
                ]
            })
        })
    })
}
