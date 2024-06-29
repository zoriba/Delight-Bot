const { Events, EmbedBuilder } = require("discord.js");
module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    console.log(member);
    const welcomeChannel = await member.guild.channels.cache.get(
      "1249073815288549409"
    );
    const date = new Date(member.joinedTimeStamp);
    date = date.toString();
    const embedMsg= `<a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> 

**Welcome <@${member.id}> to the server ${member.guild.name}!!!**

<:empty:1247210715178074253>ㅤㅤㅤ<a:FS_hashtag:1247209899340071033> Read the server info and rules at <#1246409428748730449>

<:empty:1247210715178074253><a:FS_hashtag:1247209899340071033>Chat in <#1246409429209972761>

<:empty:1247210715178074253><a:FS_hashtag:1247209899340071033> User joined at ${date.toString()}

<:empty:1247210715178074253><a:FS_hashtag:1247209899340071033>Have a great day!!!

<a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> <a:divider1:1246784324297162827> 


`;

    const embed = new EmbedBuilder()
      .setTitle("A user has Joined !!")
      .setDescription(embedMsg);
    welcomeChannel.send({embeds: [embed]});
  },
};
