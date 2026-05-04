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
            ? groupAdmins.map((v, i) => `│ ${i + 1}. @${v.id.split('@')[0]}`).join('\n')
            : '│ ➥ No Admin Found';

        const owner = groupMetadata.owner 
            || groupAdmins.find(p => p.admin === 'superadmin')?.id 
            || chatId.split('-')[0] + '@s.whatsapp.net';

        const time = new Date().toLocaleString('en-GB', {
            timeZone: 'Asia/Dhaka'
        });

        const text = `
╭━━━〔 🌐 𝐆𝐑𝐎𝐔𝐏 𝐈𝐍𝐅𝐎 ✔️ 〕━━━⬣
┃
┃ 📛 *Name* :
┃ ➥ ${groupMetadata.subject}
┃
┃ 👥 *Members* :
┃ ➥ ${participants.length}
┃
┃ 👑 *Owner* :
┃ ➥ @${owner.split('@')[0]}
┃
┃ 🛡️ *Admins* :
${listAdmin}
┃
┃ 📝 *Description* :
┃ ➥ ${groupMetadata.desc?.toString() || 'No Description'}
┃
┃ ⏰ *Checked At* :
┃ ➥ ${time}
┃
╰━━━━━━━━━━━━━━━━━━⬣
        `.trim();

        await sock.sendMessage(chatId, {
            image: { url: pp },
            caption: text,
            footer: "📛 ρσωєя∂є∂ ву ѕнαнιη яαηα!",
            buttons: [
                { buttonId: '.menu', buttonText: { displayText: '📜 MENU' }, type: 1 },
                { buttonId: '.owner', buttonText: { displayText: '👑 OWNER' }, type: 1 }
            ],
            headerType: 4,
            mentions: [...groupAdmins.map(v => v.id), owner]
        });

    } catch (error) {
        console.error('Error in groupinfo command:', error);
        await sock.sendMessage(chatId, { text: '❌ Failed to get group info!' });
    }
}

module.exports = groupInfoCommand;
