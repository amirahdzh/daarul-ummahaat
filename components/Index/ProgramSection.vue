<template>
  <section class="py-16 bg-background">
    <div class="container mx-auto px-4">
      <!-- Section Title -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-accent mb-4">Our Programs</h2>
        <div class="w-24 h-1 bg-highlight mx-auto mb-6"></div>
        <p class="text-shadow max-w-2xl mx-auto">
          Choose from our variety of Qur'anic education programs, tailored to
          different needs, schedules, and learning objectives.
        </p>
      </div>

      <!-- Program Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(program, index) in programs"
          :key="index"
          class="hover:shadow-lg shadow-black/10 transition-shadow"
        >
          <div class="bg-white p-6 rounded-lg">
            <!-- Card Header -->
            <div>
              <div :class="['w-16 h-1 mb-4', colorMap[program.color]]"></div>
              <h3 class="text-xl font-bold text-shadow mb-1">
                {{ program.title }}
              </h3>
              <p class="text-sm text-shadow/70">Level: {{ program.level }}</p>
            </div>
            <!-- Card Content -->
            <div class="mt-4">
              <p class="text-shadow mb-6">{{ program.description }}</p>
              <ul class="space-y-2">
                <li
                  v-for="(feature, i) in program.features"
                  :key="i"
                  class="flex items-center"
                >
                  <span
                    :class="[
                      'w-2 h-2 rounded-full mr-2',
                      colorMap[program.color],
                    ]"
                  ></span>
                  <span class="text-sm text-shadow/90">{{ feature }}</span>
                </li>
              </ul>
            </div>
            <!-- Card Footer -->
            <div class="mt-6">
              <router-link to="/programs">
                <button
                  class="w-full border border-shadow/20 text-shadow hover:text-accent hover:bg-accent/10 transition py-2 rounded"
                >
                  Learn More
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Register Button -->
      <div class="text-center mt-12">
        <router-link to="/register">
          <button
            class="bg-primary hover:bg-accent text-white px-6 py-3 rounded-md text-lg transition"
          >
            Register For Classes
          </button>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

const colorMap = {
  "nurul-red": "bg-primary",
  "nurul-green": "bg-accent",
  "nurul-yellow": "bg-highlight",
};

type ColorKey = keyof typeof colorMap;

const programs = ref<
  {
    title: string;
    description: string;
    features: string[];
    level: string;
    color: ColorKey;
  }[]
>([
  {
    title: "Tahsin Al-Qur'an",
    description:
      "Learn proper Qur'anic pronunciation and recitation with tajweed rules under expert guidance.",
    features: [
      "Letter pronunciation (makhārij)",
      "Tajweed rules application",
      "Rhythmic recitation practice",
      "Small class sizes",
    ],
    level: "All Levels",
    color: "nurul-red",
  },
  {
    title: "Tahfizh Al-Qur'an",
    description:
      "Structured Qur'an memorization program with personalized mentoring and regular progress tracking.",
    features: [
      "Memorization techniques",
      "Revision methods",
      "Progress certification",
      "Regular evaluations",
    ],
    level: "Intermediate & Advanced",
    color: "nurul-green",
  },
  {
    title: "Intensive Weekend Program",
    description:
      "Condensed weekend classes for busy individuals looking to improve their Qur'anic literacy.",
    features: [
      "Weekend schedule",
      "Combined tahsin & tahfizh",
      "Practical application",
      "Community support",
    ],
    level: "Mixed Levels",
    color: "nurul-yellow",
  },
]);
</script>
