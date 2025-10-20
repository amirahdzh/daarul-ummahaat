<template>
  <section class="py-16 bg-background">
    <div class="container mx-auto px-20">
      <!-- Section Title -->
      <div class="text-center mb-6">
        <h2 class="text-3xl font-bold text-accent mb-4">Kegiatan Terbaru</h2>
        <div class="w-24 h-1 bg-highlight mx-auto mb-6"></div>
        <!-- <p class="text-shadow/70 max-w-2xl mx-auto">
          Dokumentasi kegiatan terbaru dari Rumah Tahfizh, Bimbel Cordova, dan
          aksi sosial yang dilakukan oleh Yayasan Daarul Ummahaat.
        </p> -->
      </div>

      <!-- Filter: Semua / Mendatang / Sudah Lalu -->
      <div class="flex justify-center mb-6">
        <div class="inline-flex rounded-lg bg-white/5 p-1">
          <button
            :class="[
              'px-4 py-2 rounded-md text-sm font-medium',
              mode === 'all'
                ? 'bg-accent text-white'
                : 'text-accent/80 hover:text-accent',
            ]"
            @click="mode = 'all'"
            :aria-pressed="mode === 'all'"
          >
            Semua
          </button>

          <button
            :class="[
              'px-4 py-2 rounded-md text-sm font-medium',
              mode === 'upcoming'
                ? 'bg-accent text-white'
                : 'text-accent/80 hover:text-accent',
            ]"
            @click="mode = 'upcoming'"
            :aria-pressed="mode === 'upcoming'"
          >
            Mendatang
          </button>

          <button
            :class="[
              'px-4 py-2 rounded-md text-sm font-medium',
              mode === 'past'
                ? 'bg-accent text-white'
                : 'text-accent/80 hover:text-accent',
            ]"
            @click="mode = 'past'"
            :aria-pressed="mode === 'past'"
          >
            Sudah Lalu
          </button>
        </div>
      </div>

      <!-- Activity Cards: carousel preview (one row, horizontal scroll) -->
      <div v-if="!pending" class="relative">
        <div
          ref="carouselRef"
          class="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth py-2 px-2 md:px-6"
        >
          <div
            v-for="activity in activities"
            :key="activity.id"
            class="snap-start flex-shrink-0 w-full max-w-[360px] rounded-lg overflow-hidden"
          >
            <!-- Image container (kept 4:3 as requested) -->
            <div class="relative w-full" style="aspect-ratio: 4 / 3">
              <img
                :src="activity.image"
                :alt="activity.title"
                class="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />

              <!-- badge -->
              <span
                class="absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full shadow"
                :class="
                  activity.isUpcoming
                    ? 'bg-accent text-white'
                    : 'bg-gray-200 text-gray-800'
                "
              >
                {{ activity.isUpcoming ? "Mendatang" : "Sudah Lalu" }}
              </span>

              <!-- Bottom overlay with semi-transparent white background (compact) -->
              <div
                class="absolute left-0 right-0 bottom-0 p-3"
                style="
                  background: rgba(255, 255, 255, 0.5);
                  backdrop-filter: blur(4px);
                "
              >
                <div class="flex items-center text-primary mb-1">
                  <CalendarIcon class="mr-2 h-4 w-4 text-gray-900" />
                  <span class="text-sm text-gray-900">{{ activity.date }}</span>
                </div>
                <h3
                  class="sm:text-lg text-md font-bold text-gray-900 leading-tight mb-1"
                  style="min-height: 36px"
                >
                  {{ activity.title }}
                </h3>
                <!-- <p class="text-sm text-gray-800 line-clamp-2">
                  {{ excerpt(activity.description) }}
                </p>

                <div class="mt-3">
                  <RouterLink
                    :to="`/activities/${activity.slug || activity.id}`"
                    class="text-accent hover:text-hover-accent text-sm font-medium"
                  >
                    Lebih lanjut →
                  </RouterLink>
                </div> -->
              </div>
            </div>
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

import { ref, computed, onMounted, watch } from "vue";

const mode = ref("all"); // 'all' | 'past' | 'upcoming'

// Prefetch first pages for both endpoints and maintain aggregated arrays
const perPage = 5;

const pastPage = ref(1);
const upcomingPage = ref(1);

const pastItemsRaw = ref([]);
const upcomingItemsRaw = ref([]);

const pastLastPage = ref(Infinity);
const upcomingLastPage = ref(Infinity);

const isFetchingMorePast = ref(false);
const isFetchingMoreUpcoming = ref(false);

const {
  data: pastData,
  pending: pendingPast,
  error: errorPast,
} = useFetch(
  () => `/activities/past?page=${pastPage.value}&per_page=${perPage}`,
  {
    baseURL: config.public.apiBase,
    default: () => ({ current_page: 1, data: [], last_page: 1 }),
    server: false,
  }
);

