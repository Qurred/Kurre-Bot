var config = require('../data/anilist.json');
var request = require('request');
const discord = require('discord.js');
var fs = require('fs');

exports.run = function(client, msg){
    checkToken(() => {
        defineMethod(client,msg);
    });


};

function defineMethod(client, msg){
    let params = msg.content.split(" ");
    params.shift();
    const method = params.shift().toLowerCase();
    switch (method) {
        case "get":
            const type = params.shift().toLowerCase();
            if(type === 'name'){
                getAnimesByName(client,msg,params);
            }else if( type === 'id'){
                getAnimeById(client,msg,params);
            }
            break;
            //add more as the time goes on
        default:
            msg.channel.send('Invalid request');
            break;
    }
}

function getAnimesByName(client,msg, params){
    console.log('name');
    request.get(`https://${config.url}anime/search/${params.join('%20')}?access_token=${config.token}`,(err,res,body) => {
        if(err || res.statusCode !== 200){
              console.log('ANILIST API SEARCH ANIME NAME', res.statusCode );
              return;
        }//if
        var response = JSON.parse(body);
        var animes =""; //[];
        for(var anime of response){
            animes +=`**ID**: ${anime.id}\n${anime.title_english}\n${anime.title_romaji}\n`;
        }
        var res = new discord.RichEmbed()
            .setTitle(`Animes by given parameters: ${params.join(' ')}` )
            .setDescription(animes);
        msg.channel.send("",{embed:res});
        return;
    });
}

function getAnimeById(client,msg,params){
    console.log('id');
    request.get(`https://${config.url}anime/${params[0]}?access_token=${config.token}`,(err,res,body) => {
        if(err || res.statusCode !== 200){
              console.log('ANILIST API SEARCH ANIME ID', res.statusCode );
              return;
        }//if
        var response = JSON.parse(body);

        var res = new discord.RichEmbed()
            .setTitle(`${response.title_romaji===response.title_english? response.title_english: response.title_romaji +" : "+ response.title_english}`)
            .setImage(response.image_url_banner)
            .setDescription(response.description.replace(new RegExp('<br>', 'g'),''))
            .addField('Info', `Genres: ${response.genres.join(', ')}\n`+
            `${response.synonyms.length==0?"":'Also known as: ' + response.synonyms.join('\n\t')}`+
            `Score: ${response.average_score}`
            );

        msg.channel.send("", {embed:res}).then(()=>{return;}).catch((err) => {console.log(err);});
        return;
    });
}

function checkToken(_callback){
        if(!config.token || (config.expires_in < (new Date().getTime() - config.timestamp)/1000)){
          request.post({
            url:`https://${config.url}auth/access_token?grant_type=client_credentials&client_id=${config.id}&client_secret=${config.secret}`
          },(err, res, body)=>{
            if(err || res.statusCode !== 200){
              console.log('ANILIST API TOKEN REQUEST', res.statusCode );
              return;
            }//if
            var response = JSON.parse(body);
            config.token = response.access_token;
            config.expires_in = response.expires_in;
            config.token_type = response.token_type;
            config.timestamp = response.expires;
            fs.writeFile('./addons/data/anilist.json', JSON.stringify(config, null, ' '), 'utf8', function (err, data) {
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