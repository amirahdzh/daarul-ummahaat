<template>
  <footer class="bg-shadow text-white pt-12 pb-6">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <!-- Tentang Kami -->
        <div>
          <h3 class="text-xl font-bold mb-4 border-b border-primary pb-2">
            Tentang Yayasan
          </h3>
          <div class="mb-4">
            <div class="flex items-start">
              <RouterLink to="/" class="flex-shrink-0 mr-4 mb-2">
                <img
                  src="/src/assets/logo-du-white.png"
                  alt="Logo Yayasan"
                  class="h-16 w-16 object-contain rounded-lg"
                />
              </RouterLink>
              <div class="overflow-hidden">
                <p class="text-background/70 leading-relaxed text-justify">
                  Yayasan Daarul Ummahaat adalah lembaga nirlaba yang bergerak
                  dalam pendidikan Qur’an, bimbingan belajar, dan kegiatan
                  sosial seperti santunan yatim dan dhuafa.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigasi Cepat -->
        <div>
          <h3 class="text-xl font-bold mb-4 border-b border-primary pb-2">
            Navigasi
          </h3>
          <ul class="space-y-2">
            <li>
              <RouterLink to="/" class="text-background/70 hover:text-primary">
                Beranda
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/about"
                class="text-background/70 hover:text-primary"
              >
                Tentang Kami
              </RouterLink>
            </li>
            <!-- <li>
              <RouterLink
                to="/programs"
                class="text-background/70 hover:text-primary"
              >
                Program Unggulan
              </RouterLink>
            </li> -->
            <!-- <li>
              <RouterLink
                to="/gallery"
                class="text-background/70 hover:text-primary"
              >
                Galeri Kegiatan
              </RouterLink>
            </li> -->
            <!-- <li>
              <RouterLink
                to="/blog"
                class="text-background/70 hover:text-primary"
              >
                Berita & Artikel
              </RouterLink>
            </li> -->
            <li>
              <RouterLink
                to="/contact"
                class="text-background/70 hover:text-primary"
              >
                Hubungi Kami
              </RouterLink>
            </li>
            <!-- <li>
              <RouterLink
                to="/register"
                class="text-background/70 hover:text-primary"
              >
                Pendaftaran
              </RouterLink>
            </li> -->
          </ul>
        </div>

        <!-- Kontak -->
        <div>
          <h3 class="text-xl font-bold mb-4 border-b border-primary pb-2">
            Kontak
          </h3>
          <ul class="space-y-4 mb-4">
            <li class="flex items-start">
              <MapPinIcon class="text-primary mr-2 shrink-0 mt-1 w-5 h-5" />
              <span class="text-background/70">
                Jl. Contoh No. 123, Sleman, Yogyakarta 55293
              </span>
            </li>
            <li class="flex items-center">
              <PhoneIcon class="text-primary mr-2 shrink-0 w-5 h-5" />
              <a
                href="tel:+6281234567890"
                class="text-background/70 hover:text-primary"
              >
                +62 812-3456-7890
              </a>
            </li>
            <li class="flex items-center">
              <EnvelopeIcon class="text-primary mr-2 shrink-0 w-5 h-5" />
              <a
                href="mailto:info@daarulummahaat.org"
                class="text-background/70 hover:text-primary"
              >
                info@daarulummahaat.org
              </a>
            </li>
          </ul>

          <!-- Google Maps Embed -->
          <div
            class="w-full h-48 md:h-40 rounded overflow-hidden border border-primary"
          >
            <iframe
              class="w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.3342680792037!2d112.732324!3d-7.210550!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f8cb0d2cd30f%3A0xa0079b25b3a412bd!2sMasjid%20Contoh!5e0!3m2!1sid!2sid!4v1616210344403!5m2!1sid!2sid"
              style="border: 0"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div
        class="border-t border-background/20 pt-6 text-center text-background/60 text-sm"
      >
        <p>
          &copy; {{ new Date().getFullYear() }} Yayasan Daarul Ummahaat. All
          rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from "@heroicons/vue/24/outline";
</script>
