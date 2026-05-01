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

        await sock.sendMessage(chatId, { text: 'Pong!' }, { quoted: message });

        const end = Date.now();
        const ping = Math.round((end - start) / 2);

        const uptimeInSeconds = process.uptime();
        const uptimeFormatted = formatTime(uptimeInSeconds);

        const botInfo = `
*╭┈─「 *💖 🌙⧫𝐏ᮀ𝐎ᮁ𝐍ᮀ𝐆ᮁ 💗* 」┈❍*
*├◈* ⚡ *𝐑𝐞𝐬𝐩𝐨𝐧𝐜𝐞* ➳❥ ${ping} ms
*├◈* ⏱️ *𝐒𝐭𝐚𝐭𝐮𝐬* ➳❥ ${uptimeFormatted}
*├◈* 💎 *𝐕𝐞𝐫𝐬𝐢𝐨𝐧* ➳❥ v${settings.version}
*╰─➤𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲*⎯⃝‎‎‎𝐒𝐡𝐚𝐡𝐢𝐧 𝐑𝐚𝐧𝐚♡➪`.trim();

        await sock.sendMessage(chatId, { text: botInfo }, { quoted: message });

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
            text: '❌ Failed to get bot status.'
        });
    }
}

module.exports = pingCommand;
