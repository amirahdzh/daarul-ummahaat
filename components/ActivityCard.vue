<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
  >
    <!-- Activity Image -->
    <div class="relative h-48 bg-gray-200">
      <img
        v-if="activity.image"
        :src="getImageUrl(activity.image)"
        :alt="activity.title"
        class="w-full h-full object-cover"
        @error="onImageError"
      />
      <div
        v-else
        class="flex items-center justify-center h-full bg-gradient-to-br from-purple-100 to-purple-200"
      >
        <svg
          class="w-12 h-12 text-purple-400"
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
      </div>

      <!-- Status Badge -->
      <div class="absolute top-3 right-3">
        <span
          :class="[
            'px-2 py-1 text-xs font-medium rounded-full',
            activity.is_published
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800',
          ]"
        >
          {{ activity.is_published ? "Dipublikasi" : "Draft" }}
        </span>
      </div>

      <!-- Date Badge -->
      <div class="absolute top-3 left-3">
        <span
          :class="[
            'px-2 py-1 text-xs font-medium rounded-full',
            getDateBadgeClass(activity.event_date),
          ]"
        >
          {{ getDateStatus(activity.event_date) }}
        </span>
      </div>
    </div>

    <!-- Activity Content -->
    <div class="p-6">
      <div class="flex items-start justify-between mb-3">
        <h3 class="text-xl font-semibold text-gray-900 line-clamp-2">
          {{ activity.title }}
        </h3>
      </div>

      <p class="text-gray-600 text-sm mb-4 line-clamp-3">
        {{ activity.description }}
      </p>

      <!-- Event Date -->
      <div class="flex items-center text-sm text-gray-500 mb-4">
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
        <span class="font-medium">{{
          formatEventDate(activity.event_date)
        }}</span>
        <span class="ml-2 text-gray-400">•</span>
        <span class="ml-2">{{ getRelativeTime(activity.event_date) }}</span>
      </div>

      <!-- Activity Meta -->
      <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          Dibuat {{ formatDate(activity.created_at) }}
        </span>
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-3">
        <NuxtLink
          :to="`/activities/${activity.id}`"
          class="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
        >
          Lihat Detail
        </NuxtLink>

        <button
          @click="shareActivity"
          class="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center"
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
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
            ></path>
          </svg>
          Bagikan
        </button>
      </div>

      <!-- Countdown for upcoming events -->
      <div
        v-if="isUpcoming(activity.event_date)"
        class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
      >
        <div class="flex items-center text-blue-800">
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span class="text-sm font-medium">{{
            getCountdown(activity.event_date)
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Activity {
  id: number;
  title: string;
  description: string;
  event_date: string;
  image: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface Props {
  activity: Activity;
}

const props = defineProps<Props>();

// Methods
const getImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  const config = useRuntimeConfig();
  return `${config.public.imageBase}/${imagePath}`;
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

const formatEventDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const isUpcoming = (eventDate: string): boolean => {
  const now = new Date();
  const event = new Date(eventDate);
  return event > now;
};

const isPast = (eventDate: string): boolean => {
  const now = new Date();
  const event = new Date(eventDate);
  return event < now;
};

const getDateStatus = (eventDate: string): string => {
  if (isUpcoming(eventDate)) {
    return "Akan Datang";
  } else if (isPast(eventDate)) {
    return "Selesai";
  } else {
    return "Hari Ini";
  }
};

const getDateBadgeClass = (eventDate: string): string => {
  if (isUpcoming(eventDate)) {
    return "bg-blue-100 text-blue-800";
  } else if (isPast(eventDate)) {
    return "bg-gray-100 text-gray-800";
  } else {
    return "bg-green-100 text-green-800";
  }
};

const getRelativeTime = (eventDate: string): string => {
  const now = new Date();
  const event = new Date(eventDate);
  const diffTime = Math.abs(event.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (isUpcoming(eventDate)) {
    if (diffDays === 0) return "Hari ini";
    if (diffDays === 1) return "Besok";
    return `${diffDays} hari lagi`;
  } else {
    if (diffDays === 0) return "Hari ini";
    if (diffDays === 1) return "Kemarin";
    return `${diffDays} hari yang lalu`;
  }
};

const getCountdown = (eventDate: string): string => {
  const now = new Date();
  const event = new Date(eventDate);
  const diffTime = event.getTime() - now.getTime();

  if (diffTime <= 0) return "Kegiatan telah berlangsung";

  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days} hari ${hours} jam lagi`;
  } else if (hours > 0) {
    return `${hours} jam ${minutes} menit lagi`;
  } else {
    return `${minutes} menit lagi`;
  }
};

const shareActivity = async () => {
  const shareText = `Jangan lewatkan kegiatan "${
    props.activity.title
  }" di Daarul Ummahaat pada ${formatEventDate(props.activity.event_date)}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: props.activity.title,
        text: shareText,
        url: `${window.location.origin}/activities/${props.activity.id}`,
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(
      shareText +
        "\n\n" +
        `${window.location.origin}/activities/${props.activity.id}`
    );
    alert("Link telah disalin ke clipboard!");
  }
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
