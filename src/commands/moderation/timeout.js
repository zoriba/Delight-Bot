const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

const logSchema = require("../../schemas/logSchema.js");

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
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
    ) {
      return await interaction.reply({
        content: "You dont have the permission to use this command",
        ephemeral: true,
      });
    }

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

    const embed = new EmbedBuilder()
      .setColor("#B2A4D4")
      .setAuthor({
        name: "DelightBot",
        iconURL:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpng.pngtree.com%2Felement_our%2F20190528%2Fourmid%2Fpngtree-cute-cartoon-light-bulb-image_1134759.jpg&f=1&nofb=1&ipt=72d71ce7a39d017a3b63aa5294792ee087806e446b903b73679e0801746dc04d&ipo=images",
      })
      .setDescription(
        `**User has been timed out successfully :white_check_mark:**\n**User:** <@${member.id}>\n**Reason:** ${reason}\n**Staff:** ${user.username}`
      );

    const embedDm = new EmbedBuilder()
      .setColor("#B2A4D4")
      .setAuthor({
        name: "DelightBot",
        iconURL:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpng.pngtree.com%2Felement_our%2F20190528%2Fourmid%2Fpngtree-cute-cartoon-light-bulb-image_1134759.jpg&f=1&nofb=1&ipt=72d71ce7a39d017a3b63aa5294792ee087806e446b903b73679e0801746dc04d&ipo=images",
      })
      .setDescription(
        `**You Have Been timed out!**\n**Server:** ${guild.name}\n**Reason:** ${reason}\n**Staff:** ${user.username}`
      );
    await member.timeout(duration * 1000, reason);
    await member.send({ embeds: [embed] }).catch((err) => {
      console.log(`Could not send DM to the user: ${err.message}`);
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
