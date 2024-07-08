const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("bans the user")
    .addUserOption((option) => {
      return option
        .setName("user")
        .setDescription("the user you want to ban")
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option.setName("reason").setDescription("reason");
    }),
  async execute(interaction) {
    const userBan = interaction.options.getUser("user");
    const memberBan = interaction.guild.members.fetch(userBan.id);

    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
    ) {
      return await interaction.reply({
        content: "You dont have the permission to use this command",
        ephemeral: true,
      });
    }

    if (!memberBan) {
      return await interaction.reply({
        content: "The specified user does not exist",
        ephemeral: true,
      });
    }

    if (!memberBan.bannable) {
      return await interaction.reply({
        content: "Cant ban this member",
        ephemeral: true,
      });
    }
    const reason = interaction.getString("reason");
    const embedDM = new EmbedBuilder()
      .setTitle("You Have Been Banned!")
      .setDescription(
        `**Server:** ${interaction.guild.name}\n **Reason:** ${reason}\n **Staff:** ${interaction.user.username}`
      );

    const embed = new EmbedBuilder()
      .setTitle("The User Has Been Banned!")
      .setDescription(
        `**Server:** ${interaction.guild.name}\n **Reason:** ${reason}\n **Staff:** ${interaction.user.username}`
      );

    await memberBan.send({ embeds: [embedDM] });
    await memberBan.ban({ reason: reason }).catch((err) => {
      interaction.reply({
        content: "Error",
        ephemeral: true,
      });
    });
    await interaction.reply({ embeds: [embed] });
  },
};
