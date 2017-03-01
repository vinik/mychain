# MySQL = require 'mysql-connector'
# hosts = require './../configs/hosts'
auth0 = require 'auth0'
_ = require 'lodash'
bitcore = require 'bitcore-lib'

class Adapter
    constructor: (deps) ->
        @hosts = deps?.hosts || require '../config/hosts'
        @AuthenticationClient = auth0.AuthenticationClient
        @OpenchainApiClient = require('openchain').ApiClient
        @openchainClient = new @OpenchainApiClient @hosts.openchain.url

    getProfile: (params, entityCallback) ->

        auth0 = new @AuthenticationClient
            domain: params.auth0.domain
            clientId: params.auth0.clientId
            secret: params.auth0.secret

        auth0.getProfile params.id_token, (err, userInfo) =>
            console.log err, userInfo
            # TODO error handling
            # console.log err if err

            userInfo = JSON.parse userInfo
            # console.log userInfo

            # console.log mnems

            ourUser =
                user_id: userInfo.user_id
                email: userInfo.email

            console.log ourUser
            entityCallback(null, ourUser)


    queryAccount: (account, callback) ->
        console.log  "Adapter.queryAccount", account

        address = @getWalletAddress account.email

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
