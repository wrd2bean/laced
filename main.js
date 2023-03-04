const Discord = require('discord.js');
const client = new Discord.Client();
const { promisify } = require('util');
const random = require('random');
const fs = require('fs');

const prefix = ',';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

let welcomeMessages = {};
try {
  welcomeMessages = require('./welcomeMessages.json');
} catch (error) {
  console.error(error);
}

client.on('guildMemberAdd', member => {
  if (welcomeMessages.hasOwnProperty(member.guild.id)) {
    member.guild.channels.cache.find(channel => channel.name === 'general').send(welcomeMessages[member.guild.id].replace('{user}', member.user.username));
  }
});

client.on('message', message => {
  if (message.author.bot || !message.content.startsWith(prefix)) {
    return;
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === 'setwelc') {
    if (!message.member.hasPermission('MANAGE_GUILD')) {
      message.reply('You do not have permission to set the welcome message.');
      return;
    }

    const welcomeMessage = args.join(' ');
    welcomeMessages[message.guild.id] = welcomeMessage;
    fs.writeFile('./welcomeMessages.json', JSON.stringify(welcomeMessages, null, 2), error => {
      if (error) {
        console.error(error);
        message.reply('There was an error setting the welcome message.');
      } else {
        message.reply('The welcome message has been set.');
      }
    });
  } else if (command === 'kick') {
    if (!message.member.hasPermission('KICK_MEMBERS')) {
      message.reply('You do not have permission to kick members.');
      return;
    }

    const member = message.mentions.members.first();
    if (!member) {
      message.reply('Please mention a valid member of this server');
      return;
    }

    const kickAsync = promisify(member.kick).bind(member);

    kickAsync()
      .then(() => {
        message.reply(`bye bye, ${member.user.tag}`);
      })
      .catch(error => {
        console.error(error);
        message.reply('There was an error trying to kick this member');
      });
  } else if (command === 'ban') {
    if (!message.member.hasPermission('BAN_MEMBERS')) {
      message.reply('You do not have permission to ban members.');
      return;
    }

    const member = message.mentions.members.first();
    if (!member) {
      message.reply('Please mention a valid member of this server');
      return;
    }

    const banAsync = promisify(member.ban).bind(member);

    banAsync()
      .then(() => {
        message.reply(`${member.user.tag} was banned from the server.`);
      })
      .catch(error => {
        console.error(error);
        message.reply('There was an error trying to ban this member');
      });
  } else if (command === 'help') {
    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Available Commands')
      .addField('`setwelc <message>`', 'Sets the welcome message for this server.')
      .addField('`kick <@member>`', 'Kicks the specified member from the server.')
      .addField('`ban <@member>`', 'Bans the specified member from the server.')
      .addField('`trivia`', 'Returns a random trivia question and answer.')
      .addField('`joke`', 'Returns a random joke.')
      .addField('`meme`', 'Returns a random meme.')
      .setTimestamp();
  
    message.channel.send(embed);
    const Discord = require('discord.js');
    const client = new Discord.Client();
    const random = require('random'); // add this line
    
    client.on('ready', () => {
      console.log(`Logged in as ${client.user.tag}!`);
    });
    
    client.on('message', message => {
      if (message.content === 'ping') {
        message.reply('laced has big dick');
      } else if (message.content === 'hello') {
        message.channel.send('Hello!');
      } else if (message.content === 'joke') {
        const jokes = [
          'Why did the chicken cross the road? To get to the other side!',
          'Why don\'t scientists trust atoms? Because they make up everything!',
          'What do you call an alligator in a vest? An investigator!',
          'Why cant you hear a pterodactyl going to the bathroom? Because the “P” is silent',
          'What did the horse say after it tripped? Help! Ive fallen and I cant giddyup!',
          'whos a black monkey? shon!'
        ];
        const randomJoke = random.arrayElement(jokes);
        message.channel.send(randomJoke);
      } else if (message.content === 'meme') {
        const got = require('got');
    
        got('https://www.reddit.com/r/memes/random.json')
          .then(response => {
            const [list] = JSON.parse(response.body);
            const [post] = list.data.children;
            const permalink = post.data.permalink;
            const memeUrl = `https://reddit.com${permalink}`;
            const memeImage = post.data.url;
            const memeTitle = post.data.title;
            const memeUpvotes = post.data.ups;
            const memeDownvotes = post.data.downs;
            const memeNumComments = post.data.num_comments;
    
            const embed = new Discord.MessageEmbed()
              .setColor('#FF4500')
              .setTitle(`${memeTitle}`)
              .setURL(`${memeUrl}`)
              .setImage(memeImage)
              .setFooter(`👍 ${memeUpvotes} 👎 ${memeDownvotes} 💬 ${memeNumComments}`);
    
            message.channel.send(embed);
          })
          .catch(error => {
            console.error(error);
            message.reply('There was an error getting the meme.');
          });
      }
    });
    
    client.login('MTA4MTY0NDY0NjcyOTUyMzIyMA.GPJWdw.m8Bc2rkvnh5-2RDLGFcIpfWpMErBjlDugLPYcM');
}});