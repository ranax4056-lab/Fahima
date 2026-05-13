const os = require('os');
const settings = require('../settings.js');

function formatTime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds = seconds % (24 * 60 * 60);
    const hours = Math.floor(seconds / (60 * 60));
    seconds = seconds % (60 * 60);
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    let time = '';
    if (days > 0) time += `${days}d `;
    if (hours > 0) time += `${hours}h `;
    if (minutes > 0) time += `${minutes}m `;
    if (seconds > 0 || time === '') time += `${seconds}s`;

    return time.trim();
}

async function pingCommand(sock, chatId, message) {
    try {

        // 🌀 Loading reaction
        await sock.sendMessage(chatId, {
            react: {
                text: '🌀',
                key: message.key
            }
        });

        const start = Date.now();

        await sock.sendMessage(chatId, { 
            text: '* *⎯͢✧🫣 𝐏ɪɴɢɪɴɢ - //* 🌚🎀 *' 
        }, { quoted: message });

        const end = Date.now();
        const ping = Math.round((end - start) / 2);

        const uptimeInSeconds = process.uptime();
        const uptimeFormatted = formatTime(uptimeInSeconds);

        const botInfo = `
*⎯͢✧💖 𝐏ɪɴɢ 𝐒ᴛᴀᴛᴜs 🌙🐱*
*┃⚡ 𝐑ᴇsᴘᴏɴsᴇ : ${ping} ms*
*┃⏱️ 𝐒ᴛᴀᴛᴜs : ${uptimeFormatted}*
*┃💎 𝐕ᴇʀsɪᴏɴ : v${settings.version}*
*┃👑 𝐎ᴡɴᴇʀ : ⎯͢✧ 𝐒ʜꫝʜɪɴ 𝐑ᴀɴꫝᥫ᭡*
*⎯͢✧━━━━━━━━━━━━━━━✧*`.trim();

        await sock.sendMessage(chatId, { 
            text: botInfo 
        }, { quoted: message });

        // 🕊️ Success reaction
        await sock.sendMessage(chatId, {
            react: {
                text: '🕊️',
                key: message.key
            }
        });

    } catch (error) {
        console.error('Error in ping command:', error);

        // ❌ Error reaction
        await sock.sendMessage(chatId, {
            react: {
                text: '❌',
                key: message.key
            }
        });

        await sock.sendMessage(chatId, {
            text: '❌ ⎯͢✧ 𝐅ᴀɪʟᴇᴅ 𝐓ᴏ 𝐆ᴇᴛ 𝐁ᴏᴛ 𝐒ᴛᴀᴛᴜs 🐱'
        });
    }
}

module.exports = pingCommand;  
