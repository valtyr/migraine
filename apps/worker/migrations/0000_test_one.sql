-- 0000_test_one.sql generated on 2022-11-24T21:48:54.648Z using migraine 💊
-- Changes should be made to the source file: src/migrations/0000_test_one.ts

CREATE TABLE
  "person" (
    "id" uuid DEFAULT 'uuid()' PRIMARY KEY,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255),
    "gender" VARCHAR(50) NOT NULL
  );


CREATE TABLE
  "pet" (
    "id" uuid DEFAULT 'uuid()' PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "owner_id" uuid NOT NULL,
    "species" VARCHAR(255) NOT NULL,
    CONSTRAINT "pet_owner_id_fk" FOREIGN KEY ("owner_id") REFERENCES "person" ("id") ON DELETE CASCADE
  );


CREATE INDEX "pet_owner_id_index" ON "pet" ("owner_id");
