<template>
  <div class="space-y-6 pt-6 pb-10 px-4 md:px-8 lg:px-12">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Kelola Kegiatan</h1>
        <p class="mt-1 text-sm text-gray-600">
          Kelola kegiatan donasi dan acara yayasan
        </p>
      </div>
      <button
        @click="showCreateForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
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
        Tambah Kegiatan
      </button>
    </div>

    <!-- Filters (simple search + status) -->
    <div class="bg-white shadow rounded-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Cari Kegiatan</label
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

    <!-- Activities list -->
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
        v-else-if="activities && activities.length > 0"
        class="divide-y divide-gray-200"
      >
        <li v-for="act in activities" :key="act.id" class="p-4 sm:p-6">
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0"
          >
            <div
              class="flex items-start sm:items-center space-x-4 w-full cursor-pointer"
              role="button"
              tabindex="0"
              @click="editActivity(act)"
              @keydown.enter="editActivity(act)"
            >
              <div class="flex-shrink-0">
                <div
                  class="w-24 h-16 sm:w-16 sm:h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center"
                >
                  <img
                    v-if="act.image_url"
                    :src="act.image_url"
                    :alt="act.title"
                    class="w-full h-full object-cover"
                  />
                  <div
                    v-else
                    class="h-full w-full flex items-center justify-center text-gray-400"
                  >
                    <svg
                      class="h-8 w-8"
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
              </div>

              <div class="flex-1 min-w-0">
                <h3
                  class="text-base sm:text-lg font-medium text-gray-900 truncate"
                >
                  {{ act.title }}
                </h3>
                <p class="text-sm text-gray-500 mt-1 line-clamp-2">
                  {{ act.description }}
                </p>
                <div class="flex items-center mt-2 flex-wrap gap-2">
                  <span
                    :class="{
                      'bg-green-100 text-green-800': act.is_published,
                      'bg-gray-100 text-gray-800': !act.is_published,
                    }"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    >{{ act.is_published ? "Dipublikasi" : "Draft" }}</span
                  >
                  <span class="text-xs text-gray-500"
                    >Acara: {{ formatDate(act.event_date) }}</span
                  >
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  Dibuat oleh: {{ act.creator?.name || "-" }}
                </div>
              </div>
            </div>

            <div class="w-full sm:w-auto">
              <div
                class="mt-2 sm:mt-0 flex flex-row items-center sm:space-x-2 space-x-2 sm:justify-end flex-wrap"
              >
                <button
                  @click.stop="editActivity(act)"
                  class="inline-flex items-center justify-center p-3 sm:p-2 w-full sm:w-auto border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  aria-label="Edit kegiatan"
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
                  <span class="ml-2 sm:hidden">Edit</span>
                </button>

                <button
                  @click.stop="toggleStatus(act)"
                  :class="{
                    'text-green-600 hover:text-green-500': act.is_published,
                    'text-gray-600 hover:text-gray-500': !act.is_published,
                  }"
                  class="inline-flex items-center justify-center p-3 sm:p-2 w-full sm:w-auto border border-gray-300 rounded-md text-sm font-medium bg-white hover:bg-gray-50"
                  aria-label="Toggle publikasi"
                >
                  <svg
                    v-if="act.is_published"
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
                  </svg>
                </button>

                <button
                  @click.stop="deleteActivity(act)"
                  class="inline-flex items-center justify-center p-3 sm:p-2 w-full sm:w-auto border border-gray-300 rounded-md text-sm font-medium text-red-600 bg-white hover:bg-red-50"
                  aria-label="Hapus kegiatan"
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
                  <span class="ml-2 sm:hidden">Hapus</span>
                </button>
              </div>
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
          Tidak ada kegiatan
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          Mulai dengan membuat kegiatan baru
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
            <span class="font-medium">{{ data.meta.total || 0 }}</span> kegiatan
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

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateForm || showEditForm"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeModal"
    >
      <div
        class="relative top-0 mx-auto p-5 border w-full h-full sm:top-20 sm:w-11/12 md:w-2/3 lg:w-1/2 sm:h-auto shadow-lg rounded-none sm:rounded-md bg-white"
        @click.stop
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ showCreateForm ? "Tambah Kegiatan Baru" : "Edit Kegiatan" }}
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
                >Judul Kegiatan</label
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
                >Tanggal & Waktu Acara</label
              >
              <input
                v-model="form.event_date_local"
                type="datetime-local"
                required
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
              <label for="is_published" class="ml-2 block text-sm text-gray-900"
                >Publikasikan sekarang</label
              >
            </div>
          </div>

          <div v-if="formError" class="mt-4 rounded-md bg-red-50 p-4">
            <div class="text-sm text-red-700">{{ formError }}</div>
          </div>

          <div
            class="mt-6 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3"
          >
            <button
              type="button"
              @click="closeModal"
              class="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="formLoading"
              class="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
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
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Kelola Kegiatan - Admin",
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

