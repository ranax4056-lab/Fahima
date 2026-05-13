 const { setAntitag, getAntitag, removeAntitag } = require('../lib/index');
const isAdmin = require('../lib/isAdmin');

async function handleAntitagCommand(sock, chatId, userMessage, senderId, isSenderAdmin, message) {

    try {

        if (!isSenderAdmin) {

            await sock.sendMessage(chatId, {
                text: '⎯͢✧❌ 𝐅ᴏʀ 𝐆ʀᴏᴜᴘ 𝐀ᴅᴍɪɴs 𝐎ɴʟʏ 🐱'
            }, { quoted: message });

            return;
        }

        const prefix = '.';

        const args = userMessage.slice(9).toLowerCase().trim().split(' ');

        const action = args[0];

        if (!action) {

            const usage = `
⎯͢✧🛡️ 𝐀ɴᴛɪᴛᴀɢ 𝐒ᴇᴛᴜᴘ 🐱

▢ ${prefix}antitag 𝐎ɴ
▢ ${prefix}antitag 𝐒ᴇᴛ 𝐃ᴇʟᴇᴛᴇ | 𝐊ɪᴄᴋ
▢ ${prefix}antitag 𝐎ғғ
`;

            await sock.sendMessage(chatId, {
                text: usage
            }, { quoted: message });

            return;
        }

        switch (action) {

            case 'on':

                const existingConfig = await getAntitag(chatId, 'on');

                if (existingConfig?.enabled) {

                    await sock.sendMessage(chatId, {
                        text: '⎯͢✧⚠️ 𝐀ɴᴛɪᴛᴀɢ 𝐀ʟʀᴇᴀᴅʏ 𝐎ɴ 🐱'
                    }, { quoted: message });

                    return;
                }

                const result = await setAntitag(chatId, 'on', 'delete');

                await sock.sendMessage(chatId, {
                    text: result
                        ? '⎯͢✧✅ 𝐀ɴᴛɪᴛᴀɢ 𝐓ᴜʀɴᴇᴅ 𝐎ɴ 🐱'
                        : '⎯͢✧❌ 𝐅ᴀɪʟᴇᴅ 𝐓ᴏ 𝐄ɴᴀʙʟᴇ 🐱'
                }, { quoted: message });

                break;

            case 'off':

                await removeAntitag(chatId, 'on');

                await sock.sendMessage(chatId, {
                    text: '⎯͢✧❎ 𝐀ɴᴛɪᴛᴀɢ 𝐓ᴜʀɴᴇᴅ 𝐎ғғ 🐱'
                }, { quoted: message });

                break;

            case 'set':

                if (args.length < 2) {

                    await sock.sendMessage(chatId, {
                        text: `
⎯͢✧⚙️ 𝐔sᴀɢᴇ 🐱

▢ ${prefix}antitag set 𝐃ᴇʟᴇᴛᴇ
▢ ${prefix}antitag set 𝐊ɪᴄᴋ
`
                    }, { quoted: message });

                    return;
                }

                const setAction = args[1];

                if (!['delete', 'kick'].includes(setAction)) {

                    await sock.sendMessage(chatId, {
                        text: `
⎯͢✧❌ 𝐈ɴᴠᴀʟɪᴅ 𝐀ᴄᴛɪᴏɴ 🐱

▢ 𝐔sᴇ : 𝐃ᴇʟᴇᴛᴇ | 𝐊ɪᴄᴋ
`
                    }, { quoted: message });

                    return;
                }

                const setResult = await setAntitag(chatId, 'on', setAction);

                await sock.sendMessage(chatId, {
                    text: setResult
                        ? `⎯͢✧✅ 𝐀ɴᴛɪᴛᴀɢ 𝐀ᴄᴛɪᴏɴ 𝐒ᴇᴛ 𝐓ᴏ ${setAction.toUpperCase()} 🐱`
                        : '⎯͢✧❌ 𝐅ᴀɪʟᴇᴅ 🐱'
                }, { quoted: message });

                break;

            case 'get':

                const status = await getAntitag(chatId, 'on');

                const actionConfig = await getAntitag(chatId, 'on');

                await sock.sendMessage(chatId, {
                    text: `
⎯͢✧📊 𝐀ɴᴛɪᴛᴀɢ 𝐂ᴏɴғɪɢ 🐱

▢ 𝐒ᴛᴀᴛᴜs : ${status ? '𝐎𝐍' : '𝐎𝐅𝐅'}
▢ 𝐀ᴄᴛɪᴏɴ : ${actionConfig ? actionConfig.action.toUpperCase() : '𝐍ᴏᴛ 𝐒ᴇᴛ'}
`
                }, { quoted: message });

                break;

            default:

                await sock.sendMessage(chatId, {
                    text: `⎯͢✧ℹ️ 𝐔sᴇ ${prefix}antitag 🐱`
                }, { quoted: message });

        }

    } catch (error) {

        console.error('Error in antitag command:', error);

        await sock.sendMessage(chatId, {
            text: '⎯͢✧❌ 𝐄ʀʀᴏʀ 𝐏ʀᴏᴄᴇssɪɴɢ 𝐀ɴᴛɪᴛᴀɢ 🐱'
        }, { quoted: message });

    }
}

