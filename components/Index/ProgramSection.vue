<template>
  <section class="py-12 sm:py-16 lg:py-20 bg-primary-dark">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Title (SSR OK) -->
      <div class="text-center mb-8 lg:mb-12">
        <h2
          class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 lg:mb-4"
        >
          Program Unggulan
        </h2>
        <p
          class="text-white/80 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg px-4"
        >
          Tiga pilar utama Yayasan dalam mendidik, membimbing, dan berbagi.
        </p>
        <div
          class="w-16 sm:w-20 lg:w-24 h-1 bg-primary-light mx-auto mt-3 lg:mt-4"
        ></div>
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
              :autoplay="{ delay: 6000, disableOnInteraction: false }"
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
                  class="relative overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 w-full max-w-5xl mx-auto"
                  style="min-height: 320px; max-height: 480px"
                >
                  <!-- Background Pattern -->
                  <div
                    class="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-80 transition-opacity duration-500"
                  ></div>

                  <!-- Program Number Badge -->
                  <div
                    class="absolute top-2 left-2 md:top-4 md:left-4 z-10 bg-primary text-white rounded-full w-7 h-7 md:w-9 md:h-9 flex items-center justify-center font-semibold text-xs md:text-sm shadow-md transition-transform duration-200 hover:scale-105"
                  >
                    {{ index + 1 }}
                  </div>

                  <div
                    class="grid grid-cols-1 lg:grid-cols-3 min-h-[220px] lg:min-h-[320px] max-h-[480px]"
                  >
                    <!-- Image Section -->
                    <div
                      class="relative overflow-hidden lg:col-span-2 h-36 sm:h-44 md:h-52 lg:h-auto lg:min-h-[320px] lg:max-h-[480px]"
                    >
                      <img
                        :src="program.image"
                        :alt="program.title"
                        class="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-102"
                        loading="lazy"
                      />
                      <!-- Image Overlay -->
                      <div
                        class="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-500"
                      ></div>

                      <!-- Website Link Overlay -->
                      <div
                        v-if="program.website"
                        class="absolute bottom-2 left-2 md:bottom-4 md:left-4 opacity-0 group-hover:opacity-100 transition-all duration-400 transform translate-y-1 group-hover:translate-y-0"
                      >
                        <a
                          :href="program.website"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="inline-flex items-center gap-1 md:gap-2 bg-white/90 backdrop-blur-sm text-primary px-2 py-1 md:px-3 md:py-2 rounded-full text-xs md:text-sm font-medium hover:bg-white transition-colors duration-300"
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
                          <span class="hidden sm:inline">Website</span>
                        </a>
                      </div>
                    </div>

                    <!-- Content Section -->
                    <div
                      class="p-3 sm:p-5 lg:p-7 flex flex-col justify-center relative"
                    >
                      <!-- Decorative Line -->
                      <div
                        class="absolute top-0 left-4 sm:left-6 lg:left-8 w-8 sm:w-12 lg:w-16 h-1 bg-gradient-to-r from-primary to-accent transform -translate-y-1/2"
                      ></div>

                      <div class="mb-2 lg:mb-3">
                        <h3
                          class="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-800 mb-1 lg:mb-2 leading-tight group-hover:text-primary transition-colors duration-200"
                        >
                          {{ program.title }}
                        </h3>
                        <p
                          class="text-gray-600 leading-relaxed text-xs sm:text-sm mb-2 lg:mb-3 line-clamp-3 lg:line-clamp-none"
                        >
                          {{ program.description }}
                        </p>
                      </div>

                      <!-- Action Buttons -->
                      <div class="flex flex-col sm:flex-row gap-2 lg:gap-3">
                        <router-link :to="program.link" class="group/btn">
                          <button
                            class="relative w-full sm:w-auto px-3 sm:px-4 lg:px-6 py-2 lg:py-3 bg-accent text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 overflow-hidden group-hover/btn:bg-accent/90"
                          >
                            <span
                              class="relative z-10 flex items-center justify-center gap-1 lg:gap-2 text-xs lg:text-base"
                            >
                              Selengkapnya
                              <svg
                                class="w-3 h-3 lg:w-4 lg:h-4 transition-transform duration-150 group-hover/btn:translate-x-0.5"
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
                              class="absolute inset-0 bg-white/10 translate-x-full group-hover/btn:translate-x-0 transition-transform duration-200"
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
                            class="relative w-full sm:w-auto px-3 sm:px-4 lg:px-6 py-2 lg:py-3 bg-white border-2 border-primary text-primary rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:bg-primary hover:text-white overflow-hidden"
                          >
                            <span
                              class="relative z-10 flex items-center justify-center gap-1 lg:gap-2 text-xs lg:text-base"
                            >
                              <svg
                                class="w-3 h-3 lg:w-4 lg:h-4"
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
                        class="absolute bottom-2 right-2 lg:bottom-4 lg:right-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
                      >
                        <div
                          class="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-primary to-accent"
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
          <div v-else class="text-center text-white/80 py-8 lg:py-12">
            <p class="text-sm sm:text-base">Tidak ada program tersedia.</p>
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
      ? `${config.public.imageBase}/${item.image}`
      : "/src/assets/home/hero-bg.jpg",
    link: `/programs/${item.slug || item.id}`,
    website: item.external_link || undefined,
  }))
);
</script>

<style scoped>
/* Custom Swiper Pagination Styling */
:deep(.swiper-pagination-bullet) {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.6);
  opacity: 1;
  transition: all 0.2s ease;
}

@media (min-width: 768px) {
  :deep(.swiper-pagination-bullet) {
    width: 10px;
    height: 10px;
  }
}

:deep(.swiper-pagination-bullet-active) {
  background: white;
  transform: scale(1.1);
  border-color: white;
}

/* Subtle shadow for enhanced depth */
:deep(.group:hover) {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
}

/* Custom navigation buttons styling - Modern and visually appealing */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  width: 40px;
  height: 40px;
  margin-top: -20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  color: #1e40af; /* Primary blue color */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  background: white;
  color: #1e40af;
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

:deep(.swiper-button-next:active),
:deep(.swiper-button-prev:active) {
  transform: scale(0.95);
}

/* Custom arrow styling */
:deep(.swiper-button-next:after),
:deep(.swiper-button-prev:after) {
  font-size: 16px;
  font-weight: bold;
}

@media (min-width: 768px) {
  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    width: 50px;
    height: 50px;
    margin-top: -25px;
  }

  :deep(.swiper-button-next:after),
  :deep(.swiper-button-prev:after) {
    font-size: 18px;
  }
}

@media (min-width: 1024px) {
  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    width: 56px;
    height: 56px;
    margin-top: -28px;
  }

  :deep(.swiper-button-next:after),
  :deep(.swiper-button-prev:after) {
    font-size: 20px;
  }
}

/* Ensure text doesn't overflow on small screens */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Better image handling */
img {
  max-width: 100%;
  height: auto;
}

/* Responsive image container with controlled sizing */
@media (max-width: 1023px) {
  .responsive-image-container {
    aspect-ratio: 16/9;
    max-height: 250px;
  }
}

@media (min-width: 1024px) {
  .responsive-image-container {
    max-height: 400px;
  }
}

/* Prevent images from being too large */
.program-card {
  max-height: 500px;
}
</style>
