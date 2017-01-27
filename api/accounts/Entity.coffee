Adapter = require './Adapter'

class Entity

    constructor: (deps) ->
        @adapter = deps?.adapter or new Adapter

    getProfile: (params, callback) =>
        console.log 'Entity.getProfile'
        @adapter.getProfile params, callback

module.exports = Entity
