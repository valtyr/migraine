import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("person")
    .addColumn("id", "uuid", (col) => col.defaultTo("uuid()").primaryKey())
    .addColumn("first_name", "varchar(255)", (col) => col.notNull())
    .addColumn("last_name", "varchar(255)")
    .addColumn("gender", "varchar(50)", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("pet")
    .addColumn("id", "uuid", (col) => col.defaultTo("uuid()").primaryKey())
    .addColumn("name", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("owner_id", "uuid", (col) => col.notNull())
    .addColumn("species", "varchar(255)", (col) => col.notNull())
    .addForeignKeyConstraint(
      "pet_owner_id_fk",
      ["owner_id"],
      "person",
      ["id"],
      (cb) => cb.onDelete("cascade")
    )
    .execute();

  await db.schema
    .createIndex("pet_owner_id_index")
    .on("pet")
    .column("owner_id")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("pet").execute();
  await db.schema.dropTable("person").execute();
}
