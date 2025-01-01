const { Events } = require("discord.js");
const greetSchema = require("../schemas/greetSchema.js");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const data = await greetSchema.findOne({ GuildID: member.guild.id });
    if (!data || data.Toggle === false) {
      return;
    }
    function parsePlaceholders(message, data) {
      const placeholders = {
        "{user}": () => `<@${data.userId}>`,
        "{username}": () => data.username,
        "{server}": () => data.serverName,
        "{memberCount}": () => data.memberCount,
        "{joinDate}": () => data.joinDate.toLocaleDateString(),
      };

      return message.replace(/\{[\w]+\}/g, (match) => {
        const replacer = placeholders[match];
        return replacer ? replacer() : match;
      });
    }
    const { username, id: userId } = member.user;
    const { name: serverName, memberCount } = member.guild;
    const joinDate = member.guild.joinedTimestamp;

    const channel = member.guild.channels.cache.get(data.Channel);
    if (!channel) {
      console.log("Welcome channel not found.");
      return;
    }

    const parsedMsg = parsePlaceholders(data.Message, {
      username,
      userId,
      serverName,
      memberCount,
      joinDate,
    });
    channel.send(parsedMsg);
  },
};