async function handleTagDetection(sock, chatId, message, senderId) {

    try {

        const antitagSetting = await getAntitag(chatId, 'on');

        if (!antitagSetting || !antitagSetting.enabled) return;

        const mentionedJids =
            message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

        const messageText = (
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text ||
            message.message?.imageMessage?.caption ||
            message.message?.videoMessage?.caption ||
            ''
        );

        const textMentions =
            messageText.match(/@[\d+\s\-()~.]+/g) || [];

        const numericMentions =
            messageText.match(/@\d{10,}/g) || [];

        const allMentions = [
            ...new Set([
                ...mentionedJids,
                ...textMentions,
                ...numericMentions
            ])
        ];

        const uniqueNumericMentions = new Set();

        numericMentions.forEach(mention => {

            const numMatch = mention.match(/@(\d+)/);

            if (numMatch) {
                uniqueNumericMentions.add(numMatch[1]);
            }

        });

        const mentionedJidCount = mentionedJids.length;

        const numericMentionCount = uniqueNumericMentions.size;

        const totalMentions = Math.max(
            mentionedJidCount,
            numericMentionCount
        );

        if (totalMentions >= 3) {

            const groupMetadata = await sock.groupMetadata(chatId);

            const participants = groupMetadata.participants || [];

            const mentionThreshold =
                Math.ceil(participants.length * 0.5);

            const hasManyNumericMentions =
                numericMentionCount >= 10 ||
                (numericMentionCount >= 5 &&
                 numericMentionCount >= mentionThreshold);

            if (
                totalMentions >= mentionThreshold ||
                hasManyNumericMentions
            ) {

                const action =
                    antitagSetting.action || 'delete';

                if (action === 'delete') {

                    await sock.sendMessage(chatId, {
                        delete: {
                            remoteJid: chatId,
                            fromMe: false,
                            id: message.key.id,
                            participant: senderId
                        }
                    });

                    await sock.sendMessage(chatId, {
                        text: `
⎯͢✧⚠️ 𝐓ᴀɢᴀʟʟ 𝐃ᴇᴛᴇᴄᴛᴇᴅ 🐱

▢ 𝐌ᴀss 𝐓ᴀɢɢɪɴɢ 𝐈s 𝐍ᴏᴛ 𝐀ʟʟᴏᴡᴇᴅ
`
                    }, { quoted: message });

                }

                else if (action === 'kick') {

                    await sock.sendMessage(chatId, {
                        delete: {
                            remoteJid: chatId,
                            fromMe: false,
                            id: message.key.id,
                            participant: senderId
                        }
                    });

                    await sock.groupParticipantsUpdate(
                        chatId,
                        [senderId],
                        "remove"
                    );

                    const usernames = [
                        `@${senderId.split('@')[0]}`
                    ];

                    await sock.sendMessage(chatId, {
                        text: `
⎯͢✧🚫 𝐀ɴᴛɪᴛᴀɢ 𝐃ᴇᴛᴇᴄᴛᴇᴅ 🐱

▢ ${usernames.join(', ')} 𝐇ᴀs 𝐁ᴇᴇɴ 𝐊ɪᴄᴋᴇᴅ
▢ 𝐑ᴇᴀsᴏɴ : 𝐓ᴀɢɢɪɴɢ 𝐀ʟʟ 𝐌ᴇᴍʙᴇʀs
`,
                        mentions: [senderId]
                    }, { quoted: message });

                }
            }
        }

    } catch (error) {

        console.error('Error in tag detection:', error);

    }
}

module.exports = {
    handleAntitagCommand,
    handleTagDetection
};
    

