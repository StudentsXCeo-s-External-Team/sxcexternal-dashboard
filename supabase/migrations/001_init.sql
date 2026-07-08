-- ============================================================
-- CMS Backend — full schema
-- Run this in your Supabase SQL editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── updated_at trigger ──────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── events ──────────────────────────────────────────────────
CREATE TABLE events (
  id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  title            VARCHAR(255) NOT NULL,
  description      TEXT,
  image_url        TEXT,
  start_date       TIMESTAMPTZ  NOT NULL,
  end_date         TIMESTAMPTZ,
  location         VARCHAR(255),
  registration_url TEXT,
  is_published     BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── news ────────────────────────────────────────────────────
CREATE TABLE news (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  title        VARCHAR(255) NOT NULL,
  content      TEXT         NOT NULL,
  image_url    TEXT,
  author       VARCHAR(255),
  slug         VARCHAR(255) UNIQUE NOT NULL,
  images       TEXT[]       NOT NULL DEFAULT '{}',
  is_published BOOLEAN      NOT NULL DEFAULT TRUE,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── gallery_photos ──────────────────────────────────────────
CREATE TABLE gallery_photos (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  title        VARCHAR(255),
  description  TEXT,
  image_url    TEXT         NOT NULL,
  category     VARCHAR(255),
  is_published BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── programs ────────────────────────────────────────────────
CREATE TABLE programs (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         VARCHAR(255) UNIQUE NOT NULL,
  badge        VARCHAR(255) NOT NULL,
  category     VARCHAR(255) NOT NULL,
  title        VARCHAR(255) NOT NULL,
  month        VARCHAR(255) NOT NULL,
  audience     VARCHAR(255) NOT NULL,
  cover        TEXT         NOT NULL,
  hero         TEXT         NOT NULL,
  images       TEXT[]       NOT NULL DEFAULT '{}',
  excerpt      TEXT         NOT NULL,
  content      TEXT         NOT NULL,
  highlights   TEXT[]       NOT NULL DEFAULT '{}',
  is_published BOOLEAN      NOT NULL DEFAULT TRUE,
  sort_order   INTEGER      NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── partners ────────────────────────────────────────────────
CREATE TABLE partners (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(255) NOT NULL,
  logo_url     TEXT         NOT NULL,
  partner_type VARCHAR(50)  NOT NULL CHECK (partner_type IN ('corporate', 'media', 'community')),
  website_url  TEXT,
  sort_order   INTEGER      NOT NULL DEFAULT 0,
  is_published BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── members ─────────────────────────────────────────────────
CREATE TABLE members (
  id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(255) NOT NULL,
  role_type  VARCHAR(50)  NOT NULL DEFAULT 'associate' CHECK (role_type IN ('executive', 'management', 'associate')),
  position   VARCHAR(255),
  department VARCHAR(255),
  photo_url  TEXT,
  period     VARCHAR(100),
  bio        TEXT,
  social_url TEXT,
  sort_order INTEGER      NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── resources ───────────────────────────────────────────────
CREATE TABLE resources (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         VARCHAR(255) UNIQUE NOT NULL,
  badge        VARCHAR(255) NOT NULL,
  category     VARCHAR(255) NOT NULL,
  title        VARCHAR(255) NOT NULL,
  month        VARCHAR(255) NOT NULL,
  audience     VARCHAR(255) NOT NULL,
  cover        TEXT         NOT NULL,
  hero         TEXT         NOT NULL,
  excerpt      TEXT         NOT NULL,
  content      TEXT         NOT NULL,
  highlights   TEXT[]       NOT NULL DEFAULT '{}',
  is_published BOOLEAN      NOT NULL DEFAULT TRUE,
  sort_order   INTEGER      NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── updated_at triggers ─────────────────────────────────────
CREATE TRIGGER events_updated_at    BEFORE UPDATE ON events         FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER news_updated_at      BEFORE UPDATE ON news           FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER gallery_updated_at   BEFORE UPDATE ON gallery_photos FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER programs_updated_at  BEFORE UPDATE ON programs       FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER resources_updated_at BEFORE UPDATE ON resources      FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── RLS (service role bypasses, anon denied) ────────────────
ALTER TABLE events         ENABLE ROW LEVEL SECURITY;
ALTER TABLE news           ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners       ENABLE ROW LEVEL SECURITY;
ALTER TABLE members        ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources      ENABLE ROW LEVEL SECURITY;
