-- ============================================================
-- CMS Backend — schema extensions
-- Run this in your Supabase SQL editor AFTER 001_init.sql
-- ============================================================

-- ─── events: add registration_url ────────────────────────────
ALTER TABLE events ADD COLUMN IF NOT EXISTS registration_url TEXT;

-- ─── news: add images array ───────────────────────────────────
ALTER TABLE news ADD COLUMN IF NOT EXISTS images TEXT[] NOT NULL DEFAULT '{}';

-- ─── gallery_photos ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_photos (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT,
  description  TEXT,
  image_url    TEXT        NOT NULL,
  category     VARCHAR(255),
  is_published BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER gallery_photos_updated_at
  BEFORE UPDATE ON gallery_photos
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

-- ─── members ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS members (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(255) NOT NULL,
  position     VARCHAR(255),
  department   VARCHAR(255),
  photo_url    TEXT,
  period       VARCHAR(255),
  bio          TEXT,
  social_url   TEXT,
  sort_order   INTEGER      NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TRIGGER members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE members ENABLE ROW LEVEL SECURITY;
