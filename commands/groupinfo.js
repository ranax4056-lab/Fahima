/**
 * The most complete and error-resistant version of the Group Info command.
 * Handles Private Chat errors and Media Rate-limiting (Imgur 429).
 */
async function groupInfoCommand(sock, chatId, msg) {
    // 1. Check if the command is being used in a group
    const isGroup = chatId.endsWith('@g.us');
    if (!isGroup) {
        return await sock.sendMessage(chatId, { text: '❌ This command can only be used in groups!' }, { quoted: msg });
    }

    try {
        // 2. Fetch group metadata
        const groupMetadata = await sock.groupMetadata(chatId);
        const participants = groupMetadata.participants || [];
        
        // 3. Date Formatting
        const creationDate = groupMetadata.creation 
            ? new Date(groupMetadata.creation * 1000).toLocaleString('en-GB', { 
                dateStyle: 'full', 
                timeStyle: 'short' 
              }) 
            : 'Unknown';

        // 4. Admin & Role Categorization
        const superAdmins = participants.filter(p => p.admin === 'superadmin');
        const regularAdmins = participants.filter(p => p.admin === 'admin');
        const allAdmins = [...superAdmins, ...regularAdmins];
        
        const owner = groupMetadata.owner || 
                      superAdmins[0]?.id || 
                      chatId.split('-')[0] + '@s.whatsapp.net';

        // 5. Profile Picture (Handling the 429 Error)
        let pp;
        try {
            pp = await sock.profilePictureUrl(chatId, 'image');
        } catch {
            // Use a stable, high-availability placeholder or a local path if you have one
            pp = 'https://telegra.ph/file/241d7161fb85743b1ee6c.jpg'; 
        }

        // 6. Settings & Permissions
        const canSendMessages = groupMetadata.announce ? '🔒 Admins Only' : '🔓 Everyone';
        const canEditInfo = groupMetadata.restrict ? '🔒 Admins Only' : '🔓 Everyone';
        const ephemeral = groupMetadata.ephemeralDuration 
            ? `⏳ ${groupMetadata.ephemeralDuration / 86400} Days` 
            : '❌ Off';

        // 7. Build the Text
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

        // 8. Send Message
        await sock.sendMessage(chatId, {
            image: { url: pp },
            caption: text,
            mentions: [...allAdmins.map(v => v.id), owner]
        }, { quoted: msg });

    } catch (error) {
        console.error('ERROR in groupInfoCommand:', error);
        
        // If image sending fails again, fallback to TEXT ONLY so the command still works
        await sock.sendMessage(chatId, { 
            text: '⚠️ *Note:* Image could not be loaded, but here is the info:\n\n' + text,
            mentions: [...participants.filter(p => p.admin).map(v => v.id)]
        }, { quoted: msg });
    }
}

module.exports = groupInfoCommand;
