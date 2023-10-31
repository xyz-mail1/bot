const { readdirSync } = require("node:fs");

module.exports = (client) => {
  readdirSync(`./src/events/`).forEach(async (file) => {
    const event = await require(`../events/${file}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else if (event.on) {
      client.on(event.name, (...args) => event.execute(...args));
    }
  });
};
