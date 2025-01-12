import { EmbedFieldData, Message, MessageEmbed } from 'discord.js';

export { errorMessage, processingMessage, resultMessage };

const errorMessage = (message: Message) => {
	const messageEmbed = new MessageEmbed();

	messageEmbed.setDescription('Uh oh! An error occured!');

	message.channel.send({ embeds: [messageEmbed] });
};

const processingMessage = (message: Message) => {
	message.channel.send('Processing...');
};

const resultMessage = (
	message: Message,
	title: string,
	description: string,
	url: string,
	fields?: EmbedFieldData[]
) => {
	const messageEmbed = new MessageEmbed();

	messageEmbed.setTitle(title);
	messageEmbed.setDescription(description);
	messageEmbed.setURL(url);

	if (fields) messageEmbed.addFields(fields);

	message.channel.send({ embeds: [messageEmbed] });
};
