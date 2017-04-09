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
    console.log('Settings done');
    client.user.setGame('Käpyjen sota 3');
});

client.on('presenceUpdate', (oldMember,newMember) =>{
  if(oldMember.presence.status ==='offline' && newMember.presence.status !=='offline'){
    var hour = new Date().getHours();
    if(hour <= 11 && hour > 6){
      oldMember.guild.defaultChannel.sendMessage('Huomenta <@'+oldMember.id+'> :sleeping:  ')
    }else if (hour <= 15 && hour > 11) {
      oldMember.guild.defaultChannel.sendMessage('Päivää <@'+oldMember.id+'> :hugging:  ')
    }else if (hour <= 18 && hour > 15) {
      oldMember.guild.defaultChannel.sendMessage('Iltapäivää <@'+oldMember.id+'> :hugging:  ')
    }else if (hour <= 22 && hour > 18) {
      oldMember.guild.defaultChannel.sendMessage('Iltaa <@'+oldMember.id+'> :sleeping:  ')
    }else if (hour <= 6 && hour > 22) {
      oldMember.guild.defaultChannel.sendMessage('Yötä <@'+oldMember.id+'> :sleeping:  ')
    }
  }
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
