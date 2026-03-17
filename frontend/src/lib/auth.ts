import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { emailOTP } from "better-auth/plugins"
import { Resend } from "resend"
import { prisma } from "@/lib/db"

const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
  logger: {
    enabled: true,
    level: "debug",
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 分钟内读 cookie 缓存，不打 DB
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["github", "google"],
      allowDifferentEmails: true,
    },
  },
  // 不做全局限流 — get-session 等高频接口会被误杀
  // 敏感接口由各自插件单独限流（emailOTP.rateLimit）
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 300,
      sendVerificationOnSignUp: true,
      overrideDefaultEmailVerification: true,
      rateLimit: {
        window: 60,
        max: 3,
      },
      async sendVerificationOTP({ email, otp, type }) {
        const subjects: Record<string, string> = {
          "sign-in": "登录验证码",
          "email-verification": "邮箱验证码",
          "forget-password": "重置密码验证码",
          "change-email": "更改邮箱验证码",
        }
        const subject = subjects[type] || "验证码"

        // 开发阶段：RESEND_TEST_EMAIL 存在时重定向到账号自有邮箱（Resend 沙盒限制）。
        // 上线时删除 RESEND_TEST_EMAIL，在 Resend 控制台验证域名，修改 from 地址。
        const toAddress = process.env.RESEND_TEST_EMAIL ?? email
        if (process.env.RESEND_TEST_EMAIL) {
          console.log(`[Resend DEV] 沙盒重定向: ${email} → ${toAddress}`)
        }

        const { data, error } = await resend.emails.send({
          from: "Directra <onboarding@resend.dev>",
          to: toAddress,
          subject: `【Directra】${subject}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
              <div style="margin-bottom: 32px;">
                <span style="display: inline-block; width: 32px; height: 32px; background: linear-gradient(135deg, #7c3aed, #4f46e5); border-radius: 8px; text-align: center; line-height: 32px; color: white; font-weight: bold; font-size: 14px;">D</span>
                <span style="font-size: 16px; font-weight: 600; color: #0f172a; margin-left: 8px; vertical-align: middle;">Directra</span>
              </div>
              <h2 style="color: #0f172a; font-size: 20px; margin: 0 0 8px 0;">${subject}</h2>
              <p style="color: #64748b; font-size: 14px; margin: 0 0 28px 0;">请在 5 分钟内输入以下验证码完成验证：</p>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px; text-align: center; margin-bottom: 28px;">
                <span style="font-size: 40px; font-weight: 700; letter-spacing: 10px; color: #7c3aed; font-family: 'SF Mono', SFMono-Regular, Consolas, monospace;">${otp}</span>
              </div>
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">如果你没有请求此验证码，请忽略此邮件。</p>
            </div>
          `,
        })

        if (error) {
          console.error("[Resend] 邮件发送失败:", error)
          throw new Error(`邮件发送失败: ${error.message}`)
        }
        console.log("[Resend] 邮件已发送:", data?.id, "→", email)
      },
    }),
  ],
})
