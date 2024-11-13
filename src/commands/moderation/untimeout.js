const { SlashCommandBuilder } = require("discord.js");
const { checkPermissions } = require("../../utils/validators");
const { buildEmbed } = require("../../utils/embeds");
const { logEvent } = require("../../utils/logs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("untimeout")
    .setDescription("Remove the timeout of a Server Member")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select the user you want untimeout")
        .setRequired(true)
    )

    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription(
          "Enter the reason you want to remove timeout of the member"
        )
    ),
  async execute(interaction) {
    checkPermissions(interaction, "KickMembers");

    const { options, guild, user } = interaction;
    const User = options.getUser("user");
    const member = await guild.members.fetch(User.id);
    const reason = options.getString("reason") || "No reason given";
    if (!member) {
      return await interaction.reply({
        content: "The selected user does not exist",
        ephemeral: true,
      });
    }

    if (!member.kickable) {
      return await interaction.reply({
        content: "You can not remove this member's timeout",
        ephemeral: true,
      });
    }

    const embed = buildEmbed(
      `**The user's timeout removed successfully :white_check_mark:**\n**User:** <@${member.id}>\n**Reason:** ${reason}\n**Staff:** ${user.username}`
    );

    await member.timeout(null, reason);

    await logEvent(interaction, embed);

    return await interaction.reply({ embeds: [embed] });
  },
};
