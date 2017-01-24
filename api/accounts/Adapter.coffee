# MySQL = require 'mysql-connector'
# hosts = require './../configs/hosts'
auth0 = require('auth0')
console.log auth0

class Adapter
    constructor: (deps) ->
        # @MySQL = deps?.mysql or MySQL
        # @mysql = new @MySQL hosts.mysql

    # findByEmail: (email, callback) ->
    #     query = "SELECT * FROM account WHERE email='#{email}';"
    #     retryFn = (retryCallback, results) =>
    #         @mysql.read query, retryCallback
    #     @retry retryFn, callback
    getProfile: (params, callback) ->
        AuthenticationClient = auth0.AuthenticationClient

        auth0 = new AuthenticationClient
            domain: params.auth0.domain
            clientId: params.auth0.clientId
            secret: params.auth0.secret

        auth0.getProfile params.id_token, (err, userInfo) ->
            console.log userInfo
            callback()


module.exports = Adapter
