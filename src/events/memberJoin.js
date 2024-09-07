const { Events, EmbedBuilder } = require("discord.js");
module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const welcomeChannel = await member.guild.channels.cache.get(
      "1249073815288549409"
    );
    const date = new Date(member.joinedTimeStamp);
    const embedMsg = `Welcome to the server<@${member.id}>`;

    const embed = new EmbedBuilder()
      .setTitle("A user has Joined !!")
      .setDescription(embedMsg);
    welcomeChannel.send({ embeds: [embed] });
  },
};
