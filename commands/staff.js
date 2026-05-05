async function staffCommand(sock, chatId, msg) {
    try {
        // Get group metadata
        const groupMetadata = await sock.groupMetadata(chatId);
        
        // Get group profile picture
        let pp;
        try {
            pp = await sock.profilePictureUrl(chatId, 'image');
        } catch {
            pp = 'https://i.imgur.com/2wzGhpF.jpeg'; // Default image
        }

        // Get admins from participants
        const participants = groupMetadata.participants;
        const groupAdmins = participants.filter(p => p.admin);

        // Owner of the group
        const owner = groupMetadata.owner || 
            groupAdmins.find(p => p.admin === 'superadmin')?.id || 
            chatId.split('-')[0] + '@s.whatsapp.net';

        // Emoji array
        const emojis = ['🪀','👀','🍿','🐋','🧃','🎀','🍓','🎐','🍦','✨'];
        
        // Header
        const header = `*▢ GROUP : ${groupMetadata.subject}*\n*▢ ADMINS : ${groupAdmins.length}*\n*▢ MESSAGE : ATTENTION ADMINS*`;

        // Admin list
        let listAdminText = '╭┈─「 αℓℓ α∂ɱเɳร 👑 」┈❍\n';
        groupAdmins.forEach((admin, index) => {
            const emoji = emojis[index % emojis.length];
            listAdminText += `│${emoji} @${admin.id.split('@')[0]}\n`;
        });

        // Add owner
        listAdminText += `│👑 @${owner.split('@')[0]}\n`;
        listAdminText += '╰────────────❍';

        // Final text with stylish powered by
        const text = `${header}\n\n${listAdminText}\n\n✦👑 ρσωєяє∂ ву ѕнαнιη яαηα 👑`;

        // Send message
        await sock.sendMessage(chatId, {
            image: { url: pp },
            caption: text,
            mentions: [...groupAdmins.map(v => v.id), owner]
        });

    } catch (error) {
        console.error('Error in staff command:', error);
        await sock.sendMessage(chatId, { text: 'Failed to get admin list!' });
    }
}

module.exports = staffCommand;
