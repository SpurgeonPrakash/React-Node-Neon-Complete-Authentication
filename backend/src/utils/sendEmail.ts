import { MAIL_FROM, SENDGRID_API_KEY } from "../config/index.js";

import sgMail from "@sendgrid/mail";

sgMail.setApiKey(SENDGRID_API_KEY);

export const sendEmail = (to: string, subject: string, html: string) => {
  const emailData = {
    from: MAIL_FROM,
    to,
    subject,
    html,
  };

  return sgMail.send(emailData);
};
