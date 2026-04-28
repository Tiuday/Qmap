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

('old-delhi',       'Chandni Chowk',              'Old Delhi',          'moderate', 95, 95, true,  'busy',   'medium', '9 AM – 12 PM',                   array['Metro (Yellow Line – Chandni Chowk)', 'E-rickshaw', 'Walking'],    'Start from the Jama Masjid side to avoid the main road chaos — e-rickshaw loops are faster.',             77.2315, 28.6562, 'Historic chaos in the best way. Incredible food but extremely dense crowds. Avoid evening rush entirely.',             array['heritage','street food','shopping','photography']),

('khan-market',    'Khan Market',                'Central South Delhi','safe',     55, 35, true,  'chill',  'low',    '11 AM – 2 PM or 5 PM – 8 PM',  array['Metro (Violet Line – Khan Market)', 'Cab', 'Auto'],                'Use the metro exit towards Subramania Bharati Marg — avoids the main roundabout.',                         77.2237, 28.6004, 'Delhi''s most expensive market. Quiet, upscale, and consistently safe. Great for solo afternoons and reading cafes.', array['cafes','bookshops','introvert','upscale','safe for women']),

('nehru-place',    'Nehru Place',                'South East Delhi',   'moderate', 88, 82, true,  'busy',   'medium', '10 AM – 1 PM (weekdays only)',  array['Metro (Violet Line – Nehru Place)', 'Auto', 'Cab'],                'Enter from the metro exit side — the outer road approach doubles travel time during peak hours.',           77.2512, 28.5476, 'Asia''s largest IT market. Chaotic, fast-moving, overwhelming. Solo women should go in groups. Best weekday mornings.', array['tech','electronics','market','daytime only']),

('karol-bagh',     'Karol Bagh',                 'Central West Delhi', 'moderate', 82, 80, true,  'busy',   'medium', '10 AM – 12 PM (weekdays)',      array['Metro (Blue/Green Line – Karol Bagh)', 'Auto', 'Rickshaw'],        'Pusa Road entry from the metro is the cleanest approach — avoid Ajmal Khan Road at peak hours.',           77.1903, 28.6530, 'Dense shopping hub for clothes and electronics. Noisy, crowded, but generally safe in the main market lanes.',         array['shopping','street food','electronics','budget']),

('rajouri-garden', 'Rajouri Garden',             'West Delhi',         'moderate', 72, 68, true,  'social', 'medium', '6 PM – 9 PM',                   array['Metro (Blue Line – Rajouri Garden)', 'Auto', 'Cab'],               'The Vishal Mega Mart side entrance skips the main traffic signal entirely.',                               77.1187, 28.6440, 'Popular West Delhi market with street food and fashion. Lively evenings, decent safety on main lanes.',               array['shopping','street food','social','evening']),

('defence-colony', 'Defence Colony',             'South Delhi',        'safe',     45, 30, true,  'social', 'low',    '7 PM – 10 PM',                  array['Metro (Violet Line – Lajpat Nagar)', 'Cab', 'Auto'],               'Enter via the B-Block flyover to skip the main roundabout congestion.',                                    77.2342, 28.5735, 'Upscale residential colony with great restaurants and cafes. Very safe, low crime, excellent lighting at night.',    array['restaurants','cafes','introvert','safe for women','nightlife']),

('gk-1',           'GK-1 M Block Market',        'South Delhi',        'safe',     50, 40, true,  'social', 'low',    '6 PM – 10 PM',                  array['Metro (Violet Line – Greater Kailash)', 'Cab', 'Auto'],            'Park near the N Block side entrance — the main M Block parking fills up by 7 PM on weekends.',            77.2368, 28.5425, 'Compact upscale market with independent boutiques and rooftop cafes. Safe, consistent foot traffic, great vibes.', array['cafes','boutiques','introvert','nightlife','safe for women']),

('janpath',        'Janpath Market',             'Central Delhi',      'moderate', 78, 72, true,  'busy',   'medium', '11 AM – 2 PM (avoid rush hour)',array['Metro (Blue/Yellow Line – Rajiv Chowk)', 'Auto', 'Walking from CP'],'Enter from Janpath Road directly — Connaught Place inner circle approach is always jammed.',               77.2183, 28.6243, 'Beloved street market for handicrafts, ethnic clothes, and hippie wear. Crowded on weekends. Better on weekday mornings.', array['handicrafts','shopping','street','budget','tourist']),

('majnu-ka-tila',  'Majnu Ka Tila',              'North Delhi',        'safe',     35, 25, true,  'chill',  'low',    '12 PM – 8 PM',                  array['Metro (Yellow Line – Vidhan Sabha)', 'Auto', 'Cab'],               'Take the Yamuna riverbank road from Civil Lines — avoids the Ring Road traffic entirely.',                 77.2292, 28.6890, 'Delhi''s Tibetan colony. Quiet, offbeat, and genuinely safe. Great momos, thukpa, and a peaceful walking vibe.',     array['food','introvert','offbeat','chill','affordable']),

('vasant-kunj',    'Ambience Mall – Vasant Kunj','South West Delhi',   'safe',     65, 55, true,  'social', 'low',    '2 PM – 6 PM (weekdays)',         array['Metro (Yellow Line – IGNOU)', 'Cab', 'Auto'],                      'Approach from Nelson Mandela Marg to avoid the Vasant Kunj B Block bottleneck.',                          77.1575, 28.5218, 'Premium lifestyle mall in South West Delhi. Excellent safety, CCTV everywhere, and great food court options.',       array['mall','shopping','food court','movies','safe for women','family']),

('sarojini-nagar', 'Sarojini Nagar Market',      'South West Delhi',   'moderate', 90, 78, true,  'busy',   'medium', '10 AM – 12 PM (weekdays)',       array['Metro (Yellow Line – Sarojini Nagar)', 'Auto', 'Rickshaw'],        'Enter from the Gate 1 side near the metro — the main road approach is almost always gridlocked.',          77.1943, 28.5739, 'Delhi''s iconic fashion market. Insanely packed on weekends. Pickpocketing risk in dense lanes. Go on weekday mornings.', array['fashion','budget','street shopping','daytime only'])

on conflict (id) do nothing;
