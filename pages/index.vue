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
    <!-- <ClientOnly>
      <IndexDonationSection />
      <template #fallback>
        <div class="py-16 bg-white">
          <div class="container mx-auto px-4 text-center">
            <div class="text-gray-600">Memuat paket donasi...</div>
          </div>
        </div>
      </template>
    </ClientOnly> -->

    <!-- Statistics Section -->
    <!-- <section class="py-16 bg-blue-600">
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
    </section> -->

    <!-- Call to Action -->
    <!-- <section class="py-16 bg-white">
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
    </section> -->
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
