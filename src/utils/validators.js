const { PermissionsBitField } = require("discord.js");

const checkPermissions = (interaction, requiredPermission) => {
  if (
    !interaction.member.permissions.has(
      PermissionsBitField.Flags[requiredPermission]
    )
  ) {
    return interaction.reply({
      content: "You are not permitted to use this command",
      ephemeral: true,
    });
  } else {
    return true;
  }
};

module.exports = { checkPermissions };
