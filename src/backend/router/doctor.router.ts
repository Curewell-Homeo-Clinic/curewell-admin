import * as trpc from "@trpc/server";
import { prisma } from "../utils/prisma";

export const doctorRouter = trpc.router().query("get_all_doctors", {
  async resolve() {
    return await prisma.doctor.findMany({
      select: { id: true, firstName: true, lastName: true },
    });
  },
});
