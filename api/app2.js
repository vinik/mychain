var restify = require('restify');
var openchain = require('openchain');
var client = new openchain.ApiClient("http://openchain-server:8080/");

function checkAuth0(id_token) {

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
            // next();
        }
        console.log(userInfo);

        user_id = userInfo.user_id;
    });

}

function getWalletAddress(seed) {
    var hexSeed = new Buffer(seed).toString('hex');

    // Load a private key from a seed
    var privateKey = bitcore.HDPrivateKey.fromSeed(seed, "openchain");
    var address = privateKey.publicKey.toAddress();

    // Calculate the accounts corresponding to the private key
    var assetPath = issuancePath;
    var walletPath = "/p2pkh/" + address + "/";
}

function getWalletAssetPath(walletPath) {
    var issuancePath = "/asset" + walletPath;
}

function queryAccount(walletPath) {
}
function queryAccount(req, res, next) {
    var id_token = req.authorization.credentials;
    
    client.getAccountRecord(
    // Account path
    walletPath,
    // Asset path
    getWalletAssetPath(walletPath)).then(function (result) {
        console.log("Balance: " + result.balance.toString());
    });
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

// server.put('wallet/:user_id', updateUser);

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
  } else
    return res.send(new restify.MethodNotAllowedError());
}

server.on('MethodNotAllowed', unknownMethodHandler);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
