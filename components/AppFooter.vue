<template>
  <footer class="bg-shadow text-white pt-12 pb-6">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <!-- About Us -->
        <div>
          <h3 class="text-xl font-bold mb-4 border-b border-highlight pb-2">
            About Us
          </h3>
          <div class="flex items-center space-x-2 mb-4">
            <RouterLink to="/" class="flex items-center gap-2">
              <img
                src="/src/assets/logo-nq.png"
                alt="Logo Yayasan"
                class="h-10 w-auto"
              />
              <span class="font-bold text-lg text-accent">RTT NQ</span>
            </RouterLink>
          </div>
          <p class="text-background/70">
            An Islamic educational center dedicated to teaching correct Qur'anic
            recitation (tahsin) and memorization (tahfizh) with proper tajweed.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-xl font-bold mb-4 border-b border-highlight pb-2">
            Quick Links
          </h3>
          <ul class="space-y-2">
            <li>
              <RouterLink
                to="/"
                class="text-background/70 hover:text-highlight"
              >
                Home
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/about"
                class="text-background/70 hover:text-highlight"
              >
                About Us
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/programs"
                class="text-background/70 hover:text-highlight"
              >
                Our Programs
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/gallery"
                class="text-background/70 hover:text-highlight"
              >
                Gallery
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/blog"
                class="text-background/70 hover:text-highlight"
              >
                Blog
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/contact"
                class="text-background/70 hover:text-highlight"
              >
                Contact Us
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/register"
                class="text-background/70 hover:text-highlight"
              >
                Register Now
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Contact Us -->
        <div>
          <h3 class="text-xl font-bold mb-4 border-b border-highlight pb-2">
            Contact Us
          </h3>
          <ul class="space-y-4 mb-4">
            <li class="flex items-start">
              <MapPinIcon class="text-highlight mr-2 shrink-0 mt-1 w-5 h-5" />
              <span class="text-background/70">
                123 Islamic Center Street, Jakarta, Indonesia
              </span>
            </li>
            <li class="flex items-center">
              <PhoneIcon class="text-highlight mr-2 shrink-0 w-5 h-5" />
              <a
                href="tel:+6281234567890"
                class="text-background/70 hover:text-highlight"
              >
                +62 812-3456-7890
              </a>
            </li>
            <li class="flex items-center">
              <EnvelopeIcon class="text-highlight mr-2 shrink-0 w-5 h-5" />
              <a
                href="mailto:info@nurulquran.id"
                class="text-background/70 hover:text-highlight"
              >
                info@nurulquran.id
              </a>
            </li>
          </ul>

          <!-- Google Maps Embed -->
          <div
            class="w-full h-48 md:h-40 rounded overflow-hidden border border-highlight"
          >
            <iframe
              class="w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.3342680792037!2d112.732324!3d-7.210550!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f8cb0d2cd30f%3A0xa0079b25b3a412bd!2sMasjid%20Contoh!5e0!3m2!1sen!2sid!4v1616210344403!5m2!1sen!2sid"
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
          &copy; {{ new Date().getFullYear() }} Rumah Tahfidz Nurul Qur'an. All
          rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from "@heroicons/vue/24/outline";
</script>

<style scoped>
/* Kosongkan jika tidak butuh scoped CSS */
</style>
