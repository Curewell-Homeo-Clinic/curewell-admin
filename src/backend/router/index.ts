import { appointmentRouter } from "./appointments.router";
import { createRouter } from "./context";
import { doctorRouter } from "./doctor.router";
import { invoiceRouter } from "./invoice.router";
import { patientRouter } from "./patient.router";
import { plansRouter } from "./plans.router";
import { productRouter } from "./product.router";

export const appRouter = createRouter()
  .merge("appointments.", appointmentRouter)
  .merge("doctor.",doctorRouter)
  .merge("patients.",patientRouter)
  .merge("plans.", plansRouter)
  .merge("products.",productRouter)
  .merge("invoices.",invoiceRouter)
  .query("getOverallStats", {
    async resolve({ctx}) {
      const { totalAmmount } = (
        await ctx.prisma.invoice.aggregate({
          _sum: {
            totalAmmount: true,
          },
        })
      )._sum;

      return {
        patients: await ctx.prisma.patient.count({
          where: { isDeleted: { not: true } },
        }),
        invoices: await ctx.prisma.invoice.count({}),
        appointments: await ctx.prisma.appointment.count({}),
        sales: Math.round(totalAmmount!) || 0,
      };
    },
  });

export type AppRouter = typeof appRouter;
