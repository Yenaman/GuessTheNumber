const Discord = require('discord.js');
const bot = new Discord.Client;

bot.on("ready", () => {
    console.log("GuessTheNumber is Ready!");
});

let limit = 2000; // You can change it through /limit command
let number = Math.floor(Math.random()* Math.floor(limit)); // You can custom it through /number command and reroll it through /reroll
let ownerID = 'put your own user ID here';
let channelID = 'put the channel ID where you want the game';
let token = `put your bot's token here`

bot.on('message', message => {
    if(message.content == "/restart") {
        if(!message.author.id == ownerID) return message.reply(`You don't have the permission to run this command.`);
        message.react('✅');
        setTimeout(function() {
        	process.exit(0);
        }, 1000);
    }
    if(message.content == "/viewnumb") {
        if(!message.author.id == ownerID) return message.reply(`You don't have the permission to run this command.`);
        message.reply(`The current number is ${number}`);
    }
    if(message.content == "/viewlim") {
        if(!message.author.id == ownerID) return message.reply(`You don't have the permission to run this command.`);
        message.reply(`The current limit is ${limit}`);
    }
    if(message.content == "/reroll") {
        if(!message.author.id == ownerID) return message.reply(`You don't have the permission to run this command.`);
        number = Math.floor(Math.random()* Math.floor(limit));
        message.author.send(`The new number is ${number}`);
    }
    if(message.content.startsWith("/number")) {
        if(!message.author.id == ownerID) return message.reply(`You don't have the permission to run this command.`);
        const args = message.content.slice(1).trim().split(/ +/g);
        const newNumb = args.slice(1).join(" ");
        if(!newNumb) return message.reply(`You didn't specified a new number.`);
        number = newNumb;
        message.reply(`The number has been successfully changed to ${newNumb}!`);
    }
	if(message.content.startsWith("/limit")) {
        if(!message.author.id == ownerID) return message.reply(`You don't have the permission to run this command.`);
        const args = message.content.slice(1).trim().split(/ +/g);
        const newLim = args.slice(1).join(" ");
        if(!newLim) return message.reply(`You didn't specified a new limit.`);
        limit = newLim;
        message.reply(`The limit has been successfully changed to ${newLim} !`);
    }
    if(message.author.bot) return;
    if(message.channel.id === channelID) {
        if(!message.content.isNaN) {
            if(message.content > limit) return message.reply(`The number is between 1 and ${limit}! Try again`).then(sent => sent.delete(10000));
            if(message.content < 1) return message.reply(`The number cannot be negative! Try again`).then(sent => sent.delete(10000));
            if(message.content == number) {
                var everyone =  message.guild.roles.find("name", "@everyone");
                bot.channels.find("id", channelID).overwritePermissions(everyone, {
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: false
                });
                function unlock() {
                    bot.channels.find("id", channelID).overwritePermissions(everyone, {
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: true
                    });
                }
		message.channel.send(`<@${message.author.id}> found the correct number! It was ${number}. The channel will be unlocked in 1 minute.`);
                setTimeout(unlock, 60000);
            }
        } else return
    }
});
bot.login(token);
