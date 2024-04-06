/* 
* Users can use to claim free eth daily per account from the passed network and token
If you change this, make sure to run `pnpm bot:deletecommands && pnpm bot:addcommands`
! Rate limited
*/

import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

import { networks, tokens } from "../config/config.json";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("faucet_eth")
		.setDescription("Claim sepolia ETH from the faucet")
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
		.addStringOption(option =>
			option
				.setName("address")
				.setDescription("Paste in your wallet address")
				.setRequired(true)
		)
};
