<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="md:flex md:items-center md:justify-between">
          <div class="flex-1 min-w-0">
            <h1 class="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
            <p class="mt-1 text-gray-600">
              Ringkasan data dan statistik Daarul Ummahaat
            </p>
          </div>
          <div class="mt-4 md:mt-0 flex items-center space-x-3">
            <span class="text-sm text-gray-500">
              Last updated: {{ formatDate(new Date().toISOString()) }}
            </span>
            <button
              @click="refresh()"
              class="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg
                class="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="pending" class="animate-pulse space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="n in 4" :key="n" class="bg-white rounded-lg shadow p-6">
            <div class="h-4 bg-gray-300 rounded mb-2"></div>
            <div class="h-8 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div v-for="n in 2" :key="n" class="bg-white rounded-lg shadow p-6">
            <div class="h-6 bg-gray-300 rounded mb-4"></div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-300 rounded"></div>
              <div class="h-4 bg-gray-300 rounded w-3/4"></div>
              <div class="h-4 bg-gray-300 rounded w-1/2"></div>
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
            Gagal memuat dashboard
          </h3>
          <p class="text-red-600 mb-4">
            {{ error || "Terjadi kesalahan saat memuat data" }}
          </p>
          <button
            @click="refresh()"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div v-else-if="data" class="space-y-8">
        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Donations -->
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
                    ></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Total Donasi
                  </dt>
                  <dd class="text-lg font-semibold text-gray-900">
                    {{ formatCurrency(data.total_donations || 0) }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <!-- Active Fundraisers -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div
                  class="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-md"
                >
                  <svg
                    class="w-5 h-5 text-blue-600"
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
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Penggalangan Aktif
                  </dt>
                  <dd class="text-lg font-semibold text-gray-900">
                    {{ data.active_fundraisers || 0 }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <!-- Total Users -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div
                  class="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-md"
                >
                  <svg
                    class="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Total Pengguna
                  </dt>
                  <dd class="text-lg font-semibold text-gray-900">
                    {{ data.total_users || 0 }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <!-- Pending Donations -->
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
                    ></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Donasi Pending
                  </dt>
                  <dd class="text-lg font-semibold text-gray-900">
                    {{ data.pending_donations || 0 }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts/Graphs Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Recent Donations -->
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Donasi Terbaru</h3>
            </div>
            <div class="p-6">
              <div v-if="data.recent_donations?.length" class="space-y-4">
                <div
                  v-for="donation in data.recent_donations.slice(0, 5)"
                  :key="donation.id"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">
                      {{ donation.name }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ donation.category }} •
                      {{ formatDate(donation.created_at) }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-semibold text-green-600">
                      {{ formatCurrency(donation.amount) }}
                    </p>
                    <p class="text-xs text-gray-500">{{ donation.status }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-6 text-gray-500">
                Belum ada donasi terbaru
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Aksi Cepat</h3>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-2 gap-4">
                <NuxtLink
                  to="/admin/donations"
                  class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  <svg
                    class="w-8 h-8 text-blue-600 mx-auto mb-2"
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
                  <p class="text-sm font-medium text-gray-900">Kelola Donasi</p>
                </NuxtLink>

                <NuxtLink
                  to="/admin/fundraisers"
                  class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  <svg
                    class="w-8 h-8 text-green-600 mx-auto mb-2"
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
                  <p class="text-sm font-medium text-gray-900">
                    Penggalangan Dana
                  </p>
                </NuxtLink>

                <NuxtLink
                  to="/admin/programs"
                  class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  <svg
                    class="w-8 h-8 text-purple-600 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    ></path>
                  </svg>
                  <p class="text-sm font-medium text-gray-900">Program</p>
                </NuxtLink>

                <NuxtLink
                  to="/admin/users"
                  class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  <svg
                    class="w-8 h-8 text-orange-600 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    ></path>
                  </svg>
                  <p class="text-sm font-medium text-gray-900">Pengguna</p>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activities -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Aktivitas Terbaru</h3>
          </div>
          <div class="p-6">
            <div v-if="data.recent_activities?.length" class="space-y-4">
              <div
                v-for="activity in data.recent_activities.slice(0, 5)"
                :key="activity.id"
                class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex-shrink-0">
                  <div
                    class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
                  >
                    <svg
                      class="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900">
                    {{ activity.title }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ formatEventDate(activity.event_date) }}
                  </p>
                </div>
                <div class="flex-shrink-0">
                  <span
                    :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      activity.is_published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800',
                    ]"
                  >
                    {{ activity.is_published ? "Published" : "Draft" }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-6 text-gray-500">
              Belum ada aktivitas terbaru
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface DashboardData {
  total_donations: number;
  active_fundraisers: number;
  total_users: number;
  pending_donations: number;
  recent_donations: Array<{
    id: number;
    name: string;
    amount: number;
    category: string;
    status: string;
    created_at: string;
  }>;
  recent_activities: Array<{
    id: number;
    title: string;
    event_date: string;
    is_published: boolean;
  }>;
}

// Page meta with auth middleware
definePageMeta({
  title: "Dashboard Admin - Daarul Ummahaat",
  description: "Dashboard admin untuk mengelola data Daarul Ummahaat",
  layout: "admin",
  middleware: "admin",
});

// Mock dashboard data (replace with real API when backend is ready)
const pending = ref(false);
const error = ref(null);

const data = ref<DashboardData>({
  total_donations: 25750000,
  active_fundraisers: 8,
  total_users: 234,
  pending_donations: 12,
  recent_donations: [
    {
      id: 1,
      name: "Ahmad Budiman",
      amount: 500000,
      category: "pendidikan",
      status: "confirmed",
      created_at: "2025-07-11T10:30:00Z",
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      amount: 200000,
      category: "sosial",
      status: "pending",
      created_at: "2025-07-11T09:15:00Z",
    },
    {
      id: 3,
      name: "Budi Santoso",
      amount: 1000000,
      category: "infaq",
      status: "confirmed",
      created_at: "2025-07-10T14:20:00Z",
    },
    {
      id: 4,
      name: "Anonymous",
      amount: 150000,
      category: "zakat",
      status: "confirmed",
      created_at: "2025-07-10T11:45:00Z",
    },
    {
      id: 5,
      name: "Dewi Kartika",
      amount: 300000,
      category: "kesehatan",
      status: "pending",
      created_at: "2025-07-09T16:30:00Z",
    },
  ],
  recent_activities: [
    {
      id: 1,
      title: "Buka Puasa Bersama Anak Yatim",
      event_date: "2025-07-15T18:00:00Z",
      is_published: true,
    },
    {
      id: 2,
      title: "Bakti Sosial Ramadan",
      event_date: "2025-07-20T08:00:00Z",
      is_published: true,
    },
    {
      id: 3,
      title: "Pelatihan Tahfizh",
      event_date: "2025-07-25T09:00:00Z",
      is_published: false,
    },
    {
      id: 4,
      title: "Pembagian Sembako",
      event_date: "2025-07-30T10:00:00Z",
      is_published: true,
    },
    {
      id: 5,
      title: "Workshop Keterampilan",
      event_date: "2025-08-05T13:00:00Z",
      is_published: false,
    },
  ],
});

// Simulate data refresh
const refresh = () => {
  pending.value = true;

  setTimeout(() => {
    // Simulate updated data
    data.value.total_donations += Math.floor(Math.random() * 1000000);
    data.value.pending_donations = Math.floor(Math.random() * 20);
    pending.value = false;
  }, 1000);
};

// Methods
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatEventDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    month: "short",
    day: "numeric",
  });
};

// SEO
useHead({
  title: "Dashboard Admin - Daarul Ummahaat",
  meta: [
    {
      name: "description",
      content:
        "Dashboard admin untuk mengelola dan memantau aktivitas Daarul Ummahaat",
    },
  ],
});
</script>
