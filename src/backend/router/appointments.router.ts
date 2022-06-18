import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "../utils/prisma";

export const appointmentRouter = trpc
  .router()
  .query("get_all_appointments", {
    input: z.object({
      limit: z.number().optional(),
      offset: z.number().optional().default(0),
    }),
    async resolve({ input }) {
      return await prisma.appointment.findMany({
        skip: input.offset,
        take: input.limit,
        select: {
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
            },
          },
          id: true,
          timeStamp: true,
          visited: true,
        },
      });
    },
  })
  .query("get_appointment_by_id", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ input }) {
      return await prisma.appointment.findUnique({
        where: {
          id: input.id,
        },
        select: {
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
            },
          },
          id: true,
          timeStamp: true,
          visited: true,
        },
      });
    },
  });
