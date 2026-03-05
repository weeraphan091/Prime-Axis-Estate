-- === สร้างตาราง NewsletterSubscriber (รันใน Supabase SQL Editor) ===
CREATE TABLE IF NOT EXISTS "NewsletterSubscriber" (
  "id"        TEXT PRIMARY KEY,
  "email"     TEXT NOT NULL UNIQUE,
  "createdAt" TEXT NOT NULL
);
