# Admin Setup — Dr. Sandesh Mahesh

1. Create a dedicated Supabase Auth user for Dr. Sandesh Mahesh (never share another doctor's login).
2. Confirm Dr. Sandesh Mahesh's `doctor_id` UUID in `public.doctors` and place it in `js/supabase-config.js`.
3. Insert one row into `public.doctor_admins (doctor_id, user_id)` mapping that user to Dr. Sandesh's `doctor_id`.
4. Ensure public signups are disabled in Supabase Auth and leaked-password protection is enabled.
