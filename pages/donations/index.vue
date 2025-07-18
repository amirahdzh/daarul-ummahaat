<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900">Form Donasi</h1>
          <p class="mt-2 text-gray-600">
            {{
              selectedFundraiser
                ? "Donasi untuk " + selectedFundraiser.title
                : "Berikan donasi untuk mendukung program Daarul Ummahaat"
            }}
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Donation Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">
              Informasi Donasi
            </h2>

            <form @submit.prevent="submitDonation" class="space-y-6">
              <!-- Fundraiser Selection (if not pre-selected) -->
              <div v-if="!selectedFundraiser && fundraisers?.data">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Penggalangan Dana (Opsional)
                </label>
                <select
                  v-model="form.fundraiser_id"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Donasi Umum</option>
                  <option
                    v-for="fundraiser in fundraisers.data"
                    :key="fundraiser.id"
                    :value="fundraiser.id"
                  >
                    {{ fundraiser.title }}
                  </option>
                </select>
              </div>

              <!-- Donation Package Selection -->
              <div v-if="donationPackages?.data">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Paket Donasi (Opsional)
                </label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <button
                    v-for="pkg in donationPackages.data"
                    :key="pkg.id"
                    type="button"
                    @click="selectPackage(pkg)"
                    :class="[
                      'p-4 text-left border rounded-lg transition-colors',
                      form.donation_package_id === pkg.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300',
                    ]"
                  >
                    <div class="font-medium text-gray-900">{{ pkg.title }}</div>
                    <div class="text-sm text-gray-600">
                      {{ formatCurrency(pkg.amount) }}
                    </div>
                    <div class="text-xs text-gray-500 mt-1">
                      {{ pkg.category }}
                    </div>
                  </button>
                </div>
                <button
                  type="button"
                  @click="clearPackage"
                  class="text-sm text-blue-600 hover:text-blue-700"
                >
                  Atau masukkan nominal sendiri
                </button>
              </div>

              <!-- Custom Title (for package donations) -->
              <div v-if="form.donation_package_id">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Judul Donasi
                </label>
                <input
                  v-model="form.title"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan judul donasi"
                />
              </div>

              <!-- Donor Information -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    v-model="form.email"
                    type="email"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon *
                </label>
                <input
                  v-model="form.phone"
                  type="tel"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+628xxxxxxxxx"
                />
              </div>

              <!-- Donation Category -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Kategori Donasi *
                </label>
                <select
                  v-model="form.category"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih kategori</option>
                  <option value="zakat">Zakat</option>
                  <option value="infaq">Infaq</option>
                  <option value="sedekah">Sedekah</option>
                  <option value="wakaf">Wakaf</option>
                  <option value="pendidikan">Pendidikan</option>
                  <option value="kesehatan">Kesehatan</option>
                  <option value="sosial">Sosial</option>
                </select>
              </div>

              <!-- Donation Amount -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nominal Donasi *
                </label>
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <span class="text-gray-500 sm:text-sm">Rp</span>
                  </div>
                  <input
                    v-model="form.amount"
                    type="number"
                    required
                    min="1000"
                    class="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="50000"
                  />
                </div>
                <p class="mt-1 text-sm text-gray-500">
                  Minimal donasi Rp 1.000
                </p>
              </div>

              <!-- Proof Upload -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Bukti Transfer *
                </label>
                <div
                  class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg"
                >
                  <div class="space-y-1 text-center">
                    <svg
                      class="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <div class="flex text-sm text-gray-600">
                      <label
                        class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload bukti transfer</span>
                        <input
                          ref="fileInput"
                          type="file"
                          accept="image/*"
                          class="sr-only"
                          @change="handleFileUpload"
                        />
                      </label>
                      <p class="pl-1">atau drag and drop</p>
                    </div>
                    <p class="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
                <div v-if="selectedFile" class="mt-2 text-sm text-gray-600">
                  File terpilih: {{ selectedFile.name }}
                </div>
              </div>

              <!-- Submit Button -->
              <div class="pt-4">
                <button
                  type="submit"
                  :disabled="submitting"
                  class="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span
                    v-if="submitting"
                    class="flex items-center justify-center"
                  >
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
                  <span v-else>Kirim Donasi</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Selected Fundraiser Info -->
          <div
            v-if="selectedFundraiser"
            class="bg-white rounded-lg shadow-md p-6"
          >
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Penggalangan Dana
            </h3>
            <div class="space-y-3">
              <h4 class="font-medium text-gray-900">
                {{ selectedFundraiser.title }}
              </h4>
              <div class="text-sm text-gray-600">
                <div class="flex justify-between mb-1">
                  <span>Progress</span>
                  <span
                    >{{
                      getProgressPercentage(
                        selectedFundraiser.current_amount,
                        selectedFundraiser.target_amount
                      )
                    }}%</span
                  >
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    class="bg-blue-600 h-2 rounded-full"
                    :style="{
                      width: `${Math.min(
                        getProgressPercentage(
                          selectedFundraiser.current_amount,
                          selectedFundraiser.target_amount
                        ),
                        100
                      )}%`,
                    }"
                  ></div>
                </div>
                <div class="flex justify-between text-xs">
                  <span>{{
                    formatCurrency(selectedFundraiser.current_amount)
                  }}</span>
                  <span>{{
                    formatCurrency(selectedFundraiser.target_amount)
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Instructions -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Cara Donasi
            </h3>
            <div class="space-y-4 text-sm">
              <div>
                <h4 class="font-medium text-gray-900 mb-2">Transfer Bank</h4>
                <div class="bg-gray-50 p-3 rounded">
                  <p class="font-mono">BCA: 1234567890</p>
                  <p class="font-mono">Mandiri: 0987654321</p>
                  <p class="text-xs text-gray-600 mt-1">
                    a.n. Yayasan Daarul Ummahaat
                  </p>
                </div>
              </div>
              <div>
                <h4 class="font-medium text-gray-900 mb-2">E-Wallet</h4>
                <div class="bg-gray-50 p-3 rounded">
                  <p class="font-mono">GoPay: 081234567890</p>
                  <p class="font-mono">Dana: 081234567890</p>
                  <p class="text-xs text-gray-600 mt-1">
                    a.n. Yayasan Daarul Ummahaat
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Butuh Bantuan?
            </h3>
            <div class="space-y-3 text-sm">
              <div class="flex items-center">
                <svg
                  class="w-4 h-4 text-gray-400 mr-2"
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
                <span>+62 812-3456-7890</span>
              </div>
              <div class="flex items-center">
                <svg
                  class="w-4 h-4 text-gray-400 mr-2"
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
                <span>info@daarulummahaat.org</span>
              </div>
            </div>
          </div>
        </div>
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
}

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
}

