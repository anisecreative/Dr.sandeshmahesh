# Dr. Sandesh Mahesh: backend setup (ANISE central Supabase)

This site is a tenant of the central ANISE Supabase project `anise` (`hlgqypkyrvdhykezmuzd`). No separate database exists for this doctor.

- Doctor record: `public.doctors`, slug `sandesh-mahesh`, id `043e0b43-c82c-4bb6-bcaf-7dbb35ec9a1d`, specialty OBGYN.
- Every row this site writes carries that doctor_id (via the slug-based RPCs `submit_callback_request`, `submit_checkin_start`, `complete_checkin`, `log_site_event`).
- Admin (`/admin/login.html`) is gated by Row Level Security through `private.is_doctor_admin(doctor_id)` and the `public.doctor_admins` mapping. Frontend checks are only a convenience.
- Isolation was tested: another doctor's admin account returns false for this doctor and cannot read its rows.

## Still to do before launch
1. Set `website_url` on the doctor record once the domain is known (required before the owner portal can issue an invite).
2. From https://anise.in/admin, generate an invite for Dr. Sandesh's email; he sets his own password.
3. Doctor approves copy, check-in questions, fee, registration number, portrait, WhatsApp number.
4. Keep `robots.txt` blocking indexing until approved.

Never put a service_role key or any secret in this repository.
