//import the nem-sdk
// This is not needed if you use the repl.js script available in the container
var nem = require("nem-sdk").default;

// generate 32 random bytes. 
// You could write the 32 bytes of your choice if you prefer, but that might be dangerous as
// it would be less random.
// 
var rBytes = nem.crypto.nacl.randomBytes(32);
// convert the random bytes to an hex string
// the result, rHex, can be printed out to the console for taking a backup with console.log(rBytes).
// Take a backup copy of that value as it lets you recreate the keypair to give
// you access to your account.
// This value is also usable with the NEM NanoWallet.
var rHex = nem.utils.convert.ua2hex(rBytes);

// generate the keypair
var keyPair = nem.crypto.keyPair.create(rHex);

var address = nem.model.address.toAddress(keyPair.publicKey.toString(),  nem.model.network.data.testnet.id)

console.log("ADDRESS: " + address);
console.log("PUBLIC_KEY: " + keyPair.publicKey.toString());
console.log("PRIVATE_KEY: " + rHex);