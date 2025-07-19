<template>
  <div>
    <!-- Hero Section -->
    <IndexHeroSection />

    <!-- About Section -->
    <IndexAboutSection />

    <!-- Program Section -->
    <ClientOnly>
      <IndexProgramSection />
      <template #fallback>
        <div class="py-16 bg-primary-dark">
          <div class="container mx-auto px-4 text-center">
            <div class="text-white">Memuat program unggulan...</div>
          </div>
        </div>
      </template>
    </ClientOnly>

    <!-- Activity Section -->
    <ClientOnly>
      <IndexActivitySection />
      <template #fallback>
        <div class="py-16 bg-gray-50">
          <div class="container mx-auto px-4 text-center">
            <div class="text-gray-600">Memuat kegiatan terbaru...</div>
          </div>
        </div>
      </template>
    </ClientOnly>

    <!-- Donation Section -->
    <ClientOnly>
      <IndexDonationSection />
      <template #fallback>
        <div class="py-16 bg-white">
          <div class="container mx-auto px-4 text-center">
            <div class="text-gray-600">Memuat paket donasi...</div>
          </div>
        </div>
      </template>
    </ClientOnly>

    <!-- Quick Links Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900">Mulai Berdonasi</h2>
          <p class="mt-4 text-lg text-gray-600">
            Bergabunglah dengan ribuan donatur untuk membantu sesama
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Quick Donation -->
          <NuxtLink
            to="/donations"
            class="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center"
          >
            <div
              class="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors"
            >
              <svg
                class="w-6 h-6 text-blue-600"
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
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              Donasi Sekarang
            </h3>
            <p class="text-sm text-gray-600">
              Mulai berdonasi dengan mudah dan aman
            </p>
          </NuxtLink>

          <!-- View Programs -->
          <NuxtLink
            to="/programs"
            class="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center"
          >
            <div
              class="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors"
            >
              <svg
                class="w-6 h-6 text-green-600"
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
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              Lihat Program
            </h3>
            <p class="text-sm text-gray-600">
              Jelajahi program pendidikan dan sosial kami
            </p>
          </NuxtLink>

          <!-- View Activities -->
          <NuxtLink
            to="/activities"
            class="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center"
          >
            <div
              class="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors"
            >
              <svg
                class="w-6 h-6 text-purple-600"
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
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Kegiatan</h3>
            <p class="text-sm text-gray-600">
              Ikuti kegiatan dan event terbaru kami
            </p>
          </NuxtLink>

          <!-- Join Community -->
          <NuxtLink
            to="/auth/register"
            class="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center"
          >
            <div
              class="w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors"
            >
              <svg
                class="w-6 h-6 text-orange-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Bergabung</h3>
            <p class="text-sm text-gray-600">
              Daftar untuk menjadi bagian komunitas
            </p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="py-16 bg-blue-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-white">Dampak Nyata Bersama</h2>
          <p class="mt-4 text-lg text-blue-100">
            Pencapaian yang telah kita raih bersama
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="text-4xl font-bold text-white mb-2">1,234</div>
            <div class="text-blue-100">Donatur Aktif</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-white mb-2">Rp 2.5M</div>
            <div class="text-blue-100">Total Donasi</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-white mb-2">15</div>
            <div class="text-blue-100">Program Aktif</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-white mb-2">567</div>
            <div class="text-blue-100">Penerima Manfaat</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-16 bg-white">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          Mari Berdonasi untuk Kebaikan
        </h2>
        <p class="text-lg text-gray-600 mb-8">
          Setiap donasi Anda sangat berarti untuk membantu sesama dan membangun
          masa depan yang lebih baik
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/donations"
            class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Donasi Sekarang
          </NuxtLink>
          <NuxtLink
            to="/fundraisers"
            class="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Lihat Fundraiser
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Daarul Ummahaat - Yayasan Pendidikan dan Sosial",
  description:
    "Yayasan Daarul Ummahaat adalah lembaga pendidikan dan sosial yang berkomitmen untuk membantu masyarakat melalui program pendidikan, beasiswa, dan kegiatan sosial.",
  keywords: "yayasan, pendidikan, sosial, donasi, beasiswa, tahfizh, bimbel",
  layout: "default",
});

// SEO Meta Tags
useSeoMeta({
  title: "Daarul Ummahaat - Yayasan Pendidikan dan Sosial",
  ogTitle: "Daarul Ummahaat - Yayasan Pendidikan dan Sosial",
  description:
    "Yayasan Daarul Ummahaat adalah lembaga pendidikan dan sosial yang berkomitmen untuk membantu masyarakat melalui program pendidikan, beasiswa, dan kegiatan sosial.",
  ogDescription:
    "Yayasan Daarul Ummahaat adalah lembaga pendidikan dan sosial yang berkomitmen untuk membantu masyarakat melalui program pendidikan, beasiswa, dan kegiatan sosial.",
  ogImage: "/src/assets/logo-du.png",
  twitterCard: "summary_large_image",
});
</script>
