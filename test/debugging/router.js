'use strict'

import { expect } from 'chai'

import { methods } from '../../src/constants'
import Router from '../../src/router'

export default function()
{
    describe('Router', function()
    {
        const handlers = [
            function middle(req, res, next){},
            function cb(req, res){},
        ]

        it(`should return an object with complete router as JSON`, function()
        {
            let expected = {
                prefix: '/',
                routes:
                [
                    {
                        path: '/home',
                        method: 'get',
                        handlers:
                        [
                            { type: 'middleware', name: 'middle', arguments: 3 },
                            { type: 'callback', name: 'cb', arguments: 2 }
                        ]
                    },
                    {
                        path: '/about',
                        method: 'get',
                        handlers:
                        [
                            { type: 'middleware', name: 'middle', arguments: 3 },
                            { type: 'callback', name: 'cb', arguments: 2 }
                        ]
                    }
                ]
            }

            let router = new Router()

            router.get('/home', ...handlers)
            router.get('/about', ...handlers)

            let debug = router.debug(true)

            expect(debug).to.equal(JSON.stringify(expected))
        })

        it(`should flatten fns in .VERB()`, function()
        {
            let expected = {
                prefix: '/',
                routes: [
                    {
                        path: '/home',
                        method: 'get',
                        handlers: [
                            {
                                type: 'middleware',
                                name: '<anonymous>',
                                arguments: 3
                            },
                            {
                                type: 'middleware',
                                name: 'middle',
                                arguments: 3
                            },
                            {
                                type: 'callback',
                                name: 'cb',
                                arguments: 2
                            }
                        ]
                    }
                ]
            }

            let router = new Router()
            router.get('/home', (req, res, next) => {}, [handlers])

            let debug = router.debug(true)

            expect(debug).to.equal(JSON.stringify(expected))
        })
    })
}
