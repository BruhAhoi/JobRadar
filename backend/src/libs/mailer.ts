import nodemailer from "nodemailer";

const mailUser = process.env.MAIL_USER;
const mailPassword = process.env.MAIL_PASSWORD?.replace(/\s+/g, "");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: mailUser, pass: mailPassword },
});

export const sendVerificationEmail = async (
  toEmail: string,
  verifyUrl: string
): Promise<boolean> => {
  if (!mailUser || !mailPassword) return false;

  try {
    await transporter.sendMail({
      from: `"JobRadar" <${mailUser}>`,
      to: toEmail,
      subject: "Xác thực tài khoản JobRadar",
      html: `
        <div style="max-width:480px;margin:auto;font-family:Arial,sans-serif;">
          <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:28px 32px;border-radius:12px 12px 0 0;">
            <h1 style="margin:0;color:#fff;font-size:20px;">Xác thực tài khoản</h1>
            <p style="margin:6px 0 0;color:#c7d2fe;font-size:13px;">JobRadar — Bảng theo dõi việc làm</p>
          </div>
          <div style="background:#fff;padding:28px 32px;border:1px solid #e5e7eb;border-top:none;">
            <p style="font-size:15px;color:#374151;">Cảm ơn bạn đã đăng ký JobRadar!</p>
            <p style="font-size:15px;color:#374151;">Nhấn vào nút bên dưới để kích hoạt tài khoản:</p>
            <div style="text-align:center;margin:28px 0;">
              <a href="${verifyUrl}"
                style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
                Xác thực tài khoản
              </a>
            </div>
            <p style="font-size:13px;color:#6b7280;">
              Link có hiệu lực trong <strong>24 giờ</strong>.<br/>
              Nếu bạn không đăng ký tài khoản này, hãy bỏ qua email này.
            </p>
          </div>
          <div style="padding:16px 32px;background:#f9fafb;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
            <p style="margin:0;font-size:11px;color:#9ca3af;text-align:center;">Email tự động — vui lòng không reply trực tiếp.</p>
          </div>
        </div>
      `,
    });
    return true;
  } catch {
    return false;
  }
};

export const sendResetPasswordEmail = async (
  toEmail: string,
  resetUrl: string
): Promise<boolean> => {
  if (!mailUser || !mailPassword) return false;

  try {
    await transporter.sendMail({
      from: `"JobRadar" <${mailUser}>`,
      to: toEmail,
      subject: "Đặt lại mật khẩu JobRadar",
      html: `
        <div style="max-width:480px;margin:auto;font-family:Arial,sans-serif;">
          <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:28px 32px;border-radius:12px 12px 0 0;">
            <h1 style="margin:0;color:#fff;font-size:20px;">Đặt lại mật khẩu</h1>
          </div>
          <div style="background:#fff;padding:28px 32px;border:1px solid #e5e7eb;border-top:none;">
            <p style="font-size:15px;color:#374151;">Bạn vừa yêu cầu đặt lại mật khẩu. Nhấn vào nút bên dưới:</p>
            <div style="text-align:center;margin:28px 0;">
              <a href="${resetUrl}"
                style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
                Đặt lại mật khẩu
              </a>
            </div>
            <p style="font-size:13px;color:#6b7280;">
              Link có hiệu lực trong <strong>1 giờ</strong>, dùng một lần.<br/>
              Nếu bạn không yêu cầu, hãy bỏ qua email này.
            </p>
          </div>
        </div>
      `,
    });
    return true;
  } catch {
    return false;
  }
};