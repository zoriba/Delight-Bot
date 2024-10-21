const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

const logSchema = require("../../schemas/logSchema.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick A Server Member")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select the user you want to kick")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Enter the reason you want to ban the user")
    ),
  async execute(interaction) {
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)
    ) {
      return await interaction.reply({
        content: "You are not permitted to use this command",
        ephemeral: true,
      });
    }
    const userKick = interaction.options.getMember("user");
    const memberKick = await interaction.guild.members.fetch(userKick.id);

    if (!memberKick) {
      return await interaction.reply({
        content: "The user is not in the server",
        ephemeral: true,
      });
    }
    if (!memberKick.kickable) {
      return await interaction.reply({
        content: "Can not kick the specified member",
        ephemeral: true,
      });
    }
    let reason = interaction.options.getString("reason");
    if (!reason) reason = "No reason specified";
    const embedDM = new EmbedBuilder()
      .setColor("#B2A4D4")
      .setTitle("You Have Been Kicked!")
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
      .setTitle("The User Has Been Kicked")
      .setDescription(
        `**Server:** ${interaction.guild.name}\n **Reason:** ${reason}\n **Staff:** ${interaction.user.username}`
      )
      .setAuthor({
        name: "DelightBot",
        iconURL:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpng.pngtree.com%2Felement_our%2F20190528%2Fourmid%2Fpngtree-cute-cartoon-light-bulb-image_1134759.jpg&f=1&nofb=1&ipt=72d71ce7a39d017a3b63aa5294792ee087806e446b903b73679e0801746dc04d&ipo=images",
      });
    await memberKick.send({ embeds: [embed] }).catch((err) => {
      console.log(`Could not send DM to the user: ${err.message}`);
    });

    await memberKick.kick({ reason: reason }).catch((err) => {
      interaction.reply({ content: "Error", ephemeral: true });
    });

    try {
      const logData = await logSchema.findOne({
        GuildId: interaction.guild.id,
      });

      if (!logData || !logData.Channel) {
        console.log("Log channel not set.");
        return;
      }

      const logChannel = interaction.guild.channels.cache.get(logData.Channel);

      if (logChannel) {
        await logChannel.send({ embeds: [embed] });
      } else {
        console.log("Log channel not found in guild.");
      }
    } catch (err) {
      console.log(`Error logging the event: ${err.message}`);
    }

    return await interaction.reply({ embeds: [embed] });
  },
};
