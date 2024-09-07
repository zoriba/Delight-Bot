const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

const warningSchema = require("../../schemas/warnSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select the user you want to warn")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Enter the reason for the warning")
        .setRequired(true)
    ),
  async execute(interaction) {
    // Check if the user has the permission to warn
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)
    ) {
      return await interaction.reply({
        content: "You don't have the permission to warn a user.",
        ephemeral: true,
      });
    }

    const { options, guild, user } = interaction;
    const target = options.getUser("user");
    const reason = options.getString("reason");
    const userTag = `${target.username}#${target.discriminator}`;

    try {
      // Find the existing warning document or create a new one
      let data = await warningSchema.findOne({
        GuildId: guild.id,
        UserId: target.id,
      });

      if (!data) {
        // If no document exists, create a new one with an initialized warnings array
        data = new warningSchema({
          GuildId: guild.id,
          UserId: target.id,
          UserTag: userTag,
          warnings: [
            {
              ExecuterId: user.id,
              ExecuterTag: user.tag,
              Reason: reason,
            },
          ],
        });
      } else {
        // If a document exists, update it with the new warning
        const warnContent = {
          ExecuterId: user.id,
          ExecuterTag: user.tag,
          Reason: reason,
        };
        data.warnings.push(warnContent); // Push new warning to the warnings array
      }

      await data.save();

      // Notify the user via DM
      const embedDm = new EmbedBuilder()
        .setColor("#B2A4D4")
        .setDescription(
          `**You Have Been Warned!**\n**Server:** ${guild.name}\n**Reason:** ${reason}\n**Staff:** ${user.username}`
        );

      await target.send({ embeds: [embedDm] }).catch((err) => {
        console.log(`Could not send DM to ${target.tag}: ${err.message}`);
      });

      // Notify the server that the user has been warned
      const embed = new EmbedBuilder()
        .setColor("#B2A4D4")
        .setDescription(
          `**User has been warned successfully :white_check_mark:**\n**User:** <@${target.id}>\n**Reason:** ${reason}\n**Staff:** ${user.username}`
        );

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error("An error occurred:", err);
      await interaction.reply({
        content: "An error occurred while trying to warn the user.",
        ephemeral: true,
      });
    }
  },
};
