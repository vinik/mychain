Entity = require './Entity'

class Interactor

    constructor: (deps) ->
        @entity = deps?.entity or new Entity
        # @logger = deps?.logger or new Logger().get(console: true, file: true, filepath: process.env.LOG_PATH)
        # @interval = deps?.interval or 30000
        # @process = deps?.process or process

    validateLogin: (params, translatorCallback) =>
        params.auth0 = {}
        params.auth0.domain = 'vinik.auth0.com'
        params.auth0.clientId = 'weRGYvj1bVbHDCBfEsqFA3cssasg0HkF'
        params.auth0.secret = 'neZzO9dAdwCxKl8bvTozeIIpQcRClWVFuOWaqTUwfeqOWawqfxrM2OlFxwU1BXrO'

        @entity.getProfile params, translatorCallback


module.exports = Interactor
