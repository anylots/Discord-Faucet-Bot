//* Returns a transaction object which can be used to transfer to the passed address
// Pass the token Name and Network Name if the transaction is meant to be using a ERC20 token

import { CeloWallet } from "@celo-tools/celo-ethers-wrapper";
import * as dotenv from "dotenv";
import { ethers } from "ethers";

import { NonceManager } from "@ethersproject/experimental";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/3-VefB24BzwJ9dnkb9sKABundlDLZrRj");
const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
const nonceManager = new NonceManager(wallet);


module.exports = async (
	provider: ethers.providers.JsonRpcProvider,
	usrAddress: string,
	networkName: string,
): Promise<ethers.providers.TransactionResponse> => {
	// Create a wallet instance
	let wallet: ethers.Wallet;

	if (networkName == "celo") {
		wallet = new CeloWallet(process.env.WALLET_PRIVATE_KEY, provider);
	} else {
		wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
	}

	if (!wallet) throw new Error("Wallet Construction Failed!");

	let tx = await wallet.populateTransaction({
		to: usrAddress,
		value: ethers.utils.parseEther("0.05")
	});



	try {
		return (await nonceManager.sendTransaction(tx)) as ethers.providers.TransactionResponse;
	} catch (error) {
		console.log(error.code)
		if (error.code == 'NONCE_EXPIRED') {
			console.log("sendTx: NONCE_EXPIRED");
			nonceManager._initialPromise = undefined;
			nonceManager._deltaCount = 0;
			return (await nonceManager.sendTransaction(tx)) as ethers.providers.TransactionResponse;
		}
	}
};
