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
		// Check if sheet is empty, fetch online members, fetch student ids
		const fetchData = await Promise.all([
			checkEmptyAttendance(),
			message.guild?.channels.fetch(undefined, { force: true }),
			fetchStudentIds()
		]);

		// If any requests fail, just abort
		if (fetchData.includes(null) || fetchData.includes(undefined)) {
			errorMessage(message);
			return;
		}

		const [isEmptySheet, channels, studentIds] = fetchData;
		const voiceChannels = channels!.filter((c) => c.type == 'GUILD_VOICE');

		// Check if attendance has already been filled
		if (!isEmptySheet) {
			resultMessage(
				message,
				'Sheet Already Filled',
				'Sheet has already been filled! Check the current module!',
				''
			);
			return;
		}

		// List student ids for each member in every voice channel
		const presentStudentIds: string[] = [];
		let invalidCount = 0;
		voiceChannels.forEach((vc) => {
			vc.members.forEach((m) => {
				const studentId = m.nickname ?? '';

				// Regex to test nama (NPM) and get NPM in group 1
				const regex = /.*[(]([0-9]{10})[)]/;
				const match = studentId.match(regex);

				if (match) {
					presentStudentIds.push(match[1]);
				} else {
					invalidCount++;
				}
			});
		});

		// Check if student is connected to a voice channel
		const attendance = studentIds!.map((id) =>
			presentStudentIds.includes(id) ? 1 : 0
		);

		// Send attendance and check for failure
		if (!(await sendAttendance(attendance))) {
			errorMessage(message);
			return;
		}

		resultMessage(
			message,
			'Attendance Taken',
			'Click on the link to check the sheet!',
			'',
			[
				{
					name: 'Total Present',
					value: presentStudentIds.length.toString()
				},
				{
					name: 'Total Absent',
					value: (
						studentIds!.length - presentStudentIds.length
					).toString()
				},
				{ name: 'Invalid Nicknames', value: invalidCount.toString() }
			]
		);
	}
};

export default absen;
