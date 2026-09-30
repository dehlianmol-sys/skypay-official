/**
 * Skypay — single place where the app asks for an SMS OTP.
 *
 * The request goes to the existing Supabase `send-otp` function. That function
 * owns the SMS provider configuration, while the browser sends only the phone,
 * generated OTP, approved sender template and Cloudflare token.
 *
 * senderType picks the DLT approved template:
 *   FYDBZR -> registration OTP
 *   GUERAR -> forgot / reset password OTP
 *   DASSAM -> generic login OTP (provider default)
 */
import { supabase } from './supabase';

export type OtpSenderType = 'FYDBZR' | 'GUERAR' | 'DASSAM';

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtpSms(
  phone: string,
  otp: string,
  senderType: OtpSenderType,
  turnstileToken?: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('send-otp', {
      body: { phone, otp, senderType, turnstileToken },
    });
    const result = data as { success?: boolean; error?: string } | null;
    if (error || result?.success === false || result?.error) {
      let message = result?.error;
      if (!message && error && 'context' in error) {
        const context = error.context as Response | undefined;
        const responseData = await context?.clone().json().catch(() => null) as { error?: string } | null;
        message = responseData?.error;
      }
      return { ok: false, error: message ?? error?.message ?? 'Could not send OTP. Please try again.' };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not send OTP. Please check your connection.' };
  }
}
