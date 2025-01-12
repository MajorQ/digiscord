import { Client, Message, Intents } from 'discord.js';
import Discord from 'discord.js';
import secret from '../secrets/bot.json';
import config from '../config.json';
import allCommands from './allCommands';
import { authorizeGoogleAPIs } from './utils/auth';

const intents = [
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.GUILD_MEMBERS
];

const client: Client = new Discord.Client({
	intents
});

client.on('messageCreate', (message: Message) => {
	try {
		if (
			message.content.startsWith(config.commandPrefix) &&
			!message.author.bot
		) {
			const args = message.content
				.slice(config.commandPrefix.length)
				.split(/ +/)
				.filter((element) => element);
			const commandString = args.shift();
			if (commandString) {
				const command = allCommands.get(commandString);
				if (command && !command.disabled) {
					command.action(client, message, args);
				}
			}
		}
	} catch (e) {
		console.log(e);
	}
});

client.on('ready', async () => {
	await authorizeGoogleAPIs();
	console.log('Discord bot ready');
});

client.login(secret.token);
