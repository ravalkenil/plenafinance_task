const { ethers } = require("ethers");
require('dotenv').config();
const privateKey =process.env.PRIVATE_KEY


const provider = new ethers.providers.JsonRpcProvider(
  `https://data-seed-prebsc-1-s1.binance.org:8545`
);
const wallet = new ethers.Wallet(privateKey, provider);

const senderContractAddress = "0x71eC426Fe2be973Ac571F0Cd4a4E5F9Cdf0A3e05";
const receiverContractAddress = "0xB62c30C865067c19a7E97005d0b5ed961dB089E7";

const senderContract = new ethers.Contract(
  senderContractAddress,
  [
    {
      inputs: [
        {
          internalType: "address",
          name: "_address",
          type: "address",
        },
        {
          internalType: "bytes",
          name: "_payload",
          type: "bytes",
        },
      ],
      name: "transferFunds",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      stateMutability: "payable",
      type: "receive",
    },
  ],
  wallet
);
const receiverContract = new ethers.Contract(
  receiverContractAddress,
  [
    {
      inputs: [
        {
          internalType: "address payable",
          name: "_to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "transferEther",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      stateMutability: "payable",
      type: "receive",
    },
  ],
  wallet
);

const recipientAddress = "0xeE4120C472Cae7B90220C71E616BE64729de7B36";
const amountToTransfer = ethers.utils.parseUnits("1", "wei");

const payload = receiverContract.interface.encodeFunctionData("transferEther", [
  recipientAddress,
  amountToTransfer,
]);

// Call the transferFunds function in the Sender contract with the encoded payload
senderContract
  .transferFunds(receiverContractAddress, payload, {
    gasLimit: 300000,
    gasPrice: ethers.utils.parseUnits("50", "gwei"),
  })
  .then((tx) => {
    console.log("Transaction Sent. Waiting for confirmation...");
    return tx.wait(); // Wait for transaction confirmation
  })
  .then((receipt) => {
    console.log("Transaction Confirmed:", receipt);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
