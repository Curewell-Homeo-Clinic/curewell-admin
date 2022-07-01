import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "../utils/prisma";
import { generateProductImageUploadURL } from "../utils/s3";

export const productRouter = trpc
  .router()
  .query("get_all_products", {
    input: z.object({
      outOfStock: z.boolean().default(true),
    }),
    async resolve({ input }) {
      const removeOutOfStock = !input.outOfStock
        ? {
            not: {
              equals: 0,
            },
          }
        : {};
      return await prisma.product.findMany({
        where: {
          quantity: removeOutOfStock,
        },
        select: {
          name: true,
          quantity: true,
          price: true,
          id: true,
          createdAt: true,
          mRP: true,
          discountPercentage: true,
          images: {
            select: {
              url: true,
            },
            take: 1,
            skip: 0,
          },
        },
      });
    },
  })
  .query("get_product_by_id", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      return await prisma.product.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          name: true,
          price: true,
          quantity: true,
          createdAt: true,
          images: {
            select: {
              id: true,
              url: true,
              createdAt: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });
    },
  })
  .mutation("get_product_upload_secure_url", {
    async resolve() {
      return await generateProductImageUploadURL();
    },
  })
  .mutation("add_product_image_by_id", {
    input: z.object({
      url: z.string(),
      productId: z.string().cuid(),
    }),
    async resolve({ input }) {
      return await prisma.product.update({
        where: { id: input.productId },
        data: {
          images: {
            create: {
              url: input.url,
            },
          },
        },
      });
    },
  });
