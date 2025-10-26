<script setup lang="ts">
import { ref } from "vue";

const { user, logout } = useAuth();

const isMenuOpen = ref(false);
const isProgramDropdownOpen = ref(false);
const isUserMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleProgramDropdown = () => {
  isProgramDropdownOpen.value = !isProgramDropdownOpen.value;
};

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

const handleLogout = async () => {
  await logout();
  isUserMenuOpen.value = false;
  await navigateTo("/auth/login");
};
</script>

<template>
  <header class="w-full fixed top-0 left-0 z-50 bg-background">
    <div
      class="flex items-center justify-between max-w-7xl mx-auto py-2 px-4 md:px-6 lg:px-8"
    >
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2">
        <img
          src="/src/assets/logo-du.png"
          alt="Logo Yayasan"
          class="ml-2 h-16 w-auto"
        />
        <!-- <span class="font-bold text-lg text-accent">Daarul Ummahaat</span> -->
      </NuxtLink>

      <!-- Desktop Navigation -->
      <nav
        class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700"
      >
        <NuxtLink to="/" class="hover:text-accent">Beranda</NuxtLink>

        <!-- Program Dropdown -->
        <!-- <div class="relative">
          <button
            @click="toggleProgramDropdown"
            class="flex items-center gap-1 hover:text-accent focus:outline-none"
          >
            Program
            <svg
              :class="[
                'w-4 h-4 transition-transform duration-200',
                isProgramDropdownOpen ? 'rotate-180' : '',
              ]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            v-if="isProgramDropdownOpen"
            class="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md border z-50"
          >
            <NuxtLink
              to="/programs"
              class="block px-4 py-2 hover:bg-gray-100 border-b"
            >
              Semua Program
            </NuxtLink>
            <NuxtLink
              to="/donation-packages"
              class="block px-4 py-2 hover:bg-gray-100 border-b"
            >
              Paket Donasi
            </NuxtLink>
            <NuxtLink
              to="/fundraisers"
              class="block px-4 py-2 hover:bg-gray-100"
            >
              Fundraiser
            </NuxtLink>
          </div>
        </div> -->

        <!-- <NuxtLink to="/activities" class="hover:text-accent">Kegiatan</NuxtLink> -->
        <NuxtLink to="/about" class="hover:text-accent">Tentang</NuxtLink>
        <NuxtLink to="/contact" class="hover:text-accent">Kontak</NuxtLink>
        <!-- <NuxtLink to="/donations" class="hover:text-accent">Donasi</NuxtLink> -->

        <!-- Admin Link for Admin/Editor Users -->
        <NuxtLink
          v-if="
            user &&
            (user.role?.name === 'admin' || user.role?.name === 'editor')
          "
          to="/admin/programs"
          class="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Admin
        </NuxtLink>

        <!-- User Menu or Auth Links -->
        <div v-if="user" class="relative">
          <button
            @click="toggleUserMenu"
            class="flex items-center gap-2 hover:text-accent focus:outline-none"
          >
            <div
              class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium"
            >
              {{ user.name.charAt(0).toUpperCase() }}
            </div>
            <span class="hidden lg:inline">{{ user.name }}</span>
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            v-if="isUserMenuOpen"
            class="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-md border z-50"
          >
            <NuxtLink
              to="/profile"
              class="block px-4 py-2 hover:bg-gray-100 border-b"
            >
              Profil Saya
            </NuxtLink>
            <!-- <NuxtLink
              to="/profile/donations"
              class="block px-4 py-2 hover:bg-gray-100 border-b"
            >
              Riwayat Donasi
            </NuxtLink> -->
            <NuxtLink
              v-if="user.role?.name === 'admin' || user.role?.name === 'editor'"
              to="/admin"
              class="block px-4 py-2 hover:bg-gray-100 border-b"
            >
              Dashboard Admin
            </NuxtLink>
            <button
              @click="handleLogout"
              class="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
            >
              Keluar
            </button>
          </div>
        </div>
        <div v-else class="flex items-center gap-4">
          <NuxtLink to="/auth/login" class="hover:text-accent">Masuk</NuxtLink>
          <NuxtLink
            to="/auth/register"
            class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition"
          >
            Daftar
          </NuxtLink>
        </div>
      </nav>

      <!-- Mobile Hamburger -->
      <button @click="toggleMenu" class="md:hidden text-gray-800">
        <svg
          v-if="!isMenuOpen"
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <svg
          v-else
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Mobile Navigation -->
    <div v-if="isMenuOpen" class="md:hidden bg-background shadow-md">
      <nav
        class="flex flex-col items-center space-y-4 py-6 text-sm font-medium text-gray-700"
      >
        <NuxtLink to="/" class="hover:text-accent">Beranda</NuxtLink>

        <!-- Mobile Program Dropdown -->
        <div class="w-full text-center">
          <button
            @click="toggleProgramDropdown"
            class="w-full py-2 hover:text-accent flex items-center justify-center gap-1"
          >
            Program
            <svg
              :class="[
                'w-4 h-4 transition-transform duration-200',
                isProgramDropdownOpen ? 'rotate-180' : '',
              ]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div v-if="isProgramDropdownOpen" class="mt-2 space-y-2">
            <NuxtLink to="/programs" class="block hover:text-accent">
              Semua Program
            </NuxtLink>
            <NuxtLink to="/donation-packages" class="block hover:text-accent">
              Paket Donasi
            </NuxtLink>
            <NuxtLink to="/fundraisers" class="block hover:text-accent">
              Fundraiser
            </NuxtLink>
          </div>
        </div>

        <NuxtLink to="/activities" class="hover:text-accent">Kegiatan</NuxtLink>
        <NuxtLink to="/about" class="hover:text-accent">Tentang</NuxtLink>
        <NuxtLink to="/contact" class="hover:text-accent">Kontak</NuxtLink>
        <NuxtLink to="/donations" class="hover:text-accent">Donasi</NuxtLink>

        <!-- Admin Link for Mobile -->
        <NuxtLink
          v-if="
            user &&
            (user.role?.name === 'admin' || user.role?.name === 'editor')
          "
          to="/admin"
          class="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors mx-4"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Dashboard Admin
        </NuxtLink>

        <!-- Mobile User Menu -->
        <div v-if="user" class="w-full text-center border-t pt-4">
          <div class="mb-2 text-gray-900 font-medium">{{ user.name }}</div>
          <div class="space-y-2">
            <NuxtLink to="/profile" class="block hover:text-accent">
              Profil Saya
            </NuxtLink>
            <NuxtLink to="/profile/donations" class="block hover:text-accent">
              Riwayat Donasi
            </NuxtLink>
            <NuxtLink
              v-if="user.role?.name === 'admin' || user.role?.name === 'editor'"
              to="/admin"
              class="block hover:text-accent"
            >
              Dashboard Admin
            </NuxtLink>
            <button
              @click="handleLogout"
              class="block w-full text-red-600 hover:text-red-500"
            >
              Keluar
            </button>
          </div>
        </div>
        <div v-else class="w-full text-center border-t pt-4 space-y-2">
          <NuxtLink to="/auth/login" class="block hover:text-accent">
            Masuk
          </NuxtLink>
          <NuxtLink
            to="/auth/register"
            class="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Daftar
          </NuxtLink>
        </div>
      </nav>
    </div>
  </header>
</template>
