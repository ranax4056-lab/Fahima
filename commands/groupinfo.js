/**
 * The most complete version of the Group Info command.
 * Fetches: Metadata, Creation Date, Main Admin/Owner, Detailed Stats, 
 * Permissions, and Disappearing Message status.
 */
async function groupInfoCommand(sock, chatId, msg) {
    try {
        // 1. Fetch deep metadata
        const groupMetadata = await sock.groupMetadata(chatId);
        const participants = groupMetadata.participants || [];
        
        // 2. Format Creation Date (Full Detail)
        const creationDate = groupMetadata.creation 
            ? new Date(groupMetadata.creation * 1000).toLocaleString('en-GB', { 
                dateStyle: 'full', 
                timeStyle: 'short' 
              }) 
            : 'Unknown';

        // 3. Admin & Role Categorization
        const superAdmins = participants.filter(p => p.admin === 'superadmin');
        const regularAdmins = participants.filter(p => p.admin === 'admin');
        const allAdmins = [...superAdmins, ...regularAdmins];
        
        // 4. Identify the "Main" Admin (Creator)
        const owner = groupMetadata.owner || 
                      superAdmins[0]?.id || 
                      chatId.split('-')[0] + '@s.whatsapp.net';

        // 5. Fetch Profile Picture
        let pp;
        try {
            pp = await sock.profilePictureUrl(chatId, 'image');
        } catch {
            pp = 'https://i.imgur.com/2wzGhpF.jpeg'; 
        }

        // 6. Group Permissions & Settings Logic
        const canSendMessages = groupMetadata.announce ? '🔒 Admins Only' : '🔓 Everyone';
        const canEditInfo = groupMetadata.restrict ? '🔒 Admins Only' : '🔓 Everyone';
        const isCommunity = groupMetadata.isCommunity ? '✅ Yes' : '❌ No';
        const ephemeral = groupMetadata.ephemeralDuration 
            ? `⏳ ${groupMetadata.ephemeralDuration / 86400} Days` 
            : '❌ Off';

        // 7. Build the Ultimate Text Caption
        const text = `
┌──「 *ULTIMATE GROUP REPORT* 」
▢ *🔖 SUBJECT:* ${groupMetadata.subject}
▢ *♻️ ID:* ${groupMetadata.id}
▢ *📅 CREATED:* ${creationDate}
▢ *👑 MAIN ADMIN:* @${owner.split('@')[0]}

▢ *📊 MEMBER STATS:*
   • Total: ${participants.length}
   • Members: ${participants.length - allAdmins.length}
   • Admins: ${allAdmins.length}

▢ *⚙️ GROUP SETTINGS:*
   • Send Messages: ${canSendMessages}
   • Edit Group Info: ${canEditInfo}
   • Disappearing Msgs: ${ephemeral}
   • Community Linked: ${isCommunity}

▢ *🕵🏻‍♂️ ADMIN ROSTER:*
${allAdmins.map((v, i) => `   ${i + 1}. @${v.id.split('@')[0]} ${v.admin === 'superadmin' ? '*(Main)*' : ''}`).join('\n') || '   • No admins found'}

▢ *📌 DESCRIPTION:*
${groupMetadata.desc?.toString() || 'No description provided.'}
└──────────────────────────`.trim();

        // 8. Send the Final Result
        await sock.sendMessage(chatId, {
            image: { url: pp },
            caption: text,
            mentions: [...allAdmins.map(v => v.id), owner]
        }, { quoted: msg });

    } catch (error) {
        console.error('ERROR in groupInfoCommand:', error);
        
        // Handle specific permission errors
        let errorText = '❌ Failed to get group info.';
        if (error.toString().includes('401')) {
            errorText = '❌ *Access Denied:* I need to be an Admin to see full group details!';
        }
            
        await sock.sendMessage(chatId, { text: errorText }, { quoted: msg });
    }
}

module.exports = groupInfoCommand;
