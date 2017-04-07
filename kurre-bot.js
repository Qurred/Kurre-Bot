const discord = require('discord.js');
var client = new discord.Client();
//scripts
var basics = require('./scripts/basics.js')(client);
//Jsons
var config = require('./data/config.json');
var comments = require('./addons/data/comments.json');
var members = require('./addons/data/members.json');


var komennot = [
  '!ping - palauttaa pong, enimmäkseen testaamista varten',
  '!bilis - luo uuden biljardipelin (2v2)',
  '!kiima - komento jonka niki toivoi, en tiedä miksi',
  '!pelaajat - palauttaa pelaajat',
  '!uusiPelaaja [nimi] - lisää uuden pelaajan',
  '!help - auttaa casuaaleja',
  '!komennot - mitä luulet tämän olevan?'
];

client.on('ready', () => {
  console.log('Currently running version: ' + config.version);
  console.log('Bot\'s home server is ' + config.home_server.name);
  console.log(`Logged in as ${client.user.username}!`);
  var guilds = client.guilds.array();
  for(var i = 0; i < guilds.length;i++){
    if(!guilds[guilds[i].id]){
      var guild_id = guilds[i].id;
      members.guilds[guild_id] = {};
    }
      var memArr = guilds[i].members.array();
      var guild_members = {};
      for(var j = 0; j < memArr.length; j++){
         var member_datas = {};
         member_datas['name'] =  memArr[j].displayName;
         member_datas['last_online'] = "";
         member_datas['osu_username'] = "";
         member_datas['battle_name'] = "";
         guild_members[memArr[j].id] = member_datas
        }
        members.guilds[guild_id]=guild_members;
    }
     var osu = require('./addons/osu.js')(client, members.guilds);
    console.log('Settings done');
});

client.on('message', msg => {
  var message = msg.content;
  message = message.split(" ");
  if(message[0] === '!komennot'){
    var res = "Botti tuntee tällä hetkellä seuraavat komennot:";
    for(var i = 0; i < komennot.length; i++){
          res +="```" + komennot[i] + "```";
    }
    msg.channel.sendMessage(res);
  }else if(message[0] === '!roskiin'){
    msg.channel.sendMessage('Hei hei :sunglasses: ');
    setTimeout(function(){process.exit(0)}, 1500);
  }else if(message[0] === '!lainaus'){
    if(msg.guild){
      var commenter = msg.guild.members.get(comments.comments[0].commenter.id);
      var res = new discord.RichEmbed()
      .setTitle('Lainaus')
      .setAuthor(commenter.displayName, commenter.user.avatarURL)
      .setColor(0x00AE86)
      .setDescription(comments.comments[0].comment)
      .setFooter('Lisännyt ' + comments.comments[0].adder.username + ' ' + comments.comments[0].adder.date);
      msg.channel.sendEmbed(res);
    }
  }else if(message[0] === '!datat' && msg.author.id === config.owner_id){
    msg.channel.sendMessage(JSON.stringify(members.guilds));
  }else if(message[0]+" "+message[1] === '!Kurre-bot kehitys'){
    var res = new discord.RichEmbed()
    .setTitle('Kurre-bot v.' +config.version)
    .setDescription('Kurre-bot on jatkuvan kehityksen alla joten uusia ominaisuuksia voi tulla nopeaa tahtia, mutta niiden vakautta ei taata ennen kunnollista korjaamista ja koodin optimointia')
    .addField('Optimointi', 'Kurre-bot pohjautuu Node.js ja Discord.js paketteihin. Qurredin kirjoittama koodi on luotu nopeasti PoC idealla. Tästä johtuen ohjelman suoritus on raskasta ja eritoten !osu komennot kuluttavat tehoa runsaasti')
    .addField('!Osu','Osu!:n liittyvät komennot ovat kehitteillä vielä. Tällä hetkellä on vain mahdollista lisätä väliaikaisesti tunnus')
    .addField('Tallennus', 'Jokainen sovellus tarvitsee jonkinlaisen tietokannan. Tällä hetkellä Kurre-bot hyödyntää koneen välimuistia tietojen tallentamiseen. Tästä johtuen jokainen uudelleen käynnistys botin osalta (ja muutokset) nollaavat kaikki tallennukset. Tämä lisää sovelluksen käynnistysaikaa ja heikentää käytettävyyttä. Kehittäjä ei ole päättänyt vielä kunnollista formaattia tallentamista varten, eikä täten kirjoita tallentavaa koodia koska uudelleen kirjoittaminen myöhemmässä vaiheessa osoittautuu helposti työlääksi ja logiikan uudelleen luomiseksi.')
    .setFooter('Lisää voi kysyä kehittäjältä');
    msg.channel.sendEmbed(res);
  }else if (message[0] === '!Kurre-bot') {
      var res = new discord.RichEmbed()
      .setTitle('Kurre-bot v.' +config.version)
      .setDescription('Kurre-bot on Juho \'Qurred\' K.n projekti, jonka tarkoitus on tuoda erilaisiin Discord chatteihin uusia ominaisuuksia ja parantaa mm. keskustelukanavien hallintaa. Projektin uusimman stabiilin version löytää osoitteesta https://github.com/Qurred/Kurre-Bot')
      .setFooter('Lisää voi kysyä kehittäjältä');
      msg.channel.sendEmbed(res);
  }
});

client.login(config.token);
