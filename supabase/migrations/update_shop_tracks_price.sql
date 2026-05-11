alter table shop_tracks drop column if exists stripe_payment_link;
alter table shop_tracks add column if not exists prix integer not null default 500;
