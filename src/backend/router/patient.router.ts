import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "../utils/prisma";

export const patientRouter = trpc
  .router()
  .query("get_all_patients", {
    async resolve() {
      return await prisma.patient.findMany({});
    },
  })
  .query("get_patient_by_id", {
    input: z.object({
      id: z.string(),
    }),
    resolve({ input }) {
      return prisma.patient.findUnique({ where: { id: input.id } });
    },
  })
  .mutation("create_patient", {
    input: z.object({
      admittedAt: z.optional(z.date()),
      firstName: z.string(),
      lastName: z.string(),
      dob: z.date(),
      email: z.string(),
      phone: z.string(),
      address: z.string(),
      occupation: z.string(),
      // pass id for already created ailment and name for new ones
      ailments: z.array(z.object({ id: z.string(), name: z.string() })),
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
