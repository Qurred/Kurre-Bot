module.exports = function(member,client){
    console.log(`Guild member removed: ${member.displayName}`);
    var inList = false;
    for(var user in client.members){
        if(user.id == member.id){
            let i = user.guilds.indexOf(member.guild.id);
            user.guilds = user.guilds.splice(i,1);
            return;
        }
    }
}