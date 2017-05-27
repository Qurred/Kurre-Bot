//var http = require('http');
var request = require('request');
const discord = require('discord.js');

module.exports = function(client){
  client.on('message', msg => {
    var message = msg.content.toLowerCase();
    var splitter = message.indexOf('|');
    if(splitter === -1){
      message = message.split(" ");
      if(message[0] === '!spotify'){
        var q = '';
        for(var i = 1; i < message.length-1; i++){
          q  += message[i] + '%20';
        }
        q  += message[message.length-1];
        getArtist(q,msg);
      }
    }
    else{
      message.replace('!spotify',"");
      var parts = message.split('|');
      var band = '';
      var tmp = parts[0].split(" ");
      for(var i = 1; i < tmp.length-1; i++){
        band += tmp[i] + '%20';
      }
      band  += tmp[tmp.length-1];
      var song = '';
      var tmp = parts[1].split(" ");
      for(var i = 1; i < tmp.length-1; i++){
        song += tmp[i] + '%20';
      }
      song  += tmp[tmp.length-1];
      getSong(band,song,msg)
   }  
  }
);

  function getSong(band, song, msg){
    console.log('https://api.spotify.com/v1/search?q=' + band + "%20"+song+'&type=track');
    request('https://api.spotify.com/v1/search?q=' + band +"%20"+song+'&type=track', function (err, res, body) {
      if(err || res.statusCode !== 200){
          console.log('Spotify API', res.statusCode);
          console.log('Spotify API','Error' );
          return;
        }
        var rbody = JSON.parse(body);
        var song = rbody.tracks.items[0];
        var res = new discord.RichEmbed()
        .setTitle('Spotify API')
        .setDescription('Löydettiin ' + rbody.tracks.items.length + ' biisiä ja valittiin ensimmäinen:\n'
        + song.artists[0].name + ' - ' +song.album.name)
        .addField('Esikatselu',song.preview_url)
        .setColor(0xF999FF)
        .setThumbnail((song.album.images[0])?song.album.images[0].url : null);
         msg.channel.sendEmbed(res);
    });
  }

  function getArtist(band, msg){
      request('https://api.spotify.com/v1/search?q=' + band + '&type=artist', function (err, res, body) {
        if(err || res.statusCode !== 200){
          console.log('Spotify API', res.statusCode);
          console.log('Spotify API','Error' );
          return;
        }
        var rbody = JSON.parse(body);
        var artist = rbody.artists.items[0];
        band = band.replace(/%20/gi," ");
        if(!artist){
          msg.author.send("Haku " + band +  " ei tuottanut tuloksia");
          return;
        }
        var res = new discord.RichEmbed()
            .setTitle('Spotify API')
            .setDescription('Haulla \"' + band + '\" löytyi seuraava bändi, jos kyseessä ei ole haluamasi bändi niin tarkenna hakua')
            .setColor(0xF999FF)
            .addField(artist.name, artist.external_urls.spotify)
            .setThumbnail((artist.images[0])?artist.images[0].url : null);
        msg.channel.sendEmbed(res);
        return;
      });
  }
}
