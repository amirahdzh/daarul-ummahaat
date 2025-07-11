<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
  >
    <!-- Fundraiser Image -->
    <div class="relative h-48 bg-gray-200">
      <img
        v-if="fundraiser.image"
        :src="getImageUrl(fundraiser.image)"
        :alt="fundraiser.title"
        class="w-full h-full object-cover"
        @error="onImageError"
      />
      <div
        v-else
        class="flex items-center justify-center h-full bg-gradient-to-br from-green-100 to-green-200"
      >
        <svg
          class="w-12 h-12 text-green-400"
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
      </div>

      <!-- Status Badge -->
      <div class="absolute top-3 right-3">
        <span
          :class="[
            'px-2 py-1 text-xs font-medium rounded-full',
            getStatusBadgeClass(fundraiser.status),
          ]"
        >
          {{ getStatusText(fundraiser.status) }}
        </span>
      </div>

      <!-- Deadline Badge -->
      <div
        v-if="fundraiser.deadline && fundraiser.status === 'active'"
        class="absolute top-3 left-3"
      >
        <span
          class="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800"
        >
          {{ getDaysLeft(fundraiser.deadline) }} hari lagi
        </span>
      </div>
    </div>

    <!-- Fundraiser Content -->
    <div class="p-6">
      <div class="flex items-start justify-between mb-3">
        <h3 class="text-xl font-semibold text-gray-900 line-clamp-2">
          {{ fundraiser.title }}
        </h3>
      </div>

      <p class="text-gray-600 text-sm mb-4 line-clamp-3">
        {{ fundraiser.description }}
      </p>

      <!-- Progress Section -->
      <div class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-700">Progress</span>
          <span class="text-sm font-medium text-blue-600">
            {{
              getProgressPercentage(
                fundraiser.current_amount,
                fundraiser.target_amount
              )
            }}%
          </span>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{
              width: `${Math.min(
                getProgressPercentage(
                  fundraiser.current_amount,
                  fundraiser.target_amount
                ),
                100
              )}%`,
            }"
          ></div>
        </div>

        <!-- Amount Info -->
        <div class="flex justify-between items-center mt-2 text-sm">
          <span class="text-gray-600">
            Terkumpul:
            <span class="font-medium text-green-600">{{
              formatCurrency(fundraiser.current_amount)
            }}</span>
          </span>
          <span class="text-gray-600">
            Target:
            <span class="font-medium">{{
              formatCurrency(fundraiser.target_amount)
            }}</span>
          </span>
        </div>
      </div>

      <!-- Deadline Info -->
      <div
        v-if="fundraiser.deadline"
        class="flex items-center text-sm text-gray-500 mb-4"
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
        Berakhir {{ formatDate(fundraiser.deadline) }}
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-3">
        <NuxtLink
          :to="`/fundraisers/${fundraiser.id}`"
          class="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
        >
          Lihat Detail
        </NuxtLink>

        <NuxtLink
          v-if="fundraiser.status === 'active'"
          :to="`/donations?fundraiser_id=${fundraiser.id}`"
          class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center"
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
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
          Donasi
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Fundraiser {
  id: number;
  title: string;
  description: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  image: string;
  status: "active" | "completed" | "inactive";
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface Props {
  fundraiser: Fundraiser;
}

const props = defineProps<Props>();

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

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const getProgressPercentage = (current: number, target: number): number => {
  if (target === 0) return 0;
  return Math.round((current / target) * 100);
};

const getDaysLeft = (deadline: string): number => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

const getStatusText = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    active: "Aktif",
    completed: "Selesai",
    inactive: "Tidak Aktif",
  };
  return statusMap[status] || status;
};

const getStatusBadgeClass = (status: string): string => {
  const classMap: { [key: string]: string } = {
    active: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    inactive: "bg-gray-100 text-gray-800",
  };
  return classMap[status] || "bg-gray-100 text-gray-800";
};
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
}
</style>
