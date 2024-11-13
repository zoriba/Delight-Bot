const {
  SlashCommandBuilder,
  PermissionsBitField,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const { checkPermissions } = require("../../utils/validators.js");
const { logEvent } = require("../../utils/logs.js");
const { buildEmbed } = require("../../utils/embeds.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Purge a certain amount of messages in a channel")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of messages you want to purge")
        .setMaxValue(100)
        .setMinValue(1)
        .setRequired(true)
    ),
  async execute(interaction) {
    checkPermissions(interaction, "ManageMessages");

    const { user, options } = interaction;
    const count = options.getInteger("amount");

    const embed = buildEmbed(
      `**Amount**: ${count}\n **Staff:** ${user.username}`,
      "Messages deleted successfully :white_check_mark:"
    );

    const embedLog = buildEmbed(
      `**Amount:**${count}\n**Staff:** ${user.username}`,
      `Messages deleted in channel <#${interaction.channel.id}> :white_check_mark:`
    );

    await interaction.channel.bulkDelete(count);

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("purge")
        .setEmoji("🗑")
        .setStyle(ButtonStyle.Primary)
    );
    const message = await interaction.reply({
      embeds: [embed],
      components: [button],
    });

    const collector = message.createMessageComponentCollector();

    collector.on("collect", async (i) => {
      if (i.customId == "purge") {
        if (
          !interaction.member.permissions.has(
            PermissionsBitField.Flags.KickMembers
          )
        )
          return;
      }

      interaction.deleteReply();
    });
    await logEvent(interaction, embed);
  },
};
