import * as z from "zod";

export type TUserSession = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "bendahara" | "viewer";
};

export type TLogin = {
  message: string;
  token: string;
  user: TUserSession;
};

export const schemaLogin = z.object({
  email: z
    .email("Format email tidak valid"),
  password: z
    .string("Password wajib diisi" )
    .min(6, "Password minimal 6 karakter"),
});

export type TSchemaLogin = z.output<typeof schemaLogin>;
