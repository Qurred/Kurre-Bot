var users = [];
var waitTime = 3600000;
module.exports = function (client) {

  client.on('presenceUpdate', (oldMember,newMember) =>{

    //checks if user old state was offlie
    if(oldMember.presence.status !=='offline' || newMember.presence.status !=='online'){
      return;
    }

    var userIndex;
    var inList = false;

    //for-loop to seach for user
    for(var i = 0; i < users.length;i++){
      if(users[i].id === newMember.id){
        inList = true;
        var current_Time = new Date().getTime();
        if((current_Time-users[i].time) > waitTime){
          users[i].time = current_Time;
          userIndex = i;
        }
        else{return;}
      }//if
    }//for

    //user wasn't in a list, creating new
    if(!inList){
      users.push({
        id: newMember.id,
        time: new Date().getTime()
      });
      userIndex = users.length-1;
    }
    //Greeting
    var hour = new Date().getHours();
    if(hour <= 11 && hour > 6){
      oldMember.guild.defaultChannel.sendMessage('Huomenta <@'+oldMember.id+'> :sleeping:  ')
    }else if (hour <= 15 && hour > 11) {
      oldMember.guild.defaultChannel.sendMessage('Päivää <@'+oldMember.id+'> :hugging:  ')
    }else if (hour <= 18 && hour > 15) {
      oldMember.guild.defaultChannel.sendMessage('Iltapäivää <@'+oldMember.id+'> :hugging:  ')
    }else if (hour <= 22 && hour > 18) {
      oldMember.guild.defaultChannel.sendMessage('Iltaa <@'+oldMember.id+'> :sleeping:  ')
    }else{
      oldMember.guild.defaultChannel.sendMessage('Yötä <@'+oldMember.id+'> :sleeping:  ')
    }
  });
};