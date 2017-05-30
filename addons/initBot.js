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
    client.members = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
  }catch(err){console.log("./data/users.json missing");}
  var guilds = client.guilds.array();
  if(!client.members){
    console.log('INIT','Didn\'t find users.json');
    client.members = {};
  }
  for(let i = 0; i < guilds.length; i++){
      for(var user in guilds[i].client.members){
        var guid = user.id
        if(!client.members[guid]){
          var user_data = {
            id: guid,
            name: user.username,
            guilds:[guilds[i].id],
            osu:null,
            last_online:null,
            greeting_th:3600000,
            custom_message: null
          };
          if(!user_data.id)
          client.members[guid] = user_data;
       }else{
        var found = false;
        for (var z = 0; z < client.members[guid].guilds.length; z++) {
          if(client.members[guid].guilds[z] === guilds[i].id){
            found = true;
          }
        }
        if(!found){
          client.members[guid].guilds.push(guilds[i].id);
        }
      }
    }
  }
}
