var bilis = require('../data/players.json');

module.exports = function(client){
  client.on('message', msg => {
    var message = msg.content;
    message = message.split(" ");
    if (message[0] === '!ping') {
      msg.reply('Pong!');
    }
    else if(message[0] === '!bilis'){
      var tmp = "Joukkueet: ";
      var lista = [];
      for(var i = 0; i < bilis.pelaajat.length; i++){
        lista.push(bilis.pelaajat[i]);
      }
      for(var i = 0; i < 4; i++){
        var index = Math.floor((Math.random() * lista.length));
        tmp += lista[index];
        lista.splice(index, 1);
        if(i == 1){
          tmp+= " vs ";
        }
      }
      msg.channel.sendMessage(tmp);
    }
    else if(message[0] === '!kiima'){
      msg.reply('Mee roskiin!');
    }
    else if(message[0] === '!pelaajat'){
      var res = "Pelaajia ovat: "
      for(var i = 0; i < bilis.pelaajat.length-1; i++){
        res += bilis.pelaajat[i] + ", ";
      }
      res += bilis.pelaajat[bilis.pelaajat.length-1];
      msg.channel.sendMessage(res);
    }
    else if(message[0] === '!uusiPelaaja'){
      if(message[1]){
        bilis.pelaajat.push(message[1]);
      }else{
        msg.reply('Määrittele lisättävä pelaaja: \'!uusiPelaaja [pelaajan nimi]\'');
      }
    }
    else if(message[0] === '!help'){
      msg.channel.sendMessage('https://www.youtube.com/watch?v=6B7-tMh9zyI');
    }
  });
};
