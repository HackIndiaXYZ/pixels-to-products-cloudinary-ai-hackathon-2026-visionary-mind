# Setup

## 1. Copy these files into your cloned repo
Drop everything here into the root of
`pixels-to-products-cloudinary-ai-hackathon-2026-visionary-mind`
(next to the existing README.md and LICENSE).

## 2. Install dependencies
```
npm install
```

## 3. Set up Cloudinary
1. Log in to https://console.cloudinary.com
2. Copy your **Cloud name** from the dashboard.
3. Go to Settings → Upload → Upload presets → Add upload preset.
   Set **Signing Mode** to **Unsigned**, save, and copy its name.
4. Copy `.env.local.example` to `.env.local` and fill in both values.

## 4. Confirm Generative Background Replace is available
This app uses Cloudinary's `e_gen_background_replace` AI effect. Some
plans/trials require enabling AI add-ons in the console first — check
Settings → Add-ons, or the Cloudinary AI section of the console, before
your demo so you're not debugging this live.

## 5. Run it
```
npm run dev
```
Visit http://localhost:3000, upload a plain product photo, and click
"Generate shoot."

## 6. Deploy
Push to GitHub, then import the repo at https://vercel.com/new and add
the two env vars (`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`,
`NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`) in the Vercel project settings.

## Notes / next steps
- Scene prompts and crop ratios are defined as small arrays at the top
  of `app/page.js` — easy to extend with more presets.
- If a scene tile appears blank, open its image URL directly in a new
  tab: Cloudinary will return a JSON error explaining what's wrong
  (e.g. add-on not enabled, prompt too long).
- Nice add for extra polish: an AI-generated caption per scene using
  Cloudinary's auto-tagging, or a "download all" zip button.
