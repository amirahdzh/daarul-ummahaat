<template>
  <section class="py-16 bg-background">
    <div class="container mx-auto px-4">
      <!-- Section Title -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-accent mb-4">Donasi Rutin</h2>
        <div class="w-24 h-1 bg-highlight mx-auto mb-6"></div>
        <p class="text-shadow max-w-2xl mx-auto">
          Pilih bentuk dukungan rutin untuk mendukung kegiatan sosial dan
          pendidikan yang dijalankan Yayasan Daarul Ummahaat.
        </p>
      </div>

      <!-- Donation Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(donation, index) in donations"
          :key="index"
          class="hover:shadow-lg shadow-black/10 transition-shadow"
        >
          <div class="bg-white p-6 rounded-lg">
            <!-- Card Header -->
            <div>
              <div :class="['w-16 h-1 mb-4', colorMap[donation.color]]"></div>
              <h3 class="text-xl font-bold text-shadow mb-1">
                {{ donation.title }}
              </h3>
              <p class="text-sm text-shadow/70">
                Rekomendasi: {{ donation.amount }}
              </p>
            </div>
            <!-- Card Content -->
            <div class="mt-4">
              <p class="text-shadow mb-6">{{ donation.description }}</p>
              <ul class="space-y-2">
                <li
                  v-for="(benefit, i) in donation.benefits"
                  :key="i"
                  class="flex items-center"
                >
                  <span
                    :class="[
                      'w-2 h-2 rounded-full mr-2',
                      colorMap[donation.color],
                    ]"
                  ></span>
                  <span class="text-sm text-shadow/90">{{ benefit }}</span>
                </li>
              </ul>
            </div>
            <!-- Card Footer -->
            <div class="mt-6">
              <router-link to="/donasi">
                <button
                  class="w-full border border-shadow/20 text-shadow hover:text-accent hover:bg-accent/10 transition py-2 rounded"
                >
                  Donasi Sekarang
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center mt-12">
        <router-link to="/donasi">
          <button
            class="bg-primary hover:bg-accent text-white px-6 py-3 rounded-md text-lg transition"
          >
            Lihat Semua Pilihan Donasi
          </button>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const colorMap = {
  red: "bg-primary",
  green: "bg-accent",
  yellow: "bg-highlight",
};

type ColorKey = keyof typeof colorMap;

const donations = [
  {
    title: "Infaq Pendidikan",
    description:
      "Mendukung kegiatan belajar santri Rumah Tahfizh & Bimbel Cordova secara berkelanjutan.",
    benefits: [
      "Biaya operasional pendidikan",
      "Honor ustadz & guru",
      "Bahan ajar & modul",
    ],
    amount: "Rp100.000/bulan",
    color: "red" as ColorKey,
  },
  {
    title: "Santunan Yatim & Dhuafa",
    description:
      "Bantu memenuhi kebutuhan dasar anak yatim dan keluarga kurang mampu di sekitar yayasan.",
    benefits: [
      "Uang saku & sembako bulanan",
      "Kesehatan & transportasi",
      "Momen berbagi (Idul Fitri, Ramadhan)",
    ],
    amount: "Rp150.000/bulan",
    color: "green" as ColorKey,
  },
  {
    title: "Wakaf Al-Qur’an & Buku",
    description:
      "Bantu pengadaan mushaf Al-Qur’an dan buku islami untuk program dakwah & tahfizh.",
    benefits: [
      "Pembelian & distribusi Qur'an",
      "Buku pelajaran agama & akhlak",
      "Pahala jariyah berkelanjutan",
    ],
    amount: "Rp50.000 – bebas",
    color: "yellow" as ColorKey,
  },
];
</script>
