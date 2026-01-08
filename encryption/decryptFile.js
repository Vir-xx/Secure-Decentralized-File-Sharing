const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Paths
const encryptedFile = path.join(__dirname, "..", "encrypted.bin");
const outputFile = path.join(__dirname, "..", "decrypted.pdf");
const keyDir = path.join(__dirname, "keys");

// Read key and IV
const aesKey = fs.readFileSync(path.join(keyDir, "aes.key"));
const iv = fs.readFileSync(path.join(keyDir, "iv.key"));

// Read encrypted file
const encryptedBuffer = fs.readFileSync(encryptedFile);

// Decrypt
const decipher = crypto.createDecipheriv("aes-256-cbc", aesKey, iv);
const decryptedData = Buffer.concat([
  decipher.update(encryptedBuffer),
  decipher.final()
]);

// Save decrypted file
fs.writeFileSync(outputFile, decryptedData);

console.log("✅ File decrypted successfully");
