import { ethers } from "ethers";
import Certificate from "../abi/Certificate.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Used for READ-ONLY operations (like scanning a QR code on a phone without MetaMask)
export const getProviderContract = () => {
    // Connect directly to the local hardhat node instead of relying on MetaMask
    const provider = new ethers.JsonRpcProvider("http://192.168.0.202:8545"); 
    return new ethers.Contract(CONTRACT_ADDRESS, Certificate.abi, provider);
};

export const getContract = async () => {
  if (!window.ethereum) {
    alert("MetaMask not installed");
    return null;
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x7A69" }],
    });
  } catch (error) {
    // If network not added, add it
    if (error.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x7A69",
            chainName: "Hardhat Local",
            rpcUrls: ["http://127.0.0.1:8545"],
            nativeCurrency: {
              name: "ETH",
              symbol: "ETH",
              decimals: 18,
            },
          },
        ],
      });
    } else {
      console.error(error);
      return null;
    }
  }

  await window.ethereum.request({ method: "eth_requestAccounts" });

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(CONTRACT_ADDRESS, Certificate.abi, signer);
};
