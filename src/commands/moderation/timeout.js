const { SlashCommandBuilder } = require("discord.js");
const { checkPermissions } = require("../../utils/validators.js");
const { buildEmbed } = require("../../utils/embeds.js");
const { logEvent } = require("../../utils/logs.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a Server Member")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select the user you want to mute")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("duration")
        .setRequired(true)
        .setDescription(
          "Select the duration for which you want to timeout the user"
        )
        .addChoices(
          { name: "1m", value: "60" },
          { name: "5m", value: "300" },
          { name: "15m", value: "900" },
          { name: "30m", value: "1800" },
          { name: "1h", value: "3600" },
          { name: "12h", value: "43200" },
          { name: "1d", value: "86400" },
          { name: "7 Days", value: "604800" },
          { name: "14 Days", value: "1209600" },
          { name: "28 Days", value: "1219200" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setRequired(true)
        .setDescription("Enter the reason you want to timeout the member")
    ),
  async execute(interaction) {
    checkPermissions(interaction, "KickMembers");

    const { options, guild, user } = interaction;
    const User = options.getUser("user");
    const member = await guild.members.fetch(User.id);
    const duration = options.getString("duration");
    const reason = options.getString("reason");

    if (!member) {
      return await interaction.reply({
        content: "The selected user does not exist",
        ephemeral: true,
      });
    }

    if (!member.kickable) {
      return await interaction.reply({
        content: "You can not timeout this member",
        ephemeral: true,
      });
    }

    const embed = buildEmbed(
      `**User has been timed out successfully :white_check_mark:**\n**User:** <@${member.id}>\n**Reason:** ${reason}\n**Staff:** ${user.tag}`
    );
    const embedDm = buildEmbed(
      `**You Have Been timed out!**\n**Server:** ${guild.name}\n**Reason:** ${reason}\n**Staff:** ${user.tag}`
    );

    await member.timeout(duration * 1000, reason);
    await member.send({ embeds: [embedDm] }).catch((err) => {
      console.log(`Could not send DM to the user: ${err}`);
    });
    logEvent(interaction, embed);
    return await interaction.reply({
      embeds: [embed],
    });
  },
};
