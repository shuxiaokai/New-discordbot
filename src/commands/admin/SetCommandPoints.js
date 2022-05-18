const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');

module.exports = class SetCommandPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcommandpoints',
      aliases: ['setcp', 'scp'],
      usage: 'setcommandpoints <point count>',
      description: 'Sets the amount of points earned per Any Bot command used.',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setcommandpoints 5']
    });
  }
  async run(message, args) {
    const amount = args[0];
    if (!amount || !Number.isInteger(Number(amount)) || amount < 0) 
      return await this.sendErrorMessage(message, 0, 'Please enter a positive integer');
    const { 
      pointTracking: pointTracking,
      messagePoints: messagePoints,
      commandPoints: commandPoints,
      voicePoints: voicePoints
    } = await message.client.mongodb.settings.selectRow(message.guild.id);

    const status = message.client.utils.getStatus(pointTracking);
    await message.client.mongodb.settings.updateCommandPoints(amount, message.guild.id);
    const embed = new MessageEmbed()
      .setTitle('Settings: `Points`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`command points\` value was successfully updated. ${success}`)
      .addField('Message Points', `\`${messagePoints}\``, true)
      .addField('Command Points', `\`${commandPoints}\` ➔ \`${amount}\``, true)
      .addField('Voice Points', `\`${voicePoints}\``, true)
      .addField('Status', `\`${status}\``)
      .setFooter({text:message.member.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true })})
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send({embeds: [embed]});
  }
};
