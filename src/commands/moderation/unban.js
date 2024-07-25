const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("U  nban a user")
    .addStringOption((option) => {
      return option
        .setName("user")
        .setDescription("Enter the id of the user you want to unban")
        .setRequired(true);
    }),
  async execute(interaction) {
    const member = interaction.options.getString("user");

    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
    ) {
      interaction.reply({
        content: "You dont have the permission to unban members",
      });
    }
    await interaction.guild.bans.fetch().then(async (bans) => {
      if (bans.size == 0) {
        return await interaction.reply("No user is banned from the server");
      }
      let bannedID = bans.find((bans) => bans.user.id == member);
      if (!bannedID) {
        return await interaction.reply(
          "The user is not banned from the server"
        );
      }

      await interaction.guild.bans.remove(member).catch((err) =>
        interaction.reply({
          content: "Error while unbanning the user.",
          ephemeral: true,
        })
      );
    });
  },
};
