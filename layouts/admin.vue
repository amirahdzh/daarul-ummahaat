<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <div
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Sidebar Header -->
      <div
        class="flex items-center justify-between h-16 px-6 border-b border-gray-200"
      >
        <NuxtLink to="/" class="flex items-center">
          <img
            class="h-8 w-auto"
            src="/src/assets/logo-du.png"
            alt="Daarul Ummahaat"
          />
          <span class="ml-2 text-lg font-semibold text-gray-900">Admin</span>
        </NuxtLink>
        <button @click="sidebarOpen = false" class="lg:hidden">
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>

        <!-- desktop toggle removed from sidebar header; toggle lives in desktop top bar -->
      </div>

      <!-- Navigation -->
      <nav class="mt-8 px-6">
        <div class="space-y-1">
          <!-- Dashboard -->
          <!-- <NuxtLink
            to="/admin"
            class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
            :class="
              isActive('/admin') && isExact('/admin')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            "
          >
            <svg
              class="mr-3 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
              ></path>
            </svg>
            Dashboard
          </NuxtLink> -->

          <!-- Donations -->
          <!-- <NuxtLink
            to="/admin/donations"
            class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
            :class="
              isActive('/admin/donations')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            "
          >
            <svg
              class="mr-3 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              ></path>
            </svg>
            Donasi
          </NuxtLink> -->

          <!-- Programs -->
          <NuxtLink
            to="/admin/programs"
            class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
            :class="
              isActive('/admin/programs')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            "
          >
            <svg
              class="mr-3 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              ></path>
            </svg>
            Program
          </NuxtLink>

          <!-- Donation Packages -->
          <!-- <NuxtLink
            to="/admin/donation-packages"
            class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
            :class="
              isActive('/admin/donation-packages')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            "
          >
            <svg
              class="mr-3 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              ></path>
            </svg>
            Paket Donasi
          </NuxtLink> -->

          <!-- Fundraisers -->
          <!-- <NuxtLink
            to="/admin/fundraisers"
            class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
            :class="
              isActive('/admin/fundraisers')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            "
          >
            <svg
              class="mr-3 h-5 w-5"
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
            Penggalangan Dana
          </NuxtLink> -->

          <!-- Activities -->
          <NuxtLink
            to="/admin/activities"
            class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
            :class="
              isActive('/admin/activities')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            "
          >
            <svg
              class="mr-3 h-5 w-5"
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
            Kegiatan
          </NuxtLink>

          <!-- Users -->
          <!-- <NuxtLink
            to="/admin/users"
            class="group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
            :class="
              isActive('/admin/users')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            "
          >
            <svg
              class="mr-3 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              ></path>
            </svg>
            Pengguna
          </NuxtLink> -->
        </div>

        <!-- Divider -->
        <div class="mt-8 pt-8 border-t border-gray-200">
          <div class="space-y-1">
            <!-- Public Site -->
            <NuxtLink
              to="/"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <svg
                class="mr-3 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                ></path>
              </svg>
              Lihat Website
            </NuxtLink>

            <!-- Settings -->
            <!-- <NuxtLink
              to="/admin/settings"
              class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <svg
                class="mr-3 h-5 w-5"
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
            </NuxtLink> -->
          </div>
        </div>
      </nav>
    </div>

    <!-- Main Content -->
    <div :class="[{ 'lg:pl-64': sidebarOpen }, 'transition-all']">
      <!-- Top Bar -->
      <div
        class="sticky top-0 z-40 flex h-16 bg-white border-b border-gray-200 lg:hidden"
      >
        <button
          @click="sidebarOpen = true"
          class="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
        <div class="flex-1 px-4 flex justify-between items-center">
          <div class="flex-1"></div>
          <UserMenu />
        </div>
      </div>

      <!-- Desktop Top Bar -->
      <div
        class="hidden lg:flex sticky top-0 z-40 h-16 bg-white border-b border-gray-200"
      >
        <div class="flex-1 px-6 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <!-- Desktop toggle: shows collapse icon when open, open icon when closed -->
            <button
              @click="sidebarOpen = !sidebarOpen"
              class="inline-flex items-center px-3 py-2 rounded text-gray-600 hover:bg-gray-50"
              aria-label="Toggle sidebar"
            >
              <svg
                v-if="sidebarOpen"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <!-- collapse icon (chevron left) -->
                <path
                  fill-rule="evenodd"
                  d="M12.293 14.707a1 1 0 010-1.414L9.414 10l2.879-3.293a1 1 0 10-1.414-1.414l-4 4a1 1 0 000 1.414l4 4a1 1 0 001.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <!-- open icon (chevron right) -->
                <path
                  fill-rule="evenodd"
                  d="M7.707 14.707a1 1 0 010-1.414L10.586 10 7.707 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
          <UserMenu />
        </div>
      </div>

      <!-- Page Content -->
      <main>
        <slot />
      </main>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 lg:hidden"
      @click="sidebarOpen = false"
    >
      <div class="absolute inset-0 bg-gray-600 opacity-75"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const sidebarOpen = ref(false);

// Navigation helpers
const isActive = (path: string) => {
  return route.path.startsWith(path);
};

const isExact = (path: string) => {
  return route.path === path;
};

// Close sidebar on route change (mobile)
watch(
  () => route.path,
  () => {
    sidebarOpen.value = false;
  }
);
</script>
