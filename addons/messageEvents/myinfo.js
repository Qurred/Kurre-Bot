const discord = require('discord.js');

exports.run =function(client,msg){
  var user = client.members[msg.author.id];
  var response_text = 'Username:\t' + user.name + '\nUser ID:\t' +  user.id + '\nWait time:\t' + (user.greeting_th/1000/60) + ' min\nLast login:\t'+ (new Date(user.last_online)) ;
  if(user.custom_message){
    response_text += '\nCustom greeting:\t \'' + user.custom_message + '\'';
  }
  if(user.osu){
    response_text += "\nOsu! Profile\nUsername:\t"+user.osu.username+'\n[Link to profile](https://osu.ppy.sh/u/'+user.osu.id+')';
  }
  var response = new discord.RichEmbed().setTitle('User Information')
  .setDescription('This message will contain all data that Kurre-bot has about following user: <@' + user.id + '>')
  .setColor(0xF999FF)
  .addField('Data',response_text,true);
  msg.author.send("", {embed:response})
}
