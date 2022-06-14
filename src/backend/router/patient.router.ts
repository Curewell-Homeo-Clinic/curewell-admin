import * as trpc from "@trpc/server";
import { resolve } from "path";
import { z } from "zod";
import { prisma } from "../utils/prisma";

export const patientRouter = trpc
  .router()
  .query("get_all_patients", {
    async resolve() {
      return await prisma.patient.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          admittedAt: true,
          phone: true,
          ailments: true,
        },
      });
    },
  })
  .query("get_patients_limit_and_offset", {
    input: z.object({
      limit: z.number().default(10),
      offset: z.number().default(0),
    }),
    async resolve({ input }) {
      const { limit, offset } = input;
      return await prisma.patient.findMany({
        skip: offset,
        take: limit,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          admittedAt: true,
          phone: true,
          ailments: true,
        },
      });
    },
  })
  .query("get_patients_by_name", {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ input }) {
      return await prisma.patient.findMany({
        where: {
          OR: [
            { firstName: { contains: input.name } },
            { lastName: { contains: input.name } },
          ],
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          admittedAt: true,
          phone: true,
          ailments: true,
        },
        take: 10,
      });
    },
  })
  .query("get_patient_by_id", {
    input: z.object({
      id: z.string().cuid(),
    }),
    resolve({ input }) {
      return prisma.patient.findUnique({ where: { id: input.id } });
    },
  })
  .mutation("delete_patient", {
    input: z.object({
      id: z.string().cuid(),
    }),
    resolve() {},
  })
  .mutation("create_patient", {
    input: z.object({
      admittedAt: z.optional(z.date()),
      firstName: z.string(),
      lastName: z.string(),
      dob: z.date(),
      email: z.string().email(),
      phone: z
        .string()
        .length(10, {
          message: "Phone number should be 10 characters",
        })
        .refine((val) => parseInt(val), {
          message: "Invalid Phone number!",
        }),
      address: z.string(),
      occupation: z.string(),
      // pass id for already created ailment and name for new ones
      ailments: z.object({ id: z.string(), name: z.string() }).array(),
    }),
    async resolve({ input: patient }) {
      return await prisma.patient.create({
        data: {
          admittedAt: patient.admittedAt,
          firstName: patient.firstName,
          lastName: patient.lastName,
          dob: patient.dob,
          email: patient.email,
          phone: patient.phone,
          address: patient.address,
          occupation: patient.occupation,
          ailments: {
            connect: patient.ailments
              .filter((ailment) => ailment.id)
              .map(({ id }) => ({ id })),
            create: patient.ailments
              .filter(({ name }) => name)
              .map(({ name }) => ({ name })),
          },
        },
        select: {
          id: true,
        },
      });
    },
  });
