// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity('видосы Деда Бюрера', { type: 'WATCHING' });
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  
  if(command === "пинг") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("понг!)");
  }
  
  if(command === "кик") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["Внучёчки", "Дед Бюрер"].includes(r.name)) )
      return message.reply("Ты не модератор!");
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Кого кикать-то?!");
    if(!member.kickable) 
      return message.reply("Этого человека нельзя кикнуть...");
      if(member.hasPermission(`MANAGE_MESSAGES`)) 
      return message.reply("Этого человека нельзя кикнуть...");

    
    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) 
    return message.reply("Укажи причину кика.");
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Прости, ${message.author} я не могу кикнуть потому, что : ${error}`));
    message.reply(`${member.user.tag} был кикнут ${message.author.tag}, потому что: ${reason}`);

  }
  
  if(command === "бан") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["Внучёчки", "Дед Бюрер"].includes(r.name)) )
      return message.reply("Ты не модератор!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Кого кикать-то?");
    if(!member.bannable) 
    return message.reply("Этого человека нельзя забанить...");

    let reason = args.slice(1).join(' ');
    if(!reason) 
    return message.reply("Укажи причину кика.");
    
    await member.ban(reason)
      .catch(error => message.reply(`Прости, ${message.author} я не могу кикнуть потому, что : ${error}`));
      message.reply(`${member.user.tag} был забанен ${message.author.tag}, потому что: ${reason}`);
  }
  
  if(command === "удалить") {
    // This command removes all messages from all users in the channel, up to 100.
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Укажи количество сообщений к удалению (до 100)");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Не могу удалить сообщения потому, что: ${error}`));
  }
});

client.login(config.token);
