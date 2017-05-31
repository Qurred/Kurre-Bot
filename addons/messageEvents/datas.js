exports.run =function(client,msg){
    msg.channel.send(JSON.stringify(client.members, null, "    "));
};