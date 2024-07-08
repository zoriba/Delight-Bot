const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

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
      option.setName("reason").setDescription("reason")
    ),
  async execute(interaction) {
    const userKick = interaction.options.getUser("user");
    const memberKick = await interaction.guild.members.fetch(userKick.id);

    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)
    ) {
      return await interaction.reply({
        content: "You are not permitted to use this command",
        ephemeral: true,
      });
    }
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
      .setTitle("You Have Been Kicked!")
      .setDescription(
        `**Server:** ${interaction.guild.name}\n **Reason:** ${reason}\n **Staff:** ${interaction.user.username}`
      );

    const embed = new EmbedBuilder()
      .setTitle("The User Has Been Kicked!")
      .setDescription(
        `**Server:** ${interaction.guild.name}\n **Reason:** ${reason}\n **Staff:** ${interaction.user.username}`
      );
    await memberKick.send({ embeds: [embedDM] }).catch((err) => {
      return;
    });

    await memberKick.kick({ reason: reason }).catch((err) => {
      interaction.reply({ content: "Error", ephemeral: true });
    });

    await interaction.reply({ embeds: [embed] });
  },
};
