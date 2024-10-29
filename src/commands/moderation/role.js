const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

const logSchema = require("../../schemas/logSchema.js");

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
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)
    ) {
      return await interaction.reply({
        content: "You dont have the permission to use this command",
        ephemeral: true,
      });
    }
    const { guild, user, options } = interaction;
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
    const embed = new EmbedBuilder()
      .setColor("#B2A4D4")
      .setTitle("The role has been assigned :white_check_mark:")
      .setDescription(
        `**User:** <@${memberRole.id}>\n **Reason:** <@&${role.id}>\n **Staff:** ${interaction.user.username}`
      )
      .setAuthor({
        name: "DelightBot",
        iconURL:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpng.pngtree.com%2Felement_our%2F20190528%2Fourmid%2Fpngtree-cute-cartoon-light-bulb-image_1134759.jpg&f=1&nofb=1&ipt=72d71ce7a39d017a3b63aa5294792ee087806e446b903b73679e0801746dc04d&ipo=images",
      });

    try {
      const logData = await logSchema.findOne({
        GuildId: interaction.guild.id,
      });

      if (!logData || !logData.Channel) {
        console.log("Log channel not set.");
      } else {
        const logChannel = interaction.guild.channels.cache.get(
          logData.Channel
        );

        if (logChannel) {
          await logChannel.send({ embeds: [embed] });
        } else {
          console.log("Log channel not found in guild.");
        }
      }
    } catch (err) {
      console.log(`Error logging the event: ${err.message}`);
    }
    return await interaction.reply({
      embeds: [embed],
    });
  },
};
