const {
  SlashCommandBuilder,
  PermissionsBitField,
  EmbedBuilder,
  channelMention,
} = require("discord.js");

const logSchema = require("../../schemas/logSchema.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("setup the logs channel for the server")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("select the channel for logs")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return await interaction.reply({
        content: "You dont have the permission to use this command",
        ephemeral: true,
      });
    }
    const { guild, options } = interaction;
    const guildId = guild.id;
    const Channel = options.getChannel("channel");
    const id = Channel.id;
    const embed = new EmbedBuilder()
      .setColor("#B2A4D4")
      .setAuthor({
        name: "DelightBot",
        iconURL:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpng.pngtree.com%2Felement_our%2F20190528%2Fourmid%2Fpngtree-cute-cartoon-light-bulb-image_1134759.jpg&f=1&nofb=1&ipt=72d71ce7a39d017a3b63aa5294792ee087806e446b903b73679e0801746dc04d&ipo=images",
      })
      .setDescription(
        `**Logs Channel set successfully :white_check_mark:**\n **Channel:** <#${id}> `
      );
    try {
      let data = await logSchema.findOneAndUpdate(
        { GuildId: guild.id },
        { Channel: id },
        { new: true, upsert: true }
      );

      interaction.reply(`set`);
    } catch (err) {
      console.log(err);
    }
  },
};
