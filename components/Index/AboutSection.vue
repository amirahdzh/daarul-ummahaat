<template>
  <section class="py-20 lg:py-28 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
    <div class="container mx-auto px-4">
      <!-- Section Title -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-primary mb-4">Tentang Kami</h2>
        <div class="w-24 h-1 bg-highlight mx-auto mb-6"></div>
        <!-- <p class="text-shadow max-w-2xl mx-auto">
          Yayasan Daarul Ummahaat merupakan lembaga nirlaba yang bergerak di
          bidang pendidikan Qur'an dan kegiatan sosial. Kami berkomitmen membina
          generasi Qur'ani serta menjembatani kebaikan antara para muhsinin dan
          masyarakat yang membutuhkan.
        </p> -->
      </div>

      <!-- Text + illustration: stacks on mobile, side-by-side on large screens -->
      <div class="max-w-5xl mx-auto mb-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <p
              class="text-base md:text-lg text-shadow mb-6 leading-relaxed text-left lg:text-justify"
              style="hyphens: auto"
            >
              Yayasan Daarul Ummahaat didirikan oleh tokoh pendidikan dan
              aktivis sosial yang berpengalaman dalam pendidikan Al-Qur'an dan
              pemberdayaan masyarakat. Berfokus pada pembentukan generasi
              Qur'ani, yayasan ini menjalankan program pendidikan, pembinaan,
              dan bantuan sosial yang terukur dan berkelanjutan.
            </p>

            <p
              class="text-base md:text-lg text-shadow leading-relaxed text-left lg:text-justify"
              style="hyphens: auto"
            >
              Kami dipercaya karena komitmen pada transparansi, kolaborasi
              dengan mitra lokal, dan bukti dampak nyata pada penerima manfaat.
              Laporan kegiatan dan audit rutin tersedia untuk publik agar
              donatur dan stakeholder dapat melihat penggunaan dana secara
              jelas.
            </p>
          </div>

          <div class="flex justify-center lg:justify-end">
            <picture>
              <!-- Fallback PNG (keep until a webp is added to public or assets) -->
              <img
                src="/src/assets/home/hero-1.png"
                alt="Ilustrasi kegiatan pendidikan Daarul Ummahaat"
                loading="lazy"
                decoding="async"
                class="w-full max-w-[520px] rounded-lg shadow-lg object-cover"
                style="aspect-ratio: 4/3"
              />
            </picture>
          </div>
        </div>
      </div>

      <!-- Learn More Button -->
      <div class="text-center mt-6">
        <NuxtLink
          to="/about"
          class="w-full sm:inline-flex sm:w-auto justify-center items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg text-base font-medium s"
          aria-label="Baca selengkapnya tentang Daarul Ummahaat"
        >
          <span>Selengkapnya</span>
          <!-- <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg> -->
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// TODO: move static labels to i18n or props so copy can be changed without code edits
</script>
