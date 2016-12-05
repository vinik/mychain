var restify = require('restify');

// var Auth0Strategy = require('passport-auth0');
// var passport = require('passport-restify');
// var strategy = new Auth0Strategy({
//     domain:       'vinik.auth0.com',
//     clientID:     'weRGYvj1bVbHDCBfEsqFA3cssasg0HkF',
//     clientSecret: 'neZzO9dAdwCxKl8bvTozeIIpQcRClWVFuOWaqTUwfeqOWawqfxrM2OlFxwU1BXrO',
//     callbackURL:  '/callback'
// }, function(accessToken, refreshToken, extraParams, profile, done) {
//     console.log("============ PASSPORT =============");
//     console.log(accessToken, refreshToken, extraParams, profile);
//     // accessToken is the token to call Auth0 API (not needed in the most cases)
//     // extraParams.id_token has the JSON Web Token
//     // profile has all the information from the user
//     return done(null, profile);
// });
// passport.use(strategy);
//
// var auth0_callback_handler = passport.authenticate('auth0', { failureRedirect: '/login' });

// function respond(req, res, next) {
//   res.send('hello ' + req.params.name);
//   next();
// }

function generateMnemonics() {
    // var bitcore = require('bitcore-mnemonic');
    var Mnemonic = require('bitcore-mnemonic');
    var code = new Mnemonic();
    var xpriv = code.toHDPrivateKey('justapassword', 'openchain');
    var obj = {
        code:code.toString(),
        pkey: xpriv.toString()
    };
    return obj;
}

function updateUser(req, res, next) {
    // console.log(req.params.user_id);

    var mysql      = require('mysql');
    var connectionInfo = {
        host     : 'db',
        user     : 'root',
        password : 'password',
        database : 'mychain'
    }
    var connection = mysql.createConnection(connectionInfo);
    connection.connect();
    connection.on('error', function(err) {
        console.log(err.code); // 'ER_BAD_DB_ERROR'
    });

    connection.query({
        sql: 'SELECT * from wallets where user_id = ?',
        values: [req.params.user_id],
    }, function(err, rows, fields) {
        if (!err) {
            // console.log(rows.length);
            if (rows.length == 0) {
                console.log("nao existe");
                var mnems = generateMnemonics();
                var rowData = {
                    user_id: req.params.user_id,
                    passphrase: mnems.code,
                    privatekey: mnems.pkey
                }
                // console.log(rowData);
                var connection2 = mysql.createConnection(connectionInfo);
                connection2.connect();
                connection2.on('error', function(err) {
                    console.log(err.code); // 'ER_BAD_DB_ERROR'
                });
                connection2.query({
                    sql: 'INSERT INTO wallets SET ?',
                    values: [ rowData ]
                }, function (err, result) {
                    if (!err) {
                        console.log(result)
                    } else {
                        console.log(err)
                    }
                    connection2.end();
                });
                next();
            } else {
                if (!rows[0].passphrase) {
                    var connection3 = mysql.createConnection(connectionInfo);
                    connection3.connect();
                    connection3.on('error', function(err) {
                        console.log(err.code); // 'ER_BAD_DB_ERROR'
                    });

                    var menms = generateMnemonics();

                    connection3.query({
                        sql: 'UPDATE wallets SET passphrase = ?, privatekey = ? WHERE user_id = ?',
                        values: [ mnems.code, mnems.key, req.params.user_id ]
                    }, function (err, result) {
                        if (!err) {
                            console.log(result)
                        } else {
                            console.log(err)
                        }
                        connection3.end();
                    });
                    next();
                }
            }
            // console.log('The solution is: ', rows);

        } else {
            console.log('Error while performing Query.', err);
        }
        connection.end();
        next();
    });

    next();
}

function queryAccount(req, res, next) {
    console.log("========= queryAccount ==========")
    //console.log(req, res);
    // console.log(req.authorization);
    var id_token = req.authorization.credentials;
    var AuthenticationClient = require('auth0').AuthenticationClient;
    var auth0 = new AuthenticationClient({
        domain: 'vinik.auth0.com',
        clientId: 'weRGYvj1bVbHDCBfEsqFA3cssasg0HkF',
        secret: 'neZzO9dAdwCxKl8bvTozeIIpQcRClWVFuOWaqTUwfeqOWawqfxrM2OlFxwU1BXrO'
    });

    auth0.getProfile(id_token, function(err, userInfo){
        if (err) {
            // Handle error.
            console.log(err);
            next();
        }
        console.log(userInfo);

        user_id = userInfo.user_id;

        var mysql      = require('mysql');
        var connectionInfo = {
            host     : 'db',
            user     : 'root',
            password : 'password',
            database : 'mychain'
        }
        var connection = mysql.createConnection(connectionInfo);
        connection.connect();
        connection.on('error', function(err) {
            console.log(err.code); // 'ER_BAD_DB_ERROR'
        });

        connection.query({
            sql: 'SELECT * from wallets where user_id = ?',
            values: [user_id],
        }, function(err, rows, fields) {
            if (!err) {

                var request = require('request');

                request('http://openchain-server:8080/query/account?account='+rows., function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body)
                    }
                });

            } else {
                console.log('Error while performing Query.', err);
            }
            connection.end();
            next();
        });
        next();
    });

    next();

}

var server = restify.createServer();
server.use(restify.CORS({
    origins: ['*'],   // defaults to ['*']
    credentials: true,                 // defaults to false
    headers: ['x-foo']                 // sets expose-headers
}));
server.use(restify.authorizationParser());

// server.use(passport.initialize());
// server.get('/hello/:name', respond);
// server.head('/hello/:name', respond);

server.put('wallet/:user_id', updateUser);

server.get('/query/account/', queryAccount); //param account=/p2pkh/XkvtbedzuE1Jh2ujurcruPgn5J9zkneb4i/
server.get('/info', queryAccount); //{"namespace":"2f0d828a60f15727"}
server.get('/record', queryAccount); //key=2f3a444154413a696e666f

function unknownMethodHandler(req, res) {
  if (req.method.toLowerCase() === 'options') {
      console.log('received an options method request');
    var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version', 'Origin', 'X-Requested-With', 'Authorization']; // added Origin & X-Requested-With

    if (res.methods.indexOf('OPTIONS') === -1) res.methods.push('OPTIONS');

    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
    res.header('Access-Control-Allow-Methods', res.methods.join(', '));
    res.header('Access-Control-Allow-Origin', req.headers.origin);

    return res.send(204);
  }
  else
    return res.send(new restify.MethodNotAllowedError());
}

server.on('MethodNotAllowed', unknownMethodHandler);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
