const CryptoJS = require("crypto-js");
const fs = require("fs");

// Secret key (later this will be encrypted using public key)
const SECRET_KEY = "my-very-strong-secret-key";

// Read file
const fileData = fs.readFileSync("sample.txt", "utf8");

// Encrypt
const encrypted = CryptoJS.AES.encrypt(fileData, SECRET_KEY).toString();

// Save encrypted file
fs.writeFileSync("encrypted.txt", encrypted);

// Decrypt
const decryptedBytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);

// Save decrypted file
fs.writeFileSync("decrypted.txt", decryptedText);

console.log("✅ File encrypted and decrypted successfully");
