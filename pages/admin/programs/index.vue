<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Kelola Program</h1>
        <p class="mt-1 text-sm text-gray-600">
          Kelola program pendidikan dan sosial yayasan
        </p>
      </div>
      <button
        @click="showCreateForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg
          class="-ml-1 mr-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        Tambah Program
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white shadow rounded-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Cari Program</label
          >
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari berdasarkan judul..."
            class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Status</label
          >
          <select
            v-model="filterStatus"
            class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Semua Status</option>
            <option value="published">Dipublikasi</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="resetFilters"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Reset Filter
          </button>
        </div>
      </div>
    </div>

    <!-- Programs Table -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div v-if="pending" class="p-8 text-center">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
        ></div>
        <p class="mt-2 text-sm text-gray-500">Memuat data...</p>
      </div>

      <div v-else-if="error" class="p-8 text-center">
        <div class="text-red-600 mb-4">{{ error }}</div>
        <button
          @click="refresh()"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Coba Lagi
        </button>
      </div>

      <ul
        v-else-if="programs && programs.length > 0"
        class="divide-y divide-gray-200"
      >
        <li v-for="program in programs" :key="program.id" class="p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <img
                  v-if="program.image"
                  :src="program.image"
                  :alt="program.title"
                  class="h-16 w-16 object-cover rounded-lg"
                />
                <div
                  v-else
                  class="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="h-8 w-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-medium text-gray-900 truncate">
                  {{ program.title }}
                </h3>
                <p class="text-sm text-gray-500 mt-1 line-clamp-2">
                  {{ program.description }}
                </p>
                <div class="flex items-center mt-2 space-x-4">
                  <span
                    :class="{
                      'bg-green-100 text-green-800': program.is_published,
                      'bg-gray-100 text-gray-800': !program.is_published,
                    }"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ program.is_published ? "Dipublikasi" : "Draft" }}
                  </span>
                  <span class="text-xs text-gray-500">
                    Dibuat {{ formatDate(program.created_at) }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="editProgram(program)"
                class="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg
                  class="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                  />
                </svg>
              </button>
              <button
                @click="toggleStatus(program)"
                :class="{
                  'text-green-600 hover:text-green-500': program.is_published,
                  'text-gray-600 hover:text-gray-500': !program.is_published,
                }"
                class="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50"
              >
                <svg
                  v-if="program.is_published"
                  class="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fill-rule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  v-else
                  class="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                    clip-rule="evenodd"
                  />
                  <path
                    d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"
                  />
                </svg>
              </button>
              <button
                @click="deleteProgram(program)"
                class="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-red-600 bg-white hover:bg-red-50"
              >
                <svg
                  class="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </li>
      </ul>

      <div v-else class="p-8 text-center">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          Tidak ada program
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          Mulai dengan membuat program baru
        </p>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="data?.meta"
      class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
    >
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          v-if="data.meta.current_page > 1"
          @click="changePage(data.meta.current_page - 1)"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Sebelumnya
        </button>
        <button
          v-if="data.meta.current_page < data.meta.last_page"
          @click="changePage(data.meta.current_page + 1)"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Selanjutnya
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Menampilkan
            <span class="font-medium">{{ data.meta.from || 0 }}</span> -
            <span class="font-medium">{{ data.meta.to || 0 }}</span> dari
            <span class="font-medium">{{ data.meta.total || 0 }}</span> program
          </p>
        </div>
        <div>
          <nav
            class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          >
            <button
              v-if="data.meta.current_page > 1"
              @click="changePage(data.meta.current_page - 1)"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Sebelumnya
            </button>
            <button
              v-if="data.meta.current_page < data.meta.last_page"
              @click="changePage(data.meta.current_page + 1)"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Selanjutnya
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>

  <!-- Create/Edit Modal -->
  <div
    v-if="showCreateForm || showEditForm"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click="closeModal"
  >
    <div
      class="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white"
      @click.stop
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">
          {{ showCreateForm ? "Tambah Program Baru" : "Edit Program" }}
        </h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form @submit.prevent="submitForm">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Judul Program</label
            >
            <input
              v-model="form.title"
              type="text"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Deskripsi</label
            >
            <textarea
              v-model="form.description"
              rows="4"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Link Eksternal (Opsional)</label
            >
            <input
              v-model="form.external_link"
              type="url"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Gambar (Opsional)</label
            >
            <input
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div class="flex items-center">
            <input
              id="is_published"
              v-model="form.is_published"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="is_published" class="ml-2 block text-sm text-gray-900">
              Publikasikan sekarang
            </label>
          </div>
        </div>

        <div v-if="formError" class="mt-4 rounded-md bg-red-50 p-4">
          <div class="text-sm text-red-700">{{ formError }}</div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="formLoading"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {{
              formLoading
                ? "Menyimpan..."
                : showCreateForm
                ? "Simpan"
                : "Update"
            }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Kelola Program - Admin",
  description: "Kelola program pendidikan dan sosial",
  layout: "admin",
  middleware: "admin",
});

