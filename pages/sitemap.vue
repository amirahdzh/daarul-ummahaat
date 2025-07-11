<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Peta Situs</h1>
      <p class="text-lg text-gray-600">
        Temukan semua halaman dan fitur yang tersedia di website Daarul Ummahaat
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Main Pages -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <svg
            class="w-5 h-5 mr-2 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7z"
            />
          </svg>
          Halaman Utama
        </h2>
        <ul class="space-y-2">
          <li>
            <NuxtLink
              to="/"
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              🏠 Beranda
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/about"
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              ℹ️ Tentang Kami
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/contact"
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              📞 Kontak
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/sitemap"
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              🗺️ Peta Situs
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Programs -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <svg
            class="w-5 h-5 mr-2 text-green-600"
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
          Program
        </h2>
        <ul class="space-y-2">
          <li>
            <NuxtLink
              to="/programs"
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              📚 Semua Program
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/programs/1"
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              📖 Detail Program (Contoh)
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/donation-packages"
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              📦 Paket Donasi
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/fundraisers"
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              🎯 Fundraiser
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Activities -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <svg
            class="w-5 h-5 mr-2 text-purple-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Kegiatan
        </h2>
        <ul class="space-y-2">
          <li>
            <NuxtLink
              to="/activities"
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              📅 Semua Kegiatan
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/activities/1"
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              🎪 Detail Kegiatan (Contoh)
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Donations -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <svg
            class="w-5 h-5 mr-2 text-orange-600"
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
          Donasi
        </h2>
        <ul class="space-y-2">
          <li>
            <NuxtLink
              to="/donations"
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              💰 Form Donasi
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/donations/success"
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              ✅ Konfirmasi Donasi
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Authentication -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <svg
            class="w-5 h-5 mr-2 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          Autentikasi
        </h2>
        <ul class="space-y-2">
          <li>
            <NuxtLink
              to="/auth/login"
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              🔑 Masuk
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/auth/register"
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              📝 Daftar
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- User Profile -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <svg
            class="w-5 h-5 mr-2 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Profil Pengguna
        </h2>
        <ul class="space-y-2">
          <li>
            <NuxtLink
              to="/profile"
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              👤 Profil Saya
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/profile/donations"
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              📋 Riwayat Donasi
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Admin Panel -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <svg
            class="w-5 h-5 mr-2 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Panel Admin
          <span
            class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full ml-2"
            >Admin Only</span
          >
        </h2>
        <ul class="space-y-2">
          <li>
            <NuxtLink
              to="/admin"
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              🏠 Dashboard Admin
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/admin/programs"
              class="text-blue-600 hover:text-blue-800 hover:underline"
            >
              📚 Kelola Program
            </NuxtLink>
          </li>
          <li>
            <span class="text-gray-400">📦 Kelola Paket Donasi (Soon)</span>
          </li>
          <li>
            <span class="text-gray-400">🎯 Kelola Fundraiser (Soon)</span>
          </li>
          <li>
            <span class="text-gray-400">📅 Kelola Kegiatan (Soon)</span>
          </li>
          <li>
            <span class="text-gray-400">💰 Kelola Donasi (Soon)</span>
          </li>
          <li>
            <span class="text-gray-400">👥 Kelola Pengguna (Soon)</span>
          </li>
        </ul>
      </div>

      <!-- API Endpoints -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <svg
            class="w-5 h-5 mr-2 text-yellow-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          API Endpoints
          <span
            class="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full ml-2"
            >Dev</span
          >
        </h2>
        <ul class="space-y-2 text-sm">
          <li>
            <code class="text-green-600">GET /api/programs</code>
          </li>
          <li>
            <code class="text-green-600">GET /api/activities</code>
          </li>
          <li>
            <code class="text-green-600">GET /api/fundraisers</code>
          </li>
          <li>
            <code class="text-green-600">GET /api/donation-packages</code>
          </li>
          <li>
            <code class="text-blue-600">POST /api/donations</code>
          </li>
          <li>
            <code class="text-blue-600">POST /api/login</code>
          </li>
          <li>
            <code class="text-blue-600">POST /api/register</code>
          </li>
          <li>
            <code class="text-red-600">POST /api/logout</code>
          </li>
        </ul>
      </div>

      <!-- Features -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <svg
            class="w-5 h-5 mr-2 text-pink-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Fitur Utama
        </h2>
        <ul class="space-y-2">
          <li class="flex items-center">
            <span class="text-green-500 mr-2">✅</span>
            <span>Responsive Design</span>
          </li>
          <li class="flex items-center">
            <span class="text-green-500 mr-2">✅</span>
            <span>Authentication & Authorization</span>
          </li>
          <li class="flex items-center">
            <span class="text-green-500 mr-2">✅</span>
            <span>Search & Filter</span>
          </li>
          <li class="flex items-center">
            <span class="text-green-500 mr-2">✅</span>
            <span>Pagination</span>
          </li>
          <li class="flex items-center">
            <span class="text-green-500 mr-2">✅</span>
            <span>Form Validation</span>
          </li>
          <li class="flex items-center">
            <span class="text-green-500 mr-2">✅</span>
            <span>Loading States</span>
          </li>
          <li class="flex items-center">
            <span class="text-green-500 mr-2">✅</span>
            <span>Error Handling</span>
          </li>
          <li class="flex items-center">
            <span class="text-green-500 mr-2">✅</span>
            <span>SEO Optimized</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mt-16 text-center">
      <h2 class="text-2xl font-bold text-gray-900 mb-8">Aksi Cepat</h2>
      <div class="flex flex-wrap justify-center gap-4">
        <NuxtLink
          to="/donations"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          💰 Donasi Sekarang
        </NuxtLink>
        <NuxtLink
          to="/programs"
          class="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          📚 Lihat Program
        </NuxtLink>
        <NuxtLink
          to="/activities"
          class="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          📅 Lihat Kegiatan
        </NuxtLink>
        <NuxtLink
          to="/auth/register"
          class="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          📝 Bergabung
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Peta Situs - Daarul Ummahaat",
  description:
    "Peta situs website Daarul Ummahaat dengan semua halaman dan fitur yang tersedia",
  layout: "default",
});

useSeoMeta({
  title: "Peta Situs - Daarul Ummahaat",
  description:
    "Peta situs website Daarul Ummahaat dengan semua halaman dan fitur yang tersedia",
  ogTitle: "Peta Situs - Daarul Ummahaat",
  ogDescription:
    "Peta situs website Daarul Ummahaat dengan semua halaman dan fitur yang tersedia",
});
</script>
