const { bots } = require('../lib/antilink');
const { setAntilink, getAntilink, removeAntilink } = require('../lib/index');
const isAdmin = require('../lib/isAdmin');

async function handleAntilinkCommand(sock, chatId, userMessage, senderId, isSenderAdmin, message) {
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
⎯͢✧🛠️ 𝐀ɴᴛɪʟɪɴᴋ 𝐒ᴇᴛᴜᴘ 🐱

▢ ${prefix}antilink 𝐎ɴ
▢ ${prefix}antilink 𝐒ᴇᴛ 𝐃ᴇʟᴇᴛᴇ | 𝐊ɪᴄᴋ | 𝐖ᴀʀɴ
▢ ${prefix}antilink 𝐎ғғ
`;
            await sock.sendMessage(chatId, { text: usage }, { quoted: message });
            return;
        }

        switch (action) {

            case 'on':
                const existingConfig = await getAntilink(chatId, 'on');
                if (existingConfig?.enabled) {
                    await sock.sendMessage(chatId, { 
                        text: '⎯͢✧⚠️ 𝐀ɴᴛɪʟɪɴᴋ 𝐀ʟʀᴇᴀᴅʏ 𝐎ɴ 🐱' 
                    }, { quoted: message });
                    return;
                }

                const result = await setAntilink(chatId, 'on', 'delete');

                await sock.sendMessage(chatId, { 
                    text: result 
                        ? '⎯͢✧✅ 𝐀ɴᴛɪʟɪɴᴋ 𝐓ᴜʀɴᴇᴅ 𝐎ɴ 🐱'
                        : '⎯͢✧❌ 𝐅ᴀɪʟᴇᴅ 𝐓ᴏ 𝐄ɴᴀʙʟᴇ 🐱'
                }, { quoted: message });

                break;

            case 'off':
                await removeAntilink(chatId, 'on');
                await sock.sendMessage(chatId, { 
                    text: '⎯͢✧❎ 𝐀ɴᴛɪʟɪɴᴋ 𝐓ᴜʀɴᴇᴅ 𝐎ғғ 🐱' 
                }, { quoted: message });
                break;

            case 'set':
                if (args.length < 2) {
                    await sock.sendMessage(chatId, { 
                        text: `
⎯͢✧⚙️ 𝐔sᴀɢᴇ

▢ ${prefix}antilink set 𝐃ᴇʟᴇᴛᴇ
▢ ${prefix}antilink set 𝐊ɪᴄᴋ
▢ ${prefix}antilink set 𝐖ᴀʀɴ
`
                    }, { quoted: message });
                    return;
                }

                const setAction = args[1];

                if (!['delete', 'kick', 'warn'].includes(setAction)) {
                    await sock.sendMessage(chatId, { 
                        text: `
⎯͢✧❌ 𝐈ɴᴠᴀʟɪᴅ 𝐀ᴄᴛɪᴏɴ 🐱

▢ 𝐔sᴇ : 𝐃ᴇʟᴇᴛᴇ | 𝐊ɪᴄᴋ | 𝐖ᴀʀɴ
`
                    }, { quoted: message });
                    return;
                }

                const setResult = await setAntilink(chatId, 'on', setAction);

                await sock.sendMessage(chatId, { 
                    text: setResult 
                        ? `⎯͢✧✅ 𝐀ɴᴛɪʟɪɴᴋ 𝐀ᴄᴛɪᴏɴ 𝐒ᴇᴛ 𝐓ᴏ ${setAction.toUpperCase()} 🐱`
                        : '⎯͢✧❌ 𝐅ᴀɪʟᴇᴅ 🐱'
                }, { quoted: message });

                break;

            case 'get':
                const status = await getAntilink(chatId, 'on');
                const actionConfig = await getAntilink(chatId, 'on');

                await sock.sendMessage(chatId, { 
                    text: `
⎯͢✧📊 𝐀ɴᴛɪʟɪɴᴋ 𝐂ᴏɴғɪɢ 🐱

▢ 𝐒ᴛᴀᴛᴜs : ${status ? '𝐎𝐍' : '𝐎𝐅𝐅'}
▢ 𝐀ᴄᴛɪᴏɴ : ${actionConfig ? actionConfig.action.toUpperCase() : '𝐍ᴏᴛ 𝐒ᴇᴛ'}
`
                }, { quoted: message });

                break;

            default:
                await sock.sendMessage(chatId, { 
                    text: `⎯͢✧ℹ️ 𝐔sᴇ ${prefix}antilink 🐱`
                });
        }

    } catch (error) {
        console.error('Error in antilink command:', error);
        await sock.sendMessage(chatId, { 
            text: '⎯͢✧❌ 𝐄ʀʀᴏʀ 🐱'
        });
    }
}

async function handleLinkDetection(sock, chatId, message, userMessage, senderId) {
    const antilinkSetting = getAntilinkSetting(chatId);
    if (antilinkSetting === 'off') return;

    let shouldDelete = false;

    const linkPatterns = {
        whatsappGroup: /chat\.whatsapp\.com\/[A-Za-z0-9]{20,}/i,
        whatsappChannel: /wa\.me\/channel\/[A-Za-z0-9]{20,}/i,
        telegram: /t\.me\/[A-Za-z0-9_]+/i,
        allLinks: /https?:\/\/\S+|www\.\S+|(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/\S*)?/i,
    };

    if (antilinkSetting === 'whatsappGroup') {
        if (linkPatterns.whatsappGroup.test(userMessage)) shouldDelete = true;
    } 
    else if (antilinkSetting === 'whatsappChannel') {
        if (linkPatterns.whatsappChannel.test(userMessage)) shouldDelete = true;
    } 
    else if (antilinkSetting === 'telegram') {
        if (linkPatterns.telegram.test(userMessage)) shouldDelete = true;
    } 
    else if (antilinkSetting === 'allLinks') {
        if (linkPatterns.allLinks.test(userMessage)) shouldDelete = true;
    }

    if (shouldDelete) {
        const quotedMessageId = message.key.id;
        const quotedParticipant = message.key.participant || senderId;

        try {
            await sock.sendMessage(chatId, {
                delete: {
                    remoteJid: chatId,
                    fromMe: false,
                    id: quotedMessageId,
                    participant: quotedParticipant
                },
            });
        } catch (error) {
            console.error('Delete error:', error);
        }

        await sock.sendMessage(chatId, {
            text: `⎯͢✧⚠️ 𝐖ᴀʀɴɪɴɢ @${senderId.split('@')[0]} 🐱\n▢ 𝐋ɪɴᴋ 𝐍ᴏᴛ 𝐀ʟʟᴏᴡᴇᴅ`,
            mentions: [senderId]
        });
    }
}

module.exports = {
    handleAntilinkCommand,
    handleLinkDetection,
};
        
