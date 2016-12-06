'use strict'

const uuid = require('uuid')
const urlparse = require('url-parse')

const Request = module.exports = function Request(url)
{
    if (typeof url !== 'string') throw new TypeError(`Request.constructor() requires url to be a string`)

    this.id = uuid.v4()

    this.method = null
    this.url = url

    this.body = {}
    this.params = {}

    Object.defineProperty(this, 'originalUrl', {
        configurable: false,
        enumerable: true,
        value: url
    })

    Object.defineProperty(this, 'path', {
        configurable: false,
        enumerable: true,
        get: function path()
        {
            try
            {
                return urlparse(this.url).pathname
            }
            catch (err)
            {
                return undefined
            }
        }
    })

    Object.defineProperty(this, 'query', {
        configurable: true,
        enumerable: true,
        get: function qs()
        {
            try
            {
                return urlparse(this.url, true).query
            }
            catch (err)
            {
                return {}
            }
        }
    })

    return this
}
