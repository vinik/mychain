Interactor = require './Interactor'

class Translator

    constructor: () ->
        @interactor = new Interactor

    queryAccount: (req, res, next) =>
        params =
            id_token: req.authorization.credentials

        @interactor.validateLogin params, (err, response) ->
            # TODO error treatment
            next()

module.exports = Translator
