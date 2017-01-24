Interactor = require './Interactor'

class Translator

    constructor: () ->
        @interactor = new Interactor

    queryAccount: (req, res, next) =>
        console.log 'queryAccount'
        params =
            id_token: req.authorization.credentials

        console.log 'interactor'
        @interactor.validateLogin params, (err, response) ->
            # TODO error treatment
            next()

module.exports = Translator
