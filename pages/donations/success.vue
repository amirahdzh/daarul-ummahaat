<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full mx-4">
      <!-- Loading State -->
      <div v-if="pending" class="bg-white rounded-lg shadow-md p-8 text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
        ></div>
        <p class="text-gray-600">Memuat informasi donasi...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-white rounded-lg shadow-md p-8 text-center"
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
          Donasi tidak ditemukan
        </h3>
        <p class="text-red-600 mb-4">{{ error.message }}</p>
        <NuxtLink
          to="/donations"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Donasi Lagi
        </NuxtLink>
      </div>

      <!-- Success State -->
      <div
        v-else-if="data"
        class="bg-white rounded-lg shadow-md p-8 text-center"
      >
        <!-- Success Icon -->
        <div
          class="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full"
        >
          <svg
            class="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        <!-- Success Message -->
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Donasi Berhasil!</h1>
        <p class="text-gray-600 mb-6">
          Terima kasih atas donasi Anda. Donasi sedang dalam proses verifikasi.
        </p>

        <!-- Donation Details -->
        <div class="bg-gray-50 rounded-lg p-6 mb-6 text-left">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Detail Donasi
          </h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">ID Donasi:</span>
              <span class="font-medium text-gray-900">#{{ data.id }}</span>
            </div>
            <div v-if="data.title" class="flex justify-between">
              <span class="text-gray-600">Judul:</span>
              <span class="font-medium text-gray-900">{{ data.title }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Nama Donatur:</span>
              <span class="font-medium text-gray-900">{{ data.name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Kategori:</span>
              <span class="font-medium text-gray-900 capitalize">{{
                data.category
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Nominal:</span>
              <span class="font-bold text-green-600">{{
                formatCurrency(data.amount)
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Status:</span>
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  getStatusBadgeClass(data.status),
                ]"
              >
                {{ getStatusText(data.status) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Tanggal:</span>
              <span class="font-medium text-gray-900">{{
                formatDate(data.created_at)
              }}</span>
            </div>
            <div v-if="data.fundraiser" class="flex justify-between">
              <span class="text-gray-600">Penggalangan Dana:</span>
              <span class="font-medium text-gray-900">{{
                data.fundraiser.title
              }}</span>
            </div>
            <div v-if="data.donation_package" class="flex justify-between">
              <span class="text-gray-600">Paket Donasi:</span>
              <span class="font-medium text-gray-900">{{
                data.donation_package.title
              }}</span>
            </div>
          </div>
        </div>

        <!-- Status Information -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div class="flex">
            <svg
              class="w-5 h-5 text-blue-600 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div class="ml-3">
              <h4 class="text-sm font-medium text-blue-800">
                Informasi Verifikasi
              </h4>
              <div class="mt-1 text-sm text-blue-700">
                <p v-if="data.status === 'pending'">
                  Donasi Anda sedang dalam proses verifikasi. Tim kami akan
                  memverifikasi bukti transfer dalam 1-2 hari kerja.
                </p>
                <p v-else-if="data.status === 'confirmed'">
                  Donasi Anda telah dikonfirmasi. Terima kasih atas dukungan
                  Anda!
                </p>
                <p v-else-if="data.status === 'cancelled'">
                  Donasi Anda dibatalkan. Silakan hubungi tim kami jika ada
                  pertanyaan.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <div class="flex space-x-3">
            <button
              @click="shareSuccess"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <svg
                class="w-4 h-4 mr-2"
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
              to="/donations"
              class="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              Donasi Lagi
            </NuxtLink>
          </div>

          <div class="flex space-x-3">
            <NuxtLink
              to="/"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Kembali ke Beranda
            </NuxtLink>
            <NuxtLink
              to="/fundraisers"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Lihat Penggalangan Dana
            </NuxtLink>
          </div>
        </div>

        <!-- Contact Support -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <p class="text-sm text-gray-600 mb-2">Butuh bantuan?</p>
          <div class="flex justify-center space-x-4 text-sm">
            <a
              href="tel:+6281234567890"
              class="text-blue-600 hover:text-blue-700 flex items-center"
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                ></path>
              </svg>
              Telepon
            </a>
            <a
              href="mailto:info@daarulummahaat.org"
              class="text-blue-600 hover:text-blue-700 flex items-center"
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Donation {
  id: number;
  title?: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  amount: number;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  fundraiser?: {
    id: number;
    title: string;
  };
  donation_package?: {
    id: number;
    title: string;
  };
}

// Page meta
definePageMeta({
  title: "Donasi Berhasil - Daarul Ummahaat",
  description: "Terima kasih atas donasi Anda untuk Daarul Ummahaat",
});

// Get query params
const route = useRoute();
const donationId = route.query.id as string;

// Validate donation ID
if (!donationId) {
  throw createError({
    statusCode: 400,
    statusMessage: "ID donasi tidak valid",
  });
}

// Fetch donation data
const { data, pending, error } = await useFetch<Donation>(
  `/api/donations/${donationId}`,
  {
    baseURL: "http://localhost:8000",
  }
);

// Methods
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusText = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    pending: "Menunggu Verifikasi",
    confirmed: "Dikonfirmasi",
    cancelled: "Dibatalkan",
  };
  return statusMap[status] || status;
};

const getStatusBadgeClass = (status: string): string => {
  const classMap: { [key: string]: string } = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return classMap[status] || "bg-gray-100 text-gray-800";
};

const shareSuccess = async () => {
  const shareText = `Alhamdulillah, saya telah berdonasi ${formatCurrency(
    data.value?.amount || 0
  )} untuk ${
    data.value?.title || "program Daarul Ummahaat"
  }. Mari bergabung mendukung kebaikan! #DonasiDaarulUmmahaat`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Donasi Berhasil - Daarul Ummahaat",
        text: shareText,
        url: window.location.href,
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(
      shareText + "\n\n" + window.location.href
    );
    alert("Pesan telah disalin ke clipboard!");
  }
};

// SEO
watchEffect(() => {
  if (data.value) {
    useHead({
      title: `Donasi Berhasil - ${data.value.name} - Daarul Ummahaat`,
      meta: [
        {
          name: "description",
          content: `Donasi ${formatCurrency(
            data.value.amount
          )} telah berhasil dikirim untuk ${
            data.value.title || "program Daarul Ummahaat"
          }`,
        },
      ],
    });
  }
});

// Handle 404
if (error.value?.statusCode === 404) {
  throw createError({
    statusCode: 404,
    statusMessage: "Donasi tidak ditemukan",
  });
}
</script>
