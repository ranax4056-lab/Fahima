const settings = require("../settings");

async function aliveCommand(sock, chatId, message) {

    try {

        const botNumber = sock.user.id.split(":")[0];

        const aliveText =

`* *⎯͢✧🫣 𝐁ᴏᴛ 𝐂ᴏɴɴᴇᴄᴛᴇᴅ 🐱*
*┃🌱 𝐂ᴏɴɴᴇᴄᴛᴇᴅ : ${botNumber}*
*┃👻 𝐏ʀᴇғɪx : .*
*┃🔮 𝐌ᴏᴅᴇ : 𝐏ʀɪᴠᴀᴛᴇ*
*┃🎐 𝐕ᴇʀsɪᴏɴ : ${settings.version}*
*┃👑 𝐎ᴡɴᴇʀ : ⎯͢✧🫣 𝐒ʜꫝʜɪɴ 𝐑ᴀɴꫝᥫ᭡ 🐱*
*⎯͢✧━━━━━━━━━━━━━━━✧*
*┃🛠️ 𝗧ɪᴘs :*
*┃✧ 𝐓ʏᴘᴇ .menu 𝐓ᴏ 𝐕ɪᴇᴡ 𝐀ʟʟ*
*┃✧ 𝐅ᴜɴ, 𝐆ᴀᴍᴇ, 𝐒ᴛʏʟᴇ 𝐂ᴏᴍᴍᴀɴᴅs*
*⎯͢✧━━━━━━━━━━━━━━━✧*`;

        await sock.sendMessage(chatId, {

            text: aliveText,

            contextInfo: {

                forwardingScore: 999,

                isForwarded: true,

                forwardedNewsletterMessageInfo: {

                    newsletterJid: '120363161513685998@newsletter',

                    newsletterName: '⎯͢✧🫣 𝐒ʜꫝʜɪɴ 𝐑ᴀɴꫝᥫ᭡ 🐱',

                    serverMessageId: -1

                }

            }

        }, { quoted: message });

    } catch (err) {

        console.error("Alive Command Error:", err);

        await sock.sendMessage(

            chatId,

            { text: "🤖 𝐁ᴏᴛ ɪs 𝐂ᴏɴɴᴇᴄᴛᴇᴅ 𝐀ɴᴅ 𝐑ᴜɴɴɪɴɢ!" },

            { quoted: message }

        );

    }

}

module.exports = aliveCommand;
