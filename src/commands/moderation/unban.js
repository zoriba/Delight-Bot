const { SlashCommandBuilder } = require("discord.js");
const { checkPermissions } = require("../../utils/validators.js");
const { buildEmbed } = require("../../utils/embeds");
const { logEvent } = require("../../utils/logs.js");

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
    checkPermissions(interaction, "BanMembers");

    const member = interaction.options.getString("user");
    const embed = buildEmbed(
      `**Server:** ${interaction.guild.name}\n **Staff:** ${interaction.user.username}`,
      "The user has been unbanned :white_check_mark:"
    );

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
        await logEvent(interaction, embed);

        return await interaction.reply({ embeds: [embed] });
      }
    });
  },
};
