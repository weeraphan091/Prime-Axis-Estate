-- === สร้างตาราง BlogPost (รันใน Supabase SQL Editor) ===
CREATE TABLE IF NOT EXISTS "BlogPost" (
  "id"          TEXT PRIMARY KEY,
  "slug"        TEXT NOT NULL UNIQUE,
  "title"       TEXT NOT NULL,
  "titleEn"     TEXT,
  "titleZh"     TEXT,
  "titleRu"     TEXT,
  "excerpt"     TEXT NOT NULL,
  "excerptEn"   TEXT,
  "excerptZh"   TEXT,
  "excerptRu"   TEXT,
  "content"     TEXT NOT NULL,
  "contentEn"   TEXT,
  "contentZh"   TEXT,
  "contentRu"   TEXT,
  "coverImage"  TEXT,
  "category"    TEXT NOT NULL,
  "tags"        TEXT NOT NULL DEFAULT '[]',
  "status"      TEXT NOT NULL DEFAULT 'published',
  "createdAt"   TEXT NOT NULL,
  "updatedAt"   TEXT NOT NULL
);
