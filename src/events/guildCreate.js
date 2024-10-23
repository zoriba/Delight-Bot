const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.GuildCreate,
  async execute(guild) {
    try {
      const embed = new EmbedBuilder()
        .setTitle("Thanks for adding DelightBot!")
        .setDescription(
          `Hello! I'm *DelightBot*, your all-in-one moderation.
         Use  \`/help\` to see all the commands I offer!
         \n
         If you have any issues with the bot of found a bug 
         kindly report it at our [support server](https://discord.gg/)
         \n
         Have a great day!`
        )
        .setColor("#B2A4D4");

      let defaultChannel = "";

      guild.channels.cache.forEach((channel) => {
        if (
          channel.type === 0 &&
          channel.permissionsFor(guild.members.me).has("SendMessages") &&
          !defaultChannel
        ) {
          defaultChannel = channel;
        }
      });

      if (defaultChannel) {
        await defaultChannel.send({ embeds: [embed] });
      } else {
        console.log(
          `No appropriate channel found in ${guild.name} to send a welcome message.`
        );
      }
    } catch (error) {
      console.log(
        `Error sending welcome message to guild ${guild.name}: ${error}`
      );
    }
  },
};
