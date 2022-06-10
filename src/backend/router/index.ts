import * as trpc from "@trpc/server";
import { patientRouter } from "./patient.router";

export const appRouter = trpc
  .router()
  .merge(patientRouter)
  .query("hello", {
    resolve() {
      return "hello, world";
    },
  });

export type AppRouter = typeof appRouter;
