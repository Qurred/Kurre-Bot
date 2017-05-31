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
}).catch(err => {
  console.log('Discord.js Error', 'Incorrect Login details');
});
