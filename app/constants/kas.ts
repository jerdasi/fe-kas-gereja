import * as z from "zod";

export type TKasDocument = {
  id: number;
  nama: string;
  kode: string;
  deskripsi: string;
  status: boolean;
  pic: string;
  saldo: number;
};

export type TRequestKas = {
  nama: string | undefined;
  kode: string | undefined;
  deskripsi: string | undefined;
  id_pic: number | undefined;
}

export type TKasCollection = TKasDocument[];

export const INITIAL_VALUE_KAS = {
  nama: undefined,
  kode: undefined,
  deskripsi: undefined,
  id_pic: undefined
}

// export const schemaLogin = z.object({
//   email: z
//     .email("Format email tidak valid"),
//   password: z
//     .string("Password wajib diisi" )
//     .min(6, "Password minimal 6 karakter"),
// });
//
// export type TSchemaLogin = z.output<typeof schemaLogin>;
