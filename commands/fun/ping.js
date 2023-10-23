module.exports = {
  name: 'ping',
  description: 'Ping!',
  aliases: ['p'],
  SnM: true,
  async execute(client, message, args) {
    await message.channel.send(`Pong! ${client.ws.ping}`);
  },
};

