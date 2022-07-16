import {createRouter} from "./context";

export const doctorRouter = createRouter().query("getAll", {
  async resolve({ctx}) {
    return await ctx.prisma.doctor.findMany({
      select: { id: true, firstName: true, lastName: true },
    });
  },
});
