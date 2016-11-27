'use strict'

const expect = require('chai').expect
const Response = require('../../lib/response')
const channels = require('../../lib/constants/channels')
const values = require('object.values')

const test = module.exports = function ()
{
    describe('Response', function()
    {
        it(`should throw if the argumet ipc is not an object`, function()
        {
            expect(function () { new Response() }).to.throw(`Response.constructor() expects the argument ipc to be an object`)
        })

        it(`should throw if the argumet ipc does not contain the property 'channel'`, function()
        {
            expect(function () { new Response({}) }).to.throw(`Response.constructor() expects the argument ipc to contain the property 'channel'`)
        })

        it(`should throw if ipc.channel is not supported`, function()
        {
            expect(function () { new Response({ channel: 'not a supported channel' }) }).to.throw(`Response.constructor() expects a supported ipc.channel`)
        })

        it(`should throw if ipc.send is not a function and ipc.channel is HTTP`, function()
        {
            expect(function () { new Response({ channel: channels.HTTP, send: 'not a function' }) })
            .to.throw(`Response.constructor() expects ipc.send to be a function when ipc.channel is 'HTTP'`)
        })

        it(`should automatically generate an id when autoGenerateId === true`, function()
        {
            const res = new Response({ channel: channels.EVENT }, true)

            expect(res.id).to.be.a('string')
        })

        it(`should contain an undefined property id when autoGenerateId !== true`, function()
        {
            const res = new Response({ channel: channels.EVENT }, 'something else')

            expect(res.id).to.equal(undefined)
        })

        describe(`.status()`, function()
        {
            it(`should set this.statusCode`, function()
            {
                const res = new Response({ channel: channels.EVENT }, 'something else')
                res.status(200)

                expect(res.statusCode).to.equal(200)
            })

            it(`should return itself`, function()
            {
                const res = new Response({ channel: channels.EVENT }, 'something else')
                const copy = res.status(200)

                expect(copy).to.eql(res)
            })
        })

        describe(`.send()`, function()
        {
            it(`should set this.body`, function()
            {
                function send(channel, res){}

                const res = new Response({ channel: channels.HTTP, send }, 'something else')
                res.send('the body')

                expect(res.body).to.equal('the body')
            })

            it(`should call this.ipc.send with the channel as a first argument`, function()
            {
                function send(channel, res)
                {
                    expect(channel).to.equal(channels.HTTP)
                }

                const res = new Response({ channel: channels.HTTP, send }, 'something else')
                res.send('the body')
            })

            it(`should call this.ipc.send with itself as a second argument`, function()
            {
                function send(channel, _res)
                {
                    expect(_res).to.eql(res)
                }

                const res = new Response({ channel: channels.HTTP, send }, 'something else')
                res.send('the body')
            })
        })
    })
}

if (module.parent.exports.name === 'Mocha') test()
