import { mkdir, readdir, rm, writeFile } from "fs/promises";
import { join, relative } from "path";
import React from "react";
import generateSql from "../generateSql";
import { getWranglerConfig } from "../utils/config";
import MigraineError from "../utils/error";
import { ensureIsDirectory, normalizePath } from "../utils/path";
import { Box, Text } from "ink";
import Table from "ink-table";

const compileHandler = async (input: {
  sourceDirectory?: string | null;
  destinationDirectory?: string | null;
}) => {
  const config = await getWranglerConfig();

  const sourceDirectory = normalizePath(
    input.sourceDirectory || config.migraine.source_folder || "src/migrations"
  );
  const destinationDirectory = normalizePath(
    input.destinationDirectory || config.sqlMigrationDirectory
  );

  if (!(await ensureIsDirectory(sourceDirectory))) {
    throw new MigraineError(
      (
        <Text>
          Source directory {relative(process.cwd(), sourceDirectory)} does not
          exist
        </Text>
      ),
      `Source directory ${relative(
        process.cwd(),
        sourceDirectory
      )} does not exist`
    );
  }

  const sourceFiles = await readdir(sourceDirectory, { withFileTypes: true });
  const migrationFiles = sourceFiles.flatMap((value) => {
    if (!value.isFile() || !/\.ts|\.js^/i.test(value.name)) return [];
    return join(sourceDirectory, value.name);
  });

  const migrations = await Promise.all(
    migrationFiles.map(async (filename) => {
      const migration = await generateSql(filename);
      return migration;
    })
  );

  await mkdir(destinationDirectory, { recursive: true });

  await Promise.all(
    migrations.map(async ({ outputFilename, sql }) => {
      const outputPath = join(destinationDirectory, outputFilename);
      await writeFile(outputPath, sql, {
        encoding: "utf-8",
      });
      console.log(`☑️ ${relative(process.cwd(), outputPath)}`);
    })
  );

  console.log(
    `\n${migrations.length} migration ${
      migrations.length > 1 ? "files" : "file"
    } generated\n`
  );
};

export default compileHandler;
