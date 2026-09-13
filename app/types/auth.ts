import * as z from "zod";

export type TRole = "admin" | "bendahara" | "viewer";

export type TUserSession = {
  id: number;
  name: string;
  email: string;
  role: TRole;
};

export const schemaRequestLogin = z.object({
  email: z
    .string({ required_error: "Email wajib diisi" })
    .email("Format email tidak valid"),
  password: z
    .string({ required_error: "Password wajib diisi" })
    .min(6, "Password minimal 6 karakter"),
});

export type TRequestLogin = z.output<typeof schemaRequestLogin>;

export type TResponseLogin = {
  message: string;
  token: string;
  user: TUserSession;
};

export type TResponseLogout = {
  message: string;
};
