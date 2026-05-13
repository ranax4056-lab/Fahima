const isAdmin = require('../lib/isAdmin');

async function kickCommand(sock, chatId, senderId, mentionedJids, message) {
    const isOwner = message.key.fromMe;

    if (!isOwner) {
        const { isSenderAdmin, isBotAdmin } = await isAdmin(sock, chatId, senderId);

        if (!isBotAdmin) {
            await sock.sendMessage(chatId, { 
                text: '⎯͢✧❌ 𝐏ʟᴇᴀsᴇ 𝐌ᴀᴋᴇ 𝐓ʜᴇ 𝐁ᴏᴛ 𝐀ɴ 𝐀ᴅᴍɪɴ 𝐅ɪʀsᴛ 🐱' 
            }, { quoted: message });
            return;
        }

        if (!isSenderAdmin) {
            await sock.sendMessage(chatId, { 
                text: '⎯͢✧⚠️ 𝐎ɴʟʏ 𝐆ʀᴏᴜᴘ 𝐀ᴅᴍɪɴs 𝐂ᴀɴ 𝐔sᴇ 𝐓ʜɪs 𝐂ᴏᴍᴍᴀɴᴅ 🐱' 
            }, { quoted: message });
            return;
        }
    }

    let usersToKick = [];

    if (mentionedJids && mentionedJids.length > 0) {
        usersToKick = mentionedJids;
    }
    else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
        usersToKick = [message.message.extendedTextMessage.contextInfo.participant];
    }

    if (usersToKick.length === 0) {
        await sock.sendMessage(chatId, {
            text: '⎯͢✧📛 𝐏ʟᴇᴀsᴇ 𝐌ᴇɴᴛɪᴏɴ 𝐎ʀ 𝐑ᴇᴘʟʏ 𝐓ᴏ 𝐀 𝐔sᴇʀ 𝐓ᴏ 𝐊ɪᴄᴋ 🐱'
        }, { quoted: message });
        return;
    }

    const botId = sock.user?.id || '';
    const botLid = sock.user?.lid || '';

    const botPhoneNumber = botId.includes(':')
        ? botId.split(':')[0]
        : (botId.includes('@') ? botId.split('@')[0] : botId);

    const botIdFormatted = botPhoneNumber + '@s.whatsapp.net';

    const botLidNumeric = botLid.includes(':')
        ? botLid.split(':')[0]
        : (botLid.includes('@') ? botLid.split('@')[0] : botLid);

    const botLidWithoutSuffix = botLid.includes('@')
        ? botLid.split('@')[0]
        : botLid;

    const metadata = await sock.groupMetadata(chatId);
    const participants = metadata.participants || [];

    const isTryingToKickBot = usersToKick.some(userId => {

        const userPhoneNumber = userId.includes(':')
            ? userId.split(':')[0]
            : (userId.includes('@') ? userId.split('@')[0] : userId);

        const userLidNumeric = userId.includes('@lid')
            ? userId.split('@')[0].split(':')[0]
            : '';

        const directMatch = (
            userId === botId ||
            userId === botLid ||
            userId === botIdFormatted ||
            userPhoneNumber === botPhoneNumber ||
            (userLidNumeric && botLidNumeric && userLidNumeric === botLidNumeric)
        );

        if (directMatch) {
            return true;
        }

        const participantMatch = participants.some(p => {

            const pPhoneNumber = p.phoneNumber
                ? p.phoneNumber.split('@')[0]
                : '';

            const pId = p.id
                ? p.id.split('@')[0]
                : '';

            const pLid = p.lid
                ? p.lid.split('@')[0]
                : '';

            const pFullId = p.id || '';
            const pFullLid = p.lid || '';

            const pLidNumeric = pLid.includes(':')
                ? pLid.split(':')[0]
                : pLid;

            const isThisParticipantBot = (
                pFullId === botId ||
                pFullLid === botLid ||
                pLidNumeric === botLidNumeric ||
                pPhoneNumber === botPhoneNumber ||
                pId === botPhoneNumber ||
                p.phoneNumber === botIdFormatted ||
                (botLid && pLid && botLidWithoutSuffix === pLid)
            );

            if (isThisParticipantBot) {
                return (
                    userId === pFullId ||
                    userId === pFullLid ||
                    userPhoneNumber === pPhoneNumber ||
                    userPhoneNumber === pId ||
                    userId === p.phoneNumber ||
                    (pLid && userLidNumeric && userLidNumeric === pLidNumeric) ||
                    (userLidNumeric && pLidNumeric && userLidNumeric === pLidNumeric)
                );
            }

            return false;
        });

        return participantMatch;
    });

    if (isTryingToKickBot) {
        await sock.sendMessage(chatId, {
            text: '⎯͢✧🤖 𝐈 𝐂ᴀɴ’ᴛ 𝐊ɪᴄᴋ 𝐌ʏsᴇʟғ 🐱'
        }, { quoted: message });

        return;
    }

    try {

        await sock.groupParticipantsUpdate(chatId, usersToKick, "remove");

        const usernames = await Promise.all(
            usersToKick.map(async jid => {
                return `@${jid.split('@')[0]}`;
            })
        );

        await sock.sendMessage(chatId, {
            text:
`⎯͢✧🚫 𝐊ɪᴄᴋ 𝐄ᴠᴇɴᴛ 🐱

▢ 𝐔sᴇʀ : ${usernames.join(', ')}
▢ 𝐒ᴛᴀᴛᴜs : 𝐒ᴜᴄᴄᴇssғᴜʟʟʏ 𝐊ɪᴄᴋᴇᴅ
▢ 𝐀ᴄᴛɪᴏɴ : 𝐑ᴇᴍᴏᴠᴇᴅ 𝐅ʀᴏᴍ 𝐆ʀᴏᴜᴘ

⎯͢✧🫣 𝐗 𝐒ʜᴀʜɪɴ 𝐑ᴀɴᴀᥫ᭡ 🐱`,
            mentions: usersToKick

        }, { quoted: message });

    } catch (error) {

        console.error('Error in kick command:', error);

        await sock.sendMessage(chatId, {
            text: '⎯͢✧❌ 𝐅ᴀɪʟᴇᴅ 𝐓ᴏ 𝐊ɪᴄᴋ 𝐔sᴇʀ 🐱'
        }, { quoted: message });
    }
}

module.exports = kickCommand;
