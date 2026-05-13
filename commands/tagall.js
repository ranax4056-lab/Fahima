const isAdmin = require('../lib/isAdmin');

async function tagAllCommand(sock, chatId, senderId, message) {
    try {
        const groupMetadata = await sock.groupMetadata(chatId);
        const members = groupMetadata.participants;

        const emojis = [
            "│🌸 ᩧ𝆺ྀི𝅥","│👑 ᩧ𝆺ྀི𝅥","│🎀 ᩧ𝆺ྀི𝅥",
            "│🦋 ᩧ𝆺ྀི𝅥","│💎 ᩧ𝆺ྀི𝅥","│🎾 ᩧ𝆺ྀི𝅥",
            "│🎈 ᩧ𝆺ྀི𝅥","│🧁 ᩧ𝆺ྀི𝅥","│🍿 ᩧ𝆺ྀི𝅥","│🪀 ᩧ𝆺ྀི𝅥"
        ];

        let count = 1;

        let messageText = `
⎯͢✧🫣 𝐆ʀᴏᴜᴘ 𝐓ᴀɢ 𝐀ʟʟ 🐱
⎯͢✧━━━━━━━━━━━━━━━✧
▢ 𝐆ʀᴏᴜᴘ : ${groupMetadata.subject}
▢ 𝐌ᴇᴍʙᴇʀ : ${members.length}
▢ 𝐍ᴏᴛɪᴄᴇ : 💗 𝐀ᴛᴛᴇɴᴛɪᴏɴ 𝐄ᴠᴇʀʏᴏɴᴇ 💗

╭┈─「 👑 𝐀ʟʟ 𝐌ᴇᴍʙᴇʀs 」┈❍
`;

        for (let m of members) {
            let emoji = emojis[(count - 1) % emojis.length];
            messageText += `${emoji} @${m.id.split('@')[0]}\n`;
            count++;
        }

        messageText += `
╰────────────❍

⎯͢✧━━━━━━━━━━━━━━━✧
💬 𝐒ᴇɴᴛ 𝐁ʏ : ⎯͢✧🫣 𝐒ʜꫝʜɪɴ 𝐑ᴀɴꫝᥫ᭡ 🐱
💗 𝐒ᴛᴀʏ 𝐀ᴄᴛɪᴠᴇ • 𝐒ᴛᴀʏ 𝐒ᴛʏʟɪsʜ ✨
⎯͢✧━━━━━━━━━━━━━━━✧
`;

        await sock.sendMessage(chatId, {
            text: messageText,
            mentions: members.map(a => a.id)
        }, { quoted: message });

    } catch (error) {
        console.error("❌ TagAll error:", error);
        await sock.sendMessage(chatId, {
            text: "⎯͢✧❌ 𝐒ᴏʀʀʏ 𝐄ʀʀᴏʀ 🐱",
            quoted: message
        });
    }
}

module.exports = tagAllCommand;
