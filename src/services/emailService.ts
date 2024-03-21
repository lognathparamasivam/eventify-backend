import { injectable } from 'tsyringe';
import nodemailer from 'nodemailer';
import properties from '../properties';

@injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: properties.mailProviderId,
        pass: properties.mailProviderPassword,
      },
    });
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      from: properties.mailProviderId,
      to,
      subject,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
