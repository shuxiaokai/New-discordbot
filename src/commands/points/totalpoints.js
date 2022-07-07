const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class TotalPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'totalpoints',
      aliases: ['totalp', 'tp'],
      usage: 'totalpoints <user mention/ID>',
      description: 'Fetches a user\'s total points. If no user is given, your own total points will be displayed.',
      type: client.types.POINTS,
      examples: ['totalpoints @User']
    });
  }
  async run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || 
      message.guild.members.cache.get(args[0]) || 
      message.member;
    const points = await message.client.mongodb.users.selectTotalPoints(member.id, message.guild.id);
    const embed = new MessageEmbed()
      .setTitle(`${member.displayName}'s Total Points`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addField('Member', `${message.member}`, true)
      .addField('Points', `\`${points}\``, true)
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      })
      .setTimestamp()
      .setColor(member.displayHexColor);
    message.channel.send({embeds: [embed]});
  }
};
