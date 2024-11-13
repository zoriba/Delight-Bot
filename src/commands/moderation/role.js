const { SlashCommandBuilder } = require("discord.js");
const { checkPermissions } = require("../../utils/validators.js");
const { logEvent } = require("../../utils/logs.js");
const { buildEmbed } = require("../../utils/embeds.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Assign a role to A Server Member.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User who you want to assign a role to.")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role you want to assign")
        .setRequired(true)
    ),
  async execute(interaction) {
    checkPermissions(interaction, "ManageRoles");

    const { guild, options } = interaction;
    const userRole = options.getUser("user");
    const memberRole = await guild.members.fetch(userRole.id);
    const role = options.getRole("role");

    if (!memberRole || !role) {
      return await interaction.reply({
        content: "The selected role or user does not exist",
        ephemeral: true,
      });
    }
    if (memberRole.roles.cache.has(role.id)) {
      return await interaction.reply({
        ephemeral: true,
        content: "The user already has that role",
      });
    }
    memberRole.roles.add(role).catch((err) => {
      interaction.reply({
        ephemeral: true,
        content: "Could not assign the role to the user",
      });
    });

    const embed = buildEmbed(
      `**User:** <@${memberRole.id}>\n **Reason:** <@&${role.id}>\n **Staff:** ${interaction.user.username}`,
      "Role assigned successfully :white_check_mark:"
    );

    await logEvent(interaction, embed);

    return await interaction.reply({
      embeds: [embed],
    });
  },
};
