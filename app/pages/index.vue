<script lang="ts" setup>
const items = [
  'https://picsum.photos/468/468?random=1',
  'https://picsum.photos/468/468?random=2',
  'https://picsum.photos/468/468?random=3',
  'https://picsum.photos/468/468?random=4',
  'https://picsum.photos/468/468?random=5',
  'https://picsum.photos/468/468?random=6'
]

const { kategoriCollection, getKategoriCollection } = useKategori()

onMounted(async () => {
  await getKategoriCollection()
})
</script>

<template>
  <div class="p-2">
    <UCarousel
      v-slot="{ item }"
      loop
      :autoplay="{ delay: 2000 }"
      :items="items"
      :ui="{ item: 'basis-5/6' }"

    >
      <UCard class="my-1">
        <template #header>
          <UBadge>Kas Kaum Ibu</UBadge>
        </template>

        <p class="text-2xl">Rp.3000.000,-</p>

        <template #footer>
          Diperbarui 22 Des 2026
        </template>

      </UCard>
    </UCarousel>

    {{ kategoriCollection }}
  </div>
</template>
