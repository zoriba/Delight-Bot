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
const chalk = require("chalk");

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

    const { user, options, channel, guild } = interaction;
    const count = options.getInteger("amount");
    const messages = await channel.messages.fetch({ limit: count });

    const now = Date.now();
    const validMessages = messages.filter(
      (msg) => now - msg.createdTimestamp < 14 * 24 * 60 * 60 * 1000
    );
    if (validMessages.size === 0) {
      return interaction.reply({
        embeds: [
          buildEmbed(
            "No valid messages found.",
            "Could not delete messages in channel. :x: "
          ),
        ],
        ephemeral: true,
      });
    }
    const embed = buildEmbed(
      `**Amount**: ${validMessages.size}\n **Staff:** ${user.username}`,
      "Messages deleted successfully :white_check_mark:"
    );

    const embedLog = buildEmbed(
      `**Amount:**${validMessages.size}\n**Staff:** ${user.username}`,
      `Messages deleted in channel <#${channel.id}> :white_check_mark:`
    );

    await interaction.channel.bulkDelete(validMessages, true).catch((err) => {
      console.log(
        chalk.redBright(`[${guild.name}] Error deleting messages: `) + err
      );
    });

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
        if (i.user === user) interaction.deleteReply();
      }
    });
    await logEvent(interaction, embedLog);
  },
};
