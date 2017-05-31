const config = require('../data/config.json');

module.exports = function(msg,client){
  if(msg.author.bot) return; //Checks if message's author is a bot
  if(!msg.content.startsWith(config.symbol)) return; //Checks if message is a command
  var params = msg.content.split(' ');
  var message = params.shift().replace(`${config.symbol}`,''); //Get's the message
  console.log('\x1b[31mCommand usage', '\x1b[0mUser '+msg.author.username+' ('+msg.author.id + ') used following command: ' + msg.content);
  try{
    let func = require(`./messageEvents/${message}.js`);
    func.run(client,msg,params);
  }catch(err){
    //We didnt find asked command, so what?
  }
};
