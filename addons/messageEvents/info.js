
exports.run = (client, msg) => {
  var message = msg.content.toLowerCase();
  message = message.split(" ");
  try{
    var info = ""
    var func = require(`./${message[1]}.js`);
    var info = func.info;
    msg.channel.send('```'+`~~${info.command}~~\n${info.info}\nUsage: ${info.usage}`+'```');

  }catch(e){
    //We didnt find asked command, so what?
  }

}

exports.info = {
  command:'info',
  info: 'This commands tells user about asked command, what did you expect?',
  usage: 'info [commands name without "!"]'
}
