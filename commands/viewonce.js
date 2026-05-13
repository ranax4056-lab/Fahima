const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function viewonceCommand(sock, chatId, message) {

    // Extract quoted imageMessage or videoMessage
    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    const quotedImage = quoted?.imageMessage;
    const quotedVideo = quoted?.videoMessage;

    if (quotedImage && quotedImage.viewOnce) {

        // Download image
        const stream = await downloadContentFromMessage(quotedImage, 'image');

        let buffer = Buffer.from([]);

        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        await sock.sendMessage(chatId, {
            image: buffer,
            fileName: 'media.jpg',
            caption: `
⎯͢✧👀 𝐕ɪᴇᴡ 𝐎ɴᴄᴇ 𝐈ᴍᴀɢᴇ 🐱

▢ 𝐌ᴇᴅɪᴀ 𝐔ɴʟᴏᴄᴋᴇᴅ 𝐒ᴜᴄᴄᴇssғᴜʟʟʏ

⎯͢✧🫣 𝐗 𝐒ʜᴀʜɪɴ 𝐑ᴀɴᴀᥫ᭡ 🐱

${quotedImage.caption || ''}
            `.trim()
        }, { quoted: message });

    } else if (quotedVideo && quotedVideo.viewOnce) {

        // Download video
        const stream = await downloadContentFromMessage(quotedVideo, 'video');

        let buffer = Buffer.from([]);

        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        await sock.sendMessage(chatId, {
            video: buffer,
            fileName: 'media.mp4',
            caption: `
⎯͢✧🎥 𝐕ɪᴇᴡ 𝐎ɴᴄᴇ 𝐕ɪᴅᴇᴏ 🐱

▢ 𝐌ᴇᴅɪᴀ 𝐔ɴʟᴏᴄᴋᴇᴅ 𝐒ᴜᴄᴄᴇssғᴜʟʟʏ

⎯͢✧🫣 𝐗 𝐒ʜᴀʜɪɴ 𝐑ᴀɴᴀᥫ᭡ 🐱

${quotedVideo.caption || ''}
            `.trim()
        }, { quoted: message });

    } else {

        await sock.sendMessage(chatId, {
            text: `
⎯͢✧❌ 𝐑ᴇᴘʟʏ 𝐓ᴏ 𝐀 𝐕ɪᴇᴡ 𝐎ɴᴄᴇ 𝐌ᴇᴅɪᴀ 🐱

▢ 𝐈ᴍᴀɢᴇ 𝐎ʀ 𝐕ɪᴅᴇᴏ 𝐍ᴏᴛ 𝐅ᴏᴜɴᴅ

⎯͢✧🫣 𝐗 𝐒ʜᴀʜɪɴ 𝐑ᴀɴᴀᥫ᭡ 🐱
            `.trim()
        }, { quoted: message });

    }
}

module.exports = viewonceCommand;
