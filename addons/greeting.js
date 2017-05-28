var users = [];
module.exports  = function (client,members) {

  client.on('presenceUpdate', (oldMember,newMember) =>{
    //Updates last_online property
    if(newMember.presence.status ==='offline'){
      var time = new Date;
      time = time.getTime();
      members[newMember.id].last_online = time;
    }
    console.log('\x1b[32mUser\'s presence changed', '\x1b[0m '+ oldMember.user.username+': '+ oldMember.presence.status+' -> '+ newMember.presence.status);
    //checks if user old state was offlie
    if(oldMember.presence.status !=='offline' || (newMember.presence.status !=='online'&&newMember.presence.status !== 'idle')){
      return;
    }
    var waitTime = members[newMember.id].greeting_th;
    var userIndex;
    var inList = false;

    //for-loop to seach for user
    for(var i = 0; i < users.length;i++){
      if(users[i].id === newMember.id){
        inList = true;
        var current_Time = new Date().getTime();
        if((current_Time-users[i].time) > waitTime){
//          console.log("Aika kulunut, voidaan tehdä tervehdys @" + users[i].name);
          users[i].time = current_Time;
          userIndex = i;
        }
        else{
//          console.log(((current_Time - users[i].time)/1000/60)+ users[i].name);
          return;}
      }//if
    }//for

    //user wasn't in a list, creating new
    if(!inList){
      users.push({
        id: newMember.id,
        time: new Date().getTime(),
        name: newMember.user.username
      });
      userIndex = users.length-1;
    }
    //Greeting
    var hour = new Date().getHours();
    var msg_opt = {
      tts: true
    }
    if(hour <= 11 && hour > 6){
      oldMember.guild.defaultChannel.sendMessage('Huomenta <@'+oldMember.id+'> :sleeping:  ',msg_opt)
    }else if (hour <= 15 && hour > 11) {
      oldMember.guild.defaultChannel.sendMessage('Päivää <@'+oldMember.id+'> :hugging:  ',msg_opt)
    }else if (hour <= 18 && hour > 15) {
      oldMember.guild.defaultChannel.sendMessage('Iltapäivää <@'+oldMember.id+'> :hugging:  ',msg_opt)
    }else if (hour <= 22 && hour > 18) {
      oldMember.guild.defaultChannel.sendMessage('Iltaa <@'+oldMember.id+'> :sleeping:  ',msg_opt)
    }else{
      oldMember.guild.defaultChannel.sendMessage('Yötä <@'+oldMember.id+'> :sleeping:  ',msg_opt)
    }
    console.log('Lähetettiin');
  });

};
exports.help = {
    "help":     ''
}