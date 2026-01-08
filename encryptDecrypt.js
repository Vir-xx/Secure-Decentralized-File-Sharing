const CryptoJS = require("crypto-js");
const fs = require("fs");

const SECRET_KEY = "my-very-strong-secret-key";


const fileData = fs.readFileSync("sample.txt", "utf8");


const encrypted = CryptoJS.AES.encrypt(fileData, SECRET_KEY).toString();


fs.writeFileSync("encrypted.txt", encrypted);


const decryptedBytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);


fs.writeFileSync("decrypted.txt", decryptedText);

console.log("✅ File encrypted and decrypted successfully");
