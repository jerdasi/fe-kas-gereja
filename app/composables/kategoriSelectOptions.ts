import { useKas } from "~/composables/kas";

interface SelectOption {
  title: string;
  value: number;
}

export const useKategoriSelectOptions = () => {
  const { kategoriCollection } = useKas();

  return computed<SelectOption[]>(() =>
    kategoriCollection.value.map((k) => ({
      title: k.nama,
      value: k.id,
    }))
  );
};
