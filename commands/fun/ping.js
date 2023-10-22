module.exports = {
  name: 'ping',
  description: 'Ping!',
  aliases: ['p'],
  execute(message, args) {
    message.channel.send('Pong.');
  },
};

