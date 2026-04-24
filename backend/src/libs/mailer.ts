import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,     // email của bạn
    pass: process.env.MAIL_PASSWORD, // app password (không phải pass gmail)
  },
});

export const sendResetPasswordEmail = async (
  toEmail: string,
  resetUrl: string
) => {
  await transporter.sendMail({
    from: `"JobRadar" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: "Đặt lại mật khẩu JobRadar",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>Đặt lại mật khẩu</h2>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu. Nhấn vào nút bên dưới:</p>
        <a href="${resetUrl}" 
           style="display:inline-block; padding:12px 24px; background:#4F46E5;
                  color:white; border-radius:6px; text-decoration:none;">
          Đặt lại mật khẩu
        </a>
        <p style="margin-top:16px; color:#666;">
          Link có hiệu lực trong <strong>1 giờ</strong>.<br/>
          Nếu bạn không yêu cầu, hãy bỏ qua email này.
        </p>
      </div>
    `,
  });
};