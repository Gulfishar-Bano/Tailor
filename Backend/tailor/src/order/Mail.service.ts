import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    // TODO: move these to a ConfigService if you're already using @nestjs/config
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,        // e.g. smtp.gmail.com
      port: Number(process.env.MAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,      // for Gmail, this is an App Password, not your login password
      },
    });
  }

  async sendOrderConfirmationToCustomer(to: string, order: any) {
    try {
      await this.transporter.sendMail({
        from: `"Tailor Connect" <${process.env.MAIL_FROM}>`,
        to,
        subject: 'Your order has been placed — Tailor Connect',
        html: `
          <p>Hi,</p>
          <p>Your order for a <strong>${order.garmentType}</strong> (${order.stitchingType}) has been placed successfully.</p>
          <p>Expected delivery: <strong>${new Date(order.expectedDelivery).toDateString()}</strong></p>
          <p>Your tailor will review the order and confirm details with you shortly.</p>
          <p>— Tailor Connect</p>
        `,
      });
    } catch (err) {
      // don't let a failed email break order creation
      this.logger.error('Failed to send customer confirmation email', err);
    }
  }

  async sendNewOrderAlertToTailor(to: string, order: any) {
    try {
      await this.transporter.sendMail({
        from: `"Tailor Connect" <${process.env.MAIL_FROM}>`,
        to,
        subject: 'New order received — Tailor Connect',
        html: `
          <p>You've received a new order request.</p>
          <p>Garment: <strong>${order.garmentType}</strong> (${order.stitchingType})</p>
          <p>Style: ${order.style}</p>
          <p>Expected delivery: <strong>${new Date(order.expectedDelivery).toDateString()}</strong></p>
          <p>Log in to Tailor Connect to view full details and respond.</p>
        `,
      });
    } catch (err) {
      this.logger.error('Failed to send tailor alert email', err);
    }
  }

  async sendQuoteReadyToCustomer(to: string, order: any) {
    try {
      await this.transporter.sendMail({
        from: `"Tailor Connect" <${process.env.MAIL_FROM}>`,
        to,
        subject: 'Your quote is ready — please confirm',
        html: `
          <p>Hi,</p>
          <p>We've got a price for your <strong>${order.garmentType}</strong> order: <strong>₹${order.finalPrice}</strong>.</p>
          <p>Please log in to Tailor Connect to confirm or cancel this order.</p>
          <p>— Tailor Connect</p>
        `,
      });
    } catch (err) {
      this.logger.error('Failed to send quote-ready email', err);
    }
  }

  async sendOrderConfirmedToTailor(to: string, order: any) {
    try {
      await this.transporter.sendMail({
        from: `"Tailor Connect" <${process.env.MAIL_FROM}>`,
        to,
        subject: 'Order confirmed — you can start work',
        html: `
          <p>Good news — the customer has confirmed their order.</p>
          <p>Garment: <strong>${order.garmentType}</strong> (${order.stitchingType})</p>
          <p>Style: ${order.style}</p>
          <p>Expected delivery: <strong>${new Date(order.expectedDelivery).toDateString()}</strong></p>
          <p>Log in to Tailor Connect to view full details and update the order status as you progress.</p>
        `,
      });
    } catch (err) {
      this.logger.error('Failed to send order-confirmed email to tailor', err);
    }
  }
}