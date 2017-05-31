exports.run = (client, message) => {
  message.channel.send('Pong!');
};

exports.info = {
  command:'ping',
  info: 'Ummm... basic ping command, nothing fancy',
  usage: 'ping'
}
