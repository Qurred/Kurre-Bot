
const load = (e) => require(`./${e}`);

module.exports = function(client){
    client.on('ready',() => load('initBot') (client));
    client.on('reconnecting', () => load('reconnectingHandler') (client)) ;
    client.on('presenceUpdate', (x,y) => load('greeting') (x,y,client) );
    client.on('guildMemberAdd', (member) => load('newMember') (member,client) );
    client.on('guildMemberRemove', (member) => load('removeMember') (member,client) );
    client.on('message', (msg) =>load('messageManager') (msg,client));
};

