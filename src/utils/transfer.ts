//* Returns a transaction object which can be used to transfer to the passed address
// Pass the token Name and Network Name if the transaction is meant to be using a ERC20 token

import { CeloWallet } from "@celo-tools/celo-ethers-wrapper";
import * as dotenv from "dotenv";
import { ethers } from "ethers";

import { stats, tokens } from "../config/config.json";
import erc20ABI from "../libs/erc20.json";
import { NonceManager } from "@ethersproject/experimental";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/3-VefB24BzwJ9dnkb9sKABundlDLZrRj");
const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
const nonceManager = new NonceManager(wallet);


module.exports = async (
	provider: ethers.providers.JsonRpcProvider,
	usrAddress: string,
	networkName: string,
	tokenName?: any
): Promise<ethers.providers.TransactionResponse> => {
	// Create a wallet instance
	let wallet: ethers.Wallet;

	if (networkName == "celo") {
		wallet = new CeloWallet(process.env.WALLET_PRIVATE_KEY, provider);
	} else {
		wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
	}

	if (!wallet) throw new Error("Wallet Construction Failed!");

	//* Token Transfer (ERC20)
	let address: string;
	let amount: string;

	// Get the Address from the Token List
	for (let i = 0; i < tokens.length; i++) {
		if (tokens[i].name == tokenName) {
			address = tokens[i][networkName];
			amount = tokens[i].amount.toString();
			break;
		}
	}

	if (!address) throw new Error("Address not Set to Transfer!");

	// Create contract and get decimals
	const contract = new ethers.Contract(address, erc20ABI, wallet);
	const decimals = await contract.decimals();
	console.log("decimals: " + decimals);

	// Create Transaction object
	let tx = await contract.populateTransaction.transfer(
		usrAddress,
		ethers.utils.parseUnits(amount, decimals));
	// console.log(tx)
	console.log("_deltaCount:" + nonceManager._deltaCount);


	try {
		return (await nonceManager.sendTransaction(tx)) as ethers.providers.TransactionResponse;
	} catch (error) {
		console.log(error.code)
		if (error.code == 'NONCE_EXPIRED') {
			console.log("sendTx: NONCE_EXPIRED");
			nonceManager._initialPromise = undefined;
			return (await nonceManager.sendTransaction(tx)) as ethers.providers.TransactionResponse;
		}
	}
};
