Interactor = require './Interactor'

class Translator

    constructor: () ->
        @interactor = new Interactor

    queryAccount: (req, res, next) =>
        params =
            id_token: req.authorization.credentials

        @interactor.validateLogin params, (err, resp) =>
            # TODO error treatment
            # console.log err, response
            @interactor.queryAccount resp, (error, response) =>
                # TODO error treatment
                console.log 'Translator queryAccount Interactor callback', error, response
                res.json 200, response
                next()

module.exports = Translator
