const { SlashCommandBuilder, Guild } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("server").setDescription("server"),
  async execute(interaction) {
    interaction.reply(`Server name is ${interaction.guild.name}`);
  },
};
