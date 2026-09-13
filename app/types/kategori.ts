import * as z from "zod";

export const type TPemasukanAtauPengeluaran = "pemasukan" | "pengeluaran";

export type TKategoriDocument = {
  id: number;
  nama: string;
  tipe: TPemasukanAtauPengeluaran;
  deskripsi: string | null;
  created_at: string;
  updated_at: string;
};

export type TKategoriCollection = TKategoriDocument[];

export const schemaRequestInsertKategori = z.object({
  nama: z
    .string({ required_error: "Nama kategori wajib diisi" })
    .min(1, "Nama kategori tidak boleh kosong"),
  tipe: z.enum(["pemasukan", "pengeluaran"], {
    required_error: "Tipe kategori wajib diisi",
  }),
  deskripsi: z.string().max(255).optional().nullable(),
});

export type TRequestInsertKategori = z.output<typeof schemaRequestInsertKategori>;

export const schemaRequestUpdateKategori = z.object({
  nama: z
    .string({ required_error: "Nama kategori wajib diisi" })
    .min(1, "Nama kategori tidak boleh kosong")
    .optional(),
  tipe: z
    .enum(["pemasukan", "pengeluaran"], {
      required_error: "Tipe kategori wajib diisi",
    })
    .optional(),
  deskripsi: z.string().max(255).optional().nullable(),
});

export type TRequestUpdateKategori = z.output<typeof schemaRequestUpdateKategori>;

export type TResponseKategori = {
  message: string;
  kategori: TKategoriDocument;
};

export type TResponseDeleteKategori = {
  message: string;
};
