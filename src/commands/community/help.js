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
    .setName("help")
    .setDescription("Get help about the commands"),
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setColor("#B2A4D4")
      .setTitle("Help Interface")
      .setAuthor({
        name: "DelightBot",
        iconURL:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpng.pngtree.com%2Felement_our%2F20190528%2Fourmid%2Fpngtree-cute-cartoon-light-bulb-image_1134759.jpg&f=1&nofb=1&ipt=72d71ce7a39d017a3b63aa5294792ee087806e446b903b73679e0801746dc04d&ipo=images",
      })
      .setDescription(
        "If you have any queries or reports please ask at our [support server](https://discord.gg/)"
      )
      .addFields({ name: "Page 1", value: "Help Interface" })
      .addFields({ name: "Page 2", value: "Community Commands" })
      .addFields({ name: "Page 3", value: "Moderation Commands" })
      .setTimestamp();

    const embed2 = new EmbedBuilder()
      .setColor("#B2A4D4")
      .setTitle("Community Commands")
      .setAuthor({
        name: "DelightBot",
        iconURL:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpng.pngtree.com%2Felement_our%2F20190528%2Fourmid%2Fpngtree-cute-cartoon-light-bulb-image_1134759.jpg&f=1&nofb=1&ipt=72d71ce7a39d017a3b63aa5294792ee087806e446b903b73679e0801746dc04d&ipo=images",
      })
      .addFields({ name: "/help", value: "Get help about the commands" })
      .addFields({ name: "/warns", value: "View a user's warnings" })
      .setTimestamp();

    const embed3 = new EmbedBuilder()
      .setColor("#B2A4D4")
      .setTitle("Moderation Commands")
      .setAuthor({
        name: "DelightBot",
        iconURL:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpng.pngtree.com%2Felement_our%2F20190528%2Fourmid%2Fpngtree-cute-cartoon-light-bulb-image_1134759.jpg&f=1&nofb=1&ipt=72d71ce7a39d017a3b63aa5294792ee087806e446b903b73679e0801746dc04d&ipo=images",
      })
      .addFields({ name: "/role", value: "Assign a role to A Server Member" })
      .addFields({
        name: "/removerole",
        value: "Remove a role from A Server Member",
      })
      .addFields({ name: "/kick", value: "Kick A Server Member" })
      .addFields({ name: "/ban", value: "Ban a user from the server" })
      .addFields({ name: "/unban", value: "Unban a user from the server" })
      .addFields({
        name: "/purge",
        value: "Purge a certain amount of messages in a channel",
      })
      .addFields({ name: "/timeout", value: "Timeout a Server Member" })
      .addFields({
        name: "/untimeout",
        value: "Remove the timeout of a Server Member",
      })
      .addFields({ name: "/warn", value: "Warn a user" })
      .addFields({
        name: "/setup",
        value: "Setup the logs channel for the server",
      })
      .setTimestamp();

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("page1")
        .setLabel("Page 1")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("page2")
        .setLabel("Page 2")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("page3")
        .setLabel("Page 3")
        .setStyle(ButtonStyle.Primary)
    );

    const message = await interaction.reply({
      embeds: [embed],
      components: [button],
    });

    const collector = message.createMessageComponentCollector();

    collector.on("collect", async (i) => {
      if (interaction.user.id !== i.user.id) {
        return i.reply({
          content: `You can't use this button`,
          ephemeral: true,
        });
      }

      if (i.customId === "page1") {
        await i.update({ embeds: [embed], components: [button] });
      } else if (i.customId === "page2") {
        await i.update({ embeds: [embed2], components: [button] });
      } else if (i.customId === "page3") {
        await i.update({ embeds: [embed3], components: [button] });
      }
    });
  },
};
