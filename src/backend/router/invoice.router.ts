import * as trpc from "@trpc/server";
import { z } from "zod";
import { calculatePrice } from "../utils";
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
              mRP: true,
            },
          },
          productsDiscountPercentage: true,
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
          id: true,
          patient: {
            select: {
              firstName: true,
              lastName: true,
              id: true,
            },
          },
          doctor: {
            select: {
              firstName: true,
              lastName: true,
              id: true,
            },
          },
          plan: {
            select: {
              plan: {
                select: {
                  id: true,
                  price: true,
                  name: true,
                },
              },
              ammountPaid: true,
            },
          },
          consultationFee: true,
          products: true,
          productsDiscountPercentage: true,
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
      productDiscountPercentage: z.number(),
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
          productsDiscountPercentage: input.productDiscountPercentage,
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
  })
  .mutation("add_invoice_products", {
    input: z.object({
      id: z.string().cuid(),
      products: z
        .object({
          id: z.string().cuid(),
          mRP: z.number(),
        })
        .array(),
      productDiscountPercentage: z.number(),
    }),
    async resolve({ input }) {
      const totalProductAmmount = input.products
        .map((product) => product.mRP)
        .reduce((x, y) => x + y);
      const updatedInvoice = await prisma.invoice.update({
        where: { id: input.id },
        data: {
          products: {
            connect: input.products.map((product) => ({ id: product.id })),
          },
          totalAmmount: {
            increment: calculatePrice(
              totalProductAmmount,
              input.productDiscountPercentage
            ),
          },
        },
      });

      if (updatedInvoice) {
        // decrease quantity
        const updateProduct = await prisma.product.updateMany({
          where: {
            id: {
              in: input.products.map((product) => product.id),
            },
          },
          data: {
            quantity: {
              decrement: 1,
            },
          },
        });

        if (updateProduct) return true;

        return false;
      }

      return false;
    },
  })
  .mutation("remove_invoice_product", {
    input: z.object({
      id: z.string().cuid(),
      product: z.object({
        id: z.string().cuid(),
        mRP: z.number(),
      }),
      productDiscountPercentage: z.number(),
    }),
    async resolve({ input }) {
      const updatedInvoice = await prisma.invoice.update({
        where: { id: input.id },
        data: {
          products: {
            disconnect: [
              {
                id: input.product.id,
              },
            ],
          },
          totalAmmount: {
            decrement: calculatePrice(
              input.product.mRP,
              input.productDiscountPercentage
            ),
          },
        },
      });

      if (updatedInvoice) {
        // increase quantity
        const updatedProduct = await prisma.product.update({
          where: {
            id: input.product.id,
          },
          data: {
            quantity: {
              increment: 1,
            },
          },
        });

        if (updatedProduct) return true;

        return false;
      }

      return false;
    },
  })
  .mutation("update_invoice_productDiscountPercentage", {
    input: z.object({
      productDiscountPercentage: z.number(),
      id: z.string().cuid(),
    }),
    async resolve({ input }) {
      return await prisma.invoice.update({
        where: { id: input.id },
        data: {
          productsDiscountPercentage: input.productDiscountPercentage,
        },
      });
    },
  });
