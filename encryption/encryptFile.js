const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Paths
const inputFile = path.join(__dirname, "..", "sample.pdf");
const encryptedFile = path.join(__dirname, "..", "encrypted.bin");
const keyDir = path.join(__dirname, "keys");

// Ensure keys directory exists
if (!fs.existsSync(keyDir)) {
  fs.mkdirSync(keyDir, { recursive: true });
}

// Generate AES-256 key and IV
const aesKey = crypto.randomBytes(32); // 256-bit key
const iv = crypto.randomBytes(16);     // 128-bit IV

// Read input file as binary
const fileBuffer = fs.readFileSync(inputFile);

// Encrypt file
const cipher = crypto.createCipheriv("aes-256-cbc", aesKey, iv);
const encryptedData = Buffer.concat([
  cipher.update(fileBuffer),
  cipher.final()
]);

// Save encrypted file
fs.writeFileSync(encryptedFile, encryptedData);

// Save key and IV (temporary for learning)
fs.writeFileSync(path.join(keyDir, "aes.key"), aesKey);
fs.writeFileSync(path.join(keyDir, "iv.key"), iv);

console.log("✅ File encrypted successfully");
