import * as trpc from "@trpc/server";
import { prisma } from "../utils/prisma";

export const productRouter = trpc.router().query("get_all_products", {
  async resolve() {
    return await prisma.product.findMany({});
  },
});
