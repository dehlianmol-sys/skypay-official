# Fix OTP, Home Banner, and Amount Placement

## What will change
- Send registration OTP through the existing Supabase `send-otp` function after Cloudflare verification, instead of depending on the Vercel OTP endpoint.
- Read active Home banners from the existing `banners` records and keep notice banners separate.
- Remove the invisible fixed-width amount boxes and position ₹9837 and ₹0 directly beside their matching currency symbols.

## Verification
- Test the complete Send OTP request and confirm the function response.
- Sign in with the supplied test account, confirm an uploaded Home banner renders, and compare both amount positions against the screenshot.
- Confirm the preview builds without errors.

## Technical details
- Keep the existing external Supabase connection and current UI intact.
- Do not create new database tables or enable Lovable Cloud.
- Only provide SQL if the live banner query proves the existing schema or permissions are missing.
