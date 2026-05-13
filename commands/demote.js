 const settings = require('../settings');

// ================= MANUAL DEMOTE COMMAND =================
async function demoteCommand(sock, chatId, mentionedJids, message) {
    let userToDemote = [];

    if (mentionedJids && mentionedJids.length > 0) {
        userToDemote = mentionedJids;
    } else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
        userToDemote = [message.message.extendedTextMessage.contextInfo.participant];
    }

    if (userToDemote.length === 0) {
        await sock.sendMessage(chatId, {
            text: '⎯͢✧👑 𝐌ᴇɴᴛɪᴏɴ 𝐎ʀ 𝐑ᴇᴘʟʏ 𝐀 𝐔sᴇʀ 🐱'
        });
        return;
    }

    try {
        await sock.groupParticipantsUpdate(chatId, userToDemote, "demote");

        const demotedUsers = userToDemote.map(jid => `@${jid.split('@')[0]}`);
        const promoterJid = sock.user.id;
        const adminTag = `@${promoterJid.split('@')[0]}`;

        const groupMeta = await sock.groupMetadata(chatId);
        const groupName = groupMeta.subject || '𝐔ɴᴋɴᴏᴡɴ 𝐆ʀᴏᴜᴘ';

        const demoteMessage =
`⎯͢✧⚡ 𝐀ᴅᴍɪɴ 𝐄ᴠᴇɴᴛ 🐱
⎯͢✧━━━━━━━━━━━━━━━✧
┃👑 ${adminTag} 𝐃ᴇᴍᴏᴛᴇᴅ ${demotedUsers.join(', ')}
┃💬 𝐆ʀᴏᴜᴘ : ${groupName}
⎯͢✧━━━━━━━━━━━━━━━✧
┃😢 𝐘ᴏᴜ 𝐀ʀᴇ 𝐍ᴏ 𝐋ᴏɴɢᴇʀ 𝐀𝐧 𝐀ᴅᴍɪɴ
┃💔 𝐁ᴇᴛᴛᴇʀ 𝐋ᴜᴄᴋ 𝐍ᴇxᴛ 𝐓ɪᴍᴇ
⎯͢✧━━━━━━━━━━━━━━━✧
› 👑 ⎯͢✧🫣 𝐒ʜꫝʜɪɴ 𝐑ᴀɴꫝᥫ᭡ 🐱`;

        await sock.sendMessage(chatId, {
            text: demoteMessage,
            mentions: [...userToDemote, promoterJid].filter(Boolean)
        });

    } catch (error) {
        console.error('Error in demote command:', error);
        await sock.sendMessage(chatId, {
            text: '⎯͢✧❌ 𝐅ᴀɪʟᴇᴅ 𝐓ᴏ 𝐃ᴇᴍᴏᴛᴇ 🐱'
        });
    }
}

// ================= AUTO DEMOTION EVENT =================
async function handleDemotionEvent(sock, groupId, participants, author) {
    try {
        if (!Array.isArray(participants) || participants.length === 0) return;

        const groupMeta = await sock.groupMetadata(groupId);
        const groupName = groupMeta.subject || '𝐔ɴᴋɴᴏᴡɴ 𝐆ʀᴏᴜᴘ';

        const demotedUsers = participants.map(jid => {
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

        const demoteMessage =
`⎯͢✧⚡ 𝐀ᴅᴍɪɴ 𝐄ᴠᴇɴᴛ 🐱
⎯͢✧━━━━━━━━━━━━━━━✧
┃👑 ${adminTag} 𝐃ᴇᴍᴏᴛᴇᴅ ${demotedUsers.join(', ')}
┃💬 𝐆ʀᴏᴜᴘ : ${groupName}
⎯͢✧━━━━━━━━━━━━━━━✧
┃😢 𝐘ᴏᴜ 𝐀ʀᴇ 𝐍ᴏ 𝐋ᴏɴɢᴇʀ 𝐀𝐧 𝐀ᴅᴍɪɴ
┃💔 𝐁ᴇᴛᴛᴇʀ 𝐋ᴜᴄᴋ 𝐍ᴇxᴛ 𝐓ɪᴍᴇ
⎯͢✧━━━━━━━━━━━━━━━✧
› 👑 ⎯͢✧🫣 𝐒ʜꫝʜɪɴ 𝐑ᴀɴꫝᥫ᭡ 🐱`;

        await sock.sendMessage(groupId, {
            text: demoteMessage,
            mentions: mentionList
        });

    } catch (error) {
        console.error('Error handling demotion event:', error);
    }
}

module.exports = {
    demoteCommand,
    handleDemotionEvent
};
