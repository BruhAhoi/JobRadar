import nodemailer from "nodemailer";

const mailUser = process.env.MAIL_USER;
const mailPassword = process.env.MAIL_PASSWORD?.replace(/\s+/g, "");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: mailUser,
    pass: mailPassword,
  },
});

export const verifyMailerConnection = async () => {
  if (!mailUser || !mailPassword) {
    return;
  }

  try {
    await transporter.verify();
  } catch {
    return;
  }
};

export const sendResetPasswordEmail = async (toEmail: string, resetUrl: string) => {
  if (!mailUser || !mailPassword) {
    return false;
  }

  try {
    await transporter.sendMail({
      from: `"JobRadar" <${mailUser}>`,
      to: toEmail,
      subject: "Dat lai mat khau JobRadar",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
          <h2>Dat lai mat khau</h2>
          <p>Ban vua yeu cau dat lai mat khau. Nhan vao nut ben duoi:</p>
          <a href="${resetUrl}" style="display:inline-block; padding:12px 24px; background:#4F46E5; color:white; border-radius:6px; text-decoration:none;">
            Dat lai mat khau
          </a>
          <p style="margin-top:16px; color:#666;">
            Link co hieu luc trong <strong>1 gio</strong>.<br/>
            Neu ban khong yeu cau, hay bo qua email nay.
          </p>
        </div>
      `,
    });

    return true;
  } catch {
    return false;
  }
};
