const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

const logSchema = require("../../schemas/logSchema.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("untimeout")
    .setDescription("Remove the timeout of a Server Member")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select the user you want untimeout")
        .setRequired(true)
    )

    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription(
          "Enter the reason you want to remove timeout of the member"
        )
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
    const reason = options.getString("reason") || "No reason given";
    if (!member) {
      return await interaction.reply({
        content: "The selected user does not exist",
        ephemeral: true,
      });
    }

    if (!member.kickable) {
      return await interaction.reply({
        content: "You can not remove this member's timeout",
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
        `**The user's timeout removed successfully :white_check_mark:**\n**User:** <@${member.id}>\n**Reason:** ${reason}\n**Staff:** ${user.username}`
      );

    await member.timeout(null, reason);
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
    return await interaction.reply({ embeds: [embed] });
  },
};
