<template>
  <div class="bg-white shadow">
    <div class="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
      <div
        class="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200"
      >
        <div class="flex-1 min-w-0">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-500 text-white text-2xl font-bold"
              >
                {{ userInitials }}
              </div>
            </div>
            <div class="ml-4">
              <h1
                class="text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate"
              >
                {{ user?.name }}
              </h1>
              <dl class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap">
                <dt class="sr-only">Role</dt>
                <dd
                  class="flex items-center text-sm text-gray-500 font-medium capitalize sm:mr-6"
                >
                  <svg
                    class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                      clip-rule="evenodd"
                    />
                    <path
                      d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"
                    />
                  </svg>
                  {{ user?.role }}
                </dd>
                <dt class="sr-only">Email</dt>
                <dd class="flex items-center text-sm text-gray-500 sm:mr-6">
                  <svg
                    class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                    />
                    <path
                      d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                    />
                  </svg>
                  {{ user?.email }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="mt-6 flex space-x-3 md:mt-0 md:ml-4">
          <button
            @click="isEditing = !isEditing"
            type="button"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              class="-ml-1 mr-2 h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
              />
            </svg>
            {{ isEditing ? "Batal" : "Edit Profil" }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Profile Information -->
      <div class="lg:col-span-2">
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">
              Informasi Profil
            </h3>

            <form v-if="isEditing" @submit.prevent="handleUpdateProfile">
              <div class="grid grid-cols-1 gap-6">
                <div>
                  <label
                    for="name"
                    class="block text-sm font-medium text-gray-700"
                    >Nama Lengkap</label
                  >
                  <input
                    id="name"
                    v-model="editForm.name"
                    type="text"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    for="email"
                    class="block text-sm font-medium text-gray-700"
                    >Email</label
                  >
                  <input
                    id="email"
                    v-model="editForm.email"
                    type="email"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    for="phone"
                    class="block text-sm font-medium text-gray-700"
                    >No. Telepon</label
                  >
                  <input
                    id="phone"
                    v-model="editForm.phone"
                    type="tel"
                    required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    for="address"
                    class="block text-sm font-medium text-gray-700"
                    >Alamat</label
                  >
                  <textarea
                    id="address"
                    v-model="editForm.address"
                    rows="3"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  ></textarea>
                </div>
              </div>

              <div v-if="updateError" class="mt-4 rounded-md bg-red-50 p-4">
                <div class="text-sm text-red-700">{{ updateError }}</div>
              </div>

              <div class="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  @click="cancelEdit"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  :disabled="updateLoading"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {{ updateLoading ? "Menyimpan..." : "Simpan" }}
                </button>
              </div>
            </form>

            <div v-else class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Nama Lengkap</label
                >
                <p class="mt-1 text-sm text-gray-900">{{ user?.name }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Email</label
                >
                <p class="mt-1 text-sm text-gray-900">{{ user?.email }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >No. Telepon</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ user?.phone || "-" }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Alamat</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ user?.address || "-" }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Bergabung sejak</label
                >
                <p class="mt-1 text-sm text-gray-900">
                  {{ formatDate(user?.created_at) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="space-y-6">
        <!-- Donation Summary -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Ringkasan Donasi
          </h3>
          <div class="space-y-4">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Total Donasi</span>
              <span class="text-sm font-medium text-gray-900">{{
                stats.totalDonations || 0
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Total Nominal</span>
              <span class="text-sm font-medium text-gray-900">{{
                formatCurrency(stats.totalAmount || 0)
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Donasi Terakhir</span>
              <span class="text-sm font-medium text-gray-900">{{
                formatDate(stats.lastDonation)
              }}</span>
            </div>
          </div>
          <div class="mt-4">
            <NuxtLink
              to="/donations"
              class="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              Donasi Lagi →
            </NuxtLink>
          </div>
        </div>

        <!-- Recent Activities -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Aktivitas Terbaru
          </h3>
          <div v-if="recentActivities.length > 0" class="space-y-3">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="flex items-start space-x-3"
            >
              <div class="flex-shrink-0">
                <div class="h-2 w-2 bg-blue-400 rounded-full mt-2"></div>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm text-gray-900">{{ activity.title }}</p>
                <p class="text-xs text-gray-500">
                  {{ formatDate(activity.date) }}
                </p>
              </div>
            </div>
          </div>
          <div v-else class="text-sm text-gray-500">Belum ada aktivitas</div>
        </div>

        <!-- Change Password -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Keamanan</h3>
          <button
            @click="showPasswordForm = !showPasswordForm"
            class="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Ubah Password
          </button>

          <form
            v-if="showPasswordForm"
            @submit.prevent="handleChangePassword"
            class="mt-4 space-y-4"
          >
            <div>
              <label
                for="current_password"
                class="block text-sm font-medium text-gray-700"
                >Password Saat Ini</label
              >
              <input
                id="current_password"
                v-model="passwordForm.current_password"
                type="password"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                for="new_password"
                class="block text-sm font-medium text-gray-700"
                >Password Baru</label
              >
              <input
                id="new_password"
                v-model="passwordForm.new_password"
                type="password"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                for="new_password_confirmation"
                class="block text-sm font-medium text-gray-700"
                >Konfirmasi Password Baru</label
              >
              <input
                id="new_password_confirmation"
                v-model="passwordForm.new_password_confirmation"
                type="password"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div v-if="passwordError" class="rounded-md bg-red-50 p-4">
              <div class="text-sm text-red-700">{{ passwordError }}</div>
            </div>

            <div class="flex space-x-3">
              <button
                type="button"
                @click="cancelPasswordChange"
                class="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="passwordLoading"
                class="flex-1 inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {{ passwordLoading ? "Mengubah..." : "Ubah" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Profil Saya",
  description: "Kelola profil dan pengaturan akun Anda",
  middleware: "auth",
});

const { user, updateProfile } = useAuth();

if (!user.value) {
  throw createError({
    statusCode: 401,
    statusMessage: "Unauthorized",
  });
}

const isEditing = ref(false);
const updateLoading = ref(false);
const updateError = ref("");

const showPasswordForm = ref(false);
const passwordLoading = ref(false);
const passwordError = ref("");

const editForm = reactive({
  name: user.value?.name || "",
  email: user.value?.email || "",
  phone: user.value?.phone || "",
  address: user.value?.address || "",
});

const passwordForm = reactive({
  current_password: "",
  new_password: "",
  new_password_confirmation: "",
});

const userInitials = computed(() => {
  if (!user.value?.name) return "??";
  return user.value.name
    .split(" ")
    .map((name) => name.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
});

// Mock stats - replace with real API call
const stats = ref({
  totalDonations: 5,
  totalAmount: 2500000,
  lastDonation: "2024-01-15T10:30:00Z",
});

// Mock recent activities - replace with real API call
const recentActivities = ref([
  {
    id: 1,
    title: "Donasi untuk Program Pendidikan",
    date: "2024-01-15T10:30:00Z",
  },
  { id: 2, title: "Mengikuti Kajian Mingguan", date: "2024-01-10T14:00:00Z" },
  { id: 3, title: "Donasi Paket Sembako", date: "2024-01-05T09:15:00Z" },
]);

const handleUpdateProfile = async () => {
  updateLoading.value = true;
  updateError.value = "";

  try {
    await updateProfile(editForm);
    isEditing.value = false;
  } catch (err: any) {
    updateError.value = err.message || "Gagal memperbarui profil";
  } finally {
    updateLoading.value = false;
  }
};

const cancelEdit = () => {
  isEditing.value = false;
  updateError.value = "";
  // Reset form
  editForm.name = user.value?.name || "";
  editForm.email = user.value?.email || "";
  editForm.phone = user.value?.phone || "";
  editForm.address = user.value?.address || "";
};

const handleChangePassword = async () => {
  if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
    passwordError.value = "Password baru dan konfirmasi tidak sama";
    return;
  }

  if (passwordForm.new_password.length < 6) {
    passwordError.value = "Password baru minimal 6 karakter";
    return;
  }

  passwordLoading.value = true;
  passwordError.value = "";

  try {
    // Mock API call - replace with real implementation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    showPasswordForm.value = false;
    // Reset form
    passwordForm.current_password = "";
    passwordForm.new_password = "";
    passwordForm.new_password_confirmation = "";
  } catch (err: any) {
    passwordError.value = err.message || "Gagal mengubah password";
  } finally {
    passwordLoading.value = false;
  }
};

const cancelPasswordChange = () => {
  showPasswordForm.value = false;
  passwordError.value = "";
  passwordForm.current_password = "";
  passwordForm.new_password = "";
  passwordForm.new_password_confirmation = "";
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};
</script>
