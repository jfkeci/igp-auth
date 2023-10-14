import { logger } from '../logger';
import nodemailer, { SendMailOptions, Transporter } from 'nodemailer';

export class EmailService {
  private async createTestAccout(): Promise<nodemailer.TestAccount> {
    return await nodemailer.createTestAccount();
  }

  private createTransporter(creds: nodemailer.TestAccount): Transporter {
    const smtp = {
      user: creds.user,
      pass: creds.pass,
      host: creds.smtp.host,
      port: creds.smtp.port,
      secure: false,
    };

    return nodemailer.createTransport({
      ...smtp,
      auth: { user: smtp.user, pass: smtp.pass },
    });
  }

  async sendEmail(payload: SendMailOptions): Promise<void> {
    const creds = await this.createTestAccout();

    const transporter = this.createTransporter(creds);

    transporter.sendMail(payload, (err, info) => {
      if (err) {
        logger.error(`${err.message}, Error sending email`);
        return;
      }

      logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    });
  }
}
