const discord = require('discord.js');
var client = new discord.Client();
var exports = [];
var fs = require('fs');

//scripts
//var basics = require('./scripts/basics.js')(client);
//Jsons
var addons = require('./data/addons.json');
var config = require('./data/config.json');
var comments = require('./addons/data/comments.json');
var members = client.members = {};

require('./addons/addonLoader')(client);


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
  console.log('CLIENT','Starting saving user informations and shutting down');
    fs.writeFile('./addons/data/users.json', JSON.stringify(client.members, null, ' '), 'utf8', function (err, data) {
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

client.login(config.token).then(() =>{
  const init = require('./addons/initBot')(client);
})
.catch(err => {
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
