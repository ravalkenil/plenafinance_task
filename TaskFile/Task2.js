const aaveContractABI1 = require("./AbI/aaveContractAbi.json");
const { ethers } = require("ethers");
require("dotenv").config();

async function depositERC20ToAave() {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-mumbai.blockpi.network/v1/rpc/public"
    );
    const privateKey = process.env.PRIVATE_KEY;
    const aaveContractAddress = "0xcC6114B983E4Ed2737E9BD3961c9924e6216c704";
    const aaveContractABI = aaveContractABI1;
    const wallet = new ethers.Wallet(privateKey, provider);
    const aaveContract = new ethers.Contract(
      aaveContractAddress,
      aaveContractABI,
      wallet
    );
    const erc20TokenAddress = "0x52D800ca262522580CeBAD275395ca6e7598C014"; // Replace with the ERC20 token contract address
    const erc20TokenABI = [
      {
        constant: false,
        inputs: [
          {
            name: "_spender",
            type: "address",
          },
          {
            name: "_value",
            type: "uint256",
          },
        ],
        name: "approve",
        outputs: [
          {
            name: "",
            type: "bool",
          },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    const erc20TokenContract = new ethers.Contract(
      erc20TokenAddress,
      erc20TokenABI,
      wallet
    );
    const amountToDeposit = ethers.utils.parseUnits("0.000000001", 18);
    console.log(Number(amountToDeposit));
    await erc20TokenContract.approve(aaveContractAddress, amountToDeposit);
    const tx = await aaveContract.deposit(
      erc20TokenAddress,
      amountToDeposit,
      "0x03A25c6E4BcCD4c5F28b2F0cf62d144bC1d4a6d4",
      "0",
      { gasLimit: 300000, gasPrice: ethers.utils.parseUnits("50", "gwei") }
    );
    await tx.wait();
    console.log("Deposit successful!");
  } catch (error) {
    console.error("Error during deposit:", error);
  }
}

depositERC20ToAave();
