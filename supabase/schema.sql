-- ════════════════════════════════════════════════
--  Qmap — Supabase Schema
--  Run this in: Supabase Dashboard → SQL Editor
-- ════════════════════════════════════════════════

-- ── 1. Areas ─────────────────────────────────────
create table if not exists areas (
  id                  text primary key,
  name                text not null,
  locality            text not null,
  safety_level        text not null check (safety_level in ('safe', 'moderate', 'danger')),
  crowd_density       integer not null check (crowd_density between 0 and 100),
  traffic_level       integer not null check (traffic_level between 0 and 100),
  is_open             boolean default true,
  vibe                text not null check (vibe in ('chill', 'social', 'busy', 'restricted', 'closed')),
  crime_rate          text not null check (crime_rate in ('low', 'medium', 'high')),
  best_time_to_visit  text,
  transport           text[] default '{}',
  shortcut_from       text default '',
  lng                 double precision not null,
  lat                 double precision not null,
  description         text default '',
  tags                text[] default '{}',
  created_at          timestamptz default now()
);

-- ── 2. Reactions ─────────────────────────────────
create table if not exists reactions (
  id              uuid primary key default gen_random_uuid(),
  area_id         text references areas(id) on delete cascade,
  reaction_type   text not null check (
    reaction_type in ('helpful', 'safe_vibe', 'avoid', 'packed', 'chill_vibe', 'accurate')
  ),
  user_session    text not null,
  created_at      timestamptz default now(),
  -- one reaction per type per user per area
  unique (area_id, reaction_type, user_session)
);

-- ── 3. Reports ───────────────────────────────────
create table if not exists reports (
  id           uuid primary key default gen_random_uuid(),
  area_id      text references areas(id) on delete cascade,
  report_type  text not null check (
    report_type in ('unsafe', 'closed', 'overcrowded', 'incorrect_info')
  ),
  note         text,
  user_session text not null,
  created_at   timestamptz default now()
);

-- ── 4. Row Level Security ─────────────────────────
alter table areas     enable row level security;
alter table reactions enable row level security;
alter table reports   enable row level security;

-- Areas: anyone can read
create policy "areas_public_read" on areas
  for select using (true);

-- Reactions: anyone can read and insert (anonymous session)
create policy "reactions_public_read" on reactions
  for select using (true);

create policy "reactions_public_insert" on reactions
  for insert with check (true);

-- Reactions: user can delete their own
create policy "reactions_own_delete" on reactions
  for delete using (user_session = current_setting('request.headers')::json->>'x-session-id');

-- Reports: anyone can insert; no public read (admin only)
create policy "reports_public_insert" on reports
  for insert with check (true);

-- ── 5. Reaction count view (fast reads) ──────────
create or replace view reaction_counts as
  select
    area_id,
    reaction_type,
    count(*) as count
  from reactions
  group by area_id, reaction_type;

-- ── 6. Seed Data — Delhi areas ───────────────────
insert into areas (id, name, locality, safety_level, crowd_density, traffic_level, is_open, vibe, crime_rate, best_time_to_visit, transport, shortcut_from, lng, lat, description, tags) values

('cp',          'Connaught Place',         'Central Delhi',      'moderate', 85, 90, true,  'busy',       'medium', '7 PM – 10 PM',           array['Metro (Blue/Yellow Line)', 'Auto', 'Cab'],             'Take the underground path from Rajiv Chowk metro — avoid CP outer ring during peak hours.',               77.2167, 28.6315, 'The commercial heart of Delhi. Always buzzing. Best for evening outings. Avoid lunch hours on weekdays.',               array['food','shopping','nightlife','social']),

('hauz-khas',   'Hauz Khas Village',       'South Delhi',        'safe',     60, 45, true,  'chill',      'low',    '6 PM – 11 PM',           array['Metro (Yellow Line – Hauz Khas)', 'Auto', 'Cab'],      'Enter from the deer park side for immediate access to the lake view — skip the main market lane.',         77.1975, 28.5494, 'Artsy, calm vibes with cafes and galleries. Strong introvert spot. Safe after dark near the lake.',           array['art','cafes','nature','introvert','nightlife']),

('lajpat-nagar','Lajpat Nagar Market',     'South East Delhi',   'moderate', 92, 85, true,  'busy',       'medium', '11 AM – 1 PM (weekdays)',array['Metro (Pink Line – Lajpat Nagar)', 'Auto', 'Rickshaw'],  'Enter from Gate 2 near Central Market — avoids the main congestion point.',                                77.2373, 28.5665, 'Vibrant market famous for fabric and street food. Extremely crowded on weekends. Better on weekday mornings.', array['shopping','street food','budget','social']),

('lodhi-garden','Lodhi Garden',            'Lodhi Estate',       'safe',     30, 15, true,  'chill',      'low',    '6 AM – 9 AM or 5 PM – 7 PM', array['Metro (Violet Line – JLN Stadium)', 'Cab', 'Cycling'], 'Park at the Safdarjung entrance — 2 min walk to the main Mughal monuments.',                              77.2198, 28.5931, 'Green sanctuary in the heart of Delhi. Perfect introvert escape. Zero crowd in early mornings. Dog friendly.', array['nature','walking','introvert','heritage','wellness']),

('paharganj',   'Paharganj',               'Central Delhi',      'danger',   78, 70, true,  'busy',       'high',   'Daytime only (10 AM – 6 PM)', array['Metro (Blue Line – New Delhi)', 'Auto'],              'Stick to Main Bazaar road — avoid the inner lanes especially at night.',                                   77.2088, 28.6453, 'Backpacker hub near New Delhi station. High foot traffic, pickpocketing reported. Use caution at night.',      array['budget','street food','backpacker']),

('dilli-haat',  'Dilli Haat',              'INA, South Delhi',   'safe',     55, 40, true,  'social',     'low',    '4 PM – 8 PM',            array['Metro (Yellow Line – INA)', 'Auto', 'Cab'],            'INA metro exit D drops you right at the entrance — no cab needed.',                                        77.2056, 28.5721, 'Cultural craft market with state food stalls. Family friendly. Great for first dates. Very safe and patrolled.', array['culture','food','craft','introvert','family']),

('saket',       'Select City Walk – Saket','Saket, South Delhi', 'safe',     70, 60, true,  'social',     'low',    '3 PM – 6 PM (weekdays)', array['Metro (Yellow Line – Saket)', 'Cab', 'Auto'],          'Use Saket metro exit 2 for direct covered walkway to SCW.',                                                77.2195, 28.5244, 'Premium mall zone. Safe, AC, structured. Great for solo women. Weekend evenings get very crowded.',            array['shopping','food court','movies','social','safe for women']),

('old-delhi',   'Chandni Chowk',           'Old Delhi',          'moderate', 95, 95, true,  'busy',       'medium', '9 AM – 12 PM',           array['Metro (Yellow Line – Chandni Chowk)', 'E-rickshaw', 'Walking'], 'Start from the Jama Masjid side to avoid the main road chaos — e-rickshaw loops are faster.',      77.2315, 28.6562, 'Historic chaos in the best way. Incredible food but extremely dense crowds. Avoid evening rush entirely.',    array['heritage','street food','shopping','photography'])

on conflict (id) do nothing;
