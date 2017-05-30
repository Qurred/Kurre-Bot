exports.run = (client, msg) => {
    let message = msg.content.split(" ");
    if(message[1]){
        var q = '';
        for(var i = 1; i < message.length-1; i++){
            q  += message[i] + ' ';
        }
        q  += message[message.length-1];
        client.user.setGame(q);
        msg.channel.sendMessage("Changed game into: " + q );
    }else {
        client.user.setGame(null);
    }
};