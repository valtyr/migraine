import { program } from "@caporal/core";

import compileHandler from "./handlers/compile";
import newMigrationHandler from "./handlers/newMigration";
import { withErrorHandling } from "./utils/error";
import { CreateTableStatement } from "./utils/parser";
import { parseCreateTableStatement } from "./utils/parser2";

const sql = (template: TemplateStringsArray, ...items: any[]) => {
  let str = "";
  for (let i = 0; i < items.length; i++) {
    str += template[i] + String(items[i]);
  }
  return str + template[template.length - 1];
};

program.description("💊 Alka-Seltzer for your D1 migration migraine");

program
  .command("codegen", "Generate SQL code from Kyseley migrations", {
    strictOptions: true,
  })
  .option(
    "--source-directory <dir>",
    "The directory where your kysely migrations are stored",
    { validator: program.STRING }
  )
  .option(
    "--destination-directory <dir>",
    "The directory where the generated SQL files will be saved",
    { validator: program.STRING }
  )
  .action(({ options }) => {
    withErrorHandling(compileHandler)({
      sourceDirectory: options.sourceDirectory as string | null,
      destinationDirectory: options.destinationDirectory as string | null,
    });
  });

program
  .command("new-migration", "Create a new Kyseley migration", {
    strictOptions: true,
  })
  .option(
    "--source-directory <dir>",
    "The directory where your kysely migrations are stored",
    { validator: program.STRING }
  )
  .option(
    "--message <message>",
    "A short but descriptive message for your migration",
    { validator: program.STRING }
  )
  .action(({ options }) => {
    withErrorHandling(newMigrationHandler)({
      sourceDirectory: options.sourceDirectory as string | null,
      message: options.message as string | null,
    });
  });

program
  .command("parse", "Test parser ", {
    strictOptions: true,
  })
  .action(() => {
    //     const result = parseCreateTableStatement(
    //       sql`Create Table Models(
    //   model_id INTEGER PRIMARY KEY AUTOINCREMENT,
    //   model_name VARCHAR(50) NOT NULL,
    //   model_base_price INTEGER NOT NULL,
    //   brand_id INTEGER NOT NULL
    // );`
    //     );

    //     const result = parseCreateTableStatement(
    //       sql`Create Temporary Table if not exists public.Models(
    //   model_id INTEGER PRIMARY KEY AUTOINCREMENT,
    //   model_name VARCHAR NOT NULL,
    //   model_base_price INTEGER NOT NULL,
    //   brand_id INTEGER NOT NULL,
    //   Constraint test primary key desc on conflict rollback autoincrement
    // );`
    //     );

    const result = parseCreateTableStatement(
      sql`
        CREATE TEMPORARY TABLE IF NOT EXISTS public.Models (
          model_id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          Constraint test primary key desc on conflict rollback autoincrement
        );
      `
    );

    console.log(result);
  });

export default program;
