var keythereum = require("keythereum");
var dk = keythereum.create();
var keyObject = keythereum.dump('eduadiez', dk.privateKey, dk.salt, dk.iv, {kdf : "scrypt"});
keythereum.exportToFile(keyObject);


