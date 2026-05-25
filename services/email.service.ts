import { extractUrl } from '../helpers/email.helper';
import { BASE_EMAIL_URL } from '../constants/email.constant';
import { logger } from '../helpers/logger';

export class EmailService {
    private sidToken!: string;
    public email!: string;

    async getEmailAddress(): Promise<void> {
        const response = await fetch(`${BASE_EMAIL_URL}?f=get_email_address&lang=en`);
        const data = await response.json();
        this.sidToken = data.sid_token;
        this.email = data.email_addr;
        logger.info(`generated email: ${this.email}`);
    }

    async checkEmail(): Promise<string | null> {
        const response = await fetch(
            `${BASE_EMAIL_URL}?f=check_email&seq=0&sid_token=${this.sidToken}`
        );
        const data = await response.json();

        if (data.list && data.list.length > 0) {
            const newEmail = data.list.find((mail: any) => mail.mail_id !== 1);
            if (newEmail) return newEmail.mail_id;
        }
        return null;
    }

    async fetchEmail(mailId: string): Promise<{ body: string }> {
        const response = await fetch(
            `${BASE_EMAIL_URL}?f=fetch_email&email_id=${mailId}&sid_token=${this.sidToken}`
        );
        const data = await response.json();
        return { body: data.mail_body };
    }

    async getResetPasswordUrl(
        retries: number = 20,
        interval: number = 2000
    ): Promise<string> {
        for (let i = 0; i < retries; i++) {
            logger.info(`checking email... attempt ${i + 1}/${retries}`);
            const mailId = await this.checkEmail();

            if (mailId) {
                const content = await this.fetchEmail(mailId);
                return extractUrl(content.body);
            }

            await new Promise(r => setTimeout(r, interval));
        }
        throw new Error('Verification email not received');
    }
}