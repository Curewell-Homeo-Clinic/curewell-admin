import { z } from "zod";
import { deleteImages, generateImageUploadURL } from "../utils/s3";
import { createRouter } from "./context";

export const productRouter =createRouter()
  .query("getAll", {
    input: z.object({
      outOfStock: z.boolean().default(true),
    }),
    async resolve({ input, ctx }) {
      const removeOutOfStock = !input.outOfStock
        ? {
            not: {
              equals: 0,
            },
          }
        : {};

      return await ctx.prisma.product.findMany({
        where: {
          quantity: removeOutOfStock,
        },
        select: {
          name: true,
          quantity: true,
          id: true,
          createdAt: true,
          mRP: true,
          images: {
            select: {
              url: true,
            },
            take: 1,
            skip: 0,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    },
  })
  .query("get", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.product.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          name: true,
          quantity: true,
          createdAt: true,
          mRP: true,
          invoices: {
            select: {
              id: true,
            },
          },
          images: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });
    },
  })
  .mutation("getUploadSecureURL", {
    input: z.object({
      fileExt: z.string(),
    }),
    async resolve({ input }) {
      return await generateImageUploadURL("products", input.fileExt);
    },
  })
  .mutation("addImage", {
    input: z.object({
      url: z.string(),
      key: z.string(),
      productId: z.string().cuid(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.product.update({
        where: { id: input.productId },
        data: {
          images: {
            create: {
              url: input.url,
              objectKey: input.key,
            },
          },
        },
      });
    },
  })
  .mutation("deleteImages", {
    input: z.object({
      productId: z.string(),
      images: z.array(
        z.object({
          id: z.string().cuid(),
          key: z.string(),
        })
      ),
    }),
    async resolve({ input, ctx }) {
      const res = await deleteImages("products", [
        ...input.images.map((image) => image.key),
      ]);
      if (res.Deleted) {
        await ctx.prisma.product.update({
          where: { id: input.productId },
          data: {
            images: {
              deleteMany: res.Deleted.map((deletedObject) => ({
                objectKey: deletedObject.Key,
              })),
            },
          },
          select: { id: true },
        });

        return true;
      }

      return false;
    },
  })
  .mutation("create", {
    input: z.object({
      name: z.string(),
      mRP: z.number(),
      quantity: z.number(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.product.create({
        data: {
          name: input.name,
          mRP: input.mRP,
          quantity: input.quantity,
        },
        select: {
          id: true,
        },
      });
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.string().cuid(),
      name: z.string(),
      quantity: z.number(),
      mRP: z.number(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.product.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          quantity: input.quantity,
          mRP: input.mRP,
        },
      });
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ input, ctx }) {
      // delete the product
      (await ctx.prisma.product.delete({
        where: {
          id: input.id,
        },
      })) &&
        // TODO: delete the image stored on s3
        // delete the images associated
        (await ctx.prisma.image.deleteMany({
          where: {
            products: {
              every: {
                id: input.id,
              },
            },
          },
        }));

      return input.id;
    },
  });
