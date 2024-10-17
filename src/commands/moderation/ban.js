const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");
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

    const reason = interaction.options.getString("reason");
    if (reason === null) {
      reason = "No reason Given";
    }
    const embedDM = new EmbedBuilder()
      .setTitle("You Have Been Banned!")
      .setDescription(
        `**Server:** ${interaction.guild.name}\n **Reason:** ${reason}\n **Staff:** ${interaction.user.username}`
      );

    const embed = new EmbedBuilder()
      .setColor("#B2A4D4")
      .setTitle("The User Has Been Banned!")
      .setDescription(
        `**Server:** ${interaction.guild.name}\n **Reason:** ${reason}\n **Staff:** ${interaction.user.username}`
      );
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
    return await interaction.reply({ embeds: [embed] });
  },
};
