# Dr. Sandesh Mahesh — OBGYN Website (ANISE)

Static HTML/CSS/JS website tailored for **Dr. Sandesh Mahesh (MBBS, MS, FRM, FMAS — OBGYN)**, built to convert Instagram Reels (`@namma_drsandesh`) and YouTube (`@Namma_DrSandesh`) viewers into private video consultations.

## Deployment (Cloudflare Pages)
- Framework preset: **None** (static site, zero build step)
- Build command: *(leave empty)*
- Output directory: `/`

## Before Launch Checklist (Doctor Confirmation Required)
1. Upload approved portrait photo to `assets/doctor/sandesh.jpg`.
2. Update `js/site-config.js` with confirmed consultation fee, duration, booking URL (if using SuperProfile/Calendly), KMC/NMC registration number, email, and clinic address (if offering in-person visits).
3. Update `js/supabase-config.js` with your Supabase project URL, publishable anon key, and Dr. Sandesh Mahesh's verified `doctorId` UUID.
4. Have Dr. Sandesh Mahesh review all copy, 1-minute consultation guide questions, FAQs, privacy policy, and medical disclaimers.
5. Swap `robots.txt` to allow indexing and update `sitemap.xml` with the live custom domain.
