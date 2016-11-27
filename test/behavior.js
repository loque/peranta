'use strict'

const simpleSetup = require('./behavior/simple-setup')
const nestedRouters = require('./behavior/nested-routers')

describe('Behavior', function()
{
    simpleSetup()
    nestedRouters()
})
