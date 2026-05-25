export function extractUrl(mailBody: string): string {
    const match = mailBody.match(/href="(https:\/\/demo\.testarchitect\.com\/my-account\/lost-password\/[^"]+)"/);
    if (!match) throw new Error('No password URL found in email body');
    return match[1];
}