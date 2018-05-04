/** jshint -W038z8  */

//
const time = Date(),
stitch = require("mongodb-stitch"),
pak = require('./package.json'),
discord = require('discord.js'),
config = require('./config.json'),
profanities = require("./profanities.json"),
bot = new discord.Client(),
prefix = process.env.prefix,
{baselogger} = require('./logger.js'),
result = Math.round(Math.random()),
updates = ["Cleverbot is now enabled!"],
webhookchannelid = "441710517460008960"
config.updates = updates.join(' ')
var filteron = "false",
cleverbot = require('cleverbot.io'),
cb = new cleverbot("sMNApmkOjMlZRlPZ", "gskxw3JBqEVGIAboBjOnvyTf8awM1MbS")
// End of init

bot.invite = "https://discord.gg/qEFNkxB"

// Gather commands
bot.commands = new discord.Collection();

require('fs').readdir("./commands/", (err, files) => {
  console.log("Loading commands...");
  if (err) return console.log(`Command loading failed!`);
  files.filter(f => f.split(".").pop() === "js").forEach((f, i) => {
    bot.commands.set(require(`./commands/${f}`).help.name, require(`./commands/${f}`));
  });
});

bot.on("ready", () => {
  let upmsg = `Oh yeah, more updates! New updates:\n${updates}`
  bot.channels.get('441982405985828864').send(upmsg)
  bot.channels.get('441982440005697539').send(upmsg)
  require('./events/vote.js')(bot)
  require('./util/poststats.js')(bot)
  require('./util/consoles.js')(bot, config)
  bot.user.setActivity("Loading Hulkbot...", {type: "STREAMING", url: "https://twitch.tv/freakinghulk"})
  
  setTimeout(() => {
    bot.user.setActivity(`for h!help | ${bot.guilds.array().length} servers`, {type: "WATCHING"});
  }, 20000)

  bot.guilds.forEach((guild, id) => {
    console.log(`[SERVER] [${guild.memberCount}] ${guild.name} (${guild.id}) | Joined: ${guild.joinedAt.toString()}\n`)

  });
});
bot.on("guildMemberAdd", (member) => require('./events/guildMemberAdd.js')(bot, member))
bot.on("guildMemberRemove", (member) => require('./events/guildMemberRemove.js')(bot, member))
bot.on("guildBanAdd", (guild, member) => require('./events/BanAdd.js')(bot, guild, member))
//bot.on("guildBanRemove", (guild, member) => require('./events/BanRemove.js')(bot, guild, member))
 
bot.on("message", message => {
 if (filteron == "true") {
    for (x = 0; x < profanities.length; x++) {
      if (message.cleanContent.toLowerCase().includes(profanities[x].toLowerCase())) {
        console.log(`[Profanity] ${message.author.username}, said ${profanities[x]} in the ${message.channel.name} channel!`);
        message.channel.send(`<@${message.author.id}>, LANGUAGE!`).then(m => m.delete(10000));
        message.delete(500);
        return;
      }
    }
  }
  if (message.channel.type == "dm") {
    require('./events/cleverbot.js')(bot, message, cb, prefix)
  } else {
    if (!message.content.startsWith(prefix)) return;
  }

  let mArray = message.content.split(" ");
  let args = mArray.slice(1);
  let loggedcmd = mArray[0].slice(prefix.length)

  let cmd = bot.commands.get(loggedcmd);
  if (message.author.bot) return;

  if (cmd) {
    
      if (config.userblacklist.includes(message.author.id)) return;
        cmd.run(bot, message, args, discord);  
        console.log(`${message.author.username} used the ${loggedcmd} command.`);
        if (message.guild.id == "427846834225020928") {
        return;
    } else {
        baselogger(bot, `**Command Run**\n\n**Command:** ${loggedcmd}\n**User:** ${message.author.tag}\n**Message:** ${message.content}\n**Guild:** ${message.guild.name}\n**Channel:** ${message.channel.name}`);
    }
  } 
});

bot.on("message", (message, err) => {
  if (message.content == prefix) {
    let channel = message.channel;
    
    channel.send("Sorry, that's not a command. :stuck_out_tongue:").then(m => m.delete(1000));
  }
  if (message.content == prefix + "filteroff") {
    // Prevents Unauthorized Users from accessing filters
    if (message.member.hasPermission("MANAGE_GUILD")) {
      filteron = "false";
      message.channel.send("Okay, I turned my filters off!");
      console.log(`${message.author.tag} turned the filters off.`);
    } else {
      return message.channel.send("Sorry, you don't have the required permissions!");
    }
  }
  if (message.content == prefix + "filteron") {
    // Prevents Unauthorized Users from accessing filters
    if (message.member.hasPermission("MANAGE_GUILD")) {
      filteron = "true";
      message.channel.send("Okay, I turned my filters back on!");
      console.log(`${message.author.tag} turned the filters on.`);
    } else {
      return message.channel.send("Sorry, but you don't have the required permissions.");
    }
    if (message.content == prefix + "coinflip") {
      if (result) {
    message.channel.send("**Coin Flip:**\nThe coin landed on heads.");
      }
      else {
        message.channel.send("**Coin Flip:***\nThe coin landed on tails.");
}}}
  if (message.content.toLowerCase().includes("i love you hulkbot")) {
    message.channel.send("oh god, not another one");
  }
  if (message.content.includes(`<@294194506113220608>`)) {
      let embed = new discord.RichEmbed()
      .setTitle("Hulkbot for Beginners")
      .setDescription("YUP! It's me, Hulkbot! To see more info on me, use the info command. (h!info)")
      .setColor("PURPLE")
      .setThumbnail(bot.user.avatarURL)
      .setTimestamp()
   message.channel.send({embed: embed})
  }
  
 });
      
bot.on("guildCreate", (guild) => {
  require('./mysql.js')(bot, guild)
  require('./events/guildCreate.js')(bot, guild, discord)
  baselogger(bot, `**Guild Join**\n\n**Guild:** ${guild.name}\n**Owner:** ${guild.owner.user.tag}\n**Large:** ${guild.large}\n**Member Count:** ${guild.memberCount}\n\n**Total Guilds:** ${bot.guilds.array().length}`, guild.iconURL);
});

bot.on("guildDelete", (guild) => {
  // require('./mysql2.js')(bot, guild)
  require('./events/guildDelete.js')(bot, guild, discord)
  baselogger(bot, `**Guild Leave**\n\n**Guild:** ${guild.name}\n**Owner:** ${guild.owner.user.tag}\n**Large:** ${guild.large}\n**Member Count:** ${guild.memberCount}\n\n**Total Guilds:** ${bot.guilds.array().length}`, guild.iconURL);
});

bot.login(process.env.botToken); 

exports.date = time
exports.bot = bot
exports.updates = updates.join(" ")
