import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter, AppRouter } from "@/backend/router";
import { inferProcedureOutput } from "@trpc/server";
import { createContext } from "@/backend/router/context";

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createContext,
});

export type inferQueryResponse<
  TRouteKey extends keyof AppRouter["_def"]["queries"]
> = inferProcedureOutput<AppRouter["_def"]["queries"][TRouteKey]>;