const { getAuthHeaders } = useAuth();
const config = useRuntimeConfig();

// State
const searchQuery = ref("");
const filterStatus = ref("");
const currentPage = ref(1);

const showCreateForm = ref(false);
const showEditForm = ref(false);
const formLoading = ref(false);
const formError = ref("");

const editingProgram = ref(null);

const form = reactive({
  title: "",
  description: "",
  external_link: "",
  image: "",
  is_published: false,
});

// Build query parameters
const queryParams = computed(() => {
  const params: any = {
    per_page: 10,
    page: currentPage.value,
  };

  if (searchQuery.value) params.search = searchQuery.value;
  if (filterStatus.value) {
    params.is_published = filterStatus.value === "published" ? 1 : 0;
  }

  return params;
});

// Fetch programs
const { data, pending, error, refresh } = await useFetch("/admin/programs", {
  baseURL: config.public.apiBase,
  query: queryParams,
  headers: getAuthHeaders(),
  default: () => ({ data: [], meta: null }),
});

const programs = computed(() => data.value?.data || []);

// Methods
const resetFilters = () => {
  searchQuery.value = "";
  filterStatus.value = "";
  currentPage.value = 1;
};

const changePage = (page: number) => {
  currentPage.value = page;
};

const closeModal = () => {
  showCreateForm.value = false;
  showEditForm.value = false;
  resetForm();
};

const resetForm = () => {
  form.title = "";
  form.description = "";
  form.external_link = "";
  form.image = "";
  form.is_published = false;
  editingProgram.value = null;
  formError.value = "";
};

const editProgram = (program: any) => {
  editingProgram.value = program;
  form.title = program.title;
  form.description = program.description;
  form.external_link = program.external_link || "";
  form.image = program.image || "";
  form.is_published = program.is_published;
  showEditForm.value = true;
};

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    // Mock file upload - in real app, upload to server
    form.image = `${file.name}`;
  }
};

const submitForm = async () => {
  formLoading.value = true;
  formError.value = "";

  try {
    // For create/update
    const url = showEditForm.value
      ? `/admin/programs/${editingProgram.value.id}`
      : "/admin/programs";

    const method = showEditForm.value ? "PUT" : "POST";

    await $fetch(url, {
      baseURL: config.public.apiBase,
      method,
      headers: getAuthHeaders(),
      body: form,
    });

    closeModal();
    await refresh();
  } catch (err: any) {
    formError.value = err.data?.message || "Gagal menyimpan program";
  } finally {
    formLoading.value = false;
  }
};

const toggleStatus = async (program: any) => {
  try {
    await $fetch(`/admin/programs/${program.id}`, {
      baseURL: config.public.apiBase,
      method: "PUT",
      headers: getAuthHeaders(),
      body: { ...program, is_published: !program.is_published },
    });

    await refresh();
  } catch (err: any) {
    alert("Gagal mengubah status program");
  }
};

const deleteProgram = async (program: any) => {
  if (!confirm(`Yakin ingin menghapus program "${program.title}"?`)) {
    return;
  }

  try {
    // For delete
    await $fetch(`/admin/programs/${program.id}`, {
      baseURL: config.public.apiBase,
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    await refresh();
  } catch (err: any) {
    alert("Gagal menghapus program");
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Watch for search/filter changes
watch([searchQuery, filterStatus], () => {
  currentPage.value = 1;
});

watch([searchQuery, filterStatus, currentPage], () => {
  refresh();
});
</script>
