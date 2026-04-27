export const buildReminderEmail = (
  userName: string,
  jobs: { companyName: string; position: string; deadlineAt: Date; status: string }[]
): string => {
  const jobRows = jobs
    .map(
      (j) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">${j.companyName}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">${j.position}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#6366f1;font-weight:600;">${j.status}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#ef4444;font-weight:600;">
          ${new Date(j.deadlineAt).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </td>
      </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07);">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 40px;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;letter-spacing:-0.3px;">⏰ Nhắc nhở deadline ứng tuyển</h1>
      <p style="margin:8px 0 0;color:#c7d2fe;font-size:14px;">JobRadar — Bảng theo dõi việc làm cá nhân</p>
    </div>

    <!-- Body -->
    <div style="padding:32px 40px;">
      <p style="margin:0 0 16px;font-size:15px;color:#374151;">Xin chào <strong>${userName}</strong>,</p>
      <p style="margin:0 0 24px;font-size:15px;color:#374151;">
        Bạn có <strong>${jobs.length} ứng tuyển</strong> sắp đến hạn trong <strong>vòng 24 giờ tới</strong>. 
        Đừng để lỡ cơ hội nhé!
      </p>

      <!-- Table -->
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;font-size:14px;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:10px 12px;text-align:left;color:#6b7280;font-weight:600;">Công ty</th>
            <th style="padding:10px 12px;text-align:left;color:#6b7280;font-weight:600;">Vị trí</th>
            <th style="padding:10px 12px;text-align:left;color:#6b7280;font-weight:600;">Trạng thái</th>
            <th style="padding:10px 12px;text-align:left;color:#6b7280;font-weight:600;">Deadline</th>
          </tr>
        </thead>
        <tbody>
          ${jobRows}
        </tbody>
      </table>

      <div style="margin-top:28px;padding:16px;background:#fef3c7;border-left:4px solid #f59e0b;border-radius:4px;">
        <p style="margin:0;font-size:14px;color:#92400e;">
          💡 <strong>Mẹo:</strong> Cập nhật trạng thái ứng tuyển ngay trên JobRadar để theo dõi tiến trình chính xác hơn.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding:20px 40px;background:#f9fafb;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
        Bạn nhận được email này vì đã đăng ký JobRadar.<br/>
        Email tự động — vui lòng không reply trực tiếp.
      </p>
    </div>
  </div>
</body>
</html>`;
};