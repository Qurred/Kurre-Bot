var request = require('request');
const discord = require('discord.js');
var spotify_hex = '1ED760';

module.exports  = function(client){
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
      getTrack(band,song,msg)
   }  
  }
);

  //Band and song
  function getTrack(band, _song, msg){
    request('https://api.spotify.com/v1/search?q=' + band +"%20"+_song+'&type=track', function (err, res, body) {
      if(err || res.statusCode !== 200){
          console.log('Spotify API', res.statusCode);
          console.log('Spotify API','Error' );
          return;
        }
        var rbody = JSON.parse(body);
        var song = rbody.tracks.items[0];
        if(!song){
          msg.author.send("Haku " + band + " "+ _song +  " ei tuottanut tuloksia");
          return;
        }
        var res = new discord.RichEmbed()
        .setTitle('Spotify API')
        .setDescription('Löydettiin ' + rbody.tracks.items.length + ' biisiä ja valittiin ensimmäinen:'+
        '\nArtisti:\t['+ song.artists[0].name+']('+song.artists[0].external_urls.spotify+')' + 
        '\nAlbumi:\t[' +song.album.name+']('+song.album.external_urls.spotify+')'+
        '\nBiisin nimi:\t['+song.name+']('+song.external_urls.spotify+')'+
        (song.preview_url?
        '\n[Biisin esikatselu]('+song.preview_url+')' : 
        '\nBiisistä '+ song.name +' ei ole esikatselua käytettävissä'))
        .setColor(spotify_hex)
        .setThumbnail((song.album.images[0])?song.album.images[0].url : null);
         msg.channel.send("",{
           embed:res
         });
         return;
    });
  }

  //Just the band
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
        var genres = artist.genres.join(", ");
        getAlbums(artist.id, (albums) => {
          var albumList = [];
          for(let i = 0; i < albums.length; i++){
            albumList.push(
              '**[' + albums[i].name+']('+albums[i].url+')**'
            );
          }
          var res = new discord.RichEmbed()
              .setTitle('Spotify API')
              .setDescription(
              '**['+artist.name+']('+artist.external_urls.spotify+')**'+
              '\nGenret: '+ genres)
              .setColor(spotify_hex)
              .addField('Levyt',albumList.join('\n'))
              .setThumbnail((artist.images[0])?artist.images[0].url : null);
          msg.channel.send("",{embed:res});
          return;
        });

      });
  }

  function getAlbums(artist_id, callback){
    request('https://api.spotify.com/v1/artists/' + artist_id + '/albums?offset=0&limit=20&album_type=single,album', function (err, res, body) {
      if(err || res.statusCode !== 200){
        console.log('Spotify API', res.statusCode);
        console.log('Spotify API','Error' );
        return;
      }
      let albums = [];
      var rs = JSON.parse(body).items;
      albumLoop:
      for(let i = 0; i < rs.length; i++){
        let newAlbum = {
          name: rs[i].name,
          url:rs[i].external_urls.spotify
        }
        for(let j = 0; j < albums.length; j++){
          if(albums[j].name === newAlbum.name){
            continue albumLoop;
          }
        }
        albums.push(newAlbum);
      }
      callback(albums);
    });
  }

}

exports.help = {
    "help":     'Spotify commands:\n```' +
                'Search for band: "!spotify [band name]" e.g. !spotify Disturbed\n'+
                'Search for track: "!spotify [band name] | [song name]" e.g. !spotify Disturbed | The Sound Of Silence'
                +'```'
}


