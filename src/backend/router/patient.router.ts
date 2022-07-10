import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "../utils/prisma";
import { deleteImages, generateImageUploadURL } from "../utils/s3";

export const patientRouter = trpc
  .router()
  .query("get_all_patients", {
    input: z
      .object({
        limit: z.number().optional(),
        offset: z.number().optional().default(0),
      })
      .nullish(),
    async resolve({ input }) {
      return await prisma.patient.findMany({
        skip: input?.offset,
        take: input?.limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          admittedAt: true,
          phone: true,
          ailments: true,
          age: true,
          treatmentPlans: {
            select: {
              id: true,
              ammountPaid: true,
              plan: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
        where: { isDeleted: false },
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
          isDeleted: false,
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
        select: {
          firstName: true,
          lastName: true,
          phone: true,
          email: true,
          address: true,
          occupation: true,
          ailments: true,
          age: true,
          id: true,
          caseStudy: true,
          prescription: true,
          admittedAt: true,
          treatmentPlans: true,
          appointments: {
            select: {
              timeStamp: true,
              progress: true,
              id: true,
              visited: true,
            },
          },
          beforeTreatmentImages: true,
          afterTreatmentImages: true,
          testReportsImages: true,
        },
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
      id: z.string().cuid(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
      occupation: z.string().optional(),
      address: z.string().optional(),
      ailments: z.string().optional(),
      age: z.number().optional(),
    }),
    async resolve({ input: patient }) {
      return (await prisma.patient.update({
        where: { id: patient.id },
        data: {
          firstName: patient.firstName,
          lastName: patient.lastName,
          phone: patient.phone,
          email: patient.email,
          occupation: patient.occupation,
          ailments: patient.ailments,
          address: patient.address,
          age: patient.age,
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
    async resolve({ input }) {
      return (await prisma.patient.update({
        where: { id: input.id },
        data: { isDeleted: true },
      }))
        ? true
        : false;
    },
  })
  .mutation("create_patient", {
    input: z.object({
      admittedAt: z.date().optional(),
      firstName: z.string(),
      lastName: z.string(),
      age: z.number(),
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
          email: patient.email,
          age: patient.age,
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
  })
  .mutation("add_treatment_plan", {
    input: z.object({
      planId: z.string().cuid(),
      patientId: z.string().cuid(),
    }),
    async resolve({ input }) {
      return await prisma.patient.update({
        where: { id: input.patientId },
        data: {
          treatmentPlans: {
            create: {
              plan: {
                connect: {
                  id: input.planId,
                },
              },
            },
          },
        },
      });
    },
  })
  .mutation("remove_treatment_plan", {
    input: z.object({
      patientPlanId: z.string().cuid(),
      patientId: z.string().cuid(),
    }),
    async resolve({ input }) {
      return await prisma.patient.update({
        where: { id: input.patientId },
        data: {
          treatmentPlans: {
            delete: {
              id: input.patientPlanId,
            },
          },
        },
      });
    },
  })
  // using a mutation to mutate whenever we want and multiple times
  .mutation("get_patient_upload_secure_url", {
    input: z.object({
      fileExt: z.string(),
    }),
    async resolve({ input }) {
      return await generateImageUploadURL("patients", input.fileExt);
    },
  })
  .mutation("add_patient_image_by_id", {
    input: z.object({
      url: z.string(),
      key: z.string(),
      patientId: z.string().cuid(),
      category: z.enum(["before", "after", "report"]),
    }),
    async resolve({ input }) {
      const imageCreateField =
        input.category === "before"
          ? "beforeTreatmentImages"
          : input.category === "after"
          ? "afterTreatmentImages"
          : "testReportsImages";
      return await prisma.patient.update({
        where: { id: input.patientId },
        data: {
          [imageCreateField]: {
            create: {
              url: input.url,
              objectKey: input.key,
            },
          },
        },
      });
    },
  })
  .mutation("delete_patient_image_by_id", {
    input: z.object({
      patientId: z.string(),
      image: z.object({
        id: z.string().cuid(),
        objectKey: z.string(),
      }),
      category: z.enum(["before", "after", "report"]),
    }),
    async resolve({ input }) {
      const res = await deleteImages("patients", [input.image.objectKey]);

      if (res.Deleted) {
        await prisma.patient.update({
          where: { id: input.patientId },
          data: {
            [input.category === "before"
              ? "beforeTreatmentImages"
              : input.category === "after"
              ? "afterTreatmentImages"
              : "testReportsImages"]: {
              deleteMany: res.Deleted.map((deletedObject) => ({
                objectKey: deletedObject.Key,
              })),
            },
          },
        });

        return true;
      }

      return false;
    },
  });
