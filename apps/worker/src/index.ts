import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";

import { Hono } from "hono";
import { cors } from "hono/cors";

declare global {
  interface Bindings {
    DATABASE: D1Database;
    WEBAUTHN_RP_ID: string;
  }
}

const app = new Hono<{ Bindings: Bindings }>();
app.use("/*", cors());

app.all("/trpc/*", ({ req, env }) => {
  return fetchRequestHandler({
    endpoint: "/trpc",
    req: req as any,
    router: appRouter,
    createContext: createContext(env),
  });
});

export default app;
