<template>
  <section class="py-16 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
    <div class="container mx-auto px-4">
      <!-- Section Title -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-accent mb-4">Tentang DU</h2>
        <div class="w-24 h-1 bg-highlight mx-auto mb-6"></div>
        <!-- <p class="text-shadow max-w-2xl mx-auto">
          Yayasan Daarul Ummahaat merupakan lembaga nirlaba yang bergerak di
          bidang pendidikan Qur'an dan kegiatan sosial. Kami berkomitmen membina
          generasi Qur'ani serta menjembatani kebaikan antara para muhsinin dan
          masyarakat yang membutuhkan.
        </p> -->
      </div>

      <!-- Info Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <!-- Vision Card -->
        <div class="bg-background p-6 rounded-lg text-center">
          <div
            class="bg-highlight/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <BookOpenIcon class="text-accent w-12 h-12" />
          </div>
          <h3 class="text-xl font-bold text-accent mb-2">Visi</h3>
          <p class="text-shadow">
            Membangun generasi Qur’ani yang peduli dan bermanfaat bagi
            masyarakat.
          </p>
        </div>

        <!-- Mission Card -->
        <div class="bg-background p-6 rounded-lg text-center">
          <div
            class="bg-highlight/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <UsersIcon class="text-accent w-12 h-12" />
          </div>
          <h3 class="text-xl font-bold text-accent mb-2">Misi</h3>
          <p class="text-shadow">
            Menyelenggarakan pendidikan Qur'an, bimbingan belajar, dan program
            sosial.
          </p>
        </div>

        <!-- Programs Card -->
        <div class="bg-background p-6 rounded-lg text-center">
          <div
            class="bg-highlight/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CalendarIcon class="text-accent w-12 h-12" />
          </div>
          <h3 class="text-xl font-bold text-accent mb-2">Program</h3>
          <p class="text-shadow">
            Rumah Tahfizh, Bimbel Cordova, santunan yatim, bantuan dhuafa, dan
            beasiswa.
          </p>
        </div>
      </div>

      <!-- Learn More Button -->
      <div class="text-center">
        <router-link to="/about">
          <button
            class="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md text-lg transition"
          >
            Selengkapnya Tentang DU
          </button>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Importing Heroicons components
import { BookOpenIcon, UsersIcon, CalendarIcon } from "@heroicons/vue/24/solid";
</script>
