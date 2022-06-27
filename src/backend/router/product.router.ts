import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "../utils/prisma";

export const productRouter = trpc
  .router()
  .query("get_all_products", {
    input: z
      .object({
        outOfStock: z.boolean().default(true),
      })
      .nullish(),
    async resolve({ input }) {
      return await prisma.product.findMany({
        where: {
          quantity: !input?.outOfStock
            ? {
                not: {
                  equals: 0,
                },
              }
            : undefined,
        },
      });
    },
  })
  .query("get_product_by_id", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      return await prisma.product.findUnique({
        where: {
          id: input.id,
        },
      });
    },
  });
