import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "../utils/prisma";
import { deleteImages, generateImageUploadURL } from "../utils/s3";

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
  .mutation("get_product_upload_secure_url", {
    async resolve() {
      return await generateImageUploadURL("products");
    },
  })
  .mutation("add_product_image_by_id", {
    input: z.object({
      url: z.string(),
      key: z.string(),
      productId: z.string().cuid(),
    }),
    async resolve({ input }) {
      return await prisma.product.update({
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
  .mutation("delete_product_images_by_id", {
    input: z.object({
      productId: z.string(),
      images: z.array(
        z.object({
          id: z.string().cuid(),
          key: z.string(),
        })
      ),
    }),
    async resolve({ input }) {
      const res = await deleteImages("products", [
        ...input.images.map((image) => image.key),
      ]);
      if (res.Deleted) {
        await prisma.product.update({
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
  .mutation("create_product", {
    input: z.object({
      name: z.string(),
      mRP: z.number(),
      quantity: z.number(),
    }),
    async resolve({ input }) {
      return await prisma.product.create({
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
  .mutation("update_product_by_id", {
    input: z.object({
      id: z.string().cuid(),
      name: z.string(),
      quantity: z.number(),
      mRP: z.number(),
    }),
    async resolve({ input }) {
      return await prisma.product.update({
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
  .mutation("delete_product", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ input }) {
      // delete the product
      (await prisma.product.delete({
        where: {
          id: input.id,
        },
      })) &&
        // TODO: delete the image stored on s3
        // delete the images associated
        (await prisma.image.deleteMany({
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
