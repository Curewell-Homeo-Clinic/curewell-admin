import * as trpc from "@trpc/server";

export const appRouter = trpc.router().query("hello", {
  resolve() {
    return "hello, world";
  },
});

export type AppRouter = typeof appRouter;
