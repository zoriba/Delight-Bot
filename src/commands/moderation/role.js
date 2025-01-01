const { SlashCommandBuilder } = require("discord.js");
const { checkPermissions } = require("../../utils/validators.js");
const { logEvent } = require("../../utils/logs.js");
const { buildEmbed } = require("../../utils/embeds.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Assign a role to A Server Member.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a role to a user")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("the user you want to assign a role")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role you want to add")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a role from A Server Member.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("User who you want to remove a role from.")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role you want to remove")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("info")
        .setDescription("Show the info about a role.")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role you want to get the info on.")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    checkPermissions(interaction, "ManageRoles");

    const { guild, options } = interaction;
    const userRole = options.getUser("user");
    let memberRole;
    if (userRole) memberRole = (await guild.members.fetch(userRole.id)) || null;
    const role = options.getRole("role");
    const subcommand = options.getSubcommand();
    let embed;

    if (!memberRole || !role) {
      return await interaction.reply({
        content: "The selected role or user does not exist",
        ephemeral: true,
      });
    }

    if (subcommand === "add") {
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

      embed = buildEmbed(
        `**User:** <@${memberRole.id}>\n **Reason:** <@&${role.id}>\n **Staff:** ${interaction.user.username}`,
        "Role assigned successfully :white_check_mark:"
      );
      await logEvent(interaction, embed);
    } else if (subcommand === "remove") {
      if (!memberRole.roles.cache.has(role.id)) {
        return await interaction.reply({
          ephemeral: true,
          content: "The user does not has that role.",
        });
      }

      memberRole.roles.remove(role).catch((err) => {
        console.log(err);
        interaction.reply({
          ephemeral: true,
          content: "Could not remove the role from the user.",
        });
      });

      embed = buildEmbed(
        `**User:** <@${memberRole.id}>\n **Reason:** <@&${role.id}>\n **Staff:** ${interaction.user.username}`,
        "Role removed successfully :white_check_mark:"
      );
    } else if (subcommand === "info") {
      console.log(role);
    }
    await logEvent(interaction, embed);

    return await interaction.reply({
      embeds: [embed],
    });
  },
};
