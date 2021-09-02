import { Message } from 'discord.js';
import { getNPM } from '../utils/sheets';
import Command from '../model/Command';

const listPraktikan: Command = {
	name: 'List Praktikan',
	description:
		'Lists the student ids of all practicants that are in the sheet',
	hidden: false,
	disabled: false,
	action: async function (_, message: Message): Promise<void> {
		message.channel.send('Looking up...');

		const res = await getNPM();

		if (res) {
			message.channel.send('Done!');
		} else {
			message.channel.send('Uh oh! An error occured!');
		}
	}
};

export default listPraktikan;
