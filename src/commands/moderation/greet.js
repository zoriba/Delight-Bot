const { SlashCommandBuilder } = require("discord.js");
const { checkPermissions } = require("../../utils/validators.js");
const { logEvent } = require("../../utils/logs.js");
const { buildEmbed } = require("../../utils/embeds.js");
const greetSchema = require("../../schemas/greetSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("greet")
    .setDescription("The greet module for welcome system.")
    .addSubcommand((subcommand) => {
      return subcommand
        .setName("toggle")
        .setDescription("Enables or disables the greet module.");
    })
    .addSubcommand((subcommand) => {
      return subcommand
        .setName("channel")
        .setDescription("Set the welcome channel.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Select the channel for the welcome message.")
            .setRequired(true)
        );
    })
    .addSubcommand((subcommand) => {
      return subcommand
        .setName("message")
        .setDescription("Set or edit the welcome message.")
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("The message for the greet module")
            .setRequired(true)
        );
    }),

  async execute(interaction) {
    checkPermissions(interaction, "Administrator");
    const { options, guild } = interaction;
    const channel = options.getChannel("channel");
    const message = options.getString("message");
    const subcommand = options.getSubcommand();
    let embed;

    let data = await greetSchema.findOne({ GuildID: guild.id });
    if (!data) {
      data = new greetSchema({ GuildID: guild.id });
      await data.save();
    }
    if (subcommand === "toggle") {
      const toggle = !data?.Toggle;
      await greetSchema.findOneAndUpdate(
        { GuildID: guild.id },
        { Toggle: toggle },
        { new: true, upsert: true }
      );

      embed = buildEmbed(
        `**Greet module ${
          toggle ? "Enabled" : "Disabled"
        } successfully :white_check_mark:**`
      );
    } else if (subcommand === "channel") {
      await greetSchema.findOneAndUpdate(
        { GuildID: guild.id },
        { Channel: channel.id },
        { new: true, upsert: true }
      );
      embed = buildEmbed(
        `**Greet Channel set successfully :white_check_mark: **\n **Channel:** <#${channel.id}>`
      );
    } else if (subcommand === "message") {
      await greetSchema.findOneAndUpdate(
        { GuildID: guild.id },
        { Message: message },
        { new: true, upsert: true }
      );
      embed = buildEmbed(
        `**Greet message set successfully :white_check_mark: **`
      );
    }
    logEvent(interaction, embed);
    return await interaction.reply({
      embeds: [embed],
    });
  },
};
