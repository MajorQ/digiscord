import { Message } from 'discord.js';
import { fetchStudentIds } from '../utils/sheets';
import Command from '../model/Command';

const listPraktikan: Command = {
	name: 'List Praktikan',
	description:
		'Lists the student ids of all practicants that are in the sheet',
	hidden: false,
	disabled: true,
	action: async function (_, message: Message): Promise<void> {
		message.channel.send('Looking up...');

		const res = await fetchStudentIds();

		if (res) {
			message.channel.send('Done!');
		} else {
			message.channel.send('Uh oh! An error occured!');
		}
	}
};

export default listPraktikan;
