import { createRouter } from "./context";

export const clinicRouter = createRouter().query("getAll", {
  async resolve({ ctx }) {
    return ctx.prisma.clinic.findMany({
      select: {
        id: true,
        number: true,
        name: true,
      },
    });
  },
});
