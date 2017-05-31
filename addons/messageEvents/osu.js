var request = require('request');
const discord = require('discord.js');
var osu_config = require('../data/osu.json');

exports.run = function(client,msg){
  var message = msg.content;
  message = message.split(" ");
  message.shift();
  console.log
  if (!message[0]) {
      msg.author.sendMessage('Lisätäksesi itsellesi osu_username:n ole hyvä ja käytä komentoa: \'!osu Add nimimerkki');
      return;
  }
  else if(message[0] === 'add'){
    if(!message[1]){
      msg.author.send('Lisätäksesi itsellesi osu_username:n ole hyvä ja käytä komentoa: \'!osu Add nimimerkki');
      return;
    }
    request(`https://osu.ppy.sh/api/get_user?u=${message[1]}&k=${osu_config.api}`, function (err, res, body) {
      if(err || res.statusCode !== 200){
        console.log('OSU API', res.statusCode);
        return;
      }
      var profile = JSON.parse(body);
      profile = profile[0];
      if(!profile){msg.author.send(`Didn't find user ${message[1]}`);return;}
      var osuProfile = {
        id: profile.user_id,
        username:profile.username,
        thumbnail:"https://a.ppy.sh/"+profile.user_id
      };
      var res = new discord.RichEmbed()
          .setTitle('osu! profiili')
          .setDescription('Antamasi nimimerkin avulla löydettiin seuraava profiili\nTämä profiili liitetään tunnukseesi <@' + msg.author.id + '>')
          .setColor(0xF999FF)
          .setThumbnail('https://a.ppy.sh/'+profile['user_id'])
          .addField('Profiilin tiedot',profile['username']+'\nTaso:\t' +
          parseFloat(profile['level']).toFixed(2) +
          '\nPP:\t' + parseFloat(profile['level']).toFixed(2) +
          '\nTarkkuus:\t' + parseFloat(profile['accuracy']).toFixed(2) +
          ' %\nKotimaa:\t' + profile['country'])
          .setFooter('Tämä kysely luotiin käyttämällä osu!:n tarjoamaa API:a (https://github.com/ppy/osu-api/wiki)');
          msg.author.send("",{embed:res});
          client.members[msg.author.id].osu = osuProfile;      
    });
  }else if(message[0] === 'find'){
    request(`https://osu.ppy.sh/api/get_user?u=${message[1]}&k=${osu_config.api}`, function (err, res, body) {
      if(err || res.statusCode !== 200){
        console.log('OSU API', res.statusCode);
        return;
      }
      var profile = JSON.parse(body);
      profile = profile[0];
      if(!profile){msg.author.send(`Didn't find user ${message[1]}`);return;}
      var osuProfile = {
        id: profile.user_id,
        username:profile.username,
        thumbnail:"https://a.ppy.sh/"+profile.user_id
      };
      var res = new discord.RichEmbed()
          .setTitle('osu! profiili')
          .setDescription('Search resulted into the following profile')
          .setColor(0xF999FF)
          .setThumbnail('https://a.ppy.sh/'+profile['user_id'])
          .addField('Profiilin tiedot',profile['username']+'\nTaso:\t' +
          parseFloat(profile['level']).toFixed(2) +
          '\nPP:\t' + parseFloat(profile['level']).toFixed(2) +
          '\nTarkkuus:\t' + parseFloat(profile['accuracy']).toFixed(2) +
          ' %\nKotimaa:\t' + profile['country'])
          .setFooter('Tämä kysely luotiin käyttämällä osu!:n tarjoamaa API:a (https://github.com/ppy/osu-api/wiki)');
          msg.channel.send("",{embed:res});  
    });
  }
};

exports.info = {
  command:'osu',
  info: 'Command that let\'s you add an osu profile to your account and find other profiles',
  usage: '!osu [add/find] [profiilin nimi]'
}