interface AdminActivity {
  id: number;
  title: string;
  description: string;
  event_date?: string; // ISO
  image?: string;
  image_url?: string;
  created_by?: number;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
  creator?: { id: number; name: string } | null;
}

const editingActivity = ref<AdminActivity | null>(null);

const form = reactive({
  title: "",
  description: "",
  event_date_local: "", // for datetime-local input
  image: "",
  imageFile: null as File | null,
  is_published: false,
});

const queryParams = computed(() => {
  const params: any = { per_page: 10, page: currentPage.value };
  if (searchQuery.value) params.search = searchQuery.value;
  if (filterStatus.value)
    params.is_published = filterStatus.value === "published" ? 1 : 0;
  return params;
});

const { data, pending, error, refresh } = await useFetch<{
  data: AdminActivity[];
  meta: any;
}>("/activities", {
  baseURL: config.public.apiBase,
  query: queryParams,
  headers: getAuthHeaders(),
  default: () => ({ data: [], meta: null }),
});

const activities = computed<AdminActivity[]>(
  () => (data.value as any)?.data || []
);

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
  form.event_date_local = "";
  form.image = "";
  form.imageFile = null;
  form.is_published = false;
  editingActivity.value = null;
  formError.value = "";
};

const editActivity = (act: any) => {
  editingActivity.value = act;
  form.title = act.title || "";
  form.description = act.description || "";
  // convert ISO to datetime-local compatible value (without timezone)
  form.event_date_local = act.event_date
    ? new Date(act.event_date).toISOString().slice(0, 16)
    : "";
  form.image = act.image_url || act.image || "";
  form.is_published = !!act.is_published;
  showEditForm.value = true;
};

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    form.imageFile = file;
    try {
      form.image = URL.createObjectURL(file);
    } catch (e) {
      form.image = file.name;
    }
  }
};

const submitForm = async () => {
  formLoading.value = true;
  formError.value = "";
  try {
    const url =
      showEditForm.value && editingActivity.value
        ? `/activities/${editingActivity.value.id}`
        : "/activities";

    const fd = new FormData();
    fd.append("title", form.title || "");
    fd.append("description", form.description || "");
    // convert local datetime to ISO string (UTC)
    if (form.event_date_local) {
      const iso = new Date(form.event_date_local).toISOString();
      fd.append("event_date", iso);
    } else {
      fd.append("event_date", "");
    }
    fd.append("is_published", form.is_published ? "1" : "0");
    if (form.imageFile) fd.append("image", form.imageFile as File);

    const isUpdate = !!showEditForm.value;
    if (isUpdate) fd.append("_method", "PUT");

    await $fetch(url, {
      baseURL: config.public.apiBase,
      method: "POST",
      headers: getAuthHeaders(),
      body: fd,
    });

    closeModal();
    await refresh();
  } catch (err: any) {
    formError.value = err.data?.message || "Gagal menyimpan kegiatan";
  } finally {
    formLoading.value = false;
  }
};

const toggleStatus = async (act: any) => {
  try {
    await $fetch(`/activities/${act.id}`, {
      baseURL: config.public.apiBase,
      method: "PUT",
      headers: getAuthHeaders(),
      body: { ...act, is_published: !act.is_published },
    });
    await refresh();
  } catch (err: any) {
    alert("Gagal mengubah status kegiatan");
  }
};

const deleteActivity = async (act: any) => {
  if (!confirm(`Yakin ingin menghapus kegiatan "${act.title}"?`)) return;
  try {
    await $fetch(`/activities/${act.id}`, {
      baseURL: config.public.apiBase,
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    await refresh();
  } catch (err: any) {
    alert("Gagal menghapus kegiatan");
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

watch([searchQuery, filterStatus], () => {
  currentPage.value = 1;
});
watch([searchQuery, filterStatus, currentPage], () => {
  refresh();
});
</script>
