<template>
  <div
    class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
  >
    <!-- Package Header -->
    <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
      <div class="flex items-center justify-between mb-2">
        <span
          :class="[
            'px-2 py-1 text-xs font-medium rounded-full',
            getCategoryBadgeClass(package.category),
          ]"
        >
          {{ getCategoryText(package.category) }}
        </span>
        <span
          :class="[
            'px-2 py-1 text-xs font-medium rounded-full',
            package.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800',
          ]"
        >
          {{ package.is_active ? "Aktif" : "Tidak Aktif" }}
        </span>
      </div>
      <h3 class="text-xl font-semibold mb-2">{{ package.title }}</h3>
      <div class="text-3xl font-bold">
        {{ formatCurrency(package.amount) }}
      </div>
    </div>

    <!-- Package Content -->
    <div class="p-6">
      <p class="text-gray-600 text-sm mb-6 leading-relaxed">
        {{ package.description }}
      </p>

      <!-- Package Features/Benefits -->
      <div class="mb-6">
        <h4 class="text-sm font-medium text-gray-900 mb-3">
          Manfaat donasi ini:
        </h4>
        <ul class="space-y-2 text-sm text-gray-600">
          <li
            v-for="benefit in getPackageBenefits(package.category)"
            :key="benefit"
            class="flex items-start"
          >
            <svg
              class="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0"
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
            {{ benefit }}
          </li>
        </ul>
      </div>

      <!-- Package Meta -->
      <div class="flex items-center justify-between text-xs text-gray-500 mb-6">
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
          Dibuat {{ formatDate(package.created_at) }}
        </span>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-3">
        <NuxtLink
          :to="`/donations?package_id=${package.id}`"
          :class="[
            'w-full px-6 py-3 font-medium rounded-lg transition-colors text-center block',
            package.is_active
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed',
          ]"
          :disabled="!package.is_active"
        >
          <span
            v-if="package.is_active"
            class="flex items-center justify-center"
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
            Donasi Sekarang
          </span>
          <span v-else>Tidak Tersedia</span>
        </NuxtLink>

        <NuxtLink
          :to="`/donation-packages/${package.id}`"
          class="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center block"
        >
          Lihat Detail
        </NuxtLink>
      </div>
    </div>

    <!-- Impact Indicator -->
    <div class="bg-gray-50 px-6 py-4 border-t">
      <div class="flex items-center text-sm text-gray-600">
        <svg
          class="w-4 h-4 text-green-500 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          ></path>
        </svg>
        <span>{{ getImpactText(package.category, package.amount) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface DonationPackage {
  id: number;
  title: string;
  description: string;
  amount: number;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Props {
  package: DonationPackage;
}

const props = defineProps<Props>();

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
  });
};

const getCategoryText = (category: string): string => {
  const categoryMap: { [key: string]: string } = {
    zakat: "Zakat",
    infaq: "Infaq",
    sedekah: "Sedekah",
    wakaf: "Wakaf",
    pendidikan: "Pendidikan",
    kesehatan: "Kesehatan",
    sosial: "Sosial",
  };
  return categoryMap[category] || category;
};

const getCategoryBadgeClass = (category: string): string => {
  const classMap: { [key: string]: string } = {
    zakat: "bg-green-100 text-green-800",
    infaq: "bg-blue-100 text-blue-800",
    sedekah: "bg-purple-100 text-purple-800",
    wakaf: "bg-yellow-100 text-yellow-800",
    pendidikan: "bg-orange-100 text-orange-800",
    kesehatan: "bg-red-100 text-red-800",
    sosial: "bg-pink-100 text-pink-800",
  };
  return classMap[category] || "bg-gray-100 text-gray-800";
};

const getPackageBenefits = (category: string): string[] => {
  const benefitsMap: { [key: string]: string[] } = {
    zakat: [
      "Membantu fakir miskin dan yang berhak",
      "Membersihkan harta dan jiwa",
      "Mendapat pahala zakat yang berlipat",
    ],
    infaq: [
      "Infaq di jalan Allah",
      "Pahala mengalir terus menerus",
      "Membantu operasional yayasan",
    ],
    sedekah: [
      "Sedekah jariyah yang pahalanya terus mengalir",
      "Membantu sesama yang membutuhkan",
      "Membersihkan dosa dan kesalahan",
    ],
    wakaf: [
      "Wakaf produktif untuk kesejahteraan ummat",
      "Aset yang terus berkembang",
      "Pahala yang tidak terputus",
    ],
    pendidikan: [
      "Mendukung pendidikan anak yatim",
      "Beasiswa untuk santri berprestasi",
      "Fasilitas pendidikan yang lebih baik",
    ],
    kesehatan: [
      "Bantuan kesehatan untuk dhuafa",
      "Program pengobatan gratis",
      "Fasilitas kesehatan yang memadai",
    ],
    sosial: [
      "Program kemanusiaan dan sosial",
      "Bantuan untuk korban bencana",
      "Pemberdayaan masyarakat",
    ],
  };
  return (
    benefitsMap[category] || [
      "Mendukung program Daarul Ummahaat",
      "Pahala yang berlipat ganda",
      "Manfaat untuk ummat",
    ]
  );
};

const getImpactText = (category: string, amount: number): string => {
  const impactMap: { [key: string]: (amount: number) => string } = {
    pendidikan: (amount) =>
      amount >= 500000
        ? "Dapat membiayai 1 bulan sekolah anak yatim"
        : "Dapat membantu kebutuhan sekolah anak yatim",
    kesehatan: (amount) =>
      amount >= 300000
        ? "Dapat membiayai pemeriksaan kesehatan"
        : "Dapat membantu obat-obatan dasar",
    sosial: (amount) =>
      amount >= 200000
        ? "Dapat membantu 1 keluarga dhuafa"
        : "Dapat membantu kebutuhan pokok",
    zakat: (amount) => "Disalurkan sesuai 8 asnaf yang berhak",
    infaq: (amount) => "Membantu operasional dan program yayasan",
    sedekah: (amount) => "Manfaat langsung untuk yang membutuhkan",
    wakaf: (amount) => "Investasi jangka panjang untuk ummat",
  };
  return impactMap[category]?.(amount) || "Berdampak positif untuk ummat";
};
</script>
