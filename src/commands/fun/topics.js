const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class TopicsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'topics',
      aliases: ['triviatopics', 'categories', 'ts'],
      usage: 'topics',
      description: 'Displays the list of all available trivia topics.',
      type: client.types.FUN
    });
  }
  async run(message) {
    const prefix = await message.client.mongodb.settings.selectPrefix(message.guild.id);
    const topics = [];
    message.client.topics.forEach(topic => {
      topics.push(`\`${topic}\``);
    });
    const embed = new MessageEmbed()
      .setTitle('Trivia Topics')
      .setDescription(`${topics.join(' ')}\n\nType \`${prefix}trivia [topic]\` to choose one.`)
      .setFooter({ text: message.member.displayName, icon_url: message.author.displayAvatarURL({ dynamic: true })})       
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send({embeds:[embed]});
  }
};
