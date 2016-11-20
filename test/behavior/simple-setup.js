'use strict'

const expect = require('chai').expect
const events = require('events')

const methods = require('../../lib/constants/methods')

const Client = require('../adapter/client')
const Server = require('../adapter/server')

describe('[behavior] simple setup', function()
{
    methods.concat('all').forEach(method =>
    {
        it(`should handle .${method}()`, function()
        {
            let emitter = new events.EventEmitter()

            let server = Server.create(emitter)
            server[method]('/', (req, res) =>
            {
                res.status(200).send('tada')
            })

            let client = Client.create(emitter)

            if (method == 'all')
            {
                method = 'get'
            }

            return client[method]('/')
            .then(res =>
            {
                expect(res.body).to.equal('tada')
            })
        })
    })

    it(`should handle variables in url (aka, params)`, function()
    {
        let emitter = new events.EventEmitter()

        let server = Server.create(emitter)
        server.get('/:id', (req, res) =>
        {
            res.status(200).send(req.params.id)
        })

        let client = Client.create(emitter)
        return client.get('/8')
        .then(res =>
        {
            expect(res.body).to.equal('8')
        })
    })

    it(`should handle variables in body`, function()
    {
        let emitter = new events.EventEmitter()

        let server = Server.create(emitter)
        server.post('/', (req, res) =>
        {
            res.status(200).send(req.body.id)
        })

        let client = Client.create(emitter)
        return client.post('/', { id: 8 })
        .then(res =>
        {
            expect(res.body).to.equal(8)
        })
    })

    // .use() should continue to next route when calling next('route')
    // .use() should stop router.next execution if next is not called
    // .all() should hide all following routes if next is not called
})
