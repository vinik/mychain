# MySQL = require 'mysql-connector'
# hosts = require './../configs/hosts'
auth0 = require 'auth0'
_ = require 'lodash'

class Adapter
    constructor: (deps) ->
        @QueryBuilder = deps?.util?.queryBuilder || require('waferpie-utils').QueryBuilder
        @PersistenceConnector = deps?.connector?.mysql || require('waferpie-utils').Connectors.MySQL
        @hosts = deps?.hosts || require '../config/hosts'
        @mysqlParams = @hosts.mysql
        @connector = new @PersistenceConnector @mysqlParams
        @connector.changeTable 'wallets'
        @AuthenticationClient = auth0.AuthenticationClient

    getProfile: (params, entityCallback) ->

        auth0 = new @AuthenticationClient
            domain: params.auth0.domain
            clientId: params.auth0.clientId
            secret: params.auth0.secret

        auth0.getProfile params.id_token, (err, userInfo) =>
            # console.log 'auth0.getProfile'
            # TODO error handling

            userInfo = JSON.parse userInfo
            # console.log userInfo

            # console.log mnems

            ourUser =
                user_id: userInfo.user_id

            # console.log ourUser

            @findAccount ourUser, (error, success) =>
                console.log  error, success.user_id
                return callback error: err if err?
                return entityCallback() if !_.isEmpty success
                @saveAccount ourUser, ->
                    console.log ourUser
                    entityCallback()


    saveAccount: (userData, callback) ->
        mnems = @generateMnemonics()

        userData.passphrase = mnems.code
        userData.privatekey = mnems.pkey

        @connector.create userData, (err, success) ->
            return callback error: err if err?
            callback()

    findAccount: (account, callback) ->
        # find
        @connector.readByField 'user_id', account.user_id, (err, success) ->
            return callback err if err?
            callback null, success

    generateMnemonics: ->
        Mnemonic = require 'bitcore-mnemonic'
        code = new Mnemonic()
        xpriv = code.toHDPrivateKey 'justapassword', 'openchain'
        obj =
            code: code.toString()
            pkey: xpriv.toString()

        return obj

    getAssets: (id) ->

module.exports = Adapter
