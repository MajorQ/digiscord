import { Client, Message } from 'discord.js';
import Command from '../model/Command';

const absen: Command = {
	name: 'Absen',
	description: '',
	hidden: false,
	disabled: false,
	action: function (
		client: Client<boolean>,
		message: Message,
		args?: string[]
	): void {
		throw new Error('Function not implemented.');
	}
};
