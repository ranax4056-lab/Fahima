/**
 * Fully stabilized Group Info command.
 * Uses a safe fallback: sends text-only if the group has no profile picture.
 */
async function groupInfoCommand(sock, chatId, msg) {
    // 1. Guard check: Only run in groups
    if (!chatId.endsWith('@g.us')) {
        return await sock.sendMessage(chatId, { text: '❌ This command can only be used in groups!' }, { quoted: msg });
    }

    try {
        // 2. Fetch the metadata safely
        const groupMetadata = await sock.groupMetadata(chatId);
        const participants = groupMetadata.participants || [];
        
        // 3. Process Dates and Roles
        const creationDate = groupMetadata.creation 
            ? new Date(groupMetadata.creation * 1000).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' }) 
            : 'Unknown';

        const superAdmins = participants.filter(p => p.admin === 'superadmin');
        const regularAdmins = participants.filter(p => p.admin === 'admin');
        const allAdmins = [...superAdmins, ...regularAdmins];
        
        const owner = groupMetadata.owner || superAdmins[0]?.id || chatId.split('-')[0] + '@s.whatsapp.net';

        // 4. Process Settings
        const canSendMessages = groupMetadata.announce ? '🔒 Admins Only' : '🔓 Everyone';
        const canEditInfo = groupMetadata.restrict ? '🔒 Admins Only' : '🔓 Everyone';
        const ephemeral = groupMetadata.ephemeralDuration ? `⏳ ${groupMetadata.ephemeralDuration / 86400} Days` : '❌ Off';

        // 5. Build the Information Text
        const text = `
┌──「 *GROUP ANALYSIS* 」
▢ *🔖 SUBJECT:* ${groupMetadata.subject}
▢ *♻️ ID:* ${groupMetadata.id}
▢ *📅 CREATED:* ${creationDate}
▢ *👑 MAIN ADMIN:* @${owner.split('@')[0]}

▢ *📊 STATS:*
   • Total: ${participants.length}
   • Members: ${participants.length - allAdmins.length}
   • Admins: ${allAdmins.length}

▢ *⚙️ SETTINGS:*
   • Messages: ${canSendMessages}
   • Edit Info: ${canEditInfo}
   • Disappearing: ${ephemeral}

▢ *🕵🏻‍♂️ ADMINS:*
${allAdmins.map((v, i) => `   ${i + 1}. @${v.id.split('@')[0]} ${v.admin === 'superadmin' ? '*(Main)*' : ''}`).join('\n') || '   • No admins found'}

▢ *📌 DESCRIPTION:*
${groupMetadata.desc?.toString() || 'No description provided.'}
└──────────────────────────`.trim();

        // Prepare the mentions array
        const mentions = [...allAdmins.map(v => v.id), owner];

        // 6. Fetch Profile Picture Safely (NO EXTERNAL URLS)
        let ppUrl = null;
        try {
            ppUrl = await sock.profilePictureUrl(chatId, 'image');
        } catch (err) {
            // If fetching the image fails, ppUrl just stays null. No crash!
            console.log(`No profile picture found for ${chatId}, sending text only.`);
        }

        // 7. Send the Message Based on Image Availability
        if (ppUrl) {
            // Send with image
            await sock.sendMessage(chatId, { image: { url: ppUrl }, caption: text, mentions }, { quoted: msg });
        } else {
            // Fallback: Send plain text (No 404 errors!)
            await sock.sendMessage(chatId, { text: text, mentions }, { quoted: msg });
        }

    } catch (error) {
        // 8. Safe Error Handling
        console.error('CRITICAL ERROR in groupInfoCommand:', error);
        await sock.sendMessage(chatId, { text: '❌ Failed to gather group info. I might not have access to the metadata.' }, { quoted: msg });
    }
}

module.exports = groupInfoCommand;
