const settings = require('../settings');

async function ownerCommand(sock, chatId, msg) {
    try {
        // ✅ Static Owner info
        const ownerName = "⎯͢✧🫣 𝐒ʜꫝʜɪɴ 𝐑ᴀɴꫝᥫ᭡ 🐱"; 
        const ownerAddress = "𝐒ʏʟʜᴇᴛ"; 
        const ownerReligion = "𝐈sʟᴀᴍ"; 

        // ✅ Dynamic number
        const ownerNumber = settings.ownerNumber + "@s.whatsapp.net";

        // ✅ Profile picture
        let pp;
        try {
            pp = await sock.profilePictureUrl(ownerNumber, 'image');
        } catch {
            pp = 'https://i.imgur.com/2wzGhpF.jpeg'; // fallback image
        }

        // ✅ Stylish Owner Card
        const ownerText = `
⎯͢✧👑 𝐎ᴡɴᴇʀ 𝐂ᴀʀᴅ 🐱
┃🧑‍💼 𝐍ᴀᴍᴇ : ${ownerName}
┃🌍 𝐋ᴏᴄᴀᴛɪᴏɴ : ${ownerAddress}
┃🕌 𝐑ᴇʟɪɢɪᴏɴ : ${ownerReligion}
┃📲 𝐍ᴜᴍʙᴇʀ : *@${settings.ownerNumber}*
⎯͢✧━━━━━━━━━━━━━━━✧
┃🚀 𝐑ᴏʟᴇ : 𝐁ᴏᴛ 𝐎ᴡɴᴇʀ
┃🧠 𝐅ᴏᴄᴜs : 𝐂ᴏᴅɪɴɢ & 𝐈ɴɴᴏᴠᴀᴛɪᴏɴ
┃🌌 𝐕ɪʙᴇ : 𝐒ɪᴍᴘʟᴇ • 𝐂ʟᴇᴀɴ • 𝐏ʀᴏ
⎯͢✧━━━━━━━━━━━━━━━✧

«👑 ⎯͢✧🫣 𝐒ʜꫝʜɪɴ 𝐑ᴀɴꫝᥫ᭡ 🐱»
`.trim();

        // ✅ vCard send (save contact option)
        const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${settings.botOwner}
TEL;waid=${settings.ownerNumber}:${settings.ownerNumber}
END:VCARD
`;

        await sock.sendMessage(chatId, {
            contacts: {
                displayName: settings.botOwner,
                contacts: [{ vcard }]
            }
        });

        // ✅ Send Owner Card with image
        await sock.sendMessage(chatId, {
            image: { url: pp },
            caption: ownerText,
            mentions: [ownerNumber],
        }, { quoted: msg });

    } catch (error) {
        console.error('Error in owner command:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Failed to fetch owner info!', 
            quoted: msg 
        });
    }
}

module.exports = ownerCommand;
