<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Hubungi Kami</h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        Kami senang mendengar dari Anda. Jangan ragu untuk menghubungi kami
        untuk pertanyaan, saran, atau jika Anda ingin berpartisipasi dalam
        program kami.
      </p>
    </div>

    <!-- Dev status banner -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      <div
        role="status"
        aria-live="polite"
        class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md"
      >
        <div class="flex items-start">
          <svg
            class="flex-shrink-0 h-5 w-5 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l5.516 9.81c.75 1.333-.213 2.991-1.742 2.991H4.483c-1.53 0-2.492-1.658-1.742-2.99l5.516-9.811zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-8a1 1 0 00-.993.883L9 6v4a1 1 0 001.993.117L11 10V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          <div class="ml-3 text-sm text-yellow-700">
            <p class="font-semibold">Fitur dalam pengembangan</p>
            <p class="mt-1">
              Halaman kontak saat ini menggunakan fungsi mock — pesan tidak
              dikirim ke server di lingkungan ini.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Contact Form -->
      <div class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Kirim Pesan</h2>

        <form @submit.prevent="submitForm" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                for="firstName"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Nama Depan <span class="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                required
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nama depan"
              />
            </div>
            <div>
              <label
                for="lastName"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Nama Belakang
              </label>
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nama belakang"
              />
            </div>
          </div>

          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Email <span class="text-red-500">*</span>
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label
              for="phone"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              No. Telepon
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="+62812345678"
            />
          </div>

          <div>
            <label
              for="subject"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Subjek <span class="text-red-500">*</span>
            </label>
            <select
              id="subject"
              v-model="form.subject"
              required
              class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Pilih subjek</option>
              <option value="general">Pertanyaan Umum</option>
              <option value="donation">Tentang Donasi</option>
              <option value="program">Tentang Program</option>
              <option value="volunteer">Menjadi Volunteer</option>
              <option value="partnership">Kerjasama</option>
              <option value="other">Lainnya</option>
            </select>
          </div>

          <div>
            <label
              for="message"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Pesan <span class="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              v-model="form.message"
              rows="5"
              required
              class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tuliskan pesan Anda di sini..."
            ></textarea>
          </div>

          <div v-if="error" class="rounded-md bg-red-50 p-4">
            <div class="text-sm text-red-700">{{ error }}</div>
          </div>

          <div v-if="success" class="rounded-md bg-green-50 p-4">
            <div class="text-sm text-green-700">{{ success }}</div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Mengirim...
            </span>
            <span v-else>Kirim Pesan</span>
          </button>
        </form>
      </div>

      <!-- Contact Information -->
      <div class="space-y-8">
        <!-- Office Info -->
        <div class="bg-white rounded-lg shadow-md p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            Informasi Kontak
          </h2>

          <div class="space-y-6">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg
                  class="w-6 h-6 text-primary mt-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Alamat</h3>
                <p class="text-gray-600 mt-1">
                  Jl. Pendidikan No. 123<br />
                  Jakarta Selatan 12345<br />
                  DKI Jakarta, Indonesia
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg
                  class="w-6 h-6 text-primary mt-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Telepon</h3>
                <p class="text-gray-600 mt-1">
                  <a href="tel:+622112345678" class="hover:text-primary"
                    >+62 21 1234 5678</a
                  ><br />
                  <a href="tel:+628123456789" class="hover:text-primary"
                    >+62 812 3456 789</a
                  >
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg
                  class="w-6 h-6 text-primary mt-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Email</h3>
                <p class="text-gray-600 mt-1">
                  <a
                    href="mailto:info@daarulummahaat.org"
                    class="hover:text-primary"
                    >info@daarulummahaat.org</a
                  ><br />
                  <a
                    href="mailto:admin@daarulummahaat.org"
                    class="hover:text-primary"
                    >admin@daarulummahaat.org</a
                  >
                </p>
              </div>
            </div>

            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg
                  class="w-6 h-6 text-primary mt-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">
                  Jam Operasional
                </h3>
                <div class="text-gray-600 mt-1">
                  <p>Senin - Jumat: 08:00 - 17:00</p>
                  <p>Sabtu: 08:00 - 15:00</p>
                  <p>Minggu: Tutup</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Social Media -->
        <div class="bg-white rounded-lg shadow-md p-8">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Ikuti Kami</h3>
          <div class="flex space-x-4">
            <a href="#" class="text-blue-600 hover:text-blue-500">
              <span class="sr-only">Facebook</span>
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
            </a>
            <a href="#" class="text-blue-400 hover:text-blue-300">
              <span class="sr-only">Twitter</span>
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                />
              </svg>
            </a>
            <a href="#" class="text-pink-600 hover:text-pink-500">
              <span class="sr-only">Instagram</span>
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.324-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.417-3.324c.876-.876 2.027-1.297 3.324-1.297s2.448.421 3.324 1.297c.876.876 1.297 2.027 1.297 3.324s-.421 2.448-1.297 3.324c-.876.807-2.027 1.297-3.324 1.297zm7.83-9.606c-.49 0-.876-.386-.876-.876s.386-.876.876-.876.876.386.876.876-.386.876-.876.876zm0 0"
                />
              </svg>
            </a>
            <a href="#" class="text-green-600 hover:text-green-500">
              <span class="sr-only">WhatsApp</span>
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"
                />
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <!-- <div class="bg-blue-50 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-blue-900 mb-4">
            Butuh Bantuan Cepat?
          </h3>
          <div class="space-y-3">
            <NuxtLink
              to="/donations"
              class="block text-blue-700 hover:text-blue-800 hover:underline"
            >
              🎯 Cara Berdonasi
            </NuxtLink>
            <NuxtLink
              to="/programs"
              class="block text-blue-700 hover:text-blue-800 hover:underline"
            >
              📚 Info Program
            </NuxtLink>
            <NuxtLink
              to="/auth/register"
              class="block text-blue-700 hover:text-blue-800 hover:underline"
            >
              👥 Bergabung sebagai Volunteer
            </NuxtLink>
            <NuxtLink
              to="/sitemap"
              class="block text-blue-700 hover:text-blue-800 hover:underline"
            >
              🗺️ Peta Situs
            </NuxtLink>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Hubungi Kami - Daarul Ummahaat",
  description:
    "Hubungi Yayasan Daarul Ummahaat untuk pertanyaan, saran, atau informasi lebih lanjut tentang program pendidikan dan sosial kami.",
  layout: "default",
});

useSeoMeta({
  title: "Hubungi Kami - Daarul Ummahaat",
  description:
    "Hubungi Yayasan Daarul Ummahaat untuk pertanyaan, saran, atau informasi lebih lanjut tentang program pendidikan dan sosial kami.",
  ogTitle: "Hubungi Kami - Daarul Ummahaat",
  ogDescription:
    "Hubungi Yayasan Daarul Ummahaat untuk pertanyaan, saran, atau informasi lebih lanjut tentang program kami.",
});

const loading = ref(false);
const error = ref("");
const success = ref("");

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
});

const submitForm = async () => {
  loading.value = true;
  error.value = "";
  success.value = "";

  try {
    // Mock form submission - replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    success.value =
      "Pesan Anda telah berhasil dikirim! Tim kami akan merespons dalam 1-2 hari kerja.";

    // Reset form
    Object.keys(form).forEach((key) => {
      form[key] = "";
    });
  } catch (err: any) {
    error.value = "Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.";
  } finally {
    loading.value = false;
  }
};
</script>
