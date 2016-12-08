// appear noise forest melody any bachelor parade near borrow leopard quote obtain
// XgrshGBWt9oLvVR9gQWJnRoiXy9kzQaGj6
// Path: /p2pkh/XgrshGBWt9oLvVR9gQWJnRoiXy9kzQaGj6/

var openchain = require("openchain");
var bitcore = require("bitcore-lib");

// var seed = "0123456789abcdef0123456789abcdef";
// var seed = new Buffer("appear noise forest melody any bachelor parade near borrow leopard quote obtain").toString('hex');
var seed = new Buffer("appear noise forest melody any bachelor parade near borrow leopa").toString('hex');


// Load a private key from a seed
var privateKey = bitcore.HDPrivateKey.fromSeed(seed, "openchain");
var address = privateKey.publicKey.toAddress();

// Calculate the accounts corresponding to the private key
var issuancePath = "/asset/p2pkh/" + address + "/";
var assetPath = issuancePath;
var walletPath = "/p2pkh/" + address + "/";

console.log("Issuance path: " + issuancePath);
console.log("Wallet path: " + walletPath);
