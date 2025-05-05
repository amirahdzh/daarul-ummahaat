<template>
  <section class="py-16 bg-background">
    <div class="container mx-auto px-4">
      <!-- Section Title -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-accent mb-4">Latest Activities</h2>
        <div class="w-24 h-1 bg-highlight mx-auto mb-6"></div>
        <p class="text-shadow/70 max-w-2xl mx-auto">
          Stay updated on our recent events, ceremonies, and special programs
          that enrich our Qur'anic learning community.
        </p>
      </div>

      <!-- Activity Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(activity, index) in activities"
          :key="index"
          class="bg-background rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
        >
          <div class="h-48 overflow-hidden">
            <img
              :src="activity.image"
              :alt="activity.title"
              class="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
          <div class="p-6">
            <div class="flex items-center text-primary mb-2">
              <CalendarIcon class="mr-2 h-4 w-4 text-primary" />
              <span class="text-sm">{{ activity.date }}</span>
            </div>
            <h3 class="text-xl font-bold text-shadow mb-2">
              {{ activity.title }}
            </h3>
            <p class="text-shadow/80 mb-4">{{ activity.description }}</p>
            <RouterLink
              to="/gallery"
              class="text-accent hover:text-hover-accent text-sm font-medium"
            >
              See event photos →
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- View All Activities Button -->
      <div class="text-center mt-12">
        <RouterLink to="/gallery">
          <button
            class="bg-accent hover:bg-hover-accent text-white px-6 py-2 rounded-lg shadow transition-colors"
          >
            View All Activities
          </button>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { CalendarIcon } from "@heroicons/vue/24/outline";

const activities = ref([
  {
    title: "Annual Tahfizh Competition",
    date: "April 15, 2025",
    image:
      "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?auto=format&fit=crop&q=80",
    description:
      "Our annual competition where students showcase their Qur'an memorization skills before a panel of judges.",
  },
  {
    title: "Ramadan Intensive Program",
    date: "March 10-30, 2025",
    image:
      "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80",
    description:
      "Special intensive Qur'an study and memorization program during the blessed month of Ramadan.",
  },
  {
    title: "Community Iftar & Tarawih",
    date: "Ramadan 1446H",
    image:
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80",
    description:
      "Join our community for iftar meals followed by special tarawih prayers led by our tahfizh students.",
  },
]);
</script>

<style scoped>
/* Kosongkan jika tidak perlu style tambahan */
</style>
