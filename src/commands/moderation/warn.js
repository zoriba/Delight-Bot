const { SlashCommandBuilder } = require("discord.js");
const warningSchema = require("../../schemas/warnSchema");
const { checkPermissions } = require("../../utils/validators.js");
const { buildEmbed } = require("../../utils/embeds.js");
const { logEvent } = require("../../utils/logs.js");

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
    checkPermissions(interaction, "KickMembers");

    const { options, guild, user } = interaction;
    const target = options.getUser("user");
    const reason = options.getString("reason");
    const userTag = `${target.username}#${target.discriminator}`;

    try {
      let data = await warningSchema.findOne({
        GuildId: guild.id,
        UserId: target.id,
      });

      if (!data) {
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
        const warnContent = {
          ExecuterId: user.id,
          ExecuterTag: user.tag,
          Reason: reason,
        };
        data.warnings.push(warnContent);
      }

      await data.save();

      const embedDm = buildEmbed(
        `**You Have Been Warned! :white_check_mark:**\n**Server:** ${guild.name}\n**Reason:** ${reason}\n**Staff:** ${user.username}`
      );

      await target.send({ embeds: [embedDm] }).catch((err) => {
        console.log(`Could not send DM to ${target.tag}: ${err.message}`);
      });

      const embed = buildEmbed(
        `**User has been warned successfully :white_check_mark:**\n**User:** <@${target.id}>\n**Reason:** ${reason}\n**Staff:** ${user.username}`
      );

      await logEvent(interaction, embed);

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error("An error occurred:", err);
      return await interaction.reply({
        content: "An error occurred while trying to warn the user.",
        ephemeral: true,
      });
    }
  },
};
