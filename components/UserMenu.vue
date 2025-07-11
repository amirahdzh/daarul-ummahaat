<template>
  <div class="relative">
    <!-- User Menu Button -->
    <button
      @click="isOpen = !isOpen"
      class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <span class="sr-only">Open user menu</span>
      <div class="flex items-center space-x-3">
        <!-- User Avatar -->
        <div
          class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
        >
          <span class="text-sm font-medium text-white">
            {{ userInitials }}
          </span>
        </div>
        <!-- User Info (Desktop) -->
        <div class="hidden md:block text-left">
          <div class="text-sm font-medium text-gray-900">
            {{ user?.name || "Guest" }}
          </div>
          <div class="text-xs text-gray-500">{{ user?.role || "User" }}</div>
        </div>
        <!-- Dropdown Arrow -->
        <svg
          class="w-4 h-4 text-gray-400 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
      >
        <div class="py-1">
          <!-- User Info (Mobile) -->
          <div class="md:hidden px-4 py-3 border-b border-gray-100">
            <div class="text-sm font-medium text-gray-900">
              {{ user?.name || "Guest" }}
            </div>
            <div class="text-xs text-gray-500">{{ user?.email }}</div>
          </div>

          <!-- Profile -->
          <NuxtLink
            to="/profile"
            class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            @click="isOpen = false"
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            Profil
          </NuxtLink>

          <!-- Settings -->
          <NuxtLink
            to="/admin/settings"
            class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            @click="isOpen = false"
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            Pengaturan
          </NuxtLink>

          <div class="border-t border-gray-100"></div>

          <!-- Logout -->
          <button
            @click="handleLogout"
            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
            Keluar
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { user, logout, isAuthenticated } = useAuth();
const router = useRouter();

const isOpen = ref(false);

// Computed user initials
const userInitials = computed(() => {
  if (!user.value?.name) return "U";

  const names = user.value.name.split(" ");
  if (names.length >= 2) {
    return names[0][0] + names[1][0];
  }
  return names[0][0] || "U";
});

// Handle logout
const handleLogout = async () => {
  isOpen.value = false;

  try {
    await logout();
    await router.push("/auth/login");
  } catch (error) {
    console.error("Logout error:", error);
    // Still redirect even if API call fails
    await router.push("/auth/login");
  }
};

// Close dropdown when clicking outside
onMounted(() => {
  const handleClickOutside = (event: Event) => {
    const target = event.target as Element;
    if (!target.closest(".relative")) {
      isOpen.value = false;
    }
  };

  document.addEventListener("click", handleClickOutside);

  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });
});

// Redirect if not authenticated
watchEffect(() => {
  if (!isAuthenticated.value) {
    router.push("/auth/login");
  }
});
</script>
