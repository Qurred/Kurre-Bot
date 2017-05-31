var config = require('../data/config.json');
var fs = require('fs');

module.exports = function(client){
  console.log('Currently running version: ' + config.version);
  console.log('Bot\'s home server is ' + config.home_server.name);
  console.log(`Logged in as ${client.user.username}!`);
  initMembers(client);
  client.user.setGame(config.game);
  console.log('Settings done');
};

function initMembers(client) {
  try{
    client.members = JSON.parse(fs.readFileSync('./addons/data/users.json', 'utf8'));

  }catch(err){
    console.log("./data/users.json missing");
  }

  if(!client.members){
    console.log('INIT','Didn\'t find users.json');
    client.members = {};
  }
  var arrayOfGuilds = client.guilds.array();
  for(var guild of arrayOfGuilds){
    var arrayOfMembers = guild.members.array();
    for(var member of arrayOfMembers){
      var user = member.user;
      var guid = user.id
      if(!client.members[guid]){ //If this user is a new one
        var user_data = {
          id: guid,
          name: user.username,
          guilds:[guild.id],
          last_online:null,
          greeting_th:3600000,
          custom_message: null
        };
        if(!client.members[user_data.id]){
          client.members[guid] = user_data;
        }
      }else{
        var found = false;
        var memberGuilds = client.members[guid].guilds;
        for (var z = 0; z <memberGuilds.length; z++) {
          if(memberGuilds[z] === guild.id){
            found = true;
            break;
          }
        }
        if(!found){
          client.members[guid].guilds.push(guild.id);
        } //IF
      }
    }//for users in guild
  }//for guilds in client
}
