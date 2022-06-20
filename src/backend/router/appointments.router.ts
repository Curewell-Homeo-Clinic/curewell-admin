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
  })
  .mutation("update_appointment", {
    input: z.object({
      id: z.string().cuid(),
      visited: z.boolean(),
      // cannot accept date object as it's converted to string before sending to the server in the json request
      date: z.string(),
      time: z.string(),
    }),
    async resolve({ input }) {
      const timeStamp = new Date(
        new Date(new Date(input.date).getDate()).setTime(
          new Date(input.time).getTime()
        )
      );

      return await prisma.appointment.update({
        where: {
          id: input.id,
        },
        data: {
          visited: input.visited,
          timeStamp: timeStamp,
        },
        select: {
          id: true,
        },
      });
    },
  })
  .mutation("create_appointment", {
    input: z.object({
      patientId: z.string().cuid(),
      doctorId: z.string().cuid(),
      date: z.string(),
      time: z.string(),
      visited: z.boolean().optional().default(false),
    }),
    async resolve({ input }) {
      const timeStamp = new Date(
        new Date(new Date(input.date).getDate()).setTime(
          new Date(input.time).getTime()
        )
      );

      return await prisma.appointment.create({
        data: {
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
          timeStamp: timeStamp,
          visited: input.visited,
        },
      });
    },
  });
