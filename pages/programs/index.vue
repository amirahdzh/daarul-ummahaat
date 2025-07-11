<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="md:flex md:items-center md:justify-between">
          <div class="flex-1 min-w-0">
            <h1 class="text-3xl font-bold text-gray-900">Program Daarul Ummahaat</h1>
            <p class="mt-2 text-gray-600">Berbagai program pendidikan dan sosial untuk ummah</p>
          </div>
          <div class="mt-4 md:mt-0">
            <div class="flex space-x-3">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari program..."
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
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 6" :key="n" class="animate-pulse">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="h-48 bg-gray-300"></div>
            <div class="p-6">
              <div class="h-4 bg-gray-300 rounded mb-2"></div>
              <div class="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div class="h-3 bg-gray-300 rounded mb-2"></div>
              <div class="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-red-800 mb-2">Gagal memuat program</h3>
          <p class="text-red-600 mb-4">{{ error.message }}</p>
          <button
            @click="refresh()"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>

      <!-- Programs Grid -->
      <div v-else-if="data?.data" class="space-y-6">
        <!-- Results Summary -->
        <div class="flex items-center justify-between">
          <p class="text-gray-600">
            Menampilkan {{ data.data.length }} dari {{ data.meta?.total || data.data.length }} program
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

        <!-- Programs Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProgramCard
            v-for="program in data.data"
            :key="program.id"
            :program="program"
          />
        </div>

        <!-- Pagination -->
        <div v-if="data.meta" class="flex items-center justify-center space-x-2 mt-8">
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
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
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
          <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Belum ada program</h3>
          <p class="text-gray-600">Program akan ditampilkan di sini ketika sudah tersedia.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Program {
  id: number
  title: string
  description: string
  image: string
  external_link?: string
  is_published: boolean
  created_at: string
  updated_at: string
}

interface PaginationMeta {
  current_page: number
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

interface PaginationLinks {
  first: string
  last: string
  prev: string | null
  next: string | null
}

interface ApiResponse {
  data: Program[]
  meta?: PaginationMeta
  links?: PaginationLinks
}

// Page meta
definePageMeta({
  title: 'Program Daarul Ummahaat',
  description: 'Berbagai program pendidikan dan sosial untuk ummah'
})

// Reactive state
const searchQuery = ref('')
const perPage = ref(10)
const currentPage = ref(1)

// API call with reactive params
const { data, pending, error, refresh } = await useFetch<ApiResponse>('/api/programs', {
  baseURL: 'http://localhost:8000',
  query: computed(() => ({
    search: searchQuery.value,
    per_page: perPage.value,
    page: currentPage.value
  })),
  default: () => ({ data: [] })
})

// Debounced search
const debouncedSearch = useDebounceFn(() => {
  currentPage.value = 1
  refresh()
}, 500)

// Methods
const refreshWithParams = () => {
  currentPage.value = 1
  refresh()
}

const goToPage = (page: number) => {
  currentPage.value = page
  refresh()
}

// Computed pagination pages
const paginationPages = computed(() => {
  if (!data.value?.meta) return []
  
  const current = data.value.meta.current_page
  const last = data.value.meta.last_page
  const pages: number[] = []
  
  // Show up to 5 pages around current page
  const start = Math.max(1, current - 2)
  const end = Math.min(last, current + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// SEO
useHead({
  title: 'Program Daarul Ummahaat',
  meta: [
    { name: 'description', content: 'Berbagai program pendidikan dan sosial untuk ummah di Daarul Ummahaat' }
  ]
})
</script>
