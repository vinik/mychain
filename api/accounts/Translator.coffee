
class Translator

    # constructor: (deps) ->
    #     @Interactor = deps?.interactor or Interactor

    queryAccount: (req, res, next) ->
        id_token = req.authorization.credentials
        AuthenticationClient = require('auth0').AuthenticationClient
        auth0 = new AuthenticationClient
            domain: 'vinik.auth0.com'
            clientId: 'weRGYvj1bVbHDCBfEsqFA3cssasg0HkF'
            secret: 'neZzO9dAdwCxKl8bvTozeIIpQcRClWVFuOWaqTUwfeqOWawqfxrM2OlFxwU1BXrO'
        

        auth0.getProfile id_token, (err, userInfo) ->
            console.log userInfo
            next()
        

    

module.exports = Translator
