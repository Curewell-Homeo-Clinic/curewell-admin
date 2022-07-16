import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";

import { prisma } from "@/backend/utils/prisma";

export const createContext = async (
  options?: trpcNext.CreateNextContextOptions
) => {
  const req = options?.req;
  const res = options?.res;
  return {
    req,
    res,
    prisma,
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
