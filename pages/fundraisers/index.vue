<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="md:flex md:items-center md:justify-between">
          <div class="flex-1 min-w-0">
            <h1 class="text-3xl font-bold text-gray-900">Penggalangan Dana</h1>
            <p class="mt-2 text-gray-600">
              Dukung berbagai kegiatan dan program Daarul Ummahaat
            </p>
          </div>
          <div class="mt-4 md:mt-0">
            <div class="flex space-x-3">
              <select
                v-model="statusFilter"
                @change="refreshWithParams"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="completed">Selesai</option>
                <option value="inactive">Tidak Aktif</option>
              </select>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari penggalangan dana..."
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
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="h-48 bg-gray-300"></div>
            <div class="p-6">
              <div class="h-4 bg-gray-300 rounded mb-2"></div>
              <div class="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div class="h-2 bg-gray-300 rounded mb-2"></div>
              <div class="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
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
            Gagal memuat penggalangan dana
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

      <!-- Fundraisers Grid -->
      <div v-else-if="data?.data" class="space-y-6">
        <!-- Results Summary -->
        <div class="flex items-center justify-between">
          <p class="text-gray-600">
            Menampilkan {{ data.data.length }} dari
            {{ data.meta?.total || data.data.length }} penggalangan dana
          </p>
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-600">Per halaman:</label>
            <select
              v-model="perPage"
              @change="refreshWithParams"
              class="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        <!-- Fundraisers Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FundraiserCard
            v-for="fundraiser in data.data"
            :key="fundraiser.id"
            :fundraiser="fundraiser"
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Belum ada penggalangan dana
          </h3>
          <p class="text-gray-600">
            Penggalangan dana akan ditampilkan di sini ketika sudah tersedia.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Fundraiser {
  id: number;
  title: string;
  description: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  image: string;
  status: "active" | "completed" | "inactive";
  is_published: boolean;
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
  data: Fundraiser[];
  meta?: PaginationMeta;
  links?: PaginationLinks;
}

// Page meta
definePageMeta({
  title: "Penggalangan Dana - Daarul Ummahaat",
  description:
    "Dukung berbagai kegiatan dan program Daarul Ummahaat melalui penggalangan dana",
});

// Reactive state
const searchQuery = ref("");
const statusFilter = ref("");
const perPage = ref(10);
const currentPage = ref(1);

// API call with reactive params
const { data, pending, error, refresh } = await useFetch<ApiResponse>(
  "/api/fundraisers",
  {
    baseURL: "http://localhost:8000",
    query: computed(() => ({
      search: searchQuery.value,
      status: statusFilter.value,
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
  title: "Penggalangan Dana - Daarul Ummahaat",
  meta: [
    {
      name: "description",
      content:
        "Dukung berbagai kegiatan dan program Daarul Ummahaat melalui penggalangan dana yang transparan dan terpercaya",
    },
  ],
});
</script>
