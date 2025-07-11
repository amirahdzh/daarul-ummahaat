<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Kelola Donasi</h1>
        <p class="mt-1 text-sm text-gray-600">
          Kelola dan konfirmasi donasi yang masuk
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
        Tambah Donasi Manual
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="flex items-center justify-center w-8 h-8 bg-green-100 rounded-md"
            >
              <svg
                class="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">
                Total Donasi
              </dt>
              <dd class="text-lg font-semibold text-gray-900">
                {{ formatCurrency(stats.total) }}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-md"
            >
              <svg
                class="w-5 h-5 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">
                Pending
              </dt>
              <dd class="text-lg font-semibold text-gray-900">
                {{ stats.pending }}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="flex items-center justify-center w-8 h-8 bg-green-100 rounded-md"
            >
              <svg
                class="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">
                Dikonfirmasi
              </dt>
              <dd class="text-lg font-semibold text-gray-900">
                {{ stats.confirmed }}
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div
              class="flex items-center justify-center w-8 h-8 bg-red-100 rounded-md"
            >
              <svg
                class="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">
                Dibatalkan
              </dt>
              <dd class="text-lg font-semibold text-gray-900">
                {{ stats.cancelled }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Cari</label
          >
          <input
            v-model="filters.search"
            type="text"
            placeholder="Nama atau email..."
            class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

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

    <!-- Donations Table -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div v-if="loading" class="p-8 text-center">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
        ></div>
        <p class="mt-2 text-sm text-gray-500">Memuat data...</p>
      </div>

      <div v-else-if="filteredDonations.length === 0" class="p-8 text-center">
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
        <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada donasi</h3>
        <p class="mt-1 text-sm text-gray-500">
          Belum ada donasi yang sesuai dengan filter
        </p>
      </div>

      <ul v-else class="divide-y divide-gray-200">
        <li
          v-for="donation in paginatedDonations"
          :key="donation.id"
          class="p-6"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <div
                  class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <span class="text-sm font-medium text-blue-600">
                    {{ donation.name.charAt(0).toUpperCase() }}
                  </span>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2 mb-1">
                  <h3 class="text-lg font-medium text-gray-900">
                    {{ donation.name }}
                  </h3>
                  <span
                    :class="{
                      'bg-yellow-100 text-yellow-800':
                        donation.status === 'pending',
                      'bg-green-100 text-green-800':
                        donation.status === 'confirmed',
                      'bg-red-100 text-red-800':
                        donation.status === 'cancelled',
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
                  class="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600"
                >
                  <div>
                    <span class="font-medium">Nominal:</span>
                    <span class="ml-1 text-lg font-bold text-green-600">
                      {{ formatCurrency(donation.amount) }}
                    </span>
                  </div>
                  <div>
                    <span class="font-medium">Kategori:</span>
                    <span class="ml-1 capitalize">{{ donation.category }}</span>
                  </div>
                  <div>
                    <span class="font-medium">Tanggal:</span>
                    <span class="ml-1">{{
                      formatDate(donation.created_at)
                    }}</span>
                  </div>
                  <div v-if="donation.email">
                    <span class="font-medium">Email:</span>
                    <span class="ml-1">{{ donation.email }}</span>
                  </div>
                  <div v-if="donation.phone">
                    <span class="font-medium">Telepon:</span>
                    <span class="ml-1">{{ donation.phone }}</span>
                  </div>
                </div>

                <div v-if="donation.title" class="mt-2">
                  <span class="font-medium text-sm text-gray-600">Tujuan:</span>
                  <span class="ml-1 text-sm text-gray-900">{{
                    donation.title
                  }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <button
                v-if="donation.proof_image"
                @click="viewProof(donation.proof_image)"
                class="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                title="Lihat Bukti Transfer"
              >
                <svg
                  class="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>

              <button
                v-if="donation.status === 'pending'"
                @click="confirmDonation(donation)"
                class="inline-flex items-center p-2 border border-green-300 rounded-md text-sm font-medium text-green-600 bg-white hover:bg-green-50"
                title="Konfirmasi Donasi"
              >
                <svg
                  class="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>

              <button
                v-if="donation.status === 'pending'"
                @click="cancelDonation(donation)"
                class="inline-flex items-center p-2 border border-red-300 rounded-md text-sm font-medium text-red-600 bg-white hover:bg-red-50"
                title="Batalkan Donasi"
              >
                <svg
                  class="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>

              <button
                @click="viewDetail(donation)"
                class="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                title="Lihat Detail"
              >
                <svg
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
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Pagination -->
    <div
      class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
    >
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          v-if="currentPage > 1"
          @click="currentPage--"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Sebelumnya
        </button>
        <button
          v-if="currentPage < totalPages"
          @click="currentPage++"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Selanjutnya
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Menampilkan <span class="font-medium">{{ startItem }}</span> -
            <span class="font-medium">{{ endItem }}</span> dari
            <span class="font-medium">{{ filteredDonations.length }}</span>
            donasi
          </p>
        </div>
        <div>
          <nav
            class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          >
            <button
              v-if="currentPage > 1"
              @click="currentPage--"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Sebelumnya
            </button>
            <button
              v-if="currentPage < totalPages"
              @click="currentPage++"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Selanjutnya
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Kelola Donasi - Admin",
  description: "Kelola dan konfirmasi donasi yang masuk",
  layout: "admin",
  middleware: "admin",
});

