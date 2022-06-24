import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "../utils/prisma";

export const plansRouter = trpc
  .router()
  .query("get_all_treatment_plans", {
    async resolve() {
      return await prisma.treatmentPlan.findMany({
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
          _count: {
            select: {
              invoices: true,
            },
          },
        },
      });
    },
  })
  .query("get_plan_by_id", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ input }) {
      return await prisma.treatmentPlan.findUnique({
        where: {
          id: input.id,
        },
      });
    },
  })
  .mutation("update_treatment_plan", {
    input: z.object({
      id: z.string().cuid(),
      name: z.string(),
      description: z.string(),
      duration: z.number().positive(),
      price: z.number().positive(),
    }),
    async resolve({ input }) {
      return await prisma.treatmentPlan.update({
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
  .mutation("create_treatment_plan", {
    input: z.object({
      name: z.string(),
      description: z.string(),
      duration: z.number().positive(),
      price: z.number().positive(),
    }),
    async resolve({ input }) {
      return await prisma.treatmentPlan.create({
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
