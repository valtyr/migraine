import { readFile } from "fs/promises";
import toml from "toml";

import { z } from "zod";
import MigraineError from "./error";
import { Text } from "ink";
import Table from "ink-table";
import React from "react";

const Config = z.object({
  d1_databases: z
    .array(
      z.object({
        binding: z.string(),
        database_name: z.string(),
        migrations_dir: z.string().optional(),
      })
    )
    .min(1),
  migraine: z.object({
    source_folder: z.string(),
    database_name: z.string().optional(),
  }),
});

const getConfigFile = async () => {
  try {
    const configFile = await readFile("./wrangler.toml", { encoding: "utf-8" });
    return configFile;
  } catch {
    throw new MigraineError(
      (
        <Text>
          Please run migraine from the folder where your{" "}
          <Text underline>wrangler.toml</Text> lives.
        </Text>
      ),
      "Please run migraine from the folder where your wrangler.toml lives."
    );
  }
};

const parseConfigFile = (configFile: string) => {
  try {
    const parsed = toml.parse(configFile);
    return parsed;
  } catch {
    throw new MigraineError(
      (
        <Text>
          It seems like your <Text underline>wrangler.toml</Text> is invalid.
        </Text>
      ),
      "It seems like your wrangler.toml is invalid."
    );
  }
};

const validateConfigFile = (parsedConfigFile: any) => {
  const result = Config.safeParse(parsedConfigFile);

  if (!result.success) {
    throw new MigraineError(
      (
        <>
          <Text>Failed to parse wrangler.toml:</Text>

          <Table
            data={result.error.issues.map((error) => {
              return {
                code: error.code,
                message: error.message,
                path: error.path.join("."),
              };
            })}
          />
        </>
      ),
      "No d1_databases found in wrangler.toml"
    );
  }

  if (result.data.d1_databases.length === 0) {
    throw new MigraineError(
      (
        <Text>
          No d1_databases found in <Text underline>wrangler.toml</Text>
        </Text>
      ),
      "No d1_databases found in wrangler.toml"
    );
  }

  if (
    result.data.d1_databases.length > 1 &&
    !result.data.migraine.database_name
  ) {
    throw new MigraineError(
      (
        <Text>
          You have more than one D1 database in your{" "}
          <Text underline>wrangler.toml</Text> Please add a
          migraine.database_name key to wrangler.toml to specify which one is
          managed by migraine.
        </Text>
      ),
      "You have more than one D1 database in your wrangler.toml. Please add a migraine.database_name key to wrangler.toml to specify which one is managed by migraine."
    );
  }

  const sqlMigrationDirectory =
    (result.data.d1_databases.length === 1
      ? result.data.d1_databases[0].migrations_dir
      : result.data.d1_databases.find(
          (d) => d.database_name === result.data.migraine.database_name
        )?.migrations_dir) || "migrations";

  return {
    migraine: result.data.migraine,
    sqlMigrationDirectory,
  };
};

export const getWranglerConfig = async () => {
  const configFile = await getConfigFile();
  const parsed = parseConfigFile(configFile);
  const validated = validateConfigFile(parsed);

  return validated;
};
