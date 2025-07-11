<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Riwayat Donasi</h1>
      <p class="mt-2 text-gray-600">
        Lihat semua donasi yang pernah Anda berikan
      </p>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Status</label
          >
          <select
            v-model="filters.status"
            class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Dikonfirmasi</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Kategori</label
          >
          <select
            v-model="filters.category"
            class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Semua Kategori</option>
            <option value="pendidikan">Pendidikan</option>
            <option value="kesehatan">Kesehatan</option>
            <option value="sosial">Sosial</option>
            <option value="infaq">Infaq</option>
            <option value="zakat">Zakat</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Tanggal Dari</label
          >
          <input
            v-model="filters.date_from"
            type="date"
            class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Tanggal Sampai</label
          >
          <input
            v-model="filters.date_to"
            type="date"
            class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div class="flex justify-between items-center mt-4">
        <button
          @click="resetFilters"
          class="text-gray-500 hover:text-gray-700 text-sm"
        >
          Reset Filter
        </button>
        <div class="text-sm text-gray-500">
          Total: {{ donations.length }} donasi
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 mb-4">{{ error }}</div>
      <button
        @click="refresh()"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        Coba Lagi
      </button>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!donations || donations.length === 0"
      class="text-center py-12"
    >
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
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada donasi</h3>
      <p class="mt-1 text-sm text-gray-500">
        Mulai berdonasi untuk membantu sesama
      </p>
      <div class="mt-6">
        <NuxtLink
          to="/donations"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Donasi Sekarang
        </NuxtLink>
      </div>
    </div>

    <!-- Donations List -->
    <div v-else class="space-y-6">
      <div
        v-for="donation in donations"
        :key="donation.id"
        class="bg-white rounded-lg shadow p-6"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-2">
              <h3 class="text-lg font-medium text-gray-900">
                {{ donation.title || "Donasi" }}
              </h3>
              <span
                :class="{
                  'bg-yellow-100 text-yellow-800':
                    donation.status === 'pending',
                  'bg-green-100 text-green-800':
                    donation.status === 'confirmed',
                  'bg-red-100 text-red-800': donation.status === 'cancelled',
                }"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                {{
                  donation.status === "pending"
                    ? "Pending"
                    : donation.status === "confirmed"
                    ? "Dikonfirmasi"
                    : donation.status === "cancelled"
                    ? "Dibatalkan"
                    : donation.status
                }}
              </span>
            </div>

            <div
              class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600"
            >
              <div>
                <span class="font-medium">Nominal:</span>
                <span class="ml-2 text-lg font-bold text-green-600">
                  {{ formatCurrency(donation.amount) }}
                </span>
              </div>
              <div>
                <span class="font-medium">Kategori:</span>
                <span class="ml-2 capitalize">{{ donation.category }}</span>
              </div>
              <div>
                <span class="font-medium">Tanggal:</span>
                <span class="ml-2">{{ formatDate(donation.created_at) }}</span>
              </div>
              <div v-if="donation.donation_package">
                <span class="font-medium">Paket:</span>
                <span class="ml-2">{{ donation.donation_package.title }}</span>
              </div>
              <div v-if="donation.fundraiser">
                <span class="font-medium">Fundraiser:</span>
                <span class="ml-2">{{ donation.fundraiser.title }}</span>
              </div>
            </div>

            <div
              v-if="donation.confirmation_note"
              class="mt-4 p-3 bg-gray-50 rounded-md"
            >
              <p class="text-sm text-gray-600">
                <span class="font-medium">Catatan:</span>
                {{ donation.confirmation_note }}
              </p>
            </div>
          </div>

          <div class="ml-6 flex flex-col items-end space-y-2">
            <button
              @click="showDetail(donation)"
              class="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              Lihat Detail
            </button>

            <button
              v-if="donation.status === 'confirmed'"
              @click="downloadReceipt(donation)"
              class="text-green-600 hover:text-green-500 text-sm font-medium"
            >
              Download Kwitansi
            </button>

            <button
              v-if="donation.proof_image"
              @click="viewProof(donation.proof_image)"
              class="text-gray-600 hover:text-gray-500 text-sm font-medium"
            >
              Lihat Bukti Transfer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="data?.meta" class="mt-8 flex items-center justify-between">
      <div class="text-sm text-gray-500">
        Menampilkan {{ data.meta.from || 0 }} - {{ data.meta.to || 0 }} dari
        {{ data.meta.total || 0 }} donasi
      </div>
      <div class="flex space-x-2">
        <button
          v-if="data.meta.current_page > 1"
          @click="changePage(data.meta.current_page - 1)"
          class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Sebelumnya
        </button>
        <button
          v-if="data.meta.current_page < data.meta.last_page"
          @click="changePage(data.meta.current_page + 1)"
          class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  </div>

  <!-- Detail Modal -->
  <div
    v-if="selectedDonation"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click="closeDetail"
  >
    <div
      class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white"
      @click.stop
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">Detail Donasi</h3>
        <button @click="closeDetail" class="text-gray-400 hover:text-gray-600">
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

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >ID Donasi</label
          >
          <p class="mt-1 text-sm text-gray-900">{{ selectedDonation.id }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Judul</label>
          <p class="mt-1 text-sm text-gray-900">
            {{ selectedDonation.title || "-" }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Nominal</label>
          <p class="mt-1 text-lg font-bold text-green-600">
            {{ formatCurrency(selectedDonation.amount) }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Status</label>
          <span
            :class="{
              'bg-yellow-100 text-yellow-800':
                selectedDonation.status === 'pending',
              'bg-green-100 text-green-800':
                selectedDonation.status === 'confirmed',
              'bg-red-100 text-red-800':
                selectedDonation.status === 'cancelled',
            }"
            class="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          >
            {{
              selectedDonation.status === "pending"
                ? "Pending"
                : selectedDonation.status === "confirmed"
                ? "Dikonfirmasi"
                : selectedDonation.status === "cancelled"
                ? "Dibatalkan"
                : selectedDonation.status
            }}
          </span>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Kategori</label
          >
          <p class="mt-1 text-sm text-gray-900 capitalize">
            {{ selectedDonation.category }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Tanggal Donasi</label
          >
          <p class="mt-1 text-sm text-gray-900">
            {{ formatDateTime(selectedDonation.created_at) }}
          </p>
        </div>
        <div v-if="selectedDonation.confirmation_note">
          <label class="block text-sm font-medium text-gray-700"
            >Catatan Konfirmasi</label
          >
          <p class="mt-1 text-sm text-gray-900">
            {{ selectedDonation.confirmation_note }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Riwayat Donasi",
  description: "Lihat riwayat donasi yang pernah Anda berikan",
  middleware: "auth",
});

const { user } = useAuth();

if (!user.value) {
  throw createError({
    statusCode: 401,
    statusMessage: "Unauthorized",
  });
}

const filters = reactive({
  status: "",
  category: "",
  date_from: "",
  date_to: "",
  per_page: 10,
  page: 1,
});

const selectedDonation = ref(null);

// Build query parameters
const queryParams = computed(() => {
  const params: any = {
    per_page: filters.per_page,
    page: filters.page,
  };

  if (filters.status) params.status = filters.status;
  if (filters.category) params.category = filters.category;
  if (filters.date_from) params.date_from = filters.date_from;
  if (filters.date_to) params.date_to = filters.date_to;

  return params;
});

// Fetch user donations
const { data, pending, error, refresh } = await useFetch(
  "/api/user/donations",
  {
    query: queryParams,
    headers: {
      Authorization: `Bearer ${user.value?.token}`,
    },
    default: () => ({ data: [], meta: null }),
  }
);

const donations = computed(() => data.value?.data || []);

const resetFilters = () => {
  filters.status = "";
  filters.category = "";
  filters.date_from = "";
  filters.date_to = "";
  filters.page = 1;
};

const changePage = (page: number) => {
  filters.page = page;
};

const showDetail = (donation: any) => {
  selectedDonation.value = donation;
};

const closeDetail = () => {
  selectedDonation.value = null;
};

const viewProof = (imageUrl: string) => {
  // Open image in new window/modal
  window.open(imageUrl, "_blank");
};

const downloadReceipt = async (donation: any) => {
  try {
    // Mock receipt download - replace with real implementation
    const response = await $fetch(`/api/donations/${donation.id}/receipt`, {
      headers: {
        Authorization: `Bearer ${user.value?.token}`,
      },
    });

    // Create download link
    const link = document.createElement("a");
    link.href = response.download_url;
    link.download = `kwitansi-${donation.id}.pdf`;
    link.click();
  } catch (err) {
    console.error("Failed to download receipt:", err);
    alert("Gagal mengunduh kwitansi");
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Watch for filter changes
watch(
  filters,
  () => {
    refresh();
  },
  { deep: true }
);
</script>
