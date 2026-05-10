export interface User {
  id: string;           // UUID
  email: string;
  name: string;         // display name (khác Mochi dùng displayName)
  isVerified: boolean;  // email verification status
  timezone: string;     // default "Asia/Ho_Chi_Minh"
  createdAt: string;
  updatedAt: string;
}