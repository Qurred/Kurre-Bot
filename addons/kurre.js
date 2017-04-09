const discord = require('discord.js');
var fs = require('fs');
var info = JSON.parse(fs.readFileSync('./addons/data/kurre.json', 'utf8'));//require('./data/kurre.json');



module.exports = function(client){
  client.on('message', msg => {
    if(msg.author.bot){return;}
    message = msg.content.split(" ");
    if(message[0] === '!uusiPeli'){    
      // if(message[1]){
      //   var newGame = '';
      //   for(var i = 1; i < message.length; i++){
      //     newGame += message[i] = ' ';
      //     console.log(message + " " + message[i]);
      //   }
      //   newGame.trim();
        client.user.setGame(message[1]);
    }
    else if(message[0] === '!kurre-bot'){
      if(message.length === 1){
        var res = new discord.RichEmbed()
        .setTitle('Kurre-bot')
        .setDescription(info.general)
        .setFooter('Lisää voi kysyä kehittäjältä');
        msg.channel.sendEmbed(res);
      }//kurre-bot
      else if (message[1] === "kehitys") {
        var res = new discord.RichEmbed().setTitle('Kurre-bot').setDescription(info.extra);
        for (var i = 0; i < info.development.length; i++) {
          res.addField(info.development[i].title,info.development[i].field);
        }
        msg.channel.sendEmbed(res);
      } //kehitys
      else if (message[1] === "lisaa") {
        if(message[2] && message[3]){
          var newInfo = {
            title: message[2],
            field: ""
          };
          for(var i = 3; i < message.length; i++){
            newInfo.field += message[i] + " ";
          }
          newInfo.field.trim();
          info.development.push(newInfo);
          fs.writeFile('./addons/data/kurre.json', JSON.stringify(info), 'utf8', function (err, data) {
            msg.channel.sendMessage('Lisättiin onnistuneesti');
          });
        }else{
          msg.channel.sendMessage('Olkaa hyvä ja syöttäkää komento muotoa: !kurre-bot lisää [otsikko] [Selitys]');
        }
      }
    }//main if
  });
};