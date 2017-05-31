var owner = require('../../data/config.json').owner_id;

exports.run = (client, message) => {
    if(message.author.id != owner) return;
    message.channel.send('Bye bye, shutting down');
    client.shutDown();
};

exports.info = {
    command:'shutdown',
    info: 'Shuts down the bot',
    usage: '!shutdown'
}