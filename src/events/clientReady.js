const { Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    const chnl = await client.channels.fetch("1249073815288549409");
    chnl.send({ content: "The bot is online" });
  },
};
