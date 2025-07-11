<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="pending" class="animate-pulse">
      <div class="bg-white border-b">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="h-64 bg-gray-300 rounded-lg mb-8"></div>
        <div class="space-y-4">
          <div class="h-4 bg-gray-300 rounded"></div>
          <div class="h-4 bg-gray-300 rounded w-5/6"></div>
          <div class="h-4 bg-gray-300 rounded w-4/6"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="min-h-screen flex items-center justify-center"
    >
      <div class="text-center">
        <div
          class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto"
        >
          <div
            class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full"
          >
            <svg
              class="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-red-800 mb-2">
            Program tidak ditemukan
          </h3>
          <p class="text-red-600 mb-4">{{ error.message }}</p>
          <div class="space-x-3">
            <button
              @click="refresh()"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Coba Lagi
            </button>
            <NuxtLink
              to="/programs"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Kembali ke Program
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Program Content -->
    <div v-else-if="data" class="space-y-0">
      <!-- Breadcrumb -->
      <nav class="bg-white border-b">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ol class="flex items-center space-x-2 text-sm">
            <li>
              <NuxtLink to="/" class="text-gray-500 hover:text-gray-700">
                Home
              </NuxtLink>
            </li>
            <li class="text-gray-400">/</li>
            <li>
              <NuxtLink
                to="/programs"
                class="text-gray-500 hover:text-gray-700"
              >
                Program
              </NuxtLink>
            </li>
            <li class="text-gray-400">/</li>
            <li class="text-gray-900 font-medium">{{ data.title }}</li>
          </ol>
        </div>
      </nav>

      <!-- Program Header -->
      <div class="bg-white border-b">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="flex items-start justify-between mb-6">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-4">
                <span
                  :class="[
                    'px-3 py-1 text-sm font-medium rounded-full',
                    data.is_published
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800',
                  ]"
                >
                  {{ data.is_published ? "Program Aktif" : "Draft" }}
                </span>
                <span class="text-gray-500 text-sm">
                  Dibuat {{ formatDate(data.created_at) }}
                </span>
              </div>
              <h1 class="text-3xl font-bold text-gray-900 mb-4">
                {{ data.title }}
              </h1>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-3">
            <a
              v-if="data.external_link"
              :href="data.external_link"
              target="_blank"
              rel="noopener noreferrer"
              class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg
                class="w-5 h-5 mr-2"
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
              Kunjungi Program
            </a>

            <button
              @click="shareProgram"
              class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                ></path>
              </svg>
              Bagikan
            </button>

            <NuxtLink
              to="/donations?program_related=true"
              class="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
              Dukung Program Ini
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Program Image -->
      <div v-if="data.image" class="bg-white border-b">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="relative rounded-lg overflow-hidden">
            <img
              :src="getImageUrl(data.image)"
              :alt="data.title"
              class="w-full h-64 md:h-96 object-cover"
              @error="onImageError"
            />
          </div>
        </div>
      </div>

      <!-- Program Description -->
      <div class="bg-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="prose prose-lg max-w-none">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">
              Tentang Program
            </h2>
            <div class="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {{ data.description }}
            </div>
          </div>
        </div>
      </div>

      <!-- Related Programs Section -->
      <div class="bg-gray-50 border-t">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 class="text-2xl font-bold text-gray-900 mb-8">Program Lainnya</h2>
          <div
            v-if="relatedPending"
            class="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div v-for="n in 2" :key="n" class="animate-pulse">
              <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="h-48 bg-gray-300"></div>
                <div class="p-6">
                  <div class="h-4 bg-gray-300 rounded mb-2"></div>
                  <div class="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-else-if="relatedPrograms?.data"
            class="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <ProgramCard
              v-for="program in relatedPrograms.data.slice(0, 2)"
              :key="program.id"
              :program="program"
            />
          </div>
        </div>
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

// Get route params
const route = useRoute();
const programId = route.params.id as string;

// Page meta
definePageMeta({
  validate: async (route) => {
    return typeof route.params.id === "string" && /^\d+$/.test(route.params.id);
  },
});

// Fetch program data
const { data, pending, error, refresh } = await useFetch<Program>(
  `/api/programs/${programId}`,
  {
    baseURL: "http://localhost:8000",
  }
);

// Fetch related programs
const { data: relatedPrograms, pending: relatedPending } = await useFetch<{
  data: Program[];
}>("/api/programs", {
  baseURL: "http://localhost:8000",
  query: { per_page: 4 },
});

// Methods
const getImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  return `http://localhost:8000/storage/${imagePath}`;
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

const shareProgram = async () => {
  if (navigator.share && data.value) {
    try {
      await navigator.share({
        title: data.value.title,
        text: data.value.description,
        url: window.location.href,
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(window.location.href);
    // You could show a toast notification here
    alert("Link telah disalin ke clipboard!");
  }
};

// SEO
watchEffect(() => {
  if (data.value) {
    useHead({
      title: data.value.title,
      meta: [
        {
          name: "description",
          content: data.value.description.substring(0, 160) + "...",
        },
        { property: "og:title", content: data.value.title },
        { property: "og:description", content: data.value.description },
        {
          property: "og:image",
          content: data.value.image ? getImageUrl(data.value.image) : "",
        },
        { property: "og:type", content: "article" },
      ],
    });
  }
});

// Handle 404
if (error.value?.statusCode === 404) {
  throw createError({
    statusCode: 404,
    statusMessage: "Program tidak ditemukan",
  });
}
</script>
