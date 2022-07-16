import { z } from "zod";
import { createRouter } from "./context";

export const plansRouter = createRouter()
  .query("getAll", {
    async resolve({ctx}) {
      return await ctx.prisma.treatmentPlan.findMany({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          name: true,
          id: true,
          price: true,
          duration: true,
          createdAt: true,
          description: true,
        },
      });
    },
  })
  .query("getAllSkinned", {
    async resolve({ctx}) {
      return await ctx.prisma.treatmentPlan.findMany({
        select: {
          id: true,
          name: true,
        },
      });
    },
  })
  .query("get", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.treatmentPlan.findUnique({
        where: {
          id: input.id,
        },
      });
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.string().cuid(),
      name: z.string(),
      description: z.string(),
      duration: z.number().positive(),
      price: z.number().positive(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.treatmentPlan.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          duration: input.duration,
          price: input.price,
        },
        select: {
          id: true,
        },
      });
    },
  })
  .mutation("create", {
    input: z.object({
      name: z.string(),
      description: z.string(),
      duration: z.number().positive(),
      price: z.number().positive(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.treatmentPlan.create({
        data: {
          name: input.name,
          description: input.description,
          duration: input.duration,
          price: input.price,
        },
        select: { id: true },
      });
    },
  });
