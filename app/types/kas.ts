export type TKasDocument = {
  id: number;
  nama: string;
  kode: string;
  deskripsi: string | null;
  status: boolean;
  pic: string | null;
  id_pic: number | null;
  saldo: number;
};

export type TKasCollection = TKasDocument[];

export type TKasCreatePayload = {
  nama: string;
  kode: string;
  deskripsi?: string | null;
  id_pic?: number | null;
};

export type TKasUpdatePayload = Partial<TKasCreatePayload> & {
  status?: boolean;
};

export type TKasResponse = {
  message: string;
  kas: TKasDocument;
};

export type TKasDeleteResponse = {
  message: string;
};
