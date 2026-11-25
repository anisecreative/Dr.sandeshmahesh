# Isolation & Multi-Tenant Architecture — Dr. Sandesh Mahesh

- This project is a completely separate repository/deployment for **Dr. Sandesh Mahesh** (OBGYN).
- Never point `js/supabase-config.js` to another doctor's `doctorId` or `doctorSlug`.
- All public reads and admin writes are isolated by `doctor_id` with Supabase Row Level Security (`private.is_doctor_admin(doctor_id)`).
- Public enquiry writes go exclusively through rate-limited RPC functions (`submit_callback_request`, `submit_checkin_start`, `complete_checkin`).
