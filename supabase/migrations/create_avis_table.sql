-- Table des avis clients (ratings)
create table if not exists avis (
  id uuid default gen_random_uuid() primary key,
  code text not null,
  stars smallint not null check (stars between 1 and 5),
  nom text,
  created_at timestamptz default now() not null
);

-- Index pour récupérer les derniers avis rapidement
create index if not exists avis_created_at_idx on avis (created_at desc);
