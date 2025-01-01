const {
  Events,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const chalk = require("chalk");

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
         kindly report it at our support server.
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
      const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setName("Support server")
      );
      if (defaultChannel) {
        await defaultChannel.send({ embeds: [embed] });
        defaultChannel
          .createInvite({ unique: true, temporary: false })
          .then((invite) => {
            console.log(
              chalk.green(
                `[${guild.name}] Bot added to Invite link: https://discord.gg/${invite.code}`
              )
            );
          });
      } else {
        console.log(
          `[${guild.name}] No appropriate channel found in to send a welcome message.`
        );
      }
    } catch (error) {
      console.log(
        `[${guild.name}] Error sending welcome message to guild : ${error}`
      );
    }
  },
};
