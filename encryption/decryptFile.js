const crypto = require("crypto");
const fs = require("fs");
const path = require("path");


const encryptedFile = path.join(__dirname, "..", "encrypted.bin");
const outputFile = path.join(__dirname, "..", "decrypted.pdf");
const keyDir = path.join(__dirname, "keys");


const aesKey = fs.readFileSync(path.join(keyDir, "aes.key"));
const iv = fs.readFileSync(path.join(keyDir, "iv.key"));


const encryptedBuffer = fs.readFileSync(encryptedFile);


const decipher = crypto.createDecipheriv("aes-256-cbc", aesKey, iv);
const decryptedData = Buffer.concat([
  decipher.update(encryptedBuffer),
  decipher.final()
]);


fs.writeFileSync(outputFile, decryptedData);

console.log("✅ File decrypted successfully");
