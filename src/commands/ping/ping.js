const { SlashCommandBuilder, Guild } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("ping"),
  async execute(interaction) {
    interaction.reply(`Pong!, Run by ${interaction.user.username}`);
  },
};
