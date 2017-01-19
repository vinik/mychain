
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
    server.listen 8080, ->
        console.log "Reports API started on port 8080 with pid #{process.pid}"

setupRoutes = (server) ->
    # translator = new (require './../app/src/jobs/Translator')
    server.get '/', (req, res, next) ->
        res.json 200, 'ok'
        next()
    # server.get 'jobs', translator.find
    # server.post 'jobs', translator.createGroup

startServer()
