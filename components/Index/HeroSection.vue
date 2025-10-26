<template>
  <div
    class="bg-[url('/src/assets/home/hero-bg.jpg')] bg-cover mt-16 bg-center h-[70vh] min-h-[500px] flex items-center"
  >
    <div class="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <div
        class="max-w-lg bg-shadow/80 p-8 rounded-lg backdrop-blur-sm animate-fade-in"
      >
        <h1 class="text-4xl md:text-5xl font-bold text-background mb-2">
          Daarul
          <span class="text-highlight">Ummahaat</span>
        </h1>
        <!-- <p class="text-xl text-background font-arabic mb-2">نورُ القرآن</p> -->
        <p class="text-background/90 mb-6">
          Menyatukan pendidikan, dakwah, dan aksi sosial dalam satu ruang
          digital.
        </p>
        <div class="flex flex-wrap gap-4">
          <RouterLink to="/register">
            <button
              class="bg-accent text-white px-6 py-3 rounded-md text-lg transition-colors"
            >
              Donasi Sekarang
            </button>
          </RouterLink>
          <RouterLink to="/programs">
            <button
              class="bg-transparent text-background border border-background hover:bg-background/10 px-6 py-3 rounded-md text-lg transition-colors"
            >
              Lihat Program
            </button>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>
