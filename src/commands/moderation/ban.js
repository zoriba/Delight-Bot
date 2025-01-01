const { SlashCommandBuilder } = require("discord.js");
const { checkPermissions } = require("../../utils/validators.js");
const { logEvent } = require("../../utils/logs.js");
const { buildEmbed } = require("../../utils/embeds.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans a user from the server")
    .addUserOption((option) => {
      return option
        .setName("user")
        .setDescription("Enter the user you want to ban")
        .setRequired(true);
    })
    .addStringOption((option) => {
      return option
        .setName("reason")
        .setDescription("Enter the reason you want to ban the user");
    }),
  async execute(interaction) {
    checkPermissions(interaction, "BanMembers");

    const { options, guild, user } = interaction;
    const userBan = options.getMember("user");
    const memberBan = await guild.members.fetch(userBan.id);
    const reason = options.getString("reason") || "No reason given";

    if (!memberBan) {
      return await interaction.reply({
        content: "The specified user does not exist",
        ephemeral: true,
      });
    }

    const embedDM = buildEmbed(
      `**Server:** ${guild.name}\n **Reason:** ${reason}\n **Staff:** ${user.tag}`,
      "You Have Been Banned!"
    );

    const embed = buildEmbed(
      `**Server:** ${guild.name}\n **Reason:** ${reason}\n **Staff:** ${user.tag}`,
      "The User Has Been Banned!"
    );

    await memberBan.send({ embeds: [embedDM] }).catch((err) => {
      console.log(
        chalk.redBright(`[${guild.name}] Could not send DM to user: \n`) + err
      );
    });
    await memberBan
      .ban({ deleteMessageSeconds: 60 * 60 * 24 * 7, reason: [reason] })
      .catch((err) => {
        console.log(err);
        interaction.reply({
          content: "Error",
          ephemeral: true,
        });
      });

    await logEvent(interaction, embed);

    return await interaction.reply({ embeds: [embed] });
  },
};
