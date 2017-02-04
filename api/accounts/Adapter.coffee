# MySQL = require 'mysql-connector'
# hosts = require './../configs/hosts'
auth0 = require 'auth0'
_ = require 'lodash'
bitcore = require 'bitcore-lib'

class Adapter
    constructor: (deps) ->
        @QueryBuilder = deps?.util?.queryBuilder || require('waferpie-utils').QueryBuilder
        @PersistenceConnector = deps?.connector?.mysql || require('waferpie-utils').Connectors.MySQL
        @hosts = deps?.hosts || require '../config/hosts'
        @mysqlParams = @hosts.mysql
        @connector = new @PersistenceConnector @mysqlParams
        @connector.changeTable 'wallets'
        @AuthenticationClient = auth0.AuthenticationClient
        @OpenchainApiClient = require('openchain').ApiClient
        @openchainClient = new @OpenchainApiClient @hosts.openchain.url

    getProfile: (params, entityCallback) ->

        auth0 = new @AuthenticationClient
            domain: params.auth0.domain
            clientId: params.auth0.clientId
            secret: params.auth0.secret

        auth0.getProfile params.id_token, (err, userInfo) =>
            # console.log err, userInfo
            # TODO error handling

            userInfo = JSON.parse userInfo
            # console.log userInfo

            # console.log mnems

            ourUser =
                user_id: userInfo.user_id

            console.log ourUser

            @findAccount ourUser, (error, success) =>
                console.log  "findAccount callback: ", error, success
                return callback error: err if err?
                ourUser.passphrase = success.passphrase
                ourUser.privatekey = success.privatekey
                return entityCallback(null, ourUser) if !_.isEmpty success
                @saveAccount ourUser, ->
                    console.log ourUser
                    entityCallback(null, ourUser)


    saveAccount: (userData, callback) ->
        console.log "saveAccount", userData
        mnems = @generateMnemonics()

        userData.passphrase = mnems.code
        userData.privatekey = mnems.pkey

        @connector.create userData, (err, success) ->
            return callback error: err if err?
            callback()

    findAccount: (account, callback) ->
        console.log 'findAccount', account.user_id
        # find
        @connector.readByField 'user_id', account.user_id, (err, success) ->
            return callback err if err?
            callback null, success

    queryAccount: (account, callback) ->
        console.log  "Adapter.queryAccount", account

        address = @getWalletAddress account.user_id

        @openchainClient.getAccountRecords(address.accountPath, address.assetPath).then( (result)->
            console.log 'AccountRecords', result
            callback null, result
        )

    getWalletAddress: (seed) ->
        console.log 'getWalletAddress', seed
        hexSeed = new Buffer(seed).toString 'hex'

        #// Load a private key from a seed
        privateKey = bitcore.HDPrivateKey.fromSeed hexSeed, "openchain"

        address = privateKey.publicKey.toAddress()

        #// Calculate the accounts corresponding to the private key
        walletPath = "/p2pkh/" + address + "/"

        wallet =
            accountPath: walletPath
            assetPath: "/asset#{walletPath}"

        console.log 'wallet ', wallet

        return wallet


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
