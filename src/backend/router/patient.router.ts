import * as trpc from "@trpc/server";

export const patientRouter = trpc.router().query("get_all_patients", {
  resolve() {
    return "all patients";
  },
});
