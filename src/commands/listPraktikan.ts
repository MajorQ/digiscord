import { Message } from 'discord.js';
import { google } from 'googleapis';
import Command from '../model/Command';

const listPraktikan: Command = {
	name: 'List Praktikan',
	description:
		'Lists the student ids of all practicants that are in the sheet',
	hidden: false,
	disabled: false,
	action: async function (_, message: Message): Promise<void> {
		message.channel.send('Looking up...');

		const sheets = google.sheets({ version: 'v4' });

		try {
			const req = await sheets.spreadsheets.values.get({
				spreadsheetId: '1Sy7BRZI1Dx5FTmdrqvyys-zLOUxGmQq0HcgLy6KEN6U',
				range: `Kehadiran!A:A`,
				majorDimension: 'COLUMNS'
			});

			const res = req.data;

			console.log(res);
		} catch (error) {
			console.error(error);
		}

		message.channel.send('Done!');
	}
};

export default listPraktikan;
