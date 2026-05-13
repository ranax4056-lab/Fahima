const moment = require('moment-timezone');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

async function githubCommand(sock, chatId, message) {
  try {
    const res = await fetch('https://api.github.com/repos/mruniquehacker/Knightbot-md');
    if (!res.ok) throw new Error('Error fetching repository data');
    const json = await res.json();

    let txt = `*⎯͢✧🫣 𝐒ʜꫝʜɪɴ 𝐑ᴀɴꫝᥫ᭡ 🐱*\n\n`;

    txt += `✩  *𝐍ᴀᴍᴇ* : ⎯͢✧🫣 𝐒ʜꫝʜɪɴ 𝐑ᴀɴꫝᥫ᭡ 🐱-md\n`;
    txt += `✩  *𝐖ᴀᴛᴄʜᴇʀs* : ${json.watchers_count}\n`;
    txt += `✩  *𝐒ɪᴢᴇ* : ${(json.size / 1024).toFixed(2)} MB\n`;
    txt += `✩  *𝐋ᴀsᴛ 𝐔ᴘᴅᴀᴛᴇᴅ* : ${moment(json.updated_at).format('DD/MM/YY - HH:mm:ss')}\n`;
    txt += `✩  *𝐔ʀʟ* : ${json.html_url}\n`;
    txt += `✩  *𝐅ᴏʀᴋs* : ${json.forks_count}\n`;
    txt += `✩  *𝐒ᴛᴀʀs* : ${json.stargazers_count}\n\n`;

    txt += `💥 *⎯͢✧🫣 𝐒ʜꫝʜɪɴ 𝐑ᴀɴꫝᥫ᭡ 🐱*`;

    const imgPath = path.join(__dirname, '../assets/bot_image.jpg');
    const imgBuffer = fs.readFileSync(imgPath);

    await sock.sendMessage(chatId, {
      image: imgBuffer,
      caption: txt
    }, { quoted: message });

  } catch (error) {
    await sock.sendMessage(chatId, {
      text: '❌ 𝐄ʀʀᴏʀ 𝐅ᴇᴛᴄʜɪɴɢ 𝐑ᴇᴘᴏsɪᴛᴏʀʏ 𝐈ɴғᴏ 🐱'
    }, { quoted: message });
  }
}

module.exports = githubCommand;
