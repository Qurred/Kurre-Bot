var http = require('http');
const discord = require('discord.js');
var osu_config = require('./data/osu.json');

module.exports = function(client, members){
  client.on('message', msg => {
    var message = msg.content;
    message = message.split(" ");
    if(message[0] === '!osu'){
      msg.channel.sendMessage('osu! is a freeware rhythm game developed by Dean "peppy" Herbert');
    }
    else if (message[0] === '!osuAdd') {
      if(message.length < 1){
        msg.author.sendMessage('Lisätäksesi itsellesi osu_username:n ole hyvä ja käytä komentoa: \'!osuAdd nimimerkki');
        return;
      }
      if(message[1]){
        var options = {
          host: 'osu.ppy.sh',
          path: '/api/get_user?u='+ message[1] + '&k=' + osu_config.api
        };
        callback = function(response) {
          var str = '';
          response.on('data', function (chunk) {
            str += chunk;
          });
          response.on('end', function () {
            var result = JSON.parse(str);
            result = result[0];
            var osuProfile = {
              id: result.user_id,
              username:result.username,
              thumbnail:"https://a.ppy.sh/"+result.user_id
            };
            var res = new discord.RichEmbed()
            .setTitle('osu! profiili')
            .setDescription('Antamasi nimimerkin avulla löydettiin seuraava profiili\nTämä profiili liitetään tunnukseesi <@' + msg.author.id + '>')
            .setColor(0xF999FF)
            .setThumbnail('https://a.ppy.sh/'+result['user_id'])
            .addField('Profiilin tiedot',result['username']+'\nTaso:\t' +
            parseFloat(result['level']).toFixed(2) +
            '\nPP:\t' + parseFloat(result['level']).toFixed(2) +
            '\nTarkkuus:\t' + parseFloat(result['accuracy']).toFixed(2) +
            ' %\nKotimaa:\t' + result['country'])
            .setFooter('Tämä kysely luotiin käyttämällä osu!:n tarjoamaa API:a (https://github.com/ppy/osu-api/wiki)');
            msg.author.sendEmbed(res);
            members[msg.author.id].osu = osuProfile;
          });
        }
        http.request(options, callback).end();
      }
    }
  });
};
exports.help = {
  "help":     'Spotify commands:\n```' +
  'Search for band: "!spotify [band name]" e.g. !spotify Disturbed\n'+
  'Search for track: "!spotify [band name] | [song name]" e.g. !spotify Disturbed | The Sound Of Silence'
  +'```'
}
