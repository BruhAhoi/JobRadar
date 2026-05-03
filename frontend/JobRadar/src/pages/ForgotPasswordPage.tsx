import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Mail, RotateCcw } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// ZOD SCHEMA
// ─────────────────────────────────────────────────────────────────────────────
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// RADAR SVG LOGO
// ─────────────────────────────────────────────────────────────────────────────
function RadarIcon({ size = 22, color = "#94a3b8" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="9" stroke={color} strokeWidth="1.4" />
      <circle cx="11" cy="11" r="2.5" fill={color} />
      <line x1="11" y1="2"    x2="11" y2="4.5"  stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="11" y1="17.5" x2="11" y2="20"   stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="2"  y1="11"   x2="4.5" y2="11"  stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="17.5" y1="11" x2="20"  y2="11"  stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  // Submit — chỉ giao diện, chưa có logic
  const onSubmit = (_values: ForgotPasswordValues) => {
    // TODO: gọi API POST /api/auth/forgot-password
    setEmailSent(true); // hiện success banner để demo UI
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden font-sans text-slate-200">

      {/* ── FIXED BACKGROUND: grid pattern ── */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundColor: "#0b1628",
          backgroundImage: `
            linear-gradient(rgba(99,140,220,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,140,220,0.07) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      {/* Top-left blue glow */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 12% 8%, rgba(30,80,160,0.35) 0%, transparent 65%)",
        }}
      />
      {/* Bottom vignette */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 105%, rgba(5,15,35,0.7) 0%, transparent 70%)",
        }}
      />

      {/* ── CONTENT ── */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* NAVBAR */}
        <header
          className="flex items-center justify-between h-14 px-6 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <a href="/" className="flex items-center gap-2.5 no-underline">
            <RadarIcon />
            <span className="font-semibold text-[15px] tracking-tight text-slate-100">
              JobRadar
            </span>
          </a>
          <a
            href="/login"
            className="text-[13px] text-slate-400 hover:text-slate-200 transition-colors"
          >
            Sign In
          </a>
        </header>

        {/* MAIN */}
        <main className="flex-grow flex flex-col items-center justify-center px-4 py-10">
          <div className="w-full max-w-[430px] flex flex-col gap-4">

            {/* ── SUCCESS BANNER ── */}
            <div
              className={[
                "flex items-center gap-3 px-4 py-3.5 rounded-xl text-[13px] text-blue-200",
                "transition-all duration-500",
                emailSent
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2 pointer-events-none",
              ].join(" ")}
              style={{
                background: "rgba(30,70,160,0.35)",
                border: "1px solid rgba(80,130,220,0.35)",
              }}
            >
              <CheckCircle className="w-5 h-5 text-blue-400 shrink-0" />
              <span>Email sent! Check your inbox for reset instructions.</span>
            </div>

            {/* ── CARD ── */}
            <Card
              className="w-full border-white/10 bg-slate-950/50 backdrop-blur-2xl"
              style={{ borderRadius: "14px" }}
            >
              <CardContent className="px-8 pt-8 pb-8 flex flex-col items-center">

                {/* Icon box */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{
                    background: "linear-gradient(135deg, #1e3a6e 0%, #1a2f5a 100%)",
                    border: "1px solid rgba(99,130,220,0.35)",
                    boxShadow: "0 0 28px rgba(59,130,246,0.18)",
                  }}
                >
                  <RotateCcw className="w-6 h-6 text-blue-400" strokeWidth={1.8} />
                </div>

                {/* Title */}
                <h1 className="text-[22px] font-bold tracking-tight text-white mb-2">
                  Reset Password
                </h1>

                {/* Subtitle */}
                <p className="text-[14px] text-slate-400 text-center leading-relaxed mb-7 max-w-[280px]">
                  Enter your engineering credentials and we'll send a secure link to your radar.
                </p>

                {/* ── FORM (không dùng Form shadcn) ── */}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="w-full grid gap-4"
                  noValidate
                >
                  {/* Email field */}
                  <div className="grid gap-2">
                    <label
                      htmlFor="email"
                      className="text-[11px] font-semibold uppercase tracking-widest text-slate-400"
                    >
                      Professional Email
                    </label>

                    {/* Input with left mail icon */}
                    <div className="relative">
                      <Mail
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
                        strokeWidth={1.8}
                      />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@company.com"
                        {...register("email")}
                        className="h-11 pl-10 bg-white/5 border-white/10 text-sm text-slate-200 placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-blue-500/60 focus-visible:ring-offset-0"
                        style={
                          errors.email
                            ? { borderColor: "rgba(239,68,68,0.6)" }
                            : undefined
                        }
                      />
                    </div>

                    {/* Error message */}
                    {errors.email && (
                      <p className="text-[12px] text-red-400 flex items-center gap-1.5">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="shrink-0"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Submit button */}
                  <Button
                    type="submit"
                    className="w-full h-11 text-[14px] font-semibold text-white transition-all active:scale-[0.99]"
                    style={{ background: "#4f7ef8", borderRadius: "8px", border: "none" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.background = "#3b6aef")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.background = "#4f7ef8")
                    }
                  >
                    Reset Password
                  </Button>
                </form>

                {/* Divider */}
                <div
                  className="w-full mt-6 mb-5"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
                />

                {/* Back to Login */}
                <a
                  href="/login"
                  className="flex items-center gap-2 text-[13px] text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" strokeWidth={1.8} />
                  Back to Login
                </a>

              </CardContent>
            </Card>

            {/* Still having trouble */}
            <p className="text-center text-[13px] text-slate-500 mt-2">
              Still having trouble?{" "}
              <a
                href="mailto:support@jobradar.io"
                className="font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Contact engineering support
              </a>
            </p>

          </div>
        </main>

        {/* FOOTER */}
        <footer className="relative z-10 flex items-center justify-between px-6 py-5 shrink-0">
          <div className="flex items-center gap-5">
            <a href="#" className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors">
              Contact Support
            </a>
          </div>
          <span className="text-[11px] text-slate-600">
            © 2024 JobRadar. All rights reserved.
          </span>
        </footer>

      </div>
    </div>
  );
}