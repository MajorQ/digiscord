import { Client, Message } from 'discord.js';
import Command from '../model/Command';

const listPraktikan: Command = {
	name: 'List Praktikan',
	description: 'List semua praktikan yang ada di sheets',
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

export default listPraktikan;
