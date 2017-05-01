const discord = require('discord.js');
var client = new discord.Client();
var fs = require('fs');
//scripts
var basics = require('./scripts/basics.js')(client);
//Jsons
var config = require('./data/config.json');
var comments = require('./addons/data/comments.json');

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
  console.log('disconnected... Trying to reconnect');
  fs.writeFile('./data/users.json', JSON.stringify(members, null, ' '), 'utf8', function (err, data) {
    if(err){
      console.log(err);
    }
    setTimeout(function(){
      console.log("Saved files, now trying to reconnect");
      client.login(config.token);
    }, 10000);
  });

});

client.on('error', err =>{
  console.log('ERROR');
  client.destroy().then(() =>{client.login(config.token);});
});

// client.on('reconnecting', () =>{
//   console.log('Trying to reconnect');
// });

client.on('message', msg => {
  if(!msg.content.startsWith(config.symbol)){return;}
  console.log('\x1b[31mCommand usage', '\x1b[0mUser '+msg.author.username+' ('+msg.author.id + ') used following command: ' + msg.content);
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
      va
      var commenter = msg.guild.members.get(comments.comments[Math.random(comments.comments.length)].commenter.id);
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
    givePersonData(msg.author);
  }
});

client.login(config.token);

function initMembers() {
  try{
    members = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
  }catch(err){console.log("/data/users.json missing");}
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
          last_online:null,
          greeting_th:3600000,
          custom_message: null
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


function givePersonData(_author){
  var asked_user = members[_author.id];
  var response_text = 'Username:\t' + asked_user.name + '\nUser ID:\t' +  asked_user.id + '\nWait time:\t' + (asked_user.greeting_th/1000/60) + ' min\nLast login:\t'+ (new Date(asked_user.last_online)) ;
  if(asked_user.custom_message){
    response_text += '\nCustom greeting:\t \'' + asked_user.custom_message + '\'';
  }
  if(asked_user.osu){
    response_text += "\nOsu! Profile\nUsername:\t"+asked_user.osu.username+'\n[Link to profile](https://osu.ppy.sh/u/'+asked_user.osu.id+')';
  }
  var response = new discord.RichEmbed().setTitle('User Information')
  .setDescription('This message will contain all data that Kurre-bot has about following user: <@' + _author.id + '>')
  .setColor(0xF999FF)
  .addField('Data',response_text,true);
  _author.sendEmbed(response).then(function() {
    //Everything is fine
  })
  .catch(function(){
    //Error, send message about it to the asker. 
    //TODO create log about errors
    _author.sendMessage('Error... Has occupied, please contact Kurre-bot\'s creator');
  });
}