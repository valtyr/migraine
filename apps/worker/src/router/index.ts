import { initTRPC, TRPCError } from "@trpc/server";
import { TRPC_ERROR_CODES_BY_KEY } from "@trpc/server/dist/rpc";
import { z } from "zod";
import type { Context } from "../context";
// import authRouter from "./auth";

export const t = initTRPC.context<Context>().create();

const testRouter = t.router({
  createPersonAndPet: t.procedure.mutation(async ({ ctx }) => {
    const person = await ctx.db
      .insertInto("person")
      .values({
        first_name: "Valtýr Örn",
        last_name: "Kjartansson",
        gender: "male",
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    const pet = await ctx.db
      .insertInto("pet")
      .values({
        name: "Fido",
        owner_id: person.id,
        species: "dog",
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return {
      person,
      pet,
    };
  }),
});

export const appRouter = t.router({
  test: testRouter,
  // auth: authRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
