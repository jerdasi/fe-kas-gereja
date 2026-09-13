import type {
  TTransaksiDocument,
  TTransaksiCollection,
  TTransaksiCreatePayload,
  TTransaksiUpdatePayload,
  TTransaksiResponse,
  TTransaksiDeleteResponse,
} from "~/types/transaksi";
import { GET, POST, PATCH, DELETE } from "~/composables/fetch";

export const useTransaksi = () => {
  /**
   * Kas ID yang sedang aktif.
   * Endpoint API transaksi sangat bergantung pada kas ID:
   *   GET/POST/PUT/DELETE /kas/{kas}/transaksi
   *
   * Cara penggunaan:
   *   - Dari halaman detail kas, set kasId lewat setKasId()
   *   - Atau dari dashboard, pilih kas dulu sebelum buka form transaksi
   */
  const kasId = ref<number | null>(null);

  /**
   * Base URL dinamis — bergantung kasId.
   * Kalau kasId null, URL kosong dan operasi akan gagal dengan error di console.
   */
  const baseURL = computed(() => {
    const id = kasId.value;
    if (id === null || id === undefined) return "";
    return `${import.meta.env.VITE_API_KAS_GEREJA}/kas/${id}/transaksi`;
  });

  const transaksiCollection = ref<TTransaksiCollection>([]);
  const transaksiDocument = ref<TTransaksiDocument | null>(null);
  const isLoading = ref<boolean>(false);

  // ── Helper: set kas ID ───────────────────────────────────────────────────

  const setKasId = (id: number | null) => {
    kasId.value = id;
    transaksiDocument.value = null;
    transaksiCollection.value = [];
  };

  // ── Collection ───────────────────────────────────────────────────────────

  const getTransaksiCollection = async (
    query?: Record<string, unknown>
  ) => {
    const url = baseURL.value;
    if (!url) {
      console.error("[getTransaksiCollection] kasId belum di-set");
      return;
    }

    isLoading.value = true;
    try {
      transaksiCollection.value = await GET<TTransaksiCollection>(url, query);
    } catch (err) {
      console.error("[getTransaksiCollection]", err);
    } finally {
      isLoading.value = false;
    }
  };

  // ── All transaksi (bukan per-kas, khusus tampilan gabungan) ─────────────

  const getAllTransaksi = async (
    query?: Record<string, unknown>
  ) => {
    const url = `${import.meta.env.VITE_API_KAS_GEREJA}/transaksi`;
    isLoading.value = true;
    try {
      transaksiCollection.value = await GET<TTransaksiCollection>(url, query);
    } catch (err) {
      console.error("[getAllTransaksi]", err);
    } finally {
      isLoading.value = false;
    }
  };

  // ── Fetch transaksi beberapa kas sekaligus ───────────────────────────────

  interface IKasTransaksiOptions {
    kasIds: number[];
    query?: Record<string, unknown>;
  }

  const getTransaksiForKasIds = async (
    options: IKasTransaksiOptions
  ) => {
    const { kasIds, query } = options;
    if (kasIds.length === 0) {
      transaksiCollection.value = [];
      return;
    }

    isLoading.value = true;
    try {
      const results = await Promise.all(
        kasIds.map(async (kasId) => {
          const url = `${import.meta.env.VITE_API_KAS_GEREJA}/kas/${kasId}/transaksi`;
          return GET<TTransaksiCollection>(url, query);
        })
      );
      transaksiCollection.value = results.flat();
    } catch (err) {
      console.error("[getTransaksiForKasIds]", err);
    } finally {
      isLoading.value = false;
    }
  };

  // ── Document (single) ────────────────────────────────────────────────────

  const getTransaksiDocument = async (id: number) => {
    const url = baseURL.value;
    if (!url) {
      console.error("[getTransaksiDocument] kasId belum di-set");
      return;
    }

    isLoading.value = true;
    try {
      const response = await GET<{ data: TTransaksiDocument }>(
        `${url}/${id}`,
        {}
      );
      transaksiDocument.value = response.data;
    } catch (err) {
      console.error("[getTransaksiDocument]", err);
      transaksiDocument.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Create ───────────────────────────────────────────────────────────────

  const insertTransaksi = async (payload: TTransaksiCreatePayload) => {
    const url = baseURL.value;
    if (!url) {
      console.error("[insertTransaksi] kasId belum di-set");
      return;
    }

    isLoading.value = true;
    try {
      const response = await POST<TTransaksiResponse>(url, payload);
      await getTransaksiCollection();
      return response;
    } catch (err) {
      console.error("[insertTransaksi]", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Update ───────────────────────────────────────────────────────────────

  const updateTransaksi = async (
    id: number,
    payload: TTransaksiUpdatePayload
  ) => {
    const url = baseURL.value;
    if (!url) {
      console.error("[updateTransaksi] kasId belum di-set");
      return;
    }

    isLoading.value = true;
    try {
      const response = await PATCH<TTransaksiResponse>(`${url}/${id}`, payload);
      await getTransaksiCollection();
      return response;
    } catch (err) {
      console.error("[updateTransaksi]", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────

  const deleteTransaksi = async (id: number) => {
    const url = baseURL.value;
    if (!url) {
      console.error("[deleteTransaksi] kasId belum di-set");
      return;
    }

    isLoading.value = true;
    try {
      await DELETE<TTransaksiDeleteResponse>(`${url}/${id}`, {});
      await getTransaksiCollection();
    } catch (err) {
      console.error("[deleteTransaksi]", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Reset ────────────────────────────────────────────────────────────────

  const resetTransaksiDocument = () => {
    transaksiDocument.value = null;
  };

  return {
    kasId,
    setKasId,
    transaksiCollection,
    transaksiDocument,
    isLoading,
    getTransaksiCollection,
    getAllTransaksi,
    getTransaksiForKasIds,
    getTransaksiDocument,
    insertTransaksi,
    updateTransaksi,
    deleteTransaksi,
    resetTransaksiDocument,
  };
};
