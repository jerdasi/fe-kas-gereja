import type { TKategoriDocument } from "~/types/kategori";

export type TKategoriRelation = Pick<
  TKategoriDocument,
  "id" | "nama" | "tipe" | "deskripsi"
>;

export type TTransaksiDocument = {
  id: number;
  id_kas: number;
  id_kategori: number;
  tanggal: string; // YYYY-MM-DD
  jumlah: number;
  keterangan: string | null;
  created_at: string;
  updated_at: string;
  kategori: TKategoriRelation;
  kas?: {
    id: number;
    nama: string;
  };
  nama_kas?: string;
};

export type TTransaksiCollection = TTransaksiDocument[];

export type TTransaksiCreatePayload = {
  id_kategori: number;
  tanggal: string;
  jumlah: number;
  keterangan?: string | null;
};

export type TTransaksiUpdatePayload = Partial<TTransaksiCreatePayload>;

export type TTransaksiResponse = {
  message: string;
  transaksi: TTransaksiDocument;
};

export type TTransaksiDeleteResponse = {
  message: string;
};
