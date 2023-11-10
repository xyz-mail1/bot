module.exports = {
  name: "ping",
  description: "Ping!",
  aliases: ["p"],
  SnM: true,
  run: async (client, message, args) => {
    await client.embed(
      {
        title: `Ping`,
        desc: `${client.ws.ping}ms`,
        type: "reply",
      },
      message,
    );
  },
};
