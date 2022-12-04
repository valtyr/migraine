import { inferAsyncReturnType } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getDB } from "./db";

export function createContext(env: Bindings) {
  return function ({ req }: FetchCreateContextFnOptions) {
    const db = getDB(env);

    return { req, env, db };
  };
}

export type Context = inferAsyncReturnType<ReturnType<typeof createContext>>;
