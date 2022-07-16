import { z } from "zod";
import { createRouter } from "./context";

export const appointmentRouter = createRouter()
  .query("getAll", {
    input: z.object({
      limit: z.number().optional(),
      offset: z.number().optional().default(0),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.appointment.findMany({
        skip: input.offset,
        take: input.limit,
        orderBy: {
          createdAt: "desc",
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
  .query("get", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.appointment.findUnique({
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
          progress: true,
        },
      });
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.string().cuid(),
      visited: z.boolean(),
      // cannot accept date object as it's converted to string before sending to the server in the json request
      date: z.string(),
      time: z.string(),
      progress: z.string(),
    }),
    async resolve({ input, ctx }) {
      const timeStamp = new Date(
        new Date(new Date(input.date).getDate()).setTime(
          new Date(input.time).getTime()
        )
      );

      return await ctx.prisma.appointment.update({
        where: {
          id: input.id,
        },
        data: {
          visited: input.visited,
          timeStamp: timeStamp,
          progress: input.progress,
        },
        select: {
          id: true,
        },
      });
    },
  })
  .mutation("create", {
    input: z.object({
      patientId: z.string().cuid(),
      doctorId: z.string().cuid(),
      date: z.string(),
      time: z.string(),
      visited: z.boolean().optional().default(false),
    }),
    async resolve({ input, ctx }) {
      const timeStamp = new Date(
        new Date(new Date(input.date).getDate()).setTime(
          new Date(input.time).getTime()
        )
      );

      return await ctx.prisma.appointment.create({
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
  })
  .mutation("delete", {
    input: z.object({ id: z.string().cuid() }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.appointment.delete({ where: { id: input.id } });
    },
  });
