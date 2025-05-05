<template>
  <section class="py-16 bg-islamic-pattern">
    <div class="container mx-auto px-4">
      <!-- Section Title -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-accent mb-4">About Nurul Qur'an</h2>
        <div class="w-24 h-1 bg-highlight mx-auto mb-6"></div>
        <p class="text-shadow max-w-2xl mx-auto">
          Rumah Tahfidz Nurul Qur'an is dedicated to nurturing a deep connection
          with the Holy Qur'an through proper recitation and memorization in a
          supportive Islamic environment.
        </p>
      </div>

      <!-- Info Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <!-- Vision Card -->
        <div
          class="bg-background p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
        >
          <div
            class="bg-highlight/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <BookOpenIcon class="text-accent w-8 h-8" />
          </div>
          <h3 class="text-xl font-bold text-accent mb-2">Our Vision</h3>
          <p class="text-shadow">
            To foster a community of believers who embody the teachings of the
            Qur'an and serve as ambassadors of Islamic knowledge and values.
          </p>
        </div>

        <!-- Mission Card -->
        <div
          class="bg-background p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
        >
          <div
            class="bg-highlight/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <UsersIcon class="text-accent w-8 h-8" />
          </div>
          <h3 class="text-xl font-bold text-accent mb-2">Our Mission</h3>
          <p class="text-shadow">
            To provide high-quality Qur'anic education that emphasizes proper
            recitation, understanding, and memorization in a nurturing
            environment.
          </p>
        </div>

        <!-- Programs Card -->
        <div
          class="bg-background p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
        >
          <div
            class="bg-highlight/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CalendarIcon class="text-accent w-8 h-8" />
          </div>
          <h3 class="text-xl font-bold text-accent mb-2">Our Programs</h3>
          <p class="text-shadow">
            We offer structured programs for all ages and levels, from beginner
            tahsin classes to advanced tahfizh studies with personalized
            guidance.
          </p>
        </div>
      </div>

      <!-- Learn More Button -->
      <div class="text-center">
        <router-link to="/about">
          <button
            class="bg-accent hover:bg-accent text-white px-6 py-3 rounded-md text-lg transition"
          >
            Learn More About Us
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
