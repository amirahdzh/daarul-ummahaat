<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";

const isMenuOpen = ref(false);
const isProgramDropdownOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleProgramDropdown = () => {
  isProgramDropdownOpen.value = !isProgramDropdownOpen.value;
};
</script>

<template>
  <header class="w-full fixed top-0 left-0 z-50 bg-background">
    <div
      class="flex items-center justify-between max-w-7xl mx-auto py-2 px-4 md:px-6 lg:px-8"
    >
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2">
        <img
          src="/src/assets/logo-du.png"
          alt="Logo Yayasan"
          class="ml-2 h-16 w-auto"
        />
        <!-- <span class="font-bold text-lg text-accent">Daarul Ummahaat</span> -->
      </RouterLink>

      <!-- Desktop Navigation -->
      <nav
        class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700"
      >
        <RouterLink to="/tentang" class="hover:text-accent">Tentang</RouterLink>

        <!-- Program Dropdown -->
        <div class="relative">
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
            class="absolute top-full left-0 mt-2 w-40 bg-white shadow-md rounded-md"
          >
            <RouterLink
              to="/program/bimbel"
              class="block px-4 py-2 hover:bg-gray-100"
              >Bimbel</RouterLink
            >
            <RouterLink
              to="/program/tahfizh"
              class="block px-4 py-2 hover:bg-gray-100"
              >Tahfizh</RouterLink
            >
            <RouterLink
              to="/program/sosial"
              class="block px-4 py-2 hover:bg-gray-100"
              >Sosial</RouterLink
            >
          </div>
        </div>

        <RouterLink to="/donasi" class="hover:text-accent">Donasi</RouterLink>
        <RouterLink to="/kontak" class="hover:text-accent">Kontak</RouterLink>
        <RouterLink
          to="/daftar"
          class="ml-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition"
        >
          Daftar
        </RouterLink>
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
        <RouterLink to="/tentang" class="hover:text-accent">Tentang</RouterLink>

        <!-- Dropdown Mobile -->
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
            <RouterLink to="/program/bimbel" class="block hover:text-accent"
              >Bimbel</RouterLink
            >
            <RouterLink to="/program/tahfizh" class="block hover:text-accent"
              >Tahfizh</RouterLink
            >
            <RouterLink to="/program/sosial" class="block hover:text-accent"
              >Sosial</RouterLink
            >
          </div>
        </div>

        <RouterLink to="/donasi" class="hover:text-accent">Donasi</RouterLink>
        <RouterLink to="/kontak" class="hover:text-accent">Kontak</RouterLink>
        <RouterLink
          to="/daftar"
          class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Daftar
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
