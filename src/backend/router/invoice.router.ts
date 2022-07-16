import { z } from "zod";
import { calculatePrice } from "../utils";
import { createRouter } from "./context";

export const invoiceRouter = createRouter()
  .query("getAll", {
    async resolve({ctx}) {
      return ctx.prisma.invoice.findMany({
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
  .query("get", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.invoice.findUnique({
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
  .mutation("create", {
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
    async resolve({ input, ctx }) {
      // create the invoice
      const invoice = await ctx.prisma.invoice.create({
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
          await ctx.prisma.product.update({
            where: { id: product.id },
            data: {
              quantity: product.oldQuantity - product.quantity,
            },
          });
        });

      // update plan ammount paid
      invoice &&
        (await ctx.prisma.patientTreatmentPlan.update({
          where: { id: input.patientPlanId },
          data: {
            ammountPaid: input.planPaidAmmount + input.planAmmountPaying,
          },
        }));
      return invoice.id;
    },
  })
  .mutation("addProducts", {
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
    async resolve({ input, ctx }) {
      const totalProductAmmount = input.products
        .map((product) => product.mRP)
        .reduce((x, y) => x + y);
      const updatedInvoice = await ctx.prisma.invoice.update({
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
        const updateProduct = await ctx.prisma.product.updateMany({
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
  .mutation("removeProduct", {
    input: z.object({
      id: z.string().cuid(),
      product: z.object({
        id: z.string().cuid(),
        mRP: z.number(),
      }),
      productDiscountPercentage: z.number(),
    }),
    async resolve({ input, ctx }) {
      const updatedInvoice = await ctx.prisma.invoice.update({
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
        const updatedProduct = await ctx.prisma.product.update({
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
  .mutation("updateProductDiscountPercentage", {
    input: z.object({
      productDiscountPercentage: z.number(),
      id: z.string().cuid(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.invoice.update({
        where: { id: input.id },
        data: {
          productsDiscountPercentage: input.productDiscountPercentage,
        },
      });
    },
  });
