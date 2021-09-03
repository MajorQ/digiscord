import { Message } from 'discord.js';
import Command from '../model/Command';
import { getStudentIds, sendAttendance } from '../utils/sheets';

const absen: Command = {
	name: 'Absen',
	description: 'Get attendance of all students in voice channels',
	hidden: false,
	disabled: false,
	action: async function (_, message: Message): Promise<void> {
		// Group request for performance
		const reqs = await Promise.all([
			message.guild?.channels.fetch(),
			getStudentIds()
		]);

		const channels = reqs[0];
		const voiceChannels = channels?.filter((c) => c.type == 'GUILD_VOICE');

		const totalStudentIds = reqs[1];
		const connectedStudentIds: string[] = [];
		let invalid = 0;

		// Check name for each member in every voice channel
		// TODO: refactor (?)
		voiceChannels?.forEach((vc) => {
			vc.members.forEach((m) => {
				const studentId = m.nickname ?? '';

				// Regex to test nama (NPM) and get NPM in group 1
				const regex = /.*[(]([0-9]{10})[)]/;
				const match = studentId.match(regex);

				if (match) {
					connectedStudentIds.push(match[1]);
				} else {
					invalid++;
				}
			});
		});

		const attendance = totalStudentIds?.map((id) =>
			connectedStudentIds.includes(id) ? 1 : 0
		);

		// TODO: refactor
		if (attendance) {
			const res = await sendAttendance(attendance);

			if (res) {
				message.channel.send('Done!');
			} else {
				message.channel.send('Uh oh! An error occured!');
			}
		} else {
			message.channel.send('Uh oh! An error occured!');
		}
	}
};

export default absen;
