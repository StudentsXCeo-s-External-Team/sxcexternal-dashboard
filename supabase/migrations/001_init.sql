-- ============================================================
-- CMS Backend — initial schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── admins ──────────────────────────────────────────────────
CREATE TABLE admins (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT        NOT NULL,
  name          VARCHAR(255),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── events ──────────────────────────────────────────────────
CREATE TABLE events (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  image_url    TEXT,
  start_date   TIMESTAMPTZ NOT NULL,
  end_date     TIMESTAMPTZ,
  location     VARCHAR(255),
  is_published BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── news ────────────────────────────────────────────────────
CREATE TABLE news (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        VARCHAR(255) NOT NULL,
  content      TEXT        NOT NULL,
  image_url    TEXT,
  author       VARCHAR(255),
  slug         VARCHAR(255) UNIQUE NOT NULL,
  is_published BOOLEAN     NOT NULL DEFAULT TRUE,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── auto-update updated_at ──────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── RLS: block direct client access (we use service role) ──
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE news   ENABLE ROW LEVEL SECURITY;

-- Service-role key bypasses RLS — no extra policies needed.
-- Public anon key is intentionally denied access to everything.

-- ─── seed: first admin ───────────────────────────────────────
-- Replace the hash below with: SELECT crypt('yourpassword', gen_salt('bf', 12));
-- Or register via the API after running this migration.
-- INSERT INTO admins (email, password_hash, name)
-- VALUES ('admin@example.com', '$2a$12$...', 'Admin');
