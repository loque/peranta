'use strict'

import { expect } from 'chai'
import events from 'events'

import { methods } from '../../src/constants'
import Client from '../adapter/client'
import Server from '../adapter/server'

const test = module.exports = () =>
{
    describe('Simple setup', () =>
    {
        methods.concat('all').forEach(method =>
        {
            it(`should handle .${method}()`, () =>
			{
                const emitter = new events.EventEmitter()

                const server = Server.create(emitter)
                server[method]('/', (req, res) =>
                {
                    res.status(200).send('tada')
                })

                const client = Client.create(emitter)

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

        it(`should handle variables in url (aka, params)`, () =>
		{
            const emitter = new events.EventEmitter()

            const server = Server.create(emitter)
            server.get('/:id', (req, res) =>
            {
                res.status(200).send(req.params.id)
            })

            const client = Client.create(emitter)
            return client.get('/8')
            .then(res =>
            {
                expect(res.body).to.equal('8')
            })
        })

        it(`should handle variables in the query string`, () =>
		{
            const emitter = new events.EventEmitter()

            const server = Server.create(emitter)
            server.get('/home', (req, res) =>
            {
                res.status(200).send(req.query.id)
            })

            const client = Client.create(emitter)
            return client.get('/home?id=8')
            .then(res =>
            {
                expect(res.body).to.equal('8')
            })
        })

        it(`should handle variables in body`, () =>
		{
            const emitter = new events.EventEmitter()

            const server = Server.create(emitter)
            server.post('/', (req, res) =>
            {
                res.status(200).send(req.body.id)
            })

            const client = Client.create(emitter)
            return client.post('/', { id: 8 })
            .then(res =>
            {
                expect(res.body).to.equal(8)
            })
        })

        it(`properties added to req should stick between handlers`, () =>
		{
            const emitter = new events.EventEmitter()

            const server = Server.create(emitter)
            server.use((req, res, next) =>
            {
                req.someProperty = 'someValue'
                next()
            })

            server.get('/', (req, res) =>
            {
                res.status(200).send(req.someProperty)
            })

            const client = Client.create(emitter)
            return client.get('/')
            .then(res =>
            {
                expect(res.body).to.equal('someValue')
            })
        })

        it(`properties added to res should stick between handlers`, () =>
		{
            const emitter = new events.EventEmitter()

            const server = Server.create(emitter)
            server.use((req, res, next) =>
            {
                res.someProperty = 'someValue'
                next()
            })

            server.get('/', (req, res) =>
            {
                res.status(200).send(res.someProperty)
            })

            const client = Client.create(emitter)
            return client.get('/')
            .then(res =>
            {
                expect(res.body).to.equal('someValue')
            })
        })

        describe('server.all()', () =>
		{
            methods.forEach(method =>
            {
                it(`should intercept [${method}] requests`, () =>
				{
                    const emitter = new events.EventEmitter()

                    const server = Server.create(emitter)
                    server.all('/', (req, res) =>
                    {
                        res.status(200).send(true)
                    })
                    server[method]('/', (req, res) =>
                    {
                        res.status(200).send(false)
                    })

                    const client = Client.create(emitter)
                    return client[method]('/')
                    .then(res =>
                    {
                        expect(res.body).to.equal(true)
                    })
                })
            })
        })

        describe('server.use()', () =>
		{
            methods.forEach(method =>
            {
                it(`should intercept [${method}] requests`, () =>
				{
                    const emitter = new events.EventEmitter()

                    const server = Server.create(emitter)
                    server.use('/', (req, res) =>
                    {
                        res.status(200).send(true)
                    })
                    server[method]('/', (req, res) =>
                    {
                        res.status(200).send(false)
                    })

                    const client = Client.create(emitter)
                    return client[method]('/')
                    .then(res =>
                    {
                        expect(res.body).to.equal(true)
                    })
                })
            })
        })

        describe('next([route])', () =>
		{
            it(`should continue to next route when calling next('route')`, () =>
			{
                const emitter = new events.EventEmitter()

                const server = Server.create(emitter)

                server.use(
                    (req, res, next) =>
                    {
                        next('route')
                    },
                    (req, res, next) =>
                    {
                        // this middleware should be bypassed because the previous
                        // handler called next('route')

                        res.status(200).send(false)
                    }
                )

                server.get('/', (req, res) =>
                {
                    res.status(200).send(true)
                })

                const client = Client.create(emitter)
                return client.get('/')
                .then(res =>
                {
                    expect(res.body).to.equal(true)
                })
            })

            it(`should timeout because of an unresponsive middlware that does not call next()`, function(done)
            {
                const timeout = 1500
                this.timeout(timeout)

                const emitter = new events.EventEmitter()

                const server = Server.create(emitter)
                server.use(
                    (req, res, next) =>
                    {
                        next()
                    },
                    (req, res, next) =>
                    {
                        // this should cause a timeout exception because this
                        // middleware is not calling next() or res.send()
                        // thus, it is being unresponsive
                    },
                    (req, res, next) =>
                    {
                        // this should not be invoked because the previous
                        // middleware did not call next()
                        res.status(400).send('Error: Handler after a middleware that did not call next() has being invoked.')
                    }
                )

                const reqStatus = new ReqStatus()

                const client = Client.create(emitter)

                client.get('/')
                .then(res =>
                {
                    reqStatus.setStatus(true)
                })
                .catch(error =>
                {
                    reqStatus.setStatus(false)
                })

                setTimeout(() =>
                {
                    expect(reqStatus.getStatus()).to.equal(undefined)
                    done()
                }, timeout * 0.8)
            })
        })
    })
}

function ReqStatus()
{
    this.status = undefined
    return this
}

ReqStatus.prototype.getStatus = function getStatus()
{
    return this.status
}

ReqStatus.prototype.setStatus = function setStatus(status)
{
    this.status = status
}

if (module.parent.exports.name === 'Mocha') test()
