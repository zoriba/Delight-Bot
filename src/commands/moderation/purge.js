const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Purge a certain amount of messages in a channel")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of messages you want to purge")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)
    ) {
      return await interaction.reply({
        content: "You are not permitted to use this command",
        ephemeral: true,
      });
    }

    const { user, options } = interaction;
    const count = options.getInteger("amount");

    const embed = new EmbedBuilder()
      .setColor("#B2A4D4")
      .setAuthor({
        name: "DelightBot",
        iconURL:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpng.pngtree.com%2Felement_our%2F20190528%2Fourmid%2Fpngtree-cute-cartoon-light-bulb-image_1134759.jpg&f=1&nofb=1&ipt=72d71ce7a39d017a3b63aa5294792ee087806e446b903b73679e0801746dc04d&ipo=images",
      })
      .setDescription(
        `**Messages deleted successfully :white_check_mark:**\n**Staff:** ${user.username}`
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
  },
};
