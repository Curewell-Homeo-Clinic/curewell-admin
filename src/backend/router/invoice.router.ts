import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "../utils/prisma";

export const invoiceRouter = trpc
  .router()
  .query("get_all_invoices", {
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
          plan: {
            select: {
              plan: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          totalAmmount: true,
        },
      });
    },
  })
  .query("get_invoice_by_id", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ input }) {
      return await prisma.invoice.findUnique({
        where: { id: input.id },
        select: {
          timestamp: true,
          patient: {
            select: {
              firstName: true,
              lastName: true,
              id: true,
            },
          },
        },
      });
    },
  });
