'use strict'

const expect = require('chai').expect
const events = require('events')

const Router = require('../../lib/router')
const Client = require('../adapter/client')
const Server = require('../adapter/server')

const test = module.exports = function()
{
    describe('Nested router', function()
    {
        it(`should handle router-as-middleware`, function()
        {
            let emitter = new events.EventEmitter()

            // server
            let usersBooks = new Router()
            let root = Server.create(emitter)

            usersBooks.get(`/books`, (req, res) => res.status(200).send(true))
            root.use(`/users`, usersBooks.middleware())

            // let debug = root.debug(true)
            // console.log(`\n\ndebug`, debug, `\n\n`)

            // client
            let client = Client.create(emitter)
            return client.get('/users/books')
            .then(res =>
            {
                expect(res.body).to.equal(true)
            })
        })
    })

    describe('Nested router, 2 levels', function()
    {
        it(`should handle router-as-middleware`, function()
        {
            let emitter = new events.EventEmitter()

            // server
            let books = new Router()
            let users = new Router()
            let root = Server.create(emitter)

            books.get(`/`, (req, res) =>  res.status(200).send(true))
            users.use('/books', books.middleware())
            root.use(`/users`, users.middleware())

            // let debug = root.debug(true)
            // console.log(`\n\ndebug`, debug, `\n\n`)

            // client
            let client = Client.create(emitter)
            return client.get('/users/books')
            .then(res =>
            {
                expect(res.body).to.equal(true)
            })
        })

        it(`should allow req.url to be modified`, function()
        {
            let emitter = new events.EventEmitter()

            // server
            let books = new Router()
            let users = new Router()
            let root = Server.create(emitter)

            function log(req, res, next)
            {
                // console.log(`req.url "${req.url}", req.originalUrl "${req.originalUrl}"`)
                next()
            }

            books.get(`/`, log, (req, res) =>  res.status(200).send(true))
            books.get(`/:id`, log, (req, res) =>
            {
                res.status(200).send(false)
            })

            users.use('/books', log, books.middleware())

            root.use(log, (req, res, next) =>
            {
                req.url = '/users/books'
                next()
            })
            root.use(`/users`, log, users.middleware())

            // let debug = root.debug(true)
            // console.log(`\n\ndebug`, debug, `\n\n`)

            // client
            let client = Client.create(emitter)
            return client.get('/users/books/10')
            .then(res =>
            {
                expect(res.body).to.equal(true)
            })
        })

        it(`should allow params in nested routes`, function()
        {
            let emitter = new events.EventEmitter()

            // server
            let books = new Router()
            let users = new Router()
            let root = Server.create(emitter)

            books.get(`/`, (req, res) =>
            {
                res.status(200).send(req.params.type)
            })
            users.use('/:type', books.middleware())
            root.use(`/users`, users.middleware())

            // let debug = root.debug(true)
            // console.log(`\n\ndebug`, debug, `\n\n`)

            // client
            let client = Client.create(emitter)
            return client.get('/users/books')
            .then(res =>
            {
                expect(res.body).to.equal('books')
            })
        })
    })
}

if (module.parent.exports.name === 'Mocha') test()
