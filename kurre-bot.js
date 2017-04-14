const discord = require('discord.js');
var client = new discord.Client();
var fs = require('fs');
//scripts
var basics = require('./scripts/basics.js')(client);
//Jsons
var config = require('./data/config.json');
var comments = require('./addons/data/comments.json');
//var members = require('./addons/data/members.json');
var members;

client.once('ready', () => {
  console.log('Currently running version: ' + config.version);
  console.log('Bot\'s home server is ' + config.home_server.name);
  console.log(`Logged in as ${client.user.username}!`);
  initMembers();
  var osu = require('./addons/osu.js')(client, members);
  var info = require('./addons/kurre.js')(client);
  var spotify = require('./addons/spotify.js')(client);
  var greet = require('./addons/greeting.js')(client, members);
  console.log('Settings done');
  client.user.setGame('Under Maintance');
});

client.on('disconnect', msg => {
  console.log(msg);
});

client.on('error', err =>{
  console.log('ERROR');
  console.log(err);
});

client.on('reconnecting', () =>{console.log('Trying to reconnect');});

client.on('message', msg => {
  if(!msg.content.startsWith(config.symbol)){return;}
  var message = msg.content;
  message = message.split(" ");
  if(message[0] === '!roskiin'){
    msg.channel.sendMessage('Hei hei :sunglasses: ');
    fs.writeFile('./data/users.json', JSON.stringify(members, null, ' '), 'utf8', function (err, data) {
      if(err){
        console.log(err);
      }
      setTimeout(function(){process.exit(0)}, 1500);
    });
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
    msg.channel.sendMessage(JSON.stringify(members, null, "    "));
  }else if(message[0] === '!myInfo'){
    msg.author.sendMessage(JSON.stringify(members[msg.author.id], null, "    "));
  }
});

client.login(config.token);

function initMembers() {
  try{
    members = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
  }catch(err){console.log("Ei onnistuttu lataamaan");}
  var guilds = client.guilds.array();
  if(!members){
    members = {};
  }
  for(let i = 0; i < guilds.length; i++){
    var guild_users = guilds[i].members.array();
    for (let j = 0; j < guild_users.length; j++) {
      var guid = guild_users[j].id
      if(!members[guid]){
        var user_data = {
          id: guid,
          name: guild_users[j].user.username,
          guilds:[guilds[i].id],
          osu:null,
          last_online:null
        };
        members[guid] = user_data;
      }else{
        var found = false;
        for (var z = 0; z < members[guid].guilds.length; z++) {
          if(members[guid].guilds[z] === guilds[i].id){
            found = true;
          }
        }
        if(!found){
          members[guid].guilds.push(guilds[i].id);
        }
      }
    }
  }
  fs.writeFile('./data/users.json', JSON.stringify(members, null, ' '), 'utf8', function (err, data) {
    if(err){
      console.log(err);
    }
  });
}
