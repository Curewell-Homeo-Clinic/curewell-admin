import * as trpc from "@trpc/server";
import { prisma } from "../utils/prisma";

export const invoiceRouter = trpc.router().query("get_all_invoices", {
  async resolve() {
    return prisma.invoice.findMany({
      select: {
        id: true,
        timestamp: true,
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        consultationFee: true,
      },
    });
  },
});
