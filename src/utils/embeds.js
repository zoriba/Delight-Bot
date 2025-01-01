const { EmbedBuilder } = require("discord.js");

const buildEmbed = (description, title) => {
  if (!title) {
    return new EmbedBuilder()
      .setColor("#B2A4D4")
      .setAuthor({
        name: "DelightBot",
        iconURL:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpng.pngtree.com%2Felement_our%2F20190528%2Fourmid%2Fpngtree-cute-cartoon-light-bulb-image_1134759.jpg&f=1&nofb=1&ipt=72d71ce7a39d017a3b63aa5294792ee087806e446b903b73679e0801746dc04d&ipo=images",
      })
      .setDescription(description)
      .setTimestamp();
  } else {
    return new EmbedBuilder()
      .setColor("#B2A4D4")
      .setAuthor({
        name: "DelightBot",
        iconURL:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpng.pngtree.com%2Felement_our%2F20190528%2Fourmid%2Fpngtree-cute-cartoon-light-bulb-image_1134759.jpg&f=1&nofb=1&ipt=72d71ce7a39d017a3b63aa5294792ee087806e446b903b73679e0801746dc04d&ipo=images",
      })
      .setTitle(title)
      .setDescription(description)
      .setTimestamp();
  }
};
module.exports = { buildEmbed };
