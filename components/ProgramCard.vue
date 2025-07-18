<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
  >
    <!-- Program Image -->
    <div class="relative h-48 bg-gray-200">
      <img
        v-if="program.image"
        :src="getImageUrl(program.image)"
        :alt="program.title"
        class="w-full h-full object-cover"
        @error="onImageError"
      />
      <div
        v-else
        class="flex items-center justify-center h-full bg-gradient-to-br from-blue-100 to-blue-200"
      >
        <svg
          class="w-12 h-12 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          ></path>
        </svg>
      </div>

      <!-- Published Status Badge -->
      <div class="absolute top-3 right-3">
        <span
          :class="[
            'px-2 py-1 text-xs font-medium rounded-full',
            program.is_published
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800',
          ]"
        >
          {{ program.is_published ? "Aktif" : "Draft" }}
        </span>
      </div>
    </div>

    <!-- Program Content -->
    <div class="p-6">
      <div class="flex items-start justify-between mb-3">
        <h3 class="text-xl font-semibold text-gray-900 line-clamp-2">
          {{ program.title }}
        </h3>
      </div>

      <p class="text-gray-600 text-sm mb-4 line-clamp-3">
        {{ program.description }}
      </p>

      <!-- Program Meta -->
      <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span class="flex items-center">
          <svg
            class="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
          {{ formatDate(program.created_at) }}
        </span>
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-3">
        <NuxtLink
          :to="`/programs/${program.id}`"
          class="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
        >
          Lihat Detail
        </NuxtLink>

        <a
          v-if="program.external_link"
          :href="program.external_link"
          target="_blank"
          rel="noopener noreferrer"
          class="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center"
        >
          <svg
            class="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            ></path>
          </svg>
          Link
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Program {
  id: number;
  title: string;
  description: string;
  image: string;
  external_link?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface Props {
  program: Program;
}

const props = defineProps<Props>();

// Methods
const getImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  const config = useRuntimeConfig();
  return `${config.public.apiBase.replace("/api", "")}/storage/${imagePath}`;
};

const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.style.display = "none";
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
}
</style>
