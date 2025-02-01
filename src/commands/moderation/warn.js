const { SlashCommandBuilder } = require("discord.js");
const warningSchema = require("../../schemas/warnSchema");
const { checkPermissions } = require("../../utils/validators.js");
const { buildEmbed } = require("../../utils/embeds.js");
const { logEvent } = require("../../utils/logs.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("The warn module")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
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
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a warning from a user")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Select the user you want to remove a warn from")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Enter the reason for the warning")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    checkPermissions(interaction, "KickMembers");

    const { options, guild, user } = interaction;
    const subcommand = options.getSubcommand();
    const target = options.getUser("user");
    const reason = options.getString("reason");
    let embed;

    let data = await warningSchema.findOne({
      GuildId: guild.id,
      UserId: target.id,
    });

    if (subcommand === "add") {
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
              warnId: 1,
            },
          ],
        });
      } else {
        const warnContent = {
          ExecuterId: user.id,
          ExecuterTag: user.tag,
          Reason: reason,
          warnId: data.warnings.length + 1,
        };
        data.warnings.push(warnContent);
        console.log(data);
      }
      warnId = data.warnings[data.warnings.length - 1].warnId;

      const embedDm = buildEmbed(
        `**You Have Been Warned! **\n**Server:** ${guild.name}\n**Reason:** ${reason}\n**Staff:** ${user.username}`
      );

      await target.send({ embeds: [embedDm] }).catch((err) => {
        console.log(`Could not send DM to ${target.tag}: ${err.message}`);
      });

      embed = buildEmbed(
        `**User has been warned successfully :white_check_mark:**\n**User:** <@${target.id}>\n**Reason:** ${reason}\n**Warn Id:**${warnId}\n **Staff:** ${user.username}`
      );
    }
    if (subcommand === "remove") {
      const warnId = options.getInteger("id");
      console.log(data.warnings[warnId - 1]);

      data.warnings.splice(warnId - 1, 1);

      console.log(data);
      embed = buildEmbed(
        `**Warn removed successfully :white_check_mark:**\n**User:** <@${target.id}>\n**Reason:** ${reason}\n**Warn Id:**${warnId}\n **Staff:** ${user.username}`
      );
    }
    await data.save();

    await logEvent(interaction, embed);

    await interaction.reply({ embeds: [embed] });
  },
};
