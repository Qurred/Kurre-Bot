const discord = require('discord.js');
var client = new discord.Client();
//scripts
var basics = require('./scripts/basics.js')(client);
//Jsons
var config = require('./data/config.json');
var comments = require('./addons/data/comments.json');
var members = require('./addons/data/members.json');


var komennot = [
  '!ping - palauttaa pong, enimmäkseen testaamista varten',
  '!bilis - luo uuden biljardipelin (2v2)',
  '!kiima - komento jonka niki toivoi, en tiedä miksi',
  '!pelaajat - palauttaa pelaajat',
  '!uusiPelaaja [nimi] - lisää uuden pelaajan',
  '!help - auttaa casuaaleja',
  '!komennot - mitä luulet tämän olevan?'
];

client.once('ready', () => {
  console.log('Currently running version: ' + config.version);
  console.log('Bot\'s home server is ' + config.home_server.name);
  console.log(`Logged in as ${client.user.username}!`);
  var guilds = client.guilds.array();
  for(var i = 0; i < guilds.length;i++){
    if(!guilds[guilds[i].id]){
      var guild_id = guilds[i].id;
      members.guilds[guild_id] = {};
    }
    var memArr = guilds[i].members.array();
    var guild_members = {};
    for(var j = 0; j < memArr.length; j++){
      var member_datas = {};
      member_datas['name'] =  memArr[j].displayName;
      member_datas['last_online'] = "";
      member_datas['osu_username'] = "";
      member_datas['battle_name'] = "";
      guild_members[memArr[j].id] = member_datas
    }
    members.guilds[guild_id]=guild_members;
  }
  var osu = require('./addons/osu.js')(client, members.guilds);
  var info = require('./addons/kurre.js')(client);
  var spotify = require('./addons/spotify.js')(client);
  var greet = require('./addons/greeting.js')(client);
  console.log('Settings done');
  client.user.setGame('Käpyjen sota 3');
});



client.on('message', msg => {
  var message = msg.content;
  message = message.split(" ");
  if(message[0] === '!komennot'){
    var res = "Botti tuntee tällä hetkellä seuraavat komennot:";
    for(var i = 0; i < komennot.length; i++){
      res +="```" + komennot[i] + "```";
    }
    msg.channel.sendMessage(res);
  }else if(message[0] === '!roskiin'){
    msg.channel.sendMessage('Hei hei :sunglasses: ');
    setTimeout(function(){process.exit(0)}, 1500);
  }else if(message[0] === '!lainaus'){
    if(msg.guild){
      var commenter = msg.guild.members.get(comments.comments[0].commenter.id);
      var res = new discord.RichEmbed()
      .setTitle('Lainaus')
      .setAuthor(commenter.displayName, commenter.user.avatarURL)
      .setColor(0x00AE86)
      .setDescription(comments.comments[0].comment)
      .setFooter('Lisännyt ' + comments.comments[0].adder.username + ' ' + comments.comments[0].adder.date);
      msg.channel.sendEmbed(res);
    }
  }else if(message[0] === '!datat' && msg.author.id === config.owner_id){
    msg.channel.sendMessage(JSON.stringify(members.guilds));
  }
});

client.login(config.token);
