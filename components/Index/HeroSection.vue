<template>
  <div
    class="bg-[url('/src/assets/home/hero-bg.jpg')] bg-cover mt-16 bg-center h-[70vh] min-h-[500px] flex items-center"
  >
    <div class="container mx-auto px-4">
      <div
        class="max-w-lg bg-shadow/80 p-8 rounded-lg backdrop-blur-sm animate-fade-in"
      >
        <h1 class="text-4xl md:text-5xl font-bold text-background mb-2">
          Rumah Tahfidz
          <span class="text-highlight">Nurul Qur'an</span>
        </h1>
        <p class="text-xl text-background font-arabic mb-2">نورُ القرآن</p>
        <p class="text-background/90 mb-6">
          Learn to recite and memorize the Holy Qur'an with proper tajweed in a
          supportive and enriching environment guided by experienced
          instructors.
        </p>
        <div class="flex flex-wrap gap-4">
          <RouterLink to="/register">
            <button
              class="bg-primary hover:bg-hover-accent text-white px-6 py-3 rounded-md text-lg transition-colors"
            >
              Register Now
            </button>
          </RouterLink>
          <RouterLink to="/programs">
            <button
              class="bg-transparent text-background border border-background hover:bg-background/10 px-6 py-3 rounded-md text-lg transition-colors"
            >
              Explore Programs
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
