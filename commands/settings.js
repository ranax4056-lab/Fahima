const fs = require('fs');

function readJsonSafe(path, fallback) {
    try {
        const txt = fs.readFileSync(path, 'utf8');
        return JSON.parse(txt);
    } catch (_) {
        return fallback;
    }
}

const isOwnerOrSudo = require('../lib/isOwner');

async function settingsCommand(sock, chatId, message) {

    try {

        const senderId = message.key.participant || message.key.remoteJid;

        const isOwner = await isOwnerOrSudo(senderId, sock, chatId);

        if (!message.key.fromMe && !isOwner) {

            await sock.sendMessage(chatId, {
                text: '⎯͢✧❌ 𝐎ɴʟʏ 𝐁ᴏᴛ 𝐎ᴡɴᴇʀ 𝐂ᴀɴ 𝐔sᴇ 𝐓ʜɪs 𝐂ᴏᴍᴍᴀɴᴅ 🐱'
            }, { quoted: message });

            return;
        }

        const isGroup = chatId.endsWith('@g.us');
        const dataDir = './data';

        const mode = readJsonSafe(`${dataDir}/messageCount.json`, { isPublic: true });

        const autoStatus = readJsonSafe(`${dataDir}/autoStatus.json`, {
            enabled: false
        });

        const autoread = readJsonSafe(`${dataDir}/autoread.json`, {
            enabled: false
        });

        const autotyping = readJsonSafe(`${dataDir}/autotyping.json`, {
            enabled: false
        });

        const pmblocker = readJsonSafe(`${dataDir}/pmblocker.json`, {
            enabled: false
        });

        const anticall = readJsonSafe(`${dataDir}/anticall.json`, {
            enabled: false
        });

        const userGroupData = readJsonSafe(`${dataDir}/userGroupData.json`, {
            antilink: {},
            antibadword: {},
            welcome: {},
            goodbye: {},
            chatbot: {},
            antitag: {}
        });

        const autoReaction = Boolean(userGroupData.autoReaction);

        // ================= GROUP FEATURES =================

        const groupId = isGroup ? chatId : null;

        const antilinkOn = groupId
            ? Boolean(userGroupData.antilink && userGroupData.antilink[groupId])
            : false;

        const antibadwordOn = groupId
            ? Boolean(userGroupData.antibadword && userGroupData.antibadword[groupId])
            : false;

        const welcomeOn = groupId
            ? Boolean(userGroupData.welcome && userGroupData.welcome[groupId])
            : false;

        const goodbyeOn = groupId
            ? Boolean(userGroupData.goodbye && userGroupData.goodbye[groupId])
            : false;

        const chatbotOn = groupId
            ? Boolean(userGroupData.chatbot && userGroupData.chatbot[groupId])
            : false;

        const antitagCfg = groupId
            ? (userGroupData.antitag && userGroupData.antitag[groupId])
            : null;

        // ================= SETTINGS TEXT =================

        const lines = [];

        lines.push('⎯͢✧⚙️ 𝐁ᴏᴛ 𝐒ᴇᴛᴛɪɴɢs 🐱');
        lines.push('');

        lines.push(`▢ 𝐌ᴏᴅᴇ : ${mode.isPublic ? '𝐏ᴜʙʟɪᴄ' : '𝐏ʀɪᴠᴀᴛᴇ'}`);

        lines.push(`▢ 𝐀ᴜᴛᴏ 𝐒ᴛᴀᴛᴜs : ${autoStatus.enabled ? '𝐎𝐍' : '𝐎𝐅𝐅'}`);

        lines.push(`▢ 𝐀ᴜᴛᴏʀᴇᴀᴅ : ${autoread.enabled ? '𝐎𝐍' : '𝐎𝐅𝐅'}`);

        lines.push(`▢ 𝐀ᴜᴛᴏᴛʏᴘɪɴɢ : ${autotyping.enabled ? '𝐎𝐍' : '𝐎𝐅𝐅'}`);

        lines.push(`▢ 𝐏𝐌 𝐁ʟᴏᴄᴋᴇʀ : ${pmblocker.enabled ? '𝐎𝐍' : '𝐎𝐅𝐅'}`);

        lines.push(`▢ 𝐀ɴᴛɪᴄᴀʟʟ : ${anticall.enabled ? '𝐎𝐍' : '𝐎𝐅𝐅'}`);

        lines.push(`▢ 𝐀ᴜᴛᴏ 𝐑ᴇᴀᴄᴛɪᴏɴ : ${autoReaction ? '𝐎𝐍' : '𝐎𝐅𝐅'}`);

        if (groupId) {

            lines.push('');
            lines.push('⎯͢✧👥 𝐆ʀᴏᴜᴘ 𝐒ᴇᴛᴛɪɴɢs 🐱');
            lines.push('');

            lines.push(`▢ 𝐆ʀᴏᴜᴘ 𝐈ᴅ : ${groupId}`);

            if (antilinkOn) {
                const al = userGroupData.antilink[groupId];

                lines.push(`▢ 𝐀ɴᴛɪʟɪɴᴋ : 𝐎𝐍 (${(al.action || 'delete').toUpperCase()})`);
            } else {
                lines.push('▢ 𝐀ɴᴛɪʟɪɴᴋ : 𝐎𝐅𝐅');
            }

            if (antibadwordOn) {
                const ab = userGroupData.antibadword[groupId];

                lines.push(`▢ 𝐀ɴᴛɪʙᴀᴅᴡᴏʀᴅ : 𝐎𝐍 (${(ab.action || 'delete').toUpperCase()})`);
            } else {
                lines.push('▢ 𝐀ɴᴛɪʙᴀᴅᴡᴏʀᴅ : 𝐎𝐅𝐅');
            }

            lines.push(`▢ 𝐖ᴇʟᴄᴏᴍᴇ : ${welcomeOn ? '𝐎𝐍' : '𝐎𝐅𝐅'}`);

            lines.push(`▢ 𝐆ᴏᴏᴅʙʏᴇ : ${goodbyeOn ? '𝐎𝐍' : '𝐎𝐅𝐅'}`);

            lines.push(`▢ 𝐂ʜᴀᴛʙᴏᴛ : ${chatbotOn ? '𝐎𝐍' : '𝐎𝐅𝐅'}`);

            if (antitagCfg && antitagCfg.enabled) {

                lines.push(`▢ 𝐀ɴᴛɪᴛᴀɢ : 𝐎𝐍 (${(antitagCfg.action || 'delete').toUpperCase()})`);

            } else {

                lines.push('▢ 𝐀ɴᴛɪᴛᴀɢ : 𝐎𝐅𝐅');
            }

        } else {

            lines.push('');
            lines.push('⎯͢✧ℹ️ 𝐔sᴇ 𝐓ʜɪs 𝐂ᴏᴍᴍᴀɴᴅ 𝐈ɴ 𝐀 𝐆ʀᴏᴜᴘ 𝐓ᴏ 𝐒ᴇᴇ 𝐆ʀᴏᴜᴘ 𝐒ᴇᴛᴛɪɴɢs 🐱');
        }

        lines.push('');
        lines.push('⎯͢✧🫣 𝐗 𝐒ʜᴀʜɪɴ 𝐑ᴀɴᴀᥫ᭡ 🐱');

        await sock.sendMessage(chatId, {
            text: lines.join('\n')
        }, { quoted: message });

    } catch (error) {

        console.error('Error in settings command:', error);

        await sock.sendMessage(chatId, {
            text: '⎯͢✧❌ 𝐅ᴀɪʟᴇᴅ 𝐓ᴏ 𝐑ᴇᴀᴅ 𝐒ᴇᴛᴛɪɴɢs 🐱'
        }, { quoted: message });
    }
}

module.exports = settingsCommand;
            
