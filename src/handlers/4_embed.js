const D = require("discord.js");

module.exports = (client) => {
  client.templateEmbed = function() {
    return new D.EmbedBuilder()
      .setColor('Random')
      .setTimestamp();
  }
  client.embed = async function({
    embed: embed = client.templateEmbed(),
    title: title,
    desc: desc,
    color: color,
    image: image,
    author: author,
    url: url,
    footer: footer,
    thumbnail: thumbnail,
    fields: fields,
    content: content,
    components: components,
    type: type
  }, message) {
    if (title) embed.setTitle(title);
    if (desc && desc.length >= 2048) embed.setDescription(desc.substr(0, 2044) + "...");
    else if (desc) embed.setDescription(desc);
    if (image) embed.setImage(image);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (fields) embed.addFields(fields);
    if (author) embed.setAuthor(author);
    if (url) embed.setURL(url);
    if (footer) embed.setFooter({ text: footer });
    if (color) embed.setColor(color);
    return client.sendEmbed({
      embeds: [embed],
      content: content,
      components: components,
      type: type
    }, message)
  }
  client.sendEmbed = async function({
    embeds: embeds,
    content: content,
    components: components,
    type: type
  }, message) {
    if (type && type.toLowerCase() == "reply") {
      return await message.reply({
        embeds: embeds,
        content: content,
        components: components,
        fetchReply: true
      }).catch(e => { });
    }
    else {
      return await message.channel.send({
        embeds: embeds,
        content: content,
        components: components,
        fetchReply: true
      }).catch(e => { });
    }
  }
}
