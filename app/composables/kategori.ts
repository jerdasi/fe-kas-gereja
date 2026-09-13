import type {
  TKategoriCollection,
  TKategoriDocument,
  TKategoriCreatePayload,
  TKategoriUpdatePayload,
  TKategoriResponse,
} from "~/types/kategori";
import { computed } from "vue";
import { GET, POST, PATCH, DELETE } from "~/composables/fetch";

export const useKategori = () => {
  const baseURL = `${import.meta.env.VITE_API_KAS_GEREJA}/kategori`;

  const kategoriCollection = useState<TKategoriCollection>(
    "kategoriCollection",
    () => []
  );

  const kategoriDocument = useState<TKategoriDocument | null>(
    "kategoriDocument",
    () => null
  );

  const isLoading = useState<boolean>("kategoriLoading", () => false);

  // ── Collection ───────────────────────────────────────────────────────────

  const getKategoriCollection = async () => {
    isLoading.value = true;
    try {
      kategoriCollection.value = await GET<TKategoriCollection>(
        baseURL,
        {}
      );
    } catch (err) {
      console.error("[getKategoriCollection]", err);
    } finally {
      isLoading.value = false;
    }
  };

  // ── Document (single) ────────────────────────────────────────────────────

  const getKategoriDocument = async (id: number) => {
    isLoading.value = true;
    try {
      const response = await GET<{ data: TKategoriDocument }>(
        `${baseURL}/${id}`,
        {}
      );
      kategoriDocument.value = response.data;
    } catch (err) {
      console.error("[getKategoriDocument]", err);
      kategoriDocument.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Create ───────────────────────────────────────────────────────────────

  const insertKategori = async (payload: TKategoriCreatePayload) => {
    isLoading.value = true;
    try {
      const response = await POST<TKategoriResponse>(baseURL, payload);
      await getKategoriCollection();
      return response;
    } catch (err) {
      console.error("[insertKategori]", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Update ───────────────────────────────────────────────────────────────

  const updateKategori = async (
    id: number,
    payload: TKategoriUpdatePayload
  ) => {
    isLoading.value = true;
    try {
      const response = await PATCH<TKategoriResponse>(
        `${baseURL}/${id}`,
        payload
      );
      await getKategoriCollection();
      return response;
    } catch (err) {
      console.error("[updateKategori]", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────

  const deleteKategori = async (id: number) => {
    isLoading.value = true;
    try {
      await DELETE(`${baseURL}/${id}`, {});
      await getKategoriCollection();
    } catch (err) {
      console.error("[deleteKategori]", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Reset ────────────────────────────────────────────────────────────────

  const resetKategoriDocument = () => {
    kategoriDocument.value = null;
  };

  return {
    kategoriCollection,
    kategoriDocument,
    isLoading,
    getKategoriCollection,
    getKategoriDocument,
    insertKategori,
    updateKategori,
    deleteKategori,
    resetKategoriDocument,
    listOptionKategori: computed(() =>
      kategoriCollection.value.map((k) => ({
        title: k.nama,
        value: k.id,
      }))
    ),
  };
};
