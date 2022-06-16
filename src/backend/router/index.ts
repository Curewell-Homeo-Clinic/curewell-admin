import * as trpc from "@trpc/server";
import { prisma } from "../utils/prisma";
import { patientRouter } from "./patient.router";
import { productRouter } from "./product.router";

export const appRouter = trpc
  .router()
  .merge(patientRouter)
  .merge(productRouter)
  .query("get_overall_stats", {
    async resolve() {
      const { consultationFee, medicineFee } = (
        await prisma.invoice.aggregate({
          _sum: {
            consultationFee: true,
            medicineFee: true,
          },
        })
      )._sum;

      return {
        patients: await prisma.patient.count({}),
        invoices: await prisma.invoice.count({}),
        appointments: await prisma.appointment.count({}),
        sales: (consultationFee || 0) + (medicineFee || 0),
      };
    },
  });

export type AppRouter = typeof appRouter;