// State
const loading = ref(false);
const showCreateForm = ref(false);
const currentPage = ref(1);
const itemsPerPage = 10;

const filters = reactive({
  search: "",
  status: "",
  category: "",
  date_from: "",
});

// Mock donations data
const donations = ref([
  {
    id: 1,
    name: "Ahmad Budiman",
    email: "ahmad.budiman@email.com",
    phone: "+628123456789",
    amount: 500000,
    category: "pendidikan",
    status: "pending",
    title: "Donasi untuk Beasiswa Santri",
    proof_image: "/proof1.jpg",
    created_at: "2025-07-11T10:30:00Z",
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    email: "siti.nurhaliza@email.com",
    phone: "+628987654321",
    amount: 200000,
    category: "sosial",
    status: "confirmed",
    title: "Bantuan untuk Korban Bencana",
    proof_image: "/proof2.jpg",
    created_at: "2025-07-11T09:15:00Z",
  },
  {
    id: 3,
    name: "Budi Santoso",
    email: "budi.santoso@email.com",
    phone: "+628111222333",
    amount: 1000000,
    category: "infaq",
    status: "confirmed",
    title: "Infaq Bulanan",
    proof_image: "/proof3.jpg",
    created_at: "2025-07-10T14:20:00Z",
  },
  {
    id: 4,
    name: "Anonymous",
    email: "",
    phone: "",
    amount: 150000,
    category: "zakat",
    status: "pending",
    title: "Zakat Fitrah",
    proof_image: "",
    created_at: "2025-07-10T11:45:00Z",
  },
  {
    id: 5,
    name: "Dewi Kartika",
    email: "dewi.kartika@email.com",
    phone: "+628444555666",
    amount: 300000,
    category: "kesehatan",
    status: "cancelled",
    title: "Bantuan Biaya Pengobatan",
    proof_image: "/proof5.jpg",
    created_at: "2025-07-09T16:30:00Z",
  },
]);

// Computed
const stats = computed(() => ({
  total: donations.value.reduce(
    (sum, d) => (d.status === "confirmed" ? sum + d.amount : sum),
    0
  ),
  pending: donations.value.filter((d) => d.status === "pending").length,
  confirmed: donations.value.filter((d) => d.status === "confirmed").length,
  cancelled: donations.value.filter((d) => d.status === "cancelled").length,
}));

const filteredDonations = computed(() => {
  let filtered = donations.value;

  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.name.toLowerCase().includes(search) ||
        d.email.toLowerCase().includes(search)
    );
  }

  if (filters.status) {
    filtered = filtered.filter((d) => d.status === filters.status);
  }

  if (filters.category) {
    filtered = filtered.filter((d) => d.category === filters.category);
  }

  if (filters.date_from) {
    filtered = filtered.filter((d) => d.created_at >= filters.date_from);
  }

  return filtered;
});

const totalPages = computed(() =>
  Math.ceil(filteredDonations.value.length / itemsPerPage)
);

const paginatedDonations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredDonations.value.slice(start, end);
});

const startItem = computed(() => (currentPage.value - 1) * itemsPerPage + 1);
const endItem = computed(() =>
  Math.min(currentPage.value * itemsPerPage, filteredDonations.value.length)
);

// Methods
const resetFilters = () => {
  filters.search = "";
  filters.status = "";
  filters.category = "";
  filters.date_from = "";
  currentPage.value = 1;
};

const confirmDonation = async (donation: any) => {
  if (!confirm(`Konfirmasi donasi dari ${donation.name}?`)) return;

  loading.value = true;
  try {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    donation.status = "confirmed";
    alert("Donasi berhasil dikonfirmasi");
  } catch (error) {
    alert("Gagal mengkonfirmasi donasi");
  } finally {
    loading.value = false;
  }
};

const cancelDonation = async (donation: any) => {
  const reason = prompt(
    `Batalkan donasi dari ${donation.name}?\nMasukkan alasan:`
  );
  if (!reason) return;

  loading.value = true;
  try {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    donation.status = "cancelled";
    alert("Donasi berhasil dibatalkan");
  } catch (error) {
    alert("Gagal membatalkan donasi");
  } finally {
    loading.value = false;
  }
};

const viewProof = (imageUrl: string) => {
  window.open(imageUrl, "_blank");
};

const viewDetail = (donation: any) => {
  alert(
    `Detail donasi ID: ${donation.id}\nNama: ${
      donation.name
    }\nJumlah: ${formatCurrency(donation.amount)}`
  );
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Watch for filter changes
watch(
  filters,
  () => {
    currentPage.value = 1;
  },
  { deep: true }
);
</script>
