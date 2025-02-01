const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const warningSchema = require("../../schemas/warnSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warns")
    .setDescription("View a user's warnings")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select the user whose warnings you want to view")
        .setRequired(true)
    ),
  async execute(interaction) {
    const { options, guild } = interaction;

    const target = options.getUser("user");
    const userTag = `${target.username}#${target.discriminator}`;
    const embed = new EmbedBuilder();

    try {
      const data = await warningSchema.findOne({
        GuildId: guild.id,
        UserId: target.id,
      });

      console.log(data);

      if (data && Array.isArray(data.warnings)) {
        embed
          .setColor("#B2A4D4")
          .setDescription(
            `**${target.tag}'s warnings:**\n\n${data.warnings
              .map(
                (w, i) =>
                  `**Warning ${i + 1}:**\n > **Staff:** ${
                    w.ExecuterTag
                  }\n > **Reason:** ${w.Reason}\n **Warn ID: ${w.warnId}`
              )
              .join("\n")}`
          );
        await interaction.reply({ embeds: [embed] });
      } else {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#B2A4D4")
              .setDescription("The user has no warnings."),
          ],
        });
      }
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: "An error occurred while retrieving the warnings.",
        ephemeral: true,
      });
    }
  },
};
