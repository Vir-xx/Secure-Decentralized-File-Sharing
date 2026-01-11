const axios = require("axios");
const fs = require("fs");
const path = require("path");

const CID = "QmYnwTmgR5qDXM3UmLjTyaLS2vR6F1wVyZx5RgrgpaxAJf";
const outputPath = path.join(__dirname, "..", "downloaded.bin");

async function downloadFile() {
  const url = `https://gateway.pinata.cloud/ipfs/${CID}`;
  const response = await axios.get(url, { responseType: "arraybuffer" });

  fs.writeFileSync(outputPath, response.data);
  console.log("✅ File downloaded from IPFS");
}

downloadFile().catch(console.error);
