import type { TSaldoResponse } from "~/types/saldo";
import { GET } from "~/composables/fetch";

/**
 * Ambil saldo kas untuk periode tertentu.
 * Endpoint: GET /kas/{kas}/saldo?dari=...&sampai=...
 */
export const useSaldoKas = () => {
  const baseURL = `${import.meta.env.VITE_API_KAS_GEREJA}/kas`;

  const saldoData = ref<TSaldoResponse | null>(null);
  const isLoading = ref<boolean>(false);

  /**
   * @param kasId ID kas
   * @param dari tanggal awal (YYYY-MM-DD), opsional
   * @param sampai tanggal akhir (YYYY-MM-DD), opsional — harus >= dari
   */
  const getSaldo = async (
    kasId: number,
    dari?: string,
    sampai?: string
  ) => {
    isLoading.value = true;
    try {
      const query: Record<string, unknown> = {};
      if (dari) query.dari = dari;
      if (sampai) query.sampai = sampai;

      saldoData.value = await GET<TSaldoResponse>(
        `${baseURL}/${kasId}/saldo`,
        query
      );
    } catch (err) {
      console.error("[getSaldo]", err);
      saldoData.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  const resetSaldo = () => {
    saldoData.value = null;
  };

  return {
    saldoData,
    isLoading,
    getSaldo,
    resetSaldo,
  };
};
