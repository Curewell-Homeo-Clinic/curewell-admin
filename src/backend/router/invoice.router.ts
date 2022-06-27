import * as trpc from "@trpc/server";
import { string, z } from "zod";
import { prisma } from "../utils/prisma";

export const invoiceRouter = trpc
  .router()
  .query("get_all_invoices", {
    async resolve() {
      return prisma.invoice.findMany({
        select: {
          id: true,
          timestamp: true,
          consultationFee: true,
          products: {
            select: {
              discountPercentage: true,
              price: true,
            },
          },
          planAmmountPaying: true,
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
        orderBy: {
          timestamp: "desc",
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
  })
  .mutation("create_invoice", {
    input: z.object({
      timestamp: z.string(),
      patientId: z.string().cuid(),
      doctorId: z.string().cuid(),
      products: z.array(
        z.object({
          id: z.string().cuid(),
          oldQuantity: z.number(),
          quantity: z.number().default(1),
        })
      ),
      consultationFee: z.number(),
      patientPlanId: z.string(),
      planAmmountPaying: z.number(),
      planPaidAmmount: z.number(),
      totalAmmount: z.number(),
    }),
    async resolve({ input }) {
      // create the invoice
      const invoice = await prisma.invoice.create({
        data: {
          timestamp: new Date(input.timestamp),
          patient: {
            connect: {
              id: input.patientId,
            },
          },
          doctor: {
            connect: {
              id: input.doctorId,
            },
          },
          products: {
            connect: input.products.map((product) => ({ id: product.id })),
          },
          consultationFee: input.consultationFee,
          plan: {
            connect: {
              id: input.patientPlanId,
            },
          },
          planAmmountPaying: input.planAmmountPaying,
          totalAmmount: input.totalAmmount,
        },
      });

      // lessen the product quantity
      invoice &&
        input.products.forEach(async (product) => {
          await prisma.product.update({
            where: { id: product.id },
            data: {
              quantity: product.oldQuantity - product.quantity,
            },
          });
        });

      // update plan ammount paid
      invoice &&
        (await prisma.patientTreatmentPlan.update({
          where: { id: input.patientPlanId },
          data: {
            ammountPaid: input.planPaidAmmount + input.planAmmountPaying,
          },
        }));
      return invoice.id;
    },
  });
