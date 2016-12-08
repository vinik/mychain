// appear noise forest melody any bachelor parade near borrow leopard quote obtain
// XgrshGBWt9oLvVR9gQWJnRoiXy9kzQaGj6
// Path: /p2pkh/XgrshGBWt9oLvVR9gQWJnRoiXy9kzQaGj6/


var openchain = require("openchain");
var bitcore = require("bitcore-lib");
var Mnemonic = require("bitcore-mnemonic");

// var client = new openchain.ApiClient("http://localhost:8080/");

// var seed = new Buffer("shoot tissue again shove critic energy shiver blush cake foil aspect donkey", 'base64');
// var seed = new Buffer("shoot tissue again shove critic energy shiver blush cake foil aspect donkey").toString('hex');
var code = new Mnemonic("shoot tissue again shove critic energy shiver blush cake foil aspect donkey");

// console.log(seed);

// Load a private key from a seed
// var privateKey = bitcore.HDPrivateKey.fromSeed(seed, "openchain");
var derivedKey = code.toHDPrivateKey(null, "livenet");
var publicKey = derivedKey.xprivkey;
var address = publicKey.toString();

var walletPath = "/p2pkh/" + address + "/";

//XuxW5UDQh6sZZhtM97VKck7qSigvPoDREw
console.log(walletPath);
