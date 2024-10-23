const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

const logSchema = require("../../schemas/logSchema.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans a user from the server")
    .addUserOption((option) => {
      return option
        .setName("user")
        .setDescription("Enter the user you want to ban")
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName("reason")
        .setDescription("Enter the reason you want to ban the user");
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
    const userBan = interaction.options.getMember("user");
    const memberBan = await interaction.guild.members.fetch(userBan.id);

    if (!memberBan) {
      return await interaction.reply({
        content: "The specified user does not exist",
        ephemeral: true,
      });
    }

    const reason = interaction.options.getString("reason") || "No reason given";

    const embedDM = new EmbedBuilder()
      .setTitle("You Have Been Banned!")
      .setDescription(
        `**Server:** ${interaction.guild.name}\n **Reason:** ${reason}\n **Staff:** ${interaction.user.username}`
      )
      .setAuthor({
        name: "DelightBot",
        iconURL:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpng.pngtree.com%2Felement_our%2F20190528%2Fourmid%2Fpngtree-cute-cartoon-light-bulb-image_1134759.jpg&f=1&nofb=1&ipt=72d71ce7a39d017a3b63aa5294792ee087806e446b903b73679e0801746dc04d&ipo=images",
      });

    const embed = new EmbedBuilder()
      .setColor("#B2A4D4")
      .setTitle("The User Has Been Banned!")
      .setDescription(
        `**Server:** ${interaction.guild.name}\n **Reason:** ${reason}\n **Staff:** ${interaction.user.username}`
      )
      .setAuthor({
        name: "DelightBot",
        iconURL:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpng.pngtree.com%2Felement_our%2F20190528%2Fourmid%2Fpngtree-cute-cartoon-light-bulb-image_1134759.jpg&f=1&nofb=1&ipt=72d71ce7a39d017a3b63aa5294792ee087806e446b903b73679e0801746dc04d&ipo=images",
      });
    await memberBan.send({ embeds: [embed] }).catch((err) => {
      console.log(`Could not send DM to the user: ${err.message}`);
    });
    await memberBan
      .ban({ deleteMessageSeconds: 60 * 60 * 24 * 7, reason: [reason] })
      .catch((err) => {
        interaction.reply({
          content: "Error",
          ephemeral: true,
        });
      });

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
  },
};
