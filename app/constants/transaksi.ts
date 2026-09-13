import * as z from "zod";

export type TKategoriDocument = {
  id: number | undefined;
  nama: string | undefined;
  tipe: 'pemasukan' | 'pengeluaran' | undefined;
  deskripsi: string | undefined;
};

export type TKategoriCollection = TKategoriDocument[];

export const INITIAL_VALUE_TRANSAKSI = {
  id_kategori: undefined,
  tanggal: undefined,
  jumlah: undefined,
  keterangan: undefined
}

export const schemaInsertUpdateTransaksi = z.object({
  id_kategori: z.number("Kategori Wajib Dipilih"),
  tanggal: z.iso.date('Format tanggal tidak valid'),
  jumlah: z
    .number('Jumlah wajib diisi')
    .int('Jumlah harus bilangan bulat')
    .min(1, 'Jumlah minimal 1'),
  keterangan: z.string().max(255, 'Maks 255 karakter').optional(),
})

export type TSchemaInsertUpdateTransaksi = z.output<typeof schemaInsertUpdateTransaksi>;
