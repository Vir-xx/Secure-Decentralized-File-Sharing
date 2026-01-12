// DOM Elements
const connectWalletBtn = document.getElementById("connectWalletBtn");
const walletAddressText = document.getElementById("walletAddress");

// Check if MetaMask is installed
if (typeof window.ethereum === "undefined") {
  alert("MetaMask is not installed. Please install it to use this app.");
}

// Connect Wallet
connectWalletBtn.addEventListener("click", async () => {
  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const account = accounts[0];
    walletAddressText.innerText = `Connected: ${account}`;
    connectWalletBtn.innerText = "Wallet Connected ✅";
    connectWalletBtn.disabled = true;
  } catch (error) {
    console.error(error);
    alert("Wallet connection failed");
  }
});
const encryptUploadBtn = document.getElementById("encryptUploadBtn");
const fileInput = document.getElementById("fileInput");
const ipfsStatus = document.getElementById("ipfsStatus");
const cidInput = document.getElementById("cidInput");

// ⚠️ Replace with your Pinata JWT
const PINATA_JWT = "PASTE_YOUR_PINATA_JWT_HERE";


// Simple AES-GCM encryption using Web Crypto API
async function encryptFile(file) {
  const data = await file.arrayBuffer();

  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );

  return new Blob([iv, new Uint8Array(encryptedData)], {
    type: "application/octet-stream",
  });
}

// Upload encrypted file to IPFS
async function uploadToIPFS(encryptedBlob) {
  const formData = new FormData();
  formData.append("file", encryptedBlob);

  const response = await fetch(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("IPFS upload failed");
  }

  const result = await response.json();
  return result.IpfsHash;
}

// Button click handler
encryptUploadBtn.addEventListener("click", async () => {
  try {
    if (!fileInput.files.length) {
      alert("Please select a file first");
      return;
    }

    ipfsStatus.innerText = "Encrypting file...";
    const encryptedBlob = await encryptFile(fileInput.files[0]);

    ipfsStatus.innerText = "Uploading to IPFS...";
    const cid = await uploadToIPFS(encryptedBlob);

    ipfsStatus.innerText = `Uploaded to IPFS ✅ CID: ${cid}`;
    cidInput.value = cid;
  } catch (err) {
    console.error(err);
    ipfsStatus.innerText = "❌ Upload failed";
  }
});

const storeCidBtn = document.getElementById("storeCidBtn");
const receiverInput = document.getElementById("receiverInput");
const txStatus = document.getElementById("txStatus");

// 🔁 Replace with YOUR deployed contract address
const CONTRACT_ADDRESS = "0x649c35347fE4b2AA984e5282dD0def8CF4827D5D";

// ABI (only required functions)
const CONTRACT_ABI = [
  "function uploadFile(string _cid, address _receiver) public",
];

// Store CID on Blockchain
storeCidBtn.addEventListener("click", async () => {
  try {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }

    const cid = cidInput.value.trim();
    const receiver = receiverInput.value.trim();

    if (!cid || !receiver) {
      alert("CID and receiver address required");
      return;
    }

    txStatus.innerText = "Preparing transaction...";

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    txStatus.innerText = "Sending transaction...";
    const tx = await contract.uploadFile(cid, receiver);

    txStatus.innerText = "Waiting for confirmation...";
    await tx.wait();

    txStatus.innerText = `Transaction confirmed ✅
Tx Hash: ${tx.hash}`;
  } catch (err) {
    console.error(err);
    txStatus.innerText = "❌ Blockchain transaction failed";
  }
});

