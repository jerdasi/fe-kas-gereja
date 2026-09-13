import { useKas } from "~/composables/kas";

/**
 * Helper: dapatkan opsi select untuk form transaksi.
 * Gabungan kas + kategori jadi satu list (untuk UX tertentu).
 */
export function useTransaksiSelectOptions() {
  const { kasCollection } = useKas();

  const kasOptions = computed(() =>
    kasCollection.value.map((k) => ({
      title: k.nama,
      value: k.id,
    }))
  );

  return {
    kasOptions,
  };
}
