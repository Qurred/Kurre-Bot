var request = require('request');
var config = require('../data/spotify.json');
var fs = require('fs');
const discord = require('discord.js');
var spotify_hex = '1ED760';

exports.run  = function(client,msg){
    var message = msg.content.toLowerCase();
    var splitter = message.indexOf('|');
    //Checks if multiple args
    if(splitter === -1){//Only band name
      message = message.split(" ");
      if(message.length == 1 ){
        var res = new discord.RichEmbed()
        .setTitle('Spotify API')
        .setDescription(`To use Spotify api via Kurre-bot you need to use one of the following commands\n`+
          `To search for a band use: "!spotify [band name]\n`+
          `To search for a track use: "!spotify [band name] | [track name]`)
        .setColor(spotify_hex);
        msg.channel.send("",{
            embed:res
        });
        return;
        }
      if(message[0] === '!spotify'){
        var q = '';
        for(var i = 1; i < message.length-1; i++){
          q  += message[i] + '%20';
        }
        q  += message[message.length-1];
        checkToken(() => getArtist(q,msg));
      }
    }
    else{//Band name and song name
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
      checkToken(() => getTrack(band, song, msg));
    }
  };
//);

//Band and song
function getTrack(band, _song, msg){
  request.get({
    url:`https://api.spotify.com/v1/search?q='${band}"%20"${_song}+&type=track`,
    headers:{
      'Content-Type':'application/x-www-form-urlencoded',
      Authorization:`${config.token_type} ${config.token}`
    }
  },
 function (err, res, body) {//callback function
    if(err || res.statusCode !== 200){ //Checks if errors or code is not 200
      console.log('Spotify API GET TRACK', res.statusCode);
      return;
    }
    var tracks = JSON.parse(body).tracks;
    var song = tracks.items[0];
    if(!song){
      msg.author.send(`Search  "${band} ${_song}" failed, please check writen parameters`);
      return;
    }
    var res = new discord.RichEmbed()
    .setTitle('Spotify API')
    .setDescription('Löydettiin ' + tracks.items.length + ' biisiä ja valittiin ensimmäinen:'+
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
    request.get(
      {url:`https://api.spotify.com/v1/search?q=${band}&type=artist`,
      headers:{
        'Content-Type':'application/x-www-form-urlencoded',
        Authorization:`${config.token_type} ${config.token}`
      }
    }, function (err, res, body) {
      if(err || res.statusCode !== 200){
        console.log('Spotify API GET ARTIST', res.statusCode);
        return;
      }
      var rbody = JSON.parse(body);
      var artist = rbody.artists.items[0];
      band = band.replace(/%20/gi," ");
      if(!artist){
        msg.author.send(`Haku ${band} ei tuottanut tuloksia`);
        return;
      }
      var genres = artist.genres.join(", ");
      getAlbums(artist.id, (albums) => {
        var albumList = [];
        for(let i = 0; i < albums.length; i++){
          albumList.push(
            `**[${albums[i].name}](${albums[i].url})**`
          );
        }
        while(albumList.join('\n').length >=1024){
          albumList.pop();
        }
        var res = new discord.RichEmbed()
        .setTitle('Spotify API')
        .setDescription(
          `**[${artist.name}](${artist.external_urls.spotify})**\nGenret: ${genres}`)
          .setColor(spotify_hex)
          .addField('Levyt',albumList.join('\n'))
          .setThumbnail((artist.images[0])?artist.images[0].url : null);
          msg.channel.send("",{embed:res});
          return;
        });
      });
    }

    function getAlbums(artist_id, callback){
      request({
        url:`https://api.spotify.com/v1/artists/${artist_id}/albums?offset=0&limit=10&album_type=single,album`,
        headers:{
        'Content-Type':'application/x-www-form-urlencoded',
        Authorization:`${config.token_type} ${config.token}`
        }
    }, function (err, res, body) {
        if(err || res.statusCode !== 200){
          console.log('Spotify API GET ALBUMS', res.statusCode);
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

   function checkToken(_callback){
     console.log((new Date().getTime() - config.timestamp)/1000);
     if(!config.token || (config.expires_in < (new Date().getTime() - config.timestamp)/1000)){
      let encoded = new Buffer(`${config.id}:${config.secret}`).toString('base64');
      let auth = `Basic ${encoded}`;
      request.post({
        url:'https://accounts.spotify.com/api/token?grant_type=client_credentials',
        headers:{
          'Content-Type':'application/x-www-form-urlencoded',
          Authorization:auth
        }
      },
      (err, res, body)=>{
        if(err || res.statusCode !== 200){
          console.log('Spotify API TOKEN', res.statusCode );
          return;
        }//if
        var timestamp = new Date().getTime();
        var response = JSON.parse(body);
        config.token = response.access_token;
        config.expires_in = response.expires_in;
        config.token_type = response.token_type;
        config.timestamp = timestamp;
        fs.writeFile('./addons/data/spotify.json', JSON.stringify(config, null, ' '), 'utf8', function (err, data) {
        if(err) console.log(err);
        _callback();  
        });
      }
    );
  }else{
    _callback();  
    return;
  }
 } 


  exports.info = {
    command:'spotify',
    info: 'Uses Spotify API to get artists and tracks',
    usage: 'Search for band: "!spotify [band name]" e.g. !spotify Disturbed\nSearch for track: "!spotify [band name] | [song name]" e.g. !spotify Disturbed | The Sound Of Silence'
}
