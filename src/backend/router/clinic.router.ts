import { z } from "zod";
import { createRouter } from "./context";

export const clinicRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      return ctx.prisma.clinic.findMany({
        select: {
          id: true,
          number: true,
          name: true,
          address: true,
        },
      });
    },
  })
  .query("get", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.clinic.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          number: true,
          name: true,
          address: true,
          invoices: {
            orderBy: {
              timestamp: "desc",
            },
            select: {
              id: true,
              timestamp: true,
              number: true,
              totalAmmount: true,
              patient: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });
    },
  })
  .mutation("create", {
    input: z.object({
      name: z.string(),
      address: z.string(),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.clinic.create({
        data: {
          name: input.name,
          address: input.address,
        },
      });
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.string().cuid(),
      name: z.string(),
      address: z.string(),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.clinic.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          address: input.address,
        },
      });
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.clinic.delete({
        where: {
          id: input.id,
        },
      });
    },
  });
