
module.exports = function(member,client){
    console.log(`New Guild member joined: ${member.displayName}`);
    var inList = false;
    for(var user in client.members){
        if(user.id == member.id){
            inList = true;
            break;
        }
    }
    if(!inList){
        var member_data = {
            id: member.id,
            name: member.user.username,
            guilds:member.guild.id,
            osu:null,
            last_online:null,
            greeting_th:3600000,
            custom_message: null
        };
        client.members[member.id] = member_data;
    }else{
        client.members[member.id].guilds.push(member.guild.id);
    }
};