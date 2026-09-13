<script lang="ts" setup>
import { computed, watch } from "vue";
import { formatCurrency, formatDate } from "~/utils/general";
import {
  INITIAL_VALUE_TRANSAKSI,
  schemaInsertUpdateTransaksi,
  type TSchemaInsertUpdateTransaksi
} from "~/constants/transaksi";
import { useAuth } from "~/composables/auth";

definePageMeta({
  middleware: ["auth"]
});

const { getKategoriCollection, listOptionKategori } = useKategori();
const { kasCollection, getKasCollection } = useKas();
const totalSaldoSemuaKas = computed(() =>
  kasCollection.value.reduce((s, k) => s + k.saldo, 0)
);
const { transaksiCollection, getTransaksiCollection, setKasId, getAllTransaksi, getTransaksiForKasIds } = useTransaksi();
const { currentUser } = useAuth();

const drawerTransaksi = ref(false);
const dataTransaksi = reactive<Partial<TSchemaInsertUpdateTransaksi>>({
  ...INITIAL_VALUE_TRANSAKSI
});
const tipeTransaksi = ref<"pemasukan" | "pengeluaran">("pemasukan");
const selectedKasId = ref<number | null>(null);
const periodFilter = ref<"minggu" | "bulan" | "semua">("semua");
const fabMenuOpen = ref(false);
const viewMode = ref<"all" | "mine">("all");

const displayedKas = computed(() => {
  if (viewMode.value === "all") {
    return kasCollection.value;
  } else {
    return kasCollection.value.filter((k) => userKasIds.value.includes(k.id));
  }
});

watch(viewMode, async (mode) => {
  selectedKasId.value = null; // reset selection when scope changes
  if (mode === "all") {
    await getAllTransaksi();
  } else {
    await getTransaksiForKasIds({ kasIds: userKasIds.value });
  }
});

const loadTransaksiByViewMode = async () => {
  if (viewMode.value === "all") {
    await getAllTransaksi();
  } else {
    await getTransaksiForKasIds({ kasIds: userKasIds.value });
  }
};

const canSubmit = computed(() => {
  if (!currentUser.value) return false;
  if (currentUser.value.role === "admin") return true;
  if (currentUser.value.role === "bendahara") {
    return kasCollection.value.some((k) => k.id_pic === currentUser.value.id);
  }
  return false;
});

const userKasIds = computed(() => {
  if (!currentUser.value) return [];
  if (currentUser.value.role === "admin") {
    return kasCollection.value.map((k) => k.id);
  }
  if (currentUser.value.role === "bendahara") {
    return kasCollection.value.filter((k) => k.id_pic === currentUser.value.id).map((k) => k.id);
  }
  return [];
});

const filteredTransactions = computed(() => {
  const now = new Date();
  const transactions = transaksiCollection.value;
  const isFiltered = selectedKasId.value !== null;
  return transactions.filter((tx) => {
    const txDate = new Date(tx.tanggal + "T00:00:00");
    if (periodFilter.value === "minggu") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return txDate >= weekAgo;
    }
    if (periodFilter.value === "bulan") {
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    }
    if (isFiltered) {
      return tx.id_kas === selectedKasId.value;
    }
    return true;
  });
});

const totalPemasukan = computed(() =>
  filteredTransactions.value
    .filter((tx) => tx.kategori?.tipe === "pemasukan")
    .reduce((s, tx) => s + tx.jumlah, 0)
);

const totalPengeluaran = computed(() =>
  filteredTransactions.value
    .filter((tx) => tx.kategori?.tipe === "pengeluaran")
    .reduce((s, tx) => s + tx.jumlah, 0)
);

const selectedKasName = computed(() =>
  kasCollection.value.find((k) => k.id === selectedKasId.value)?.nama ?? null
);

const openDrawer = (jenis: "pemasukan" | "pengeluaran") => {
  tipeTransaksi.value = jenis;
  Object.assign(dataTransaksi, { ...INITIAL_VALUE_TRANSAKSI });
  drawerTransaksi.value = true;
  fabMenuOpen.value = false;
};

