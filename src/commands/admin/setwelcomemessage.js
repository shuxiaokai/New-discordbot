const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine } = require('common-tags');

module.exports = class SetWelcomeMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setwelcomemessage',
      aliases: ['setwelcomemsg', 'setwm', 'swm'],
      usage: 'setwelcomemessage <message>',
      description: oneLine`
        Sets the message Any Bot will say when someone joins your server.
        You may use \`?member\` to substitute for a user mention,
        \`?username\` to substitute for someone's username,
        \`?tag\` to substitute for someone's full Discord tag (username + discriminator),
        \`?size\` to substitute for your server's current member count,
        \`?guild\` to substitute for your server's name,
        Enter no message to clear the current \`welcome message\`.
        A \`welcome channel\` must also be set to enable welcome messages.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setwelcomemessage ?member has joined the server!']
    });
  }
  async run(message, args) {

    let { welcomeChannelID: welcomeChannelId, welcomeMessage: oldWelcomeMessage } = 
      await message.client.mongodb.settings.selectRow(message.guild.id);

      if(oldWelcomeMessage[0].data.text){
        oldWelcomeMessage = oldWelcomeMessage[0].data.text;
      } else {
        oldWelcomeMessage = null;
      }
      
    let welcomeChannel = message.guild.channels.cache.get(welcomeChannelId);

    // Get status
    const oldStatus = message.client.utils.getStatus(welcomeChannelId, oldWelcomeMessage);

    const embed = new MessageEmbed()
      .setTitle('Settings: `Welcomes`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`welcome message\` was successfully updated. ${success}`)
      .addField('Channel', welcomeChannel ? `${welcomeChannel}` : '`None`', true)
      .setFooter({text: message.member.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true })})
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    if (!args[0]) {
      await message.client.mongodb.settings.updateWelcomeMessage(null, message.guild.id);

      // Update status
      const status = 'disabled';
      const statusUpdate = (oldStatus !== status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;

      return message.channel.send({embeds:[embed
        .addField('Status', statusUpdate, true)
        .addField('Message', '`None`')
      ]});
    }
    
    let welcomeMessage = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    await message.client.mongodb.settings.updateWelcomeMessage(welcomeMessage, message.guild.id);
    if (welcomeMessage.length > 1024) welcomeMessage = welcomeMessage.slice(0, 1021) + '...';

    // Update status
    const status =  message.client.utils.getStatus(welcomeChannel, welcomeMessage);
    const statusUpdate = (oldStatus !== status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;

    message.channel.send({embeds:[embed
      .addField('Status', statusUpdate, true)
      .addField('Message', message.client.utils.replaceKeywords(welcomeMessage))
    ]});
  }
};