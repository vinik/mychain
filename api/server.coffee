
restify = require 'restify'

startServer = ->
    server = restify.createServer()
    server.use restify.CORS()
    server.use restify.queryParser mapParams: false
    server.use restify.bodyParser mapParams: false
    server.use restify.authorizationParser()
    # server.use checkAuthorization
    setupRoutes server

    server.on 'error', (req, res, route, err) ->
        console.log err?.stack || err
    server.on 'uncaughtException', (req, res, route, err) ->
        console.log err?.stack || err
    server.on 'MethodNotAllowed', unknownMethodHandler
    server.listen 8080, ->
        console.log "Reports API started on port 8080 with pid #{process.pid}"

setupRoutes = (server) ->
    # translator = new (require './../app/src/jobs/Translator')
    translator = new (require './accounts/Translator')
    server.get '/', (req, res, next) ->
        res.json 200, 'ok'
        next()
    server.get 'query/account', translator.queryAccount
    # server.get 'jobs', translator.find
    # server.post 'jobs', translator.createGroup

unknownMethodHandler = (req, res) ->
    if req.method.toLowerCase() is 'options'
        console.log('received an options method request')
        allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version', 'Origin', 'X-Requested-With', 'Authorization'];

        res.methods.push('OPTIONS') if res.methods.indexOf('OPTIONS') is -1 

        res.header('Access-Control-Allow-Credentials', true)
        res.header('Access-Control-Allow-Headers', allowHeaders.join(', '))
        res.header('Access-Control-Allow-Methods', res.methods.join(', '))
        res.header('Access-Control-Allow-Origin', req.headers.origin)

        return res.send(204)
    else
        return res.send(new restify.MethodNotAllowedError())


startServer()


# idToken = '"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly92aW5pay5hdXRoMC5jb20vIiwic3ViIjoiZmFjZWJvb2t8MTMxODU0NjA0ODIwNTg2NSIsImF1ZCI6IndlUkdZdmoxYlZiSERDQmZFc3FGQTNjc3Nhc2cwSGtGIiwiZXhwIjoxNDg0OTU5MDQ3LCJpYXQiOjE0ODQ5MjMwNDd9.pdvs_UPoATsxHf5IjpAfnQ_Ent2cr1gNByTO4f0lHg4"'