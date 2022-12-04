import { stat } from "fs/promises";
import { join, normalize } from "path";
import { exit } from "process";

export const normalizePath = (path: string) => {
  if (path.startsWith("/")) return normalize(path);
  return join(process.cwd(), path);
};

export const ensureIsDirectory = async (path: string) => {
  try {
    const res = await stat(path);
    return res.isDirectory();
  } catch {
    return false;
  }
};
