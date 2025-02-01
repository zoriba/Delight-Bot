const { SlashCommandBuilder } = require("discord.js");
const { checkPermissions } = require("../../utils/validators.js");
const { logEvent } = require("../../utils/logs.js");
const { buildEmbed } = require("../../utils/embeds.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("The Ban Module")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Ban a member")
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
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Unban a member")
        .addStringOption((option) => {
          return option
            .setName("user")
            .setDescription("Enter the id of the user you want to unban")
            .setRequired(true);
        })
    ),
  async execute(interaction) {
    checkPermissions(interaction, "BanMembers");

    const { options, guild, user } = interaction;
    const subcommand = options.getSubcommand();
    let embed;

    if (subcommand === "Add") {
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

      embed = buildEmbed(
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
    }
    if (subcommand === "unban") {
      const member = interaction.options.getString("user");
      const embed = buildEmbed(
        `**Server:** ${interaction.guild.name}\n **Staff:** ${interaction.user.username}`,
        "The user has been unbanned :white_check_mark:"
      );

      await interaction.guild.bans.fetch().then(async (bans) => {
        if (bans.size == 0) {
          return await interaction.reply("No user is banned from the server");
        }
        let bannedID = bans.find((bans) => bans.user.id == member);
        if (!bannedID) {
          return await interaction.reply(
            "The user is not banned from the server"
          );
        } else {
          await interaction.guild.bans.remove(member).catch((err) => {
            console.log(err.message);
            interaction.reply({
              content: "Error while unbanning the user.",
              ephemeral: true,
            });
          });
        }
        await logEvent(interaction, embed);
        return await interaction.reply({ embeds: [embed] });
      });
    }
  },
};
