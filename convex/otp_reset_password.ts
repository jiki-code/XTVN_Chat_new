// convex/resendOTPPasswordReset.ts
import type { EmailConfig } from "@convex-dev/auth/server";
import { Resend as ResendAPI } from "resend";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";

export const ResendOTPPasswordReset: EmailConfig<any> = {
  id: "resend-otp",
  type: "email",
  name: "Resend OTP Reset Password",
  from: "XTVN Team <onboarding@resend.dev>",
  maxAge: 6 * 60,
  options: {
    apiKey: process.env.AUTH_RESEND_KEY,   
  },           // Convex will also pass this back as provider.apiKey

  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes) {
        crypto.getRandomValues(bytes);
      },
    };

    const alphabet = "0123456789";
    const length = 8;
    return generateRandomString(random, alphabet, length);

  },

  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendAPI(provider.options.apiKey);

    const { error } = await resend.emails.send({
      from: provider.from,
      to: [email],
      subject: "Your authentication code - Expires in 6 minutes",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <div style="background: #F7B13B; padding: 20px; text-align: center; color: white;">
          <h2 style="margin: 0;">AUTHENTICATION CODE</h2>
        </div>
        
        <div style="padding: 10px; "font-size: 16px;color: #666; background: #f8f9fa;">
          <p>Your authentication code is: <p>
          
          <div style="text-align: center; margin: 10px 0;">
            <div style="
              display: inline-block; 
              padding: 10px 18px; 
              background: #c7c7c7; 
              color: white; 
              font-size: 20px; 
              font-weight: bold; 
              letter-spacing: 4px; 
              border-radius: 6px;
            ">${token}</div>
          </div>
          
          <p style="font-size: 14px; color: #666;">
            📍 he code is valid for <strong>6 minutes</strong><br>
            🔒 Do not share code with others
          </p>
        </div>
      </div>
    `,
      text: `
AUTHENTICATION CODE
Your authentication code is: ${token}

📍 The code is valid for 6 minutes
🔒 Do not share code with others
    `,
    });

    if (error) throw new Error(error.message);
  },
};
