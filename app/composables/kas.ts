import type {
  TKasCollection,
  TKasDocument,
  TKasCreatePayload,
  TKasUpdatePayload,
  TKasResponse,
  TKasDeleteResponse
} from "~/types/kas";
import { GET, POST, PATCH, DELETE } from "~/composables/fetch";

export const useKas = () => {
  const baseURL = `${import.meta.env.VITE_API_KAS_GEREJA}/kas`;

  const kasCollection = useState<TKasCollection>("kasCollection", () => []);
  const kasDocument = useState<TKasDocument | null>("kasDocument", () => null);

  const isLoading = useState<boolean>("kasLoading", () => false);

  const getKasCollection = async () => {
    isLoading.value = true;
    try {
      kasCollection.value = await GET<TKasCollection>(baseURL, {});
    } catch (err) {
      console.error("[getKasCollection]", err);
    }
    isLoading.value = false;
  };

  const getKasDocument = async (id: number) => {
    isLoading.value = true;
    try {
      kasDocument.value = await GET<TKasDocument>(`${baseURL}/${id}`, {});
    } catch (err) {
      console.error("[getKasDocument]", err);
      kasDocument.value = null;
    }
    isLoading.value = false;
  };

  const insertKas = async (payload: TKasCreatePayload) => {
    isLoading.value = true;
    try {
      const response = await POST<TKasResponse>(baseURL, payload);
      await getKasCollection();
    } catch (err) {
      console.error("[insertKas]", err);
      throw err;
    }
    isLoading.value = false;
  };

  // ── Update ──────────────────────────────────────────────────────────────

  const updateKas = async (id: number, payload: TKasUpdatePayload) => {
    isLoading.value = true;
    try {
      const response = await PATCH<TKasResponse>(`${baseURL}/${id}`, payload);
      await getKasCollection();
      return response;
    } catch (err) {
      console.error("[updateKas]", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────

  const deleteKas = async (id: number) => {
    isLoading.value = true;
    try {
      await DELETE<TKasDeleteResponse>(`${baseURL}/${id}`, {});
      await getKasCollection();
    } catch (err) {
      console.error("[deleteKas]", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // ── Reset ───────────────────────────────────────────────────────────────

  const resetKasDocument = () => {
    kasDocument.value = null;
  };

  return {
    kasCollection,
    kasDocument,
    isLoading,
    getKasCollection,
    getKasDocument,
    insertKas,
    updateKas,
    deleteKas,
    resetKasDocument
  };
};
