const crypto = require("crypto");
const fs = require("fs");
const path = require("path");


const inputFile = path.join(__dirname, "..", "sample.pdf");
const encryptedFile = path.join(__dirname, "..", "encrypted.bin");
const keyDir = path.join(__dirname, "keys");


if (!fs.existsSync(keyDir)) {
  fs.mkdirSync(keyDir, { recursive: true });
}


const aesKey = crypto.randomBytes(32); // 256-bit key
const iv = crypto.randomBytes(16);     // 128-bit IV


const fileBuffer = fs.readFileSync(inputFile);


const cipher = crypto.createCipheriv("aes-256-cbc", aesKey, iv);
const encryptedData = Buffer.concat([
  cipher.update(fileBuffer),
  cipher.final()
]);


fs.writeFileSync(encryptedFile, encryptedData);


fs.writeFileSync(path.join(keyDir, "aes.key"), aesKey);
fs.writeFileSync(path.join(keyDir, "iv.key"), iv);

console.log("✅ File encrypted successfully");
