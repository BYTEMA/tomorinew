const discord = require('discord.js')

module.exports = (bot, guild, member) => {
  let reason = require('../config.json').banreason
  if (reason) {
  console.log(`${member.username} was banned from ${guild.name} for ${reason}!`)
  member.send(`${member.username}, you are now banned from ${guild.name} for the reason ${reason}!`)
  } else {
    console.log(`${member.username} was banned from ${guild.name}.`)
    member.send(`${member.username}, you are now banned from ${guild.name}!`)
  }
  let log = guild.channels.find('name', 'guild-bot-log')
  let embed = new discord.RichEmbed()
  .setTitle("Log")
  if (reason) {
  embed.setDescription(`${member.username} was banned from ${guild.name} for the reason ${reason}!`)
  } else {
    embed.setDescription(`${member.username} was banned from ${guild.name}!`)
  }
  embed.setThumbnail(member.avatarURL)
  embed.setColor("RED")
  embed.setFooter(`${member.username} was banned`)
  embed.setTimestamp()
  if (log) {
    log.send({embed: embed})
  } else return console.warn(`Guild ${guild.name} has no log channel, canceling send.`);
}
