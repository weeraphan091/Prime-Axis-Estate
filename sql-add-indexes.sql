-- เพิ่ม indexes สำหรับ queries ที่ใช้บ่อย
-- รันใน Supabase SQL Editor

-- Property indexes
CREATE INDEX IF NOT EXISTS "Property_status_idx" ON "Property" ("status");
CREATE INDEX IF NOT EXISTS "Property_status_updatedAt_idx" ON "Property" ("status", "updatedAt" DESC);
CREATE INDEX IF NOT EXISTS "Property_listingType_idx" ON "Property" ("listingType");
CREATE INDEX IF NOT EXISTS "Property_userId_idx" ON "Property" ("userId");
CREATE INDEX IF NOT EXISTS "Property_agentId_idx" ON "Property" ("agentId");

-- Lead indexes
CREATE INDEX IF NOT EXISTS "Lead_propertyId_idx" ON "Lead" ("propertyId");
CREATE INDEX IF NOT EXISTS "Lead_status_idx" ON "Lead" ("status");
CREATE INDEX IF NOT EXISTS "Lead_createdAt_idx" ON "Lead" ("createdAt" DESC);

-- BlogPost indexes
CREATE INDEX IF NOT EXISTS "BlogPost_status_idx" ON "BlogPost" ("status");
CREATE INDEX IF NOT EXISTS "BlogPost_status_createdAt_idx" ON "BlogPost" ("status", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "BlogPost_category_idx" ON "BlogPost" ("category");
