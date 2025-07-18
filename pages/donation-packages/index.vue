<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="md:flex md:items-center md:justify-between">
          <div class="flex-1 min-w-0">
            <h1 class="text-3xl font-bold text-gray-900">Paket Donasi</h1>
            <p class="mt-2 text-gray-600">
              Pilih paket donasi yang sesuai dengan kemampuan Anda
            </p>
          </div>
          <div class="mt-4 md:mt-0">
            <div class="flex space-x-3">
              <select
                v-model="categoryFilter"
                @change="refreshWithParams"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua Kategori</option>
                <option value="zakat">Zakat</option>
                <option value="infaq">Infaq</option>
                <option value="sedekah">Sedekah</option>
                <option value="wakaf">Wakaf</option>
                <option value="pendidikan">Pendidikan</option>
                <option value="kesehatan">Kesehatan</option>
                <option value="sosial">Sosial</option>
              </select>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari paket donasi..."
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="debouncedSearch"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div
        v-if="pending"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div v-for="n in 6" :key="n" class="animate-pulse">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="h-4 bg-gray-300 rounded mb-2"></div>
            <div class="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div class="h-8 bg-gray-300 rounded mb-4"></div>
            <div class="h-3 bg-gray-300 rounded w-1/2 mb-3"></div>
            <div class="h-10 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div
          class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto"
        >
          <div
            class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full"
          >
            <svg
              class="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-red-800 mb-2">
            Gagal memuat paket donasi
          </h3>
          <p class="text-red-600 mb-4">{{ error.message }}</p>
          <button
            @click="refresh()"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>

      <!-- Donation Packages Grid -->
      <div v-else-if="data?.data" class="space-y-6">
        <!-- Results Summary -->
        <div class="flex items-center justify-between">
          <p class="text-gray-600">
            Menampilkan {{ data.data.length }} dari
            {{ data.meta?.total || data.data.length }} paket donasi
          </p>
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-600">Per halaman:</label>
            <select
              v-model="perPage"
              @change="refreshWithParams"
              class="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="48">48</option>
            </select>
          </div>
        </div>

        <!-- Donation Packages Grid -->
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <DonationPackageCard
            v-for="pkg in data.data"
            :key="pkg.id"
            :package="pkg"
          />
        </div>

        <!-- Pagination -->
        <div
          v-if="data.meta"
          class="flex items-center justify-center space-x-2 mt-8"
        >
          <button
            :disabled="!data.links?.prev"
            @click="goToPage(data.meta.current_page - 1)"
            class="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div class="flex space-x-1">
            <button
              v-for="page in paginationPages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'px-3 py-2 text-sm rounded-lg',
                page === data.meta.current_page
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 hover:bg-gray-50',
              ]"
            >
              {{ page }}
            </button>
          </div>

          <button
            :disabled="!data.links?.next"
            @click="goToPage(data.meta.current_page + 1)"
            class="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="max-w-md mx-auto">
          <div
            class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full"
          >
            <svg
              class="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              ></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Belum ada paket donasi
          </h3>
          <p class="text-gray-600">
            Paket donasi akan ditampilkan di sini ketika sudah tersedia.
          </p>
        </div>
      </div>

      <!-- Call to Action -->
      <div
        class="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8 text-center"
      >
        <h3 class="text-xl font-semibold text-blue-900 mb-2">
          Ingin Donasi dengan Nominal Sendiri?
        </h3>
        <p class="text-blue-700 mb-4">
          Anda juga dapat berdonasi dengan nominal yang sesuai kemampuan Anda
        </p>
        <NuxtLink
          to="/donations"
          class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Donasi Sekarang
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface DonationPackage {
  id: number;
  title: string;
  description: string;
  amount: number;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

interface ApiResponse {
  data: DonationPackage[];
  meta?: PaginationMeta;
  links?: PaginationLinks;
}

// Page meta
definePageMeta({
  title: "Paket Donasi - Daarul Ummahaat",
  description:
    "Pilih paket donasi yang sesuai dengan kemampuan Anda untuk mendukung program Daarul Ummahaat",
});

// Reactive state
const searchQuery = ref("");
const categoryFilter = ref("");
const perPage = ref(12);
const currentPage = ref(1);
const config = useRuntimeConfig();

// API call with reactive params
const { data, pending, error, refresh } = await useFetch<ApiResponse>(
  "/donation-packages",
  {
    baseURL: config.public.apiBase,
    query: computed(() => ({
      search: searchQuery.value,
      category: categoryFilter.value,
      per_page: perPage.value,
      page: currentPage.value,
    })),
    default: () => ({ data: [] }),
  }
);

// Debounced search
const debouncedSearch = useDebounceFn(() => {
  currentPage.value = 1;
  refresh();
}, 500);

// Methods
const refreshWithParams = () => {
  currentPage.value = 1;
  refresh();
};

const goToPage = (page: number) => {
  currentPage.value = page;
  refresh();
};

// Computed pagination pages
const paginationPages = computed(() => {
  if (!data.value?.meta) return [];

  const current = data.value.meta.current_page;
  const last = data.value.meta.last_page;
  const pages: number[] = [];

  // Show up to 5 pages around current page
  const start = Math.max(1, current - 2);
  const end = Math.min(last, current + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// SEO
useHead({
  title: "Paket Donasi - Daarul Ummahaat",
  meta: [
    {
      name: "description",
      content:
        "Pilih paket donasi yang sesuai dengan kemampuan Anda untuk mendukung berbagai program pendidikan dan sosial Daarul Ummahaat",
    },
  ],
});
</script>
