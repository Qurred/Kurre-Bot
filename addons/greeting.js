var users = [];
module.exports  = function(oldMember,newMember,client) {
    //Updates last_online property
    if(newMember.presence.status ==='offline'){
      var time = new Date;
      time = time.getTime();
      if(!client.members[newMember.id]){
        return;
      }
      client.members[newMember.id].last_online = time;
      console.log('\x1b[32mUser\'s presence changed', '\x1b[0m '+ oldMember.user.username+': '+ oldMember.presence.status+' -> '+ newMember.presence.status);
    }

    //checks if user old state was offline
    if(oldMember.presence.status !=='offline' || (newMember.presence.status !=='online'&&newMember.presence.status !== 'idle')){
      return;
    }
    var waitTime = client.members[newMember.id].greeting_th;
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
        else{
          return;
        }
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
        tts: false
      }
      if(hour <= 11 && hour > 6){
        oldMember.guild.defaultChannel.send('Huomenta <@'+oldMember.id+'> :sleeping:  ',msg_opt)
      }else if (hour <= 15 && hour > 11) {
        oldMember.guild.defaultChannel.send('Päivää <@'+oldMember.id+'> :hugging:  ',msg_opt)
      }else if (hour <= 18 && hour > 15) {
        oldMember.guild.defaultChannel.send('Iltapäivää <@'+oldMember.id+'> :hugging:  ',msg_opt)
      }else if (hour <= 22 && hour > 18) {
        oldMember.guild.defaultChannel.send('Iltaa <@'+oldMember.id+'> :sleeping:  ',msg_opt)
      }else{
        oldMember.guild.defaultChannel.send('Yötä <@'+oldMember.id+'> :sleeping:  ',msg_opt)
      }
      console.log('\x1b[32mUser\'s presence changed', '\x1b[0m '+ oldMember.user.username+': '+ oldMember.presence.status+' -> '+ newMember.presence.status);
      return;
  };