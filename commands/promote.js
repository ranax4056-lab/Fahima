 const { isAdmin } = require('../lib/isAdmin');

// Function to handle manual promotions via command
async function promoteCommand(sock, chatId, mentionedJids, message) {
    let userToPromote = [];
    
    if (mentionedJids && mentionedJids.length > 0) {
        userToPromote = mentionedJids;
    } else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
        userToPromote = [message.message.extendedTextMessage.contextInfo.participant];
    }
    
    if (userToPromote.length === 0) {
        await sock.sendMessage(chatId, { 
            text: 'Please mention the user or reply to their message to promote!'
        });
        return;
    }

    try {
        await sock.groupParticipantsUpdate(chatId, userToPromote, "promote");
        
        const usernames = userToPromote.map(jid => `@${jid.split('@')[0]}`);
        const promoterJid = message.key.participant || message.key.remoteJid;
        const promoterTag = `@${promoterJid.split('@')[0]}`;

        const promotionMessage =
`*╭─❖「 🎉 ᴄσɴɢʀᴀᴛѕ 」❖─╮*
${usernames.map(u => `*┋● 👤 ᴜѕᴇʀ ➤* *${u}*`).join('\n')}
*┋● 🚀 ѕтαтυѕ ➤ ηєω α∂мιη 💗🍒*
*┋● 🌷 ɢινєη ву ➤* *${promoterTag}*
*┋● 👑 ρσωєʀ∂є∂ ву ѕнαнιη яαηα*
*╰────────────────────╯*`;

        // 📸 Get promoted user's DP
        let ppUrl;
        try {
            ppUrl = await sock.profilePictureUrl(userToPromote[0], 'image');
        } catch {
            ppUrl = 'https://i.ibb.co/4pDNDk1/avatar.png';
        }

        // 📩 Send image + caption
        await sock.sendMessage(chatId, { 
            image: { url: ppUrl },
            caption: promotionMessage,
            mentions: [...userToPromote, promoterJid]
        });

    } catch (error) {
        console.error('Error in promote command:', error);
        await sock.sendMessage(chatId, { text: 'Failed to promote user(s)!'});
    }
}

// Function to handle automatic promotion detection
async function handlePromotionEvent(sock, groupId, participants, author) {
    try {
        if (!Array.isArray(participants) || participants.length === 0) return;

        const usernames = participants.map(jid => {
            const id = typeof jid === 'string' ? jid : (jid.id || jid.toString());
            return `@${id.split('@')[0]}`;
        });

        let promoterTag = 'System';
        let mentionList = participants.map(jid =>
            typeof jid === 'string' ? jid : (jid.id || jid.toString())
        );

        if (author) {
            const authorJid = typeof author === 'string' ? author : (author.id || author.toString());
            promoterTag = `@${authorJid.split('@')[0]}`;
            mentionList.push(authorJid);
        }

        const promotionMessage =
`*╭─❖「 🎉 ᴄσɴɢʀᴀᴛѕ 」❖─╮*
${usernames.map(u => `*┋● 👤 ᴜѕᴇʀ ➤* *${u}*`).join('\n')}
*┋● 🚀 ѕтαтυѕ ➤ ηєω α∂мιη 💗🍒*
*┋● 🌷 ɢινєη ву ➤* *${promoterTag}*
*┋● 👑 ρσωєʀ∂є∂ ву ѕнαнιη яαηα*
*╰────────────────────╯*`;

        // 📸 Get promoted user's DP
        let ppUrl;
        try {
            ppUrl = await sock.profilePictureUrl(participants[0], 'image');
        } catch {
            ppUrl = 'https://i.ibb.co/4pDNDk1/avatar.png';
        }

        await sock.sendMessage(groupId, {
            image: { url: ppUrl },
            caption: promotionMessage,
            mentions: mentionList
        });

    } catch (error) {
        console.error('Error handling promotion event:', error);
    }
}

module.exports = { promoteCommand, handlePromotionEvent };       
