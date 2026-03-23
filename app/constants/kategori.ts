import * as z from "zod";

export type TKategoriDocument = {
  id: number | undefined;
  nama: string | undefined;
  tipe: 'pemasukan' | 'pengeluaran' | undefined;
  deskripsi: string | undefined;
};

export type TKategoriCollection = TKategoriDocument[];

export const INITIAL_VALUE_KATEGORI = {
  id: undefined,
  nama: undefined,
  tipe: undefined,
  deskripsi: undefined,
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
