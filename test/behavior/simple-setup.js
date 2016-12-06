'use strict'

const expect = require('chai').expect
const events = require('events')

const methods = require('../../src/constants/methods')

const Client = require('../adapter/client')
const Server = require('../adapter/server')

const test = module.exports = function ()
{
    describe('Simple setup', function()
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

        it(`should handle variables in the query string`, function()
        {
            let emitter = new events.EventEmitter()

            let server = Server.create(emitter)
            server.get('/home', (req, res) =>
            {
                res.status(200).send(req.query.id)
            })

            let client = Client.create(emitter)
            return client.get('/home?id=8')
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

        it(`properties added to req should stick between handlers`, function()
        {
            let emitter = new events.EventEmitter()

            let server = Server.create(emitter)
            server.use((req, res, next) =>
            {
                req.someProperty = 'someValue'
                next()
            })

            server.get('/', (req, res) =>
            {
                res.status(200).send(req.someProperty)
            })

            let client = Client.create(emitter)
            return client.get('/')
            .then(res =>
            {
                expect(res.body).to.equal('someValue')
            })
        })

        it(`properties added to res should stick between handlers`, function()
        {
            let emitter = new events.EventEmitter()

            let server = Server.create(emitter)
            server.use((req, res, next) =>
            {
                res.someProperty = 'someValue'
                next()
            })

            server.get('/', (req, res) =>
            {
                res.status(200).send(res.someProperty)
            })

            let client = Client.create(emitter)
            return client.get('/')
            .then(res =>
            {
                expect(res.body).to.equal('someValue')
            })
        })

        describe('server.all()', function()
        {
            methods.forEach(method =>
            {
                it(`should intercept [${method}] requests`, function()
                {
                    let emitter = new events.EventEmitter()

                    let server = Server.create(emitter)
                    server.all('/', (req, res) =>
                    {
                        res.status(200).send(true)
                    })
                    server[method]('/', (req, res) =>
                    {
                        res.status(200).send(false)
                    })

                    let client = Client.create(emitter)
                    return client[method]('/')
                    .then(res =>
                    {
                        expect(res.body).to.equal(true)
                    })
                })
            })
        })

        describe('server.use()', function()
        {
            methods.forEach(method =>
            {
                it(`should intercept [${method}] requests`, function()
                {
                    let emitter = new events.EventEmitter()

                    let server = Server.create(emitter)
                    server.use('/', (req, res) =>
                    {
                        res.status(200).send(true)
                    })
                    server[method]('/', (req, res) =>
                    {
                        res.status(200).send(false)
                    })

                    let client = Client.create(emitter)
                    return client[method]('/')
                    .then(res =>
                    {
                        expect(res.body).to.equal(true)
                    })
                })
            })
        })

        describe('next([route])', function()
        {
            it(`should continue to next route when calling next('route')`, function()
            {
                let emitter = new events.EventEmitter()

                let server = Server.create(emitter)

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

                let client = Client.create(emitter)
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

                let emitter = new events.EventEmitter()

                let server = Server.create(emitter)
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

                let reqStatus = new ReqStatus()

                let client = Client.create(emitter)

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