const {
  data: upcomingData,
  pending: pendingUpcoming,
  error: errorUpcoming,
} = useFetch(
  () => `/activities/upcoming?page=${upcomingPage.value}&per_page=${perPage}`,
  {
    baseURL: config.public.apiBase,
    default: () => ({ current_page: 1, data: [], last_page: 1 }),
    server: false,
  }
);

const pending = computed(() => !!pendingPast.value || !!pendingUpcoming.value);

// When initial data arrives, populate raw arrays and last_page
watch(pastData, (val) => {
  if (!val) return;
  if (Array.isArray(val.data)) pastItemsRaw.value = val.data.slice();
  pastLastPage.value = val.last_page || 1;
});

watch(upcomingData, (val) => {
  if (!val) return;
  if (Array.isArray(val.data)) upcomingItemsRaw.value = val.data.slice();
  upcomingLastPage.value = val.last_page || 1;
});

// helper to append raw fetched items (keep original shape for dedupe) and update last_page
function appendToRaw(rawRef, resp, lastPageRef) {
  if (!resp) return false;
  const items = Array.isArray(resp.data) ? resp.data : [];
  if (!items || items.length === 0) return false;
  const existingIds = new Set(rawRef.value.map((i) => i.id));
  items.forEach((it) => {
    if (!existingIds.has(it.id)) rawRef.value.push(it);
  });
  if (typeof resp.last_page === "number") lastPageRef.value = resp.last_page;
  return true;
}

// Fetch next page helpers using $fetch so we control append and stop when last page reached
async function fetchNextPast() {
  if (isFetchingMorePast.value) return;
  if (pastPage.value >= pastLastPage.value) return;
  isFetchingMorePast.value = true;
  const next = pastPage.value + 1;
  try {
    const res = await $fetch(
      `/activities/past?page=${next}&per_page=${perPage}`,
      { baseURL: config.public.apiBase }
    );
    const ok = appendToRaw(pastItemsRaw, res, pastLastPage);
    if (ok) pastPage.value = next;
    setTimeout(updateControls, 60);
  } catch (e) {
    // ignore
  } finally {
    isFetchingMorePast.value = false;
  }
}

async function fetchNextUpcoming() {
  if (isFetchingMoreUpcoming.value) return;
  if (upcomingPage.value >= upcomingLastPage.value) return;
  isFetchingMoreUpcoming.value = true;
  const next = upcomingPage.value + 1;
  try {
    const res = await $fetch(
      `/activities/upcoming?page=${next}&per_page=${perPage}`,
      { baseURL: config.public.apiBase }
    );
    const ok = appendToRaw(upcomingItemsRaw, res, upcomingLastPage);
    if (ok) upcomingPage.value = next;
    setTimeout(updateControls, 60);
  } catch (e) {
    // ignore
  } finally {
    isFetchingMoreUpcoming.value = false;
  }
}

// pending already computed above

function extractItems(resp) {
  // With a consistent API shape we expect { data: [...] }
  if (!resp) return [];
  if (Array.isArray(resp.data)) return resp.data;
  return [];
}

function buildItem(item) {
  const eventDate = item.event_date || item.created_at || null;
  const eventTs = eventDate ? new Date(eventDate).getTime() : 0;
  const nowTs = Date.now();
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    image: item.image_url
      ? item.image_url
      : item.image
      ? `${config.public.imageBase}/${item.image}`
      : "/src/assets/home/hero-bg.jpg",
    event_date: eventDate,
    eventTs,
    date: formatDate(eventDate || item.created_at),
    slug: item.slug,
    created_at: item.created_at,
    isUpcoming: eventTs >= new Date().setHours(0, 0, 0, 0),
  };
}

const upcomingItems = computed(() =>
  (upcomingItemsRaw.value || [])
    .map(buildItem)
    .sort((a, b) => a.eventTs - b.eventTs)
);

const pastItems = computed(() =>
  (pastItemsRaw.value || [])
    .map(buildItem)
    .sort((a, b) => b.eventTs - a.eventTs)
);

// Combine and dedupe by id
const allItems = computed(() => {
  const map = new Map();
  // prefer upcoming version if duplicate
  [...upcomingItems.value, ...pastItems.value].forEach((it) => {
    map.set(it.id, { ...(map.get(it.id) || {}), ...it });
  });
  // return as array sorted by eventTs desc (newest / upcoming first)
  return Array.from(map.values()).sort((a, b) => b.eventTs - a.eventTs);
});

const activities = computed(() => {
  if (mode.value === "upcoming") return upcomingItems.value;
  if (mode.value === "past") return pastItems.value;
  return allItems.value;
});

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

// Return a safe plain-text excerpt (maxLen chars)
function excerpt(htmlOrText, maxLen = 120) {
  if (!htmlOrText) return "";
  // strip simple HTML tags
  const s = String(htmlOrText)
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (s.length <= maxLen) return s;
  return s.slice(0, maxLen).trim() + "…";
}
</script>
