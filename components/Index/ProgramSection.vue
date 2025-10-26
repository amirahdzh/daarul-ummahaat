<template>
  <section class="py-8 bg-accent">
    <div class="container mx-auto px-16">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-white mb-4">Program Unggulan</h2>
        <!-- <p class="text-white/80 text-sm">
          Program pendidikan, pembinaan, dan bantuan sosial yang fokus membentuk
          generasi Qur'ani.
        </p> -->
        <div class="w-24 h-1 bg-highlight mx-auto mb-6"></div>
      </div>
      <ClientOnly>
        <div>
          <div v-if="pending">
            <p>Memuat program...</p>
          </div>

          <template v-else>
            <div v-if="programs.length > 0">
              <div class="divide-y divide-white/10">
                <div
                  v-for="(program, i) in programs"
                  :key="program.id"
                  class="flex flex-col md:flex-row items-start gap-6 py-6 md:py-8"
                  :class="{ 'md:flex-row-reverse': i % 2 === 1 }"
                >
                  <!-- image (40%) -->
                  <div class="w-full md:w-2/5 flex-shrink-0">
                    <img
                      :src="program.image"
                      :alt="program.title"
                      loading="lazy"
                      class="w-full h-64 sm:h-72 md:h-64 lg:h-80 object-cover rounded-lg"
                    />
                  </div>

                  <!-- text (60%) -->
                  <div class="w-full md:w-3/5 p-2 md:p-4">
                    <h3 class="text-2xl font-semibold text-white mb-2">
                      {{ program.title }}
                    </h3>
                    <p class="text-white/90 mb-4 text-justify">
                      {{ program.description }}
                    </p>
                    <div class="flex flex-wrap gap-3">
                      <!-- <NuxtLink
                        :to="program.link"
                        class="text-white/70 hover:text-white text-sm underline underline-offset-2 hover:underline-offset-4 transition-all duration-200"
                        :aria-label="`Lihat program ${program.title}`"
                      >
                        Selengkapnya
                      </NuxtLink> -->

                      <a
                        v-if="program.website"
                        :href="program.website"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-white/70 hover:text-white text-sm underline underline-offset-2 hover:underline-offset-4 transition-all duration-200"
                      >
                        Website →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <p>Tidak ada program tersedia.</p>
            </div>
          </template>
        </div>
      </ClientOnly>
    </div>
  </section>
</template>

<script setup lang="ts">
// Swiper removed — simple list layout

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
}

const { data: apiData, pending } = useFetch<ProgramApiResponse>("/programs", {
  baseURL: config.public.apiBase,
  query: { is_published: 1, per_page: 10 },
  default: () => ({ current_page: 1, data: [] }),
  server: false,
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
