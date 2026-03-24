-- FILE DOKUMENTASI
-- Tujuan: Sinkronisasi otomatis dari auth.users (Supabase) ke tabel public."User" (Prisma)

-- 1. Membuat fungsi untuk menyalin data user baru (DENGAN UPSERT / SELF-HEALING)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public."User" (id, email)
  values (new.id, new.email)
  on conflict (id) do update
  set email = excluded.email; -- Jika ID sudah ada, paksa sinkronkan emailnya
  return new;
end;
$$;

-- 2. Memasang Trigger (Pelatuk) agar fungsi di atas jalan otomatis setiap ada yang Sign Up
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();