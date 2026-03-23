import { INITIAL_VALUE_KATEGORI, type TKategoriDocument } from "~/constants/kategori";
import { INITIAL_VALUE_KAS, type TKasCollection, type TKasDocument } from "~/constants/kas";

export const useKas = () => {
  const baseURL = `${import.meta.env.VITE_API_KAS_GEREJA}/kas`;

  const kasCollection = useState<TKasDocument[]>(
    "kasCollection",
    (): TKasDocument[] => []
  );
  const kasDocument = useState<TKasDocument>(
    "kasDocument",
    (): TKasDocument => ({ ...INITIAL_VALUE_KAS })
  );

  const listOptionKategori = computed(() => {
    return kasCollection.value.map(kategori => {
      return {
        title: kategori.nama,
        value: kategori.id
      }
    })
  })
  const isLoading = useState<boolean>("kasLoading", () => false);

  const getKasCollection = async () => {
    isLoading.value = true;
    try {
      kasCollection.value = await GET<TKasDocument[]>(baseURL, {});
    } catch (err) {
      console.log("[getKasCollection]", err);
    }
    isLoading.value = false;
  };

  const getKasDocument = async (id: number) => {
    isLoading.value = true;
    try {
      kasDocument.value = await GET<TKasDocument>(`${baseURL}/${id}`, {});
    } catch (err) {
      console.error("[getKasDocument]", err);
    }
    isLoading.value = false;
  };

  const insertKas = async (payload: Omit<TKategoriDocument, "id">) => {
    isLoading.value = true;
    try {
      await POST<{ data: TKategoriDocument }>(baseURL, payload);
      await getKasCollection();
    } catch (err) {
      console.error("[insertKas]", err);
    } finally {
      isLoading.value = false;
    }
  };

  // UPDATE
  const updateKas = async (id: number, payload: Partial<TKategoriDocument>) => {
    isLoading.value = true;
    try {
      await PATCH<{ data: TKategoriDocument }>(`${baseURL}/${id}`, payload);
      await getKasCollection();
    } catch (err) {
      console.error("[updateKas]", err);
    }
    isLoading.value = false;
  };

  // DELETE
  const deleteKas = async (id: number) => {
    isLoading.value = true;
    try {
      await DELETE(`${baseURL}/${id}`, {});
      await getKasCollection();
    } catch (err) {
      console.error("[deleteKategori]", err);
    }
    isLoading.value = false;
  };

  const resetKasDocument = () => {
    kasDocument.value = { ...INITIAL_VALUE_KATEGORI };
  };

  return {
    kasCollection,
    kasDocument,
    listOptionKategori,
    getKasCollection,
    getKasDocument,
    insertKas,
    updateKas,
    deleteKas,
    resetKasDocument
  };
};
