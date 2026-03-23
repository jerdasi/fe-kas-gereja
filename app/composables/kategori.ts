import { INITIAL_VALUE_KATEGORI, type TKategoriDocument } from "~/constants/kategori";

export const useKategori = () => {
  const baseURL = `${import.meta.env.VITE_API_KAS_GEREJA}/kategori`;

  const kategoriCollection = useState<TKategoriDocument[]>(
    "kategoriCollection",
    (): TKategoriDocument[] => []
  );
  const kategoriDocument = useState<TKategoriDocument>(
    "kategoriDocument",
    (): TKategoriDocument => ({ ...INITIAL_VALUE_KATEGORI })
  );

  const listOptionKategori = computed(() => {
    return kategoriCollection.value.map(kategori => {
      return {
        title: kategori.nama,
        value: kategori.id
      }
    })
  })
  const isLoading = useState<boolean>("kategoriLoading", () => false);

  const getKategoriCollection = async () => {
    isLoading.value = true;
    try {
      kategoriCollection.value = await GET<TKategoriDocument[]>(baseURL, {});
    } catch (err) {
      console.log("[getKategoriCollection]", err);
    }
    isLoading.value = false;
  };

  const getKategoriDocument = async (id: number) => {
    isLoading.value = true;
    try {
      const response = await GET<{ data: TKategoriDocument }>(`${baseURL}/${id}`, {});
      kategoriDocument.value = response.data;
    } catch (err) {
      console.error("[getKategoriDocument]", err);
    }
    isLoading.value = false;
  };

  const insertKategori = async (payload: Omit<TKategoriDocument, "id">) => {
    isLoading.value = true;
    try {
      await POST<{ data: TKategoriDocument }>(baseURL, payload);
      await getKategoriCollection();
    } catch (err) {
      console.error("[insertKategori]", err);
    } finally {
      isLoading.value = false;
    }
  };

  // UPDATE
  const updateKategori = async (id: number, payload: Partial<TKategoriDocument>) => {
    isLoading.value = true;
    try {
      await PATCH<{ data: TKategoriDocument }>(`${baseURL}/${id}`, payload);
      await getKategoriCollection();
    } catch (err) {
      console.error("[updateKategori]", err);
    }
    isLoading.value = false;
  };

  // DELETE
  const deleteKategori = async (id: number) => {
    isLoading.value = true;
    try {
      await DELETE(`${baseURL}/${id}`, {});
      await getKategoriCollection();
    } catch (err) {
      console.error("[deleteKategori]", err);
    }
    isLoading.value = false;
  };

  const resetKategoriDocument = () => {
    kategoriDocument.value = { ...INITIAL_VALUE_KATEGORI };
  };

  return {
    kategoriCollection,
    kategoriDocument,
    listOptionKategori,
    getKategoriCollection,
    getKategoriDocument,
    insertKategori,
    updateKategori,
    deleteKategori,
    resetKategoriDocument
  };
};
