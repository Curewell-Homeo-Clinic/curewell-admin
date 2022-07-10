import * as trpc from "@trpc/server";
import { prisma } from "../utils/prisma";
import { appointmentRouter } from "./appointments.router";
import { doctorRouter } from "./doctor.router";
import { invoiceRouter } from "./invoice.router";
import { patientRouter } from "./patient.router";
import { plansRouter } from "./plans.router";
import { productRouter } from "./product.router";

export const appRouter = trpc
  .router()
  .merge(patientRouter)
  .merge(productRouter)
  .merge(appointmentRouter)
  .merge(doctorRouter)
  .merge(invoiceRouter)
  .merge(plansRouter)
  .query("get_overall_stats", {
    async resolve() {
      const { totalAmmount } = (
        await prisma.invoice.aggregate({
          _sum: {
            totalAmmount: true,
          },
        })
      )._sum;

      return {
        patients: await prisma.patient.count({
          where: { isDeleted: { not: true } },
        }),
        invoices: await prisma.invoice.count({}),
        appointments: await prisma.appointment.count({}),
        sales: Math.round(totalAmmount!) || 0,
      };
    },
  });

export type AppRouter = typeof appRouter;
