const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

const Genius = require("genius-lyrics");
const Client = new Genius.Client(); 
module.exports = class LyricsMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'lyrics',
      usage: 'lyrics [song name]',
      description: 'Shows the lyrics to the currently-playing song',
      examples: ['lyrics Never Gonna Give You Up', 'lyrics Show Yourself CG5'],
      type: client.types.MUSIC,
    });
  }
  async run(message, args) {
    let song = args.join(' ');
      const searches = await Client.songs.search(song);
      const first_result = searches[0];
      const lyrics = await first_result.lyrics();

      if(!lyrics) return this.sendErrorMessage(message, 1, 'No lyrics found for that song.');

      if(lyrics.length > 2048) {
        const embeds = [];
        for (let i = 0; i < lyrics.length; i += 2048) {
          const embed = new MessageEmbed()
            .setColor(message.guild ? message.guild.me.displayColor : '#7CFC00')
            .setDescription(lyrics.substring(i, i + 2048));
          embeds.push(embed);
        }
        if(embeds.length > 5) {
          //Sends first 5 embeds
          let first_embed = 0
          for(let i = 0; i < 5; i++) {
            if(i % 4 === 0) {
              let newEmbedList = embeds.slice(first_embed, first_embed + 5);
              message.channel.send({embeds: newEmbedList});
              first_embed += 5;
            }
          }

      } else {
        message.channel.send({embeds: embeds});
      }

      let embed = new MessageEmbed()
      .setColor(message.guild.me.displayColor)
      .setTitle(`Lyrics for ${first_result.title}`)
      .setDescription(lyrics)
      .setFooter({
        text: `Requested by ${message.author.tag}`,
        icon_url: message.author.displayAvatarURL()
      })
      message.channel.send({embeds: [embed]});
    }
    }
  };
