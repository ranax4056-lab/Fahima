async function groupInfoCommand(sock, chatId, msg) {
    try {
        const groupMetadata = await sock.groupMetadata(chatId);

        let pp;
        try {
            pp = await sock.profilePictureUrl(chatId, 'image');
        } catch {
            pp = 'https://i.imgur.com/2wzGhpF.jpeg';
        }

        const participants = groupMetadata.participants;
        const groupAdmins = participants.filter(p => p.admin);

        const listAdmin = groupAdmins.length > 0
            ? groupAdmins.map((v, i) => `▢ @${v.id.split('@')[0]}`).join('\n')
            : '▢ 𝐍ᴏ 𝐀ᴅᴍɪɴ 𝐅ᴏᴜɴᴅ';

        const owner = groupMetadata.owner 
            || groupAdmins.find(p => p.admin === 'superadmin')?.id 
            || chatId.split('-')[0] + '@s.whatsapp.net';

        const time = new Date().toLocaleString('en-GB', {
            timeZone: 'Asia/Dhaka'
        });

        const text = `
⎯͢✧🌐 𝐆ʀᴏᴜᴘ 𝐈ɴғᴏ 🐱

▢ 𝐍ᴀᴍᴇ : ${groupMetadata.subject}

▢ 𝐌ᴇᴍʙᴇʀs : ${participants.length}

▢ 𝐎ᴡɴᴇʀ : @${owner.split('@')[0]}

▢ 𝐀ᴅᴍɪɴs :
${listAdmin}

▢ 𝐃ᴇsᴄ :
${groupMetadata.desc?.toString() || '𝐍ᴏ 𝐃ᴇsᴄʀɪᴘᴛɪᴏɴ'}

▢ 𝐂ʜᴇᴄᴋᴇᴅ 𝐀ᴛ :
${time}

⎯͢✧🫣 𝐗 𝐒ʜᴀʜɪɴ 𝐑ᴀɴᴀᥫ᭡ 🐱
        `.trim();

        await sock.sendMessage(chatId, {
            image: { url: pp },
            caption: text,
            footer: "⎯͢✧🫣 𝐗 𝐒ʜᴀʜɪɴ 𝐑ᴀɴᴀᥫ᭡ 🐱",
            buttons: [
                { buttonId: '.menu', buttonText: { displayText: '▢ 𝐌ᴇɴᴜ' }, type: 1 },
                { buttonId: '.owner', buttonText: { displayText: '▢ 𝐎ᴡɴᴇʀ' }, type: 1 }
            ],
            headerType: 4,
            mentions: [...groupAdmins.map(v => v.id), owner]
        });

    } catch (error) {
        console.error('Error in groupinfo command:', error);

        await sock.sendMessage(chatId, {
            text: '⎯͢✧❌ 𝐅ᴀɪʟᴇᴅ 𝐓ᴏ 𝐆ᴇᴛ 𝐆ʀᴏᴜᴘ 𝐈ɴғᴏ 🐱'
        });
    }
}

module.exports = groupInfoCommand;
