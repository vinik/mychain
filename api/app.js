var restify = require('restify');

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

function generateMnemonics() {
    var bitcore = require('bitcore-mnemonic');
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
    console.log(req.params.user_id);

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
            console.log(rows.length);
            if (rows.length == 0) {
                console.log("nao existe");
                var mnems = generateMnemonics();
                var rowData = {
                    user_id: req.params.user_id,
                    passphrase: mnems.code,
                    privatekey: mnems.pkey
                }
                console.log(rowData);
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
            console.log('The solution is: ', rows);

        } else {
            console.log('Error while performing Query.', err);
        }
        connection.end();
        next();
    });

    next();
}

var server = restify.createServer();
server.use(restify.CORS());
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);

server.put('wallet/:user_id', updateUser);

server.get('/query/account', respond); //param account=/p2pkh/XkvtbedzuE1Jh2ujurcruPgn5J9zkneb4i/
server.get('/info', respond); //{"namespace":"2f0d828a60f15727"}
server.get('/record', respond); //key=2f3a444154413a696e666f

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
