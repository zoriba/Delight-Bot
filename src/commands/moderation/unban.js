const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

const logSchema = require("../../schemas/logSchema.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user")
    .addStringOption((option) => {
      return option
        .setName("user")
        .setDescription("Enter the id of the user you want to unban")
        .setRequired(true);
    }),
  async execute(interaction) {
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
    ) {
      return await interaction.reply({
        content: "You dont have the permission to use this command",
        ephemeral: true,
      });
    }
    const member = interaction.options.getString("user");
    const embed = new EmbedBuilder()
      .setColor("#B2A4D4")
      .setTitle("The user has been unbanned")
      .setDescription(
        `**Server:** ${interaction.guild.name}\n **Staff:** ${interaction.user.username}`
      )
      .setAuthor({
        name: "DelightBot",
        iconURL:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpng.pngtree.com%2Felement_our%2F20190528%2Fourmid%2Fpngtree-cute-cartoon-light-bulb-image_1134759.jpg&f=1&nofb=1&ipt=72d71ce7a39d017a3b63aa5294792ee087806e446b903b73679e0801746dc04d&ipo=images",
      });

    await interaction.guild.bans.fetch().then(async (bans) => {
      if (bans.size == 0) {
        return await interaction.reply("No user is banned from the server");
      }
      let bannedID = bans.find((bans) => bans.user.id == member);
      if (!bannedID) {
        return await interaction.reply(
          "The user is not banned from the server"
        );
      } else {
        await interaction.guild.bans.remove(member).catch((err) =>
          interaction.reply({
            content: "Error while unbanning the user.",
            ephemeral: true,
          })
        );
        try {
          const logData = await logSchema.findOne({
            GuildId: interaction.guild.id,
          });

          if (!logData || !logData.Channel) {
            console.log("Log channel not set.");
          } else {
            const logChannel = interaction.guild.channels.cache.get(
              logData.Channel
            );

            if (logChannel) {
              await logChannel.send({ embeds: [embed] });
            } else {
              console.log("Log channel not found in guild.");
            }
          }
        } catch (err) {
          console.log(`Error logging the event: ${err.message}`);
        }
        return await interaction.reply({ embeds: [embed] });
      }
    });
  },
};
