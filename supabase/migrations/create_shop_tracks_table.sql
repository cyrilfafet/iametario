create table if not exists shop_tracks (
  id uuid default gen_random_uuid() primary key,
  titre text not null,
  genre text not null,
  fichier_preview_url text not null,
  fichier_wav_url text not null,
  stripe_payment_link text not null,
  published boolean default false not null,
  created_at timestamptz default now() not null
);

create index if not exists shop_tracks_published_idx on shop_tracks (published, created_at desc);
