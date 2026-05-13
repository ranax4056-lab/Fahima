const settings = require('../settings');

// ================= MANUAL PROMOTE COMMAND =================
async function promoteCommand(sock, chatId, mentionedJids, message) {
    let userToPromote = [];

    if (mentionedJids && mentionedJids.length > 0) {
        userToPromote = mentionedJids;
    } else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
        userToPromote = [message.message.extendedTextMessage.contextInfo.participant];
    }

    if (userToPromote.length === 0) {
        await sock.sendMessage(chatId, {
            text: '⎯͢✧👑 𝐌ᴇɴᴛɪᴏɴ 𝐀 𝐔sᴇʀ 𝐎ʀ 𝐑ᴇᴘʟʏ 𝐓ᴏ 𝐏ʀᴏᴍᴏᴛᴇ 🐱'
        });
        return;
    }

    try {
        await sock.groupParticipantsUpdate(chatId, userToPromote, "promote");

        const usernames = userToPromote.map(jid => `@${jid.split('@')[0]}`);
        const promoterJid = sock.user.id;
        const adminTag = `@${promoterJid.split('@')[0]}`;

        const groupMeta = await sock.groupMetadata(chatId);
        const groupName = groupMeta.subject || '𝐔ɴᴋɴᴏᴡɴ 𝐆ʀᴏᴜᴘ';

        const promotionMessage =
`⎯͢✧🎉 𝐀ᴅᴍɪɴ 𝐄ᴠᴇɴᴛ 🐱
⎯͢✧━━━━━━━━━━━━━━━✧
┃👑 ${adminTag} 𝐏ʀᴏᴍᴏᴛᴇᴅ ${usernames.join(', ')}
┃💬 𝐆ʀᴏᴜᴘ : ${groupName}
⎯͢✧━━━━━━━━━━━━━━━✧
┃💖 𝐂ᴏɴɢʀᴀᴛᴜʟᴀᴛɪᴏɴs
┃💫 𝐘ᴏᴜ 𝐀ʀᴇ 𝐍ᴏᴡ 𝐀ɴ 𝐀ᴅᴍɪɴ
⎯͢✧━━━━━━━━━━━━━━━✧
› 👑 ⎯͢✧🫣 𝐒ʜꫝʜɪɴ 𝐑ᴀɴꫝᥫ᭡ 🐱`;

        await sock.sendMessage(chatId, {
            text: promotionMessage,
            mentions: [...userToPromote, promoterJid].filter(Boolean)
        });

    } catch (error) {
        console.error('Error in promote command:', error);
        await sock.sendMessage(chatId, {
            text: '⎯͢✧❌ 𝐅ᴀɪʟᴇᴅ 𝐓ᴏ 𝐏ʀᴏᴍᴏᴛᴇ 🐱'
        });
    }
}

// ================= AUTO PROMOTION EVENT =================
async function handlePromotionEvent(sock, groupId, participants, author) {
    try {
        if (!Array.isArray(participants) || participants.length === 0) return;

        const groupMeta = await sock.groupMetadata(groupId);
        const groupName = groupMeta.subject || '𝐔ɴᴋɴᴏᴡɴ 𝐆ʀᴏᴜᴘ';

        const promotedUsers = participants.map(jid => {
            const jidStr = typeof jid === 'string' ? jid : jid.id;
            return `@${jidStr.split('@')[0]}`;
        });

        let mentionList = participants.map(jid =>
            typeof jid === 'string' ? jid : jid.id
        );

        let adminTag = '𝐒ʏsᴛᴇᴍ';
        if (author) {
            const adminJid = typeof author === 'string' ? author : author.id;
            adminTag = `@${adminJid.split('@')[0]}`;
            mentionList.push(adminJid);
        }

        const promotionMessage =
`⎯͢✧🎉 𝐀ᴅᴍɪɴ 𝐄ᴠᴇɴᴛ 🐱
⎯͢✧━━━━━━━━━━━━━━━✧
┃👑 ${adminTag} 𝐏ʀᴏᴍᴏᴛᴇᴅ ${promotedUsers.join(', ')}
┃💬 𝐆ʀᴏᴜᴘ : ${groupName}
⎯͢✧━━━━━━━━━━━━━━━✧
┃💖 𝐂ᴏɴɢʀᴀᴛᴜʟᴀᴛɪᴏɴs
┃💫 𝐘ᴏᴜ 𝐀ʀᴇ 𝐍ᴏᴡ 𝐀ɴ 𝐀ᴅᴍɪɴ
⎯͢✧━━━━━━━━━━━━━━━✧
› 👑 ⎯͢✧🫣 𝐒ʜꫝʜɪɴ 𝐑ᴀɴꫝᥫ᭡ 🐱`;

        await sock.sendMessage(groupId, {
            text: promotionMessage,
            mentions: mentionList
        });

    } catch (error) {
        console.error('Error handling promotion event:', error);
    }
}

module.exports = { promoteCommand, handlePromotionEvent };
}  
