const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");

const warningSchema = require("../../schemas/warnSchema");
const logSchema = require("../../schemas/logSchema.js");

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
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
    ) {
      return await interaction.reply({
        content: "You dont have the permission to use this command",
        ephemeral: true,
      });
    }

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

      const embedDm = new EmbedBuilder()
        .setColor("#B2A4D4")
        .setAuthor({
          name: "DelightBot",
          iconURL:
            "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpng.pngtree.com%2Felement_our%2F20190528%2Fourmid%2Fpngtree-cute-cartoon-light-bulb-image_1134759.jpg&f=1&nofb=1&ipt=72d71ce7a39d017a3b63aa5294792ee087806e446b903b73679e0801746dc04d&ipo=images",
        })
        .setDescription(
          `**You Have Been Warned!**\n**Server:** ${guild.name}\n**Reason:** ${reason}\n**Staff:** ${user.username}`
        );

      await target.send({ embeds: [embedDm] }).catch((err) => {
        console.log(`Could not send DM to ${target.tag}: ${err.message}`);
      });

      const embed = new EmbedBuilder()
        .setColor("#B2A4D4")
        .setAuthor({
          name: "DelightBot",
          iconURL:
            "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpng.pngtree.com%2Felement_our%2F20190528%2Fourmid%2Fpngtree-cute-cartoon-light-bulb-image_1134759.jpg&f=1&nofb=1&ipt=72d71ce7a39d017a3b63aa5294792ee087806e446b903b73679e0801746dc04d&ipo=images",
        })
        .setDescription(
          `**User has been warned successfully :white_check_mark:**\n**User:** <@${target.id}>\n**Reason:** ${reason}\n**Staff:** ${user.username}`
        );
      try {
        const logData = await logSchema.findOne({
          GuildId: interaction.guild.id,
        });

        if (!logData || !logData.Channel) {
          console.log("Log channel not set.");
          return;
        }

        const logChannel = interaction.guild.channels.cache.get(
          logData.Channel
        );

        if (logChannel) {
          // Send the embed to the log channel
          await logChannel.send({ embeds: [embed] });
        } else {
          console.log("Log channel not found in guild.");
        }
      } catch (err) {
        console.log(`Error logging the event: ${err.message}`);
      }
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
