var http = require('http');
const discord = require('discord.js');
var osu_config = require('./data/osu.json');

module.exports = function(client, members){
    var memberArray = members; //members.array();
    client.on('message', msg => {
    var message = msg.content;
    var osu_username;
    message = message.split(" ");

    if(message[0] === '!osu'){
      msg.channel.sendMessage('osu! is a freeware rhythm game developed by Dean "peppy" Herbert');
    }
    else if (message[0] === '!osuAdd') {
      if(message.length > 1){
        for(var guild_id in memberArray){
          if(!memberArray.hasOwnProperty(guild_id)) continue;
          if(memberArray[guild_id][msg.author.id]){
            osu_username = message[1];
            memberArray[guild_id][msg.author.id].osu_username = osu_username;
            break;
          }
        }
      }else{
        msg.author.sendMessage('Lisätäksesi itsellesi osu_username:n ole hyvä ja käytä komentoa: \'!osuAdd');
        for(var i = 0; i < memberArray.length; i++){
          if(memberArray[guild_id][msg.author.id]){
            osu_username = memberArray[guild_id][msg.author.id].osu_username;
            break;
          }
        }
      }
      if(osu_username){
        var options = {
          host: 'osu.ppy.sh',
          path: '/api/get_user?u='+ osu_username + '&k=' + osu_config.api
        };
        callback = function(response) {
        var str = '';
        response.on('data', function (chunk) {
          str += chunk;
        });
        response.on('end', function () {
          var result = JSON.parse(str);
          result = result[0];
          var res = new discord.RichEmbed()
          .setTitle('osu! profiili')
          .setDescription('Antamasi nimimerkin avulla löydettiin seuraava profiili' )
          .setColor(0x00AE86)
          .setThumbnail('https://a.ppy.sh/'+result['user_id'])
          .addField('Profiilin nimimerkki', result['username'])
          .addField('Profiilin taso', result['level'])
          .addField('PP', result['pp_raw'])
          .addField('Tarkkuus',result['accuracy'])
          .addField('Kotimaa ', result['country'])
          .setFooter('Tämä profiili liitetään tunnukseesi ' + msg.author.username);
          msg.author.sendEmbed(res);
        });
        }
        http.request(options, callback).end();
      }
    }
  });
};
