const discord = require('discord.js');
var client = new discord.Client();
var exports = [];
var fs = require('fs');
require('./addons/addonLoader')(client);
//scripts
//var basics = require('./scripts/basics.js')(client);
//Jsons
var addons = require('./data/addons.json');
var config = require('./data/config.json');
var comments = require('./addons/data/comments.json');
var members = client.members = {};
var tries = 0;

client.on('disconnect', msg => {
  console.log(msg);
  fs.writeFile('./data/users.json', JSON.stringify(members, null, ' '), 'utf8', function (err, data) {
    if(err){
      console.log(err);
    }
    setTimeout(function(){
      console.log('ERROR','Shutting down the bot to prevent multiple request to discord');
      process.exit(0);
    }, 10000);
  });
});

client.shutDown = function(){
  console.log('CLIENT','Staring saving user informations and shutting down');
    fs.writeFile('./data/users.json', JSON.stringify(members, null, ' '), 'utf8', function (err, data) {
      if(err){
        console.log(err);
      }
      setTimeout(function(){process.exit(0)}, 1500);
    });
}

client.on('error', err =>{
  console.log('ERROR');
  client.destroy().then(() =>{client.login(config.token);});
});

client.on('warn', err=>{
  console.log('DiscordJS Warn', err);
});

// client.on('guildMemberAdd', member =>{
//   console.log(`New Guild member joined: ${member.displayName}`);
//   var member_data = {
//           id: member.id,
//           name: member.user.username,
//           guilds:member.guild.id,
//           osu:null,
//           last_online:null,
//           greeting_th:3600000,
//           custom_message: null
//         };
//   members[member.id] = member_data;
// })

// client.on('message', msg => {
//   if(!msg.content.startsWith(config.symbol)){return;}
//   console.log('\x1b[31mCommand usage', '\x1b[0mUser '+msg.author.username+' ('+msg.author.id + ') used following command: ' + msg.content);
//   var message = msg.content;
//   message = message.split(" ");
//   if(message[0] === '!roskiin'){
//     msg.channel.sendMessage('Hei hei :sunglasses: ');
//     fs.writeFile('./data/users.json', JSON.stringify(members, null, ' '), 'utf8', function (err, data) {
//       if(err){
//         console.log(err);
//       }
//       setTimeout(function(){process.exit(0)}, 1500);
//     });
//   }
//   else if(message[0] === '!help'){
//     let manual = "Kurre-bot knows currently following commands:\n";
//     for(let i = 0; i < addons.items.length; i++){
//       const addonData = require(addons.items[i].route);
//       console.log(addonData.help);
//       //manual += exports[i].help;
//     }



//   }else if(message[0] === '!lainaus'){
//     if(msg.guild){
//       va
//       var commenter = msg.guild.members.get(comments.comments[Math.random(comments.comments.length)].commenter.id);
//       var res = new discord.RichEmbed()
//       .setTitle('Lainaus')
//       .setAuthor(commenter.displayName, commenter.user.avatarURL)
//       .setColor(0x00AE86)
//       .setDescription(comments.comments[0].comment)
//       .setFooter('Lisännyt ' + comments.comments[0].adder.username + ' ' + comments.comments[0].adder.date);
//       msg.channel.sendEmbed(res);
//     }
//   }else if(message[0] === '!datat' && msg.author.id === config.owner_id){
//     msg.channel.sendMessage(JSON.stringify(members, null, "    "));
//   }else if(message[0] === '!myInfo'){
//     givePersonData(msg.author);
//   }
// });

client.login(config.token).catch(err => {
  console.log('Discord.js Error', 'Incorrect Login details');
});




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
