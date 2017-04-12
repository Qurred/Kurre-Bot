var http = require('http');
const discord = require('discord.js');

module.exports = function(client){
  client.on('message', msg => {
    var message = msg.content.toLowerCase();
    message = message.split(" ");

    if(message[0] === '!spotify'){
      console.log("täällä");
      var q = '';
      for(var i = 1; i < message.length-1; i++){
        q  += message[i] + '%20';
      }
      q  += message[message.length-1];

      var options = {
        host: 'api.spotify.com',
        path: '/v1/search?q='+ q +'&type=artist'
      };

      callback = function(response) {
        var str = '';
        response.on('data', function (chunk) {
          str += chunk;
        });
        response.on('end', function () {
          try{
            var result = JSON.parse(str);
            msg.channel.sendMessage(str);
          }catch(err){
            msg.channel.sendMessage(options.host+options.path);
            msg.channel.sendMessage(err);
          }
        });
        response.on('error', function(e){
          msg.channel.sendMessage("virheitä lisää\n"+e);
        })
      }
      console.log("yritetään...");
      http.request(options, callback).end();
    }
  });
}
