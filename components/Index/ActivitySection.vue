<template>
  <section class="py-16 bg-background">
    <div class="container mx-auto px-4">
      <!-- Section Title -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-accent mb-4">Kegiatan Terbaru</h2>
        <div class="w-24 h-1 bg-highlight mx-auto mb-6"></div>
        <p class="text-shadow/70 max-w-2xl mx-auto">
          Dokumentasi kegiatan terbaru dari Rumah Tahfizh, Bimbel Cordova, dan
          aksi sosial yang dilakukan oleh Yayasan Daarul Ummahaat.
        </p>
      </div>

      <!-- Activity Cards -->
      <div v-if="!pending" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="activity in activities"
          :key="activity.id"
          class="bg-background rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
        >
          <div class="h-48 overflow-hidden">
            <img
              :src="activity.image"
              :alt="activity.title"
              class="w-full h-full object-cover transition-transform hover:scale-105"
              loading="lazy"
            />
          </div>
          <div class="p-6">
            <div class="flex items-center text-primary mb-2">
              <CalendarIcon class="mr-2 h-4 w-4 text-primary" />
              <span class="text-sm">{{ activity.date }}</span>
            </div>
            <h3 class="text-xl font-bold text-shadow mb-2">
              {{ activity.title }}
            </h3>
            <p class="text-shadow/80 mb-4">{{ activity.description }}</p>
            <RouterLink
              :to="`/activities/${activity.slug || activity.id}`"
              class="text-accent hover:text-hover-accent text-sm font-medium"
            >
              Lihat dokumentasi →
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-background rounded-lg overflow-hidden shadow-md animate-pulse"
        >
          <div class="h-48 bg-gray-300"></div>
          <div class="p-6">
            <div class="h-4 bg-gray-300 rounded mb-2"></div>
            <div class="h-6 bg-gray-300 rounded mb-2"></div>
            <div class="h-4 bg-gray-300 rounded mb-4"></div>
            <div class="h-4 bg-gray-300 rounded w-1/3"></div>
          </div>
        </div>
      </div>

      <!-- No Activities Message -->
      <div v-if="!pending && activities.length === 0" class="text-center py-8">
        <p class="text-shadow/70">Belum ada kegiatan yang tersedia.</p>
      </div>

      <!-- View All Activities Button -->
      <div class="text-center mt-12">
        <RouterLink to="/activities">
          <button
            class="bg-accent hover:bg-hover-accent text-white px-6 py-2 rounded-lg shadow transition-colors"
          >
            Lihat Semua Kegiatan
          </button>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { CalendarIcon } from "@heroicons/vue/24/outline";

const config = useRuntimeConfig();

const {
  data: apiData,
  pending,
  error,
} = useFetch("/activities/past", {
  baseURL: config.public.apiBase,
  query: { per_page: 3 },
  default: () => ({ current_page: 1, data: [] }),
  server: false,
});

const activities = computed(() =>
  (apiData.value?.data || []).map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    image: item.image
      ? `${config.public.imageBase}/${item.image}`
      : "/src/assets/home/hero-bg.jpg",
    date: formatDate(item.activity_date || item.created_at),
    slug: item.slug,
    created_at: item.created_at,
  }))
);

// Format date to Indonesian format
function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}
</script>
