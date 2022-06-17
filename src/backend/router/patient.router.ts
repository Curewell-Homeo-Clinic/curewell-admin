import * as trpc from "@trpc/server";
import { z, ZodString } from "zod";
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
  // unused
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
      return prisma.patient.findUnique({
        where: { id: input.id },
      });
    },
  })
  .mutation("update_case_study_and_prescription", {
    input: z.object({
      id: z.string(),
      caseStudy: z.string().optional(),
      prescription: z.string().optional(),
    }),
    async resolve({ input }) {
      const res = await prisma.patient.update({
        where: { id: input.id },
        data: {
          caseStudy: input.caseStudy,
          prescription: input.prescription,
        },
      });

      if (res) return true;

      return false;
    },
  })
  .mutation("update_patient_personal_info", {
    input: z.object({
      id: z.string(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
      occupation: z.string().optional(),
      address: z.string().optional(),
      ailments: z.string().optional(),
    }),
    async resolve({ input }) {
      return (await prisma.patient.update({
        where: { id: input.id },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          email: input.email,
          occupation: input.occupation,
          ailments: input.ailments,
          address: input.address,
        },
      }))
        ? true
        : false;
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
      admittedAt: z.date().optional(),
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
      ailments: z.string(),
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
          ailments: patient.ailments,
        },
        select: {
          id: true,
        },
      });
    },
  });
