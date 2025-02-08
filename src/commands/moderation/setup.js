const { SlashCommandBuilder } = require("discord.js");
const logSchema = require("../../schemas/logSchema.js");
const { checkPermissions } = require("../../utils/validators.js");
const { buildEmbed } = require("../../utils/embeds.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setuplogs")
    .setDescription("setup the logs channel for the server")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("select the channel for logs")
        .setRequired(true)
    ),
  async execute(interaction) {
    checkPermissions(interaction, "Administrator");
    const { guild, options } = interaction;
    const channel = options.getChannel("channel");
    const embed = buildEmbed(
      `**Logs Channel set successfully :white_check_mark: **\n **Channel:** <#${channel.id}> `
    );

    await logSchema.findOneAndUpdate(
      { GuildId: guild.id },
      { Channel: channel.id },
      { new: true, upsert: true }
    );
    await channel.send({
      embeds: [embed],
    });

    return await interaction.reply({
      embeds: [embed],
    });
  },
};
