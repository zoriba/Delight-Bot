const { SlashCommandBuilder } = require("discord.js");
const { logEvent } = require("../../utils/logs.js");
const { checkPermissions } = require("../../utils/validators.js");
const { buildEmbed } = require("../../utils/embeds.js");
const chalk = require("chalk");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick A Server Member")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select the user you want to kick")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Enter the reason you want to ban the user")
    ),
  async execute(interaction) {
    checkPermissions(interaction, "KickMembers");

    const { options, guild, user } = interaction;
    const userKick = options.getMember("user");
    const memberKick = await guild.members.fetch(userKick.id);
    const reason = options.getString("reason") || "No reason specified";

    if (!memberKick) {
      return await interaction.reply({
        content: "The user is not in the server",
        ephemeral: true,
      });
    }
    if (!memberKick.kickable) {
      return await interaction.reply({
        content: "Can not kick the specified member",
        ephemeral: true,
      });
    }

    const embedDM = buildEmbed(
      `**Server:** ${guild.name}\n **Reason:** ${reason}\n **Staff:** ${user.tag}`,
      "You Have Been Kicked!"
    );

    const embed = buildEmbed(
      `**Server:** ${guild.name}\n **Reason:** ${reason}\n **Staff:** ${user.tag}`,
      "The User Has Been Kicked"
    );
    await memberKick.send({ embeds: [embed] }).catch((err) => {
      console.log(
        chalk.redBright(
          `[${guild.name}] Could not send DM to user while kicking: \n`
        ) + err
      );
    });

    await memberKick.kick({ reason: reason }).catch((err) => {
      interaction.reply({ content: "Error", ephemeral: true });
    });

    await logEvent(interaction, embed);

    return await interaction.reply({ embeds: [embed] });
  },
};
