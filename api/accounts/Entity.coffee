Adapter = require './Adapter'

class Entity

    constructor: (deps) ->
        @adapter = deps?.adapter or new Adapter

    getProfile: (params, callback) =>
        @adapter.getProfile params, callback

module.exports = Entity
