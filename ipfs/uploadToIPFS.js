require("dotenv").config();
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "encrypted.bin");

async function uploadFile() {
  const data = new FormData();
  data.append("file", fs.createReadStream(filePath));

  const response = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    data,
    {
      maxBodyLength: "Infinity",
      headers: {
        ...data.getHeaders(),
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY
      }
    }
  );

  console.log("✅ File uploaded to IPFS");
  console.log("📌 CID:", response.data.IpfsHash);
}

uploadFile().catch(console.error);