// Page meta
definePageMeta({
  title: "Form Donasi - Daarul Ummahaat",
  description: "Berikan donasi untuk mendukung program Daarul Ummahaat",
});

// Get query params
const route = useRoute();
const router = useRouter();

// Form state
const form = reactive({
  donation_package_id: null as number | null,
  fundraiser_id: Number(route.query.fundraiser_id) || null,
  title: "",
  name: "",
  email: "",
  phone: "",
  category: "",
  amount: null as number | null,
  proof_image: "",
});

const submitting = ref(false);
const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement>();

// Fetch data
const config = useRuntimeConfig();

const { data: donationPackages } = await useFetch<{ data: DonationPackage[] }>(
  "/donation-packages",
  {
    baseURL: config.public.apiBase,
    query: { per_page: 50 },
  }
);

const { data: fundraisers } = await useFetch<{ data: Fundraiser[] }>(
  "/fundraisers",
  {
    baseURL: config.public.apiBase,
    query: { status: "active", per_page: 50 },
  }
);

// Get selected fundraiser
const selectedFundraiser = computed(() => {
  if (!form.fundraiser_id || !fundraisers.value?.data) return null;
  return fundraisers.value.data.find((f) => f.id === form.fundraiser_id);
});

// Methods
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

const selectPackage = (pkg: DonationPackage) => {
  form.donation_package_id = pkg.id;
  form.amount = pkg.amount;
  form.category = pkg.category;
  form.title = pkg.title;
};

const clearPackage = () => {
  form.donation_package_id = null;
  form.amount = null;
  form.title = "";
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    selectedFile.value = file;
    // In a real app, you'd upload the file to storage and get a URL
    form.proof_image = file.name; // Placeholder
  }
};

const submitDonation = async () => {
  if (!selectedFile.value) {
    alert("Harap upload bukti transfer");
    return;
  }

  submitting.value = true;

  try {
    // Create FormData for file upload
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      const value = form[key as keyof typeof form];
      if (value !== null && value !== "") {
        formData.append(key, String(value));
      }
    });

    if (selectedFile.value) {
      formData.append("proof_image", selectedFile.value);
    }

    const response = await $fetch<{ donation: { id: number } }>("/donations", {
      baseURL: config.public.apiBase,
      method: "POST",
      body: formData,
    });

    // Redirect to success page
    await router.push(`/donations/success?id=${response.donation.id}`);
  } catch (error: any) {
    console.error("Donation submission error:", error);
    alert(error.data?.message || "Terjadi kesalahan saat mengirim donasi");
  } finally {
    submitting.value = false;
  }
};

// SEO
useHead({
  title: "Form Donasi - Daarul Ummahaat",
  meta: [
    {
      name: "description",
      content:
        "Berikan donasi untuk mendukung program Daarul Ummahaat dengan mudah dan aman",
    },
  ],
});
</script>
