const logSchema = require("../schemas/logSchema.js");

const logEvent = async (interaction, embed) => {
  const logData = await logSchema.findOne({
    GuildId: interaction.guild.id,
  });

  console.log(logData.Channel);
  if (!logData || !logData.Channel) {
    console.log("Log channel not set.");
  } else {
    const logChannel = await interaction.guild.channels.cache.get(
      logData.Channel
    );

    if (logChannel) {
      await logChannel.send({ embeds: [embed] });
    } else {
      console.log("Log channel not found in guild.");
    }
  }
};

module.exports = {
  logEvent,
};
