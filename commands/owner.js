const settings = require('../settings');

async function ownerCommand(sock, chatId, msg) {
    try {
        // ✅ Static Owner info
        const ownerName = "Shahin Rana"; 
        const ownerAddress = "Sylhet"; 
        const ownerReligion = "Islam"; 

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
╭━━━〔 👑 𝐎𝐖𝐍𝐄𝐑 𝐂𝐀𝐑𝐃 〕━━━⬣
┃ 🧑‍💼 𝗡𝗮𝗺𝗲      : 𝐒𝐡𝐚𝐡𝐢𝐧 𝐑𝐚𝐧𝐚
┃ 🌍 𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻 : 𝐒𝐲𝐥𝐡𝐞𝐭
┃ 🕌 𝗥𝗲𝗹𝗶𝗴𝗶𝗼𝗻 : 𝐈𝐬𝐥𝐚𝐦
┃ 📲 𝗡𝘂𝗺𝗯𝗲𝗿   : *@${settings.ownerNumber}*
┣━━━━━━━━━━━━━━━━━━⬣
┃ 🚀 𝗥𝗼𝗹𝗲   : 𝐁𝐨𝐭 𝐎𝐰𝐧𝐞𝐫
┃ 🧠 𝗙𝗼𝗰𝘂𝘀  : 𝐂𝐨𝐝𝐢𝐧𝐠 & 𝐈𝐧𝐧𝐨𝐯𝐚𝐭𝐢𝐨𝐧
┃ 🌌 𝗩𝗶𝗯𝗲   : 𝐒𝐢𝐦𝐩𝐥𝐞 • 𝐂𝐥𝐞𝐚𝐧 • 𝐏𝐫𝐨
╰━━━━━━━━━━━━━━━━━━⬣

> 👑 ρσωєʀє∂ ву ѕнαнιη яαηα
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
