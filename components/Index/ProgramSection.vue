<template>
  <section class="py-16 bg-primary-dark">
    <div class="container mx-auto px-4">
      <!-- Title (SSR OK) -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-white mb-4">Program Unggulan</h2>
        <p class="text-white/80 max-w-2xl mx-auto">
          Tiga pilar utama Yayasan dalam mendidik, membimbing, dan berbagi.
        </p>
        <div class="w-24 h-1 bg-primary-light mx-auto mt-4"></div>
      </div>
      <!-- Carousel (Client only) -->
      <ClientOnly>
        <div class="relative">
          <!-- Swiper and Navigation Buttons -->
          <template v-if="!pending">
            <!-- Swiper -->
            <Swiper
              :modules="[Autoplay, Navigation, Pagination]"
              :slides-per-view="1"
              :loop="programs.length > 1"
              :autoplay="{ delay: 5000, disableOnInteraction: false }"
              :navigation="{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }"
              :pagination="{ el: '.swiper-pagination', clickable: true }"
              class="w-full"
            >
              <SwiperSlide
                v-for="(program, index) in programs"
                :key="program.id"
                class="group"
              >
                <div
                  class="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-white to-gray-50 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 max-w-xl mx-auto"
                  style="min-height: 400px"
                >
                  <!-- Background Pattern -->
                  <div
                    class="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  ></div>

                  <!-- Program Number Badge -->
                  <div
                    class="absolute top-4 left-4 z-10 bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg"
                  >
                    {{ index + 1 }}
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 min-h-[400px]">
                    <!-- Image Section (2/3 width) -->
                    <div
                      class="relative overflow-hidden md:col-span-2 flex items-center"
                    >
                      <img
                        :src="program.image"
                        :alt="program.title"
                        class="w-full h-72 max-h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                        style="aspect-ratio: 16/9"
                      />
                      <!-- Image Overlay -->
                      <div
                        class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      ></div>

                      <!-- Website Link Overlay -->
                      <div
                        v-if="program.website"
                        class="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0"
                      >
                        <a
                          :href="program.website"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-primary px-3 py-2 rounded-full text-sm font-medium hover:bg-white transition-colors duration-300"
                        >
                          <svg
                            class="w-4 h-4"
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
                          Website
                        </a>
                      </div>
                    </div>

                    <!-- Content Section (1/3 width) -->
                    <div
                      class="p-6 md:p-8 flex flex-col justify-center relative"
                    >
                      <!-- Decorative Line -->
                      <div
                        class="absolute top-0 left-6 md:left-8 w-12 md:w-16 h-1 bg-gradient-to-r from-primary to-accent transform -translate-y-1/2"
                      ></div>

                      <div class="mb-4">
                        <h3
                          class="text-2xl md:text-3xl font-bold text-gray-800 mb-3 leading-tight group-hover:text-primary transition-colors duration-300"
                        >
                          {{ program.title }}
                        </h3>
                        <p
                          class="text-gray-600 leading-relaxed text-sm md:text-base mb-4 md:mb-6"
                        >
                          {{ program.description }}
                        </p>
                      </div>

                      <!-- Action Buttons -->
                      <div class="flex flex-col sm:flex-row gap-2 md:gap-3">
                        <router-link :to="program.link" class="group/btn">
                          <button
                            class="relative w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 bg-accent text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group-hover/btn:bg-accent/90"
                          >
                            <span
                              class="relative z-10 flex items-center justify-center gap-2 text-sm md:text-base"
                            >
                              Selengkapnya
                              <svg
                                class="w-3 h-3 md:w-4 md:h-4 transition-transform group-hover/btn:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M9 5l7 7-7 7"
                                ></path>
                              </svg>
                            </span>
                            <div
                              class="absolute inset-0 bg-white/20 translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300"
                            ></div>
                          </button>
                        </router-link>

                        <a
                          v-if="program.website"
                          :href="program.website"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="group/btn"
                        >
                          <button
                            class="relative w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 bg-white border-2 border-primary text-primary rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-primary hover:text-white overflow-hidden"
                          >
                            <span
                              class="relative z-10 flex items-center justify-center gap-2 text-sm md:text-base"
                            >
                              <svg
                                class="w-3 h-3 md:w-4 md:h-4"
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
                              Website
                            </span>
                          </button>
                        </a>
                      </div>

                      <!-- Decorative Elements -->
                      <div
                        class="absolute bottom-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                      >
                        <div
                          class="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
          </template>
          <div v-else class="text-center text-white/80 py-12">
            Tidak ada program tersedia.
          </div>
        </div>
      </ClientOnly>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const config = useRuntimeConfig();

interface Program {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  website?: string;
}

interface ProgramApiResponse {
  current_page: number;
  data: any[];
  // ...other fields if needed
}

const {
  data: apiData,
  pending,
  error,
} = useFetch<ProgramApiResponse>("/programs", {
  baseURL: config.public.apiBase,
  query: { is_published: 1, per_page: 10 },
  default: () => ({ current_page: 1, data: [] } as ProgramApiResponse),
  server: false, // <-- THIS IS THE KEY FIX
});

const programs = computed<Program[]>(() =>
  (apiData.value?.data || []).map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    image: item.image
      ? `${config.public.apiBase.replace("/api", "")}/storage/${item.image}`
      : "/src/assets/home/hero-bg.jpg",
    link: `/programs/${item.slug || item.id}`,
    website: item.external_link || undefined,
  }))
);
</script>

<style scoped>
/* Custom Swiper Pagination Styling */
:deep(.swiper-pagination-bullet) {
  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.8);
  opacity: 1;
  transition: all 0.3s ease;
}

:deep(.swiper-pagination-bullet-active) {
  background: white;
  transform: scale(1.2);
  border-color: white;
}

/* Custom shadow for enhanced depth */
:deep(.group:hover) {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
</style>
