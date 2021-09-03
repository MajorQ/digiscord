import { Message } from 'discord.js';
import Command from '../model/Command';
import {
	processingMessage,
	errorMessage,
	resultMessage
} from '../utils/messages';
import {
	fetchStudentIds,
	checkEmptyAttendance,
	sendAttendance
} from '../utils/sheets';

const absen: Command = {
	name: 'Absen',
	description: 'Get attendance of all students in voice channels',
	hidden: false,
	disabled: false,
	action: async function (_, message: Message): Promise<void> {
		processingMessage(message);

		// Group request for performance
		const reqs = await Promise.all([
			checkEmptyAttendance(),
			message.guild?.channels.fetch(),
			fetchStudentIds()
		]);

		// If any requests fail, just abort
		if (reqs.includes(null) || reqs.includes(undefined)) {
			errorMessage(message);
			return;
		}

		const emptySheet = reqs[0];
		const channels = reqs[1];
		const totalStudentIds = reqs[2];

		// Check if attendance has already been filled
		if (!emptySheet) {
			resultMessage(
				message,
				'Sheet Already Filled',
				'Sheet has already been filled! Check the current module!',
				''
			);
			return;
		}

		const voiceChannels = channels!.filter((c) => c.type == 'GUILD_VOICE');
		const connectedStudentIds: string[] = [];
		let invalidCount = 0;
		let connectedCount = 0;
		let offlineCount = 0;

		// List student ids for each member in every voice channel
		voiceChannels.forEach((vc) => {
			vc.members.forEach((m) => {
				const studentId = m.nickname ?? '';

				// Regex to test nama (NPM) and get NPM in group 1
				const regex = /.*[(]([0-9]{10})[)]/;
				const match = studentId.match(regex);

				if (match) {
					connectedStudentIds.push(match[1]);
				} else {
					invalidCount++;
				}
			});
		});

		// Check if student is connected to a voice channel
		const attendance = totalStudentIds!.map((id) => {
			if (connectedStudentIds.includes(id)) {
				connectedCount++;
				return 1;
			} else {
				offlineCount++;
				return 0;
			}
		});
		const res = await sendAttendance(attendance);

		// Check if success
		if (!res) {
			errorMessage(message);
			return;
		}

		resultMessage(
			message,
			'Attendance Taken',
			'Click on the link to check the sheet!',
			'',
			[
				{ name: 'Total Present', value: connectedCount.toString() },
				{ name: 'Total Absent', value: offlineCount.toString() },
				{ name: 'Invalid Nicknames', value: invalidCount.toString() }
			]
		);
	}
};

export default absen;
