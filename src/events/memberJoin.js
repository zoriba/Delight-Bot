const { Events, EmbedBuilder } = require("discord.js");
module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    console.log(member);
    const welcomeChannel = await member.guild.channels.cache.get(
      "1249073815288549409"
    );
    const embed = new EmbedBuilder()
      .setAuthor({
        name: zoriba,
      })
      .setTitle()
      .setDescription(
        "Read the server info and rules at #【📜】info\n Chat in #【🗨】general\n User joined at {date}\n"
      );
    welcomeChannel.send(`Welcome to the server <@${member.id}>`);
  },
};