const toggleFabMenu = () => {
  fabMenuOpen.value = !fabMenuOpen.value;
};

const deselectKas = () => {
  selectedKasId.value = null;
  setKasId(null);
  loadTransaksiByViewMode();
};

const selectKas = (id: number) => {
  selectedKasId.value = id;
  setKasId(id);
  getTransaksiCollection();
};

onMounted(async () => {
  await getKategoriCollection();
  await getKasCollection();
  await loadTransaksiByViewMode();
});
</script>

<template>
  <div class="total-kas p-4 px-6 pb-8">
    <p class="text-white/90 text-sm">Total Uang Kas Gereja</p>
    <p class="text-white text-4xl font-semibold">{{ formatCurrency(totalSaldoSemuaKas) }}</p>
  </div>

  <div class="p-3 flex flex-col gap-4 -mt-8">
    <div>
      <UTabs
        v-model="viewMode"
        :items="[
            { label: 'Semua Kas', value: 'all' },
            { label: 'Kas Saya', value: 'mine' }
          ]"
        vertical
      />

      <p class="font-semibold text-secondary">Daftar Kas</p>
      <UCarousel
        v-slot="{ item }"
        loop
        :autoplay="{ delay: 4000 }"
        :items="displayedKas"
        :ui="{ item: 'basis-5/6' }"
      >
        <UCard
          class="my-1 cursor-pointer transition-all hover:shadow-md"
          :class="{ 'ring-2 ring-primary': selectedKasId === item.id }"
          @click="selectKas(item.id)"
        >
          <UBadge size="sm">{{ item.nama }}</UBadge>
          <p class="text-2xl text-primary mt-1">{{ formatCurrency(item.saldo) }}</p>
          <small>{{ item.deskripsi }}</small>
        </UCard>
      </UCarousel>
      <template v-if="displayedKas.length === 0">
        <UCard size="sm" class="py-6 text-center text-muted">
          Tidak ada Data Kas
        </UCard>
      </template>
    </div>

    <div>
      <div class="flex items-center justify-center gap-3 mb-2">
        <div class="flex items-center gap-1 bg-muted rounded-md p-0.5">
          <UTabs
            v-model="periodFilter"
            :items="[
              { label: 'Minggu Ini', value: 'minggu' },
              { label: 'Bulan Ini', value: 'bulan' },
              { label: 'Semua', value: 'semua' }
            ]"
          />
        </div>
      </div>

      <div v-if="selectedKasId !== null" class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2 text-sm">
          <span class="font-medium text-primary">Transaksi di kas:</span>
          <span class="font-semibold text-foreground">{{ selectedKasName }}</span>
        </div>
        <UButton variant="ghost" size="xs" icon="i-heroicons-x-mark" @click="deselectKas">
          <span class="sr-only">Hapus filter kas</span>
        </UButton>
      </div>
      <div v-else class="flex items-center gap-2 mb-3 text-sm text-muted">
        <span class="font-medium">Menampilkan semua kas</span>
      </div>

      <div class="flex gap-3 mb-6">
        <UCard size="sm" class="flex-1">
          <p class="text-xs text-muted uppercase tracking-wide">Pemasukan</p>
          <p class="text-xl font-semibold text-success">
            {{ formatCurrency(totalPemasukan) }}
          </p>
        </UCard>
        <UCard size="sm" class="flex-1">
          <p class="text-xs text-muted uppercase tracking-wide">Pengeluaran</p>
          <p class="text-xl font-semibold text-error">
            {{ formatCurrency(totalPengeluaran) }}
          </p>
        </UCard>
      </div>

      <p class="font-semibold text-secondary mb-2">Aktivitas</p>

      <div class="space-y-2">
        <UCard
          v-for="tx in filteredTransactions"
          :key="tx.id"
          size="sm"
          class="mb-3 overflow-visible"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <p class="line-clamp-2 font-medium text-sm">
                {{ tx.keterangan ?? 'Tanpa keterangan' }}
              </p>
              <div class="flex items-center gap-1.5 mt-1 text-xs text-muted">
                <span>{{ tx.nama_kas ?? tx.kas?.nama ?? 'Kas tidak dikenal' }}</span>
                <span class="opacity-40">·</span>
                <span>{{ formatDate(tx.tanggal) }}</span>
              </div>
            </div>
            <div class="text-right shrink-0">
              <p :class="tx.kategori?.tipe === 'pemasukan' ? 'text-success' : 'text-error'" class="text-sm font-semibold">
                {{ tx.kategori?.tipe === 'pemasukan' ? '+' : '-' }}{{ formatCurrency(tx.jumlah) }}
              </p>
              <small class="opacity-60 text-xs">
                {{ tx.kategori?.tipe === 'pemasukan' ? 'pemasukan' : tx.kategori?.tipe === 'pengeluaran' ? 'pengeluaran' : '-' }}
              </small>
            </div>
          </div>
        </UCard>

        <template v-if="filteredTransactions.length === 0">
          <UCard size="sm" class="py-6 text-center text-muted">
            Belum ada aktivitas
          </UCard>
        </template>
      </div>
    </div>

    <template v-if="canSubmit">
      <UButton
        color="primary"
        icon="i-heroicons-plus"
        size="xl"
        class="fixed bottom-6 right-6 z-50 shadow-lg transition-transform hover:scale-105 active:scale-95"
        @click="toggleFabMenu"
      >
        <span class="sr-only">Tambah transaksi</span>
      </UButton>
      <div
        v-if="fabMenuOpen"
        class="fixed bottom-20 right-6 z-50 flex flex-col gap-2"
      >
        <UButton
          color="success"
          size="lg"
          class="shadow-lg"
          @click="openDrawer('pemasukan')"
        >
          Pemasukan
        </UButton>
        <UButton
          color="error"
          size="lg"
          class="shadow-lg"
          @click="openDrawer('pengeluaran')"
        >
          Pengeluaran
        </UButton>
      </div>
    </template>

    <UDrawer
      v-model:open="drawerTransaksi"
      :title="tipeTransaksi === 'pemasukan' ? 'Catat Pemasukan' : 'Catat Pengeluaran'"
      side="right"
    >
      <template #body>
        <UForm
          :schema="schemaInsertUpdateTransaksi"
          :state="dataTransaksi"
          class="space-y-4"
          @submit="() => {}"
        >
          <UFormField label="Kategori" name="id_kategori" required>
            <USelect
              v-model="dataTransaksi.id_kategori"
              :items="listOptionKategori"
              value-key="value"
              label-key="title"
              placeholder="Pilih kategori"
              class="w-full"
              size="lg"
            />
          </UFormField>
          <UFormField label="Tanggal" name="tanggal" required>
            <UInput v-model="dataTransaksi.tanggal" type="date" class="w-full" size="lg" />
          </UFormField>
          <UFormField label="Jumlah (Rp)" name="jumlah" required>
            <UInput
              v-model.number="dataTransaksi.jumlah"
              type="number"
              min="1"
              placeholder="Masukkan jumlah"
              class="w-full"
              size="lg"
            />
          </UFormField>
          <UFormField label="Keterangan" name="keterangan">
            <UTextarea
              v-model="dataTransaksi.keterangan"
              placeholder="Opsional"
              class="w-full"
              size="lg"
            />
          </UFormField>
          <div class="flex justify-end gap-2 pt-2">
            <UButton variant="ghost" @click="drawerTransaksi = false">Batal</UButton>
            <UButton type="submit" :color="tipeTransaksi === 'pemasukan' ? 'success' : 'error'">
              Simpan {{ tipeTransaksi === "pemasukan" ? "Pemasukan" : "Pengeluaran" }}
            </UButton>
          </div>
        </UForm>
      </template>
    </UDrawer>
  </div>
</template>

<style scoped>
.total-kas {
  background: linear-gradient(200deg, rgba(255, 189, 89, 1) 0%, rgba(63, 127, 96, 1) 66%);;
}
</style>
