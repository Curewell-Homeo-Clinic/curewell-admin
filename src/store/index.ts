import { atom } from "recoil";

export const STATES = {
  isAdmin: atom<boolean>({
    key: "isAdmin",
    default: false,
  }),
};
