<template>
  <AdminLayout>
    <h1 class="text-3xl font-[jua] text-[#FA812F] mb-5">User</h1>

    <div class="mx-2 my-2">
      <TableSearch
        :headers="header"
        :rows="rows"
        :total="total"
        :currentPage="currentPage"
        :limit="limit"
        :total_pages="total_pages"
        :search="search"
      >
        <template #addNew>
          <button
            class="bg-[#FA812F] text-white px-3 py-2 rounded-lg hover:bg-[#E67300] transition-colors duration-200"
            @click="addModal"
          >
            Add New
          </button>
        </template>
        <template #action="{ row }">
          <button
            class="bg-[#FA812F] text-white px-1 py-1 mx-2 rounded-lg hover:bg-[#E67300] transition-colors duration-200"
            @click="editModal(row)"
          >
            <Pencil class="w-6 h-6" />
          </button>

          <button
            class="bg-[#FA812F] text-white px-1 py-1 mx-2 rounded-lg hover:bg-[#E67300] transition-colors duration-200"
          >
            <TrashIcon class="w-6 h-6" />
          </button>
        </template>
      </TableSearch>
    </div>

    <Modal
      :dialogVisible="dialogVisible"
      :modalTitle="mode === 'add' ? 'Tambah User' : 'Edit User'"
      @close="closeModal"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
            <input
              type="text"
              class="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
              placeholder="Masukkan nama User"
              v-model="form.nama"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Email"
              class="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F]"
              v-model="form.email"
            />
          </div>
          <div class="flex">
            <div class="flex-1  mr-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                class="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F]"
                placeholder="Kelamin"
                v-model="form.jenis_kelamin"
              >
                <option value="" disabled selected>Gender</option>
                <option value="pria">Pria</option>
                <option value="wanita">Wanita</option>
              </select>
            </div>
            <div class="flex-2  mr-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                class="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F]"
                placeholder="Role"
                v-model="form.role"
                required
              >
                <option value="" disabled selected>Select</option>
                <option value="ahli_gizi">Ahli Gizi</option>
                <option value="pasien">Pasien</option>
                <option value="admin">Admin</option>
                <option value="tenaga_kesehatan">Tenaga Kesehatan</option>
              </select>
            </div>
            <div class="flex-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
              <dateform
                v-model="form.tanggal_lahir"
                :config="dateConfig"
                placeholder="Tanggal Lahir"
              />
            </div>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
          <div class="flex my-2">
            <div class="flex-1 mx-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Desa</label>
              <input
                type="text"
                class="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
                placeholder="Masukkan desa"
                v-model="form.alamat.desa"
              />
            </div>
            <div class="flex-1 mx-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Kecamatan</label>
              <input
                type="text"
                class="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
                placeholder="Masukkan kecamatan"
                v-model="form.alamat.kecamatan"
              />
            </div>
            <div class="flex-1 mx-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Kota</label>
              <input
                type="text"
                class="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
                placeholder="Masukkan kota"
                v-model="form.alamat.kota"
              />
            </div>
            <div class="flex-1 mx-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Provinsi</label>
              <input
                type="text"
                class="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
                placeholder="Masukkan provinsi"
                v-model="form.alamat.provinsi"
              />
            </div>
          </div>
          <textarea
            id="Tujuan Diet"
            class="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F]"
            rows="3"
            v-model="form.alamat.lengkap"
            placeholder="Alamat Lengkap"
          ></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <password_form v-model="form.password" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password Confirm</label>
          <password_form v-model="form.password_validation" />
        </div>
      </template>
      <template #button>
        <button
          type="button"
          class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 mr-2"
          @click="closeModal"
        >
          Cancel
        </button>

        <button
          type="button"
          class="bg-[#FA812F] text-white px-4 py-2 rounded-md hover:bg-[#E67300]"
          @click="submitForm()"
        >
          Save
        </button>
      </template>
    </Modal>
  </AdminLayout>
</template>
<script setup lang="ts">
import AdminLayout from '@/components/layout/admin/AdminLayout.vue'
import Modal from '@/components/costumeComponents/common/modal.vue'
import dateform from '@/components/costumeComponents/form input/dateform.vue'
import password_form from '@/components/costumeComponents/form input/password_form.vue'
import { Pencil } from '@/icons/customeIcon'
import { onMounted, ref } from 'vue'
import { TrashIcon } from '@/icons/index'
import TableSearch from '@/components/costumeComponents/common/tableSearch.vue'
import { editUser, getUserAdmin, postUser } from '@/service/admin/user'
import Swal from 'sweetalert2'

const dialogVisible = ref(false)
const mode = ref('add')
const selectedId = ref<number | null>(null)

const dateConfig = {
  minDate: '1800-01-01',
  maxDate: 'today',
}

const total = ref(0)
const currentPage = ref(1)
const limit = ref(10)
const total_pages = ref(1)
const rows = ref<any[]>([])
const search = ref('')

onMounted(async () => {
  mapUser()
})

interface User {
  id: number
  nama: string
  email: string
  role: string
  jenis_kelamin: string
  tanggal_lahir: string
  alamat: {
    desa: string
    kecamatan: string
    kota: string
    provinsi: string
    lengkap: string
  }
}

const form = ref({
  nama: '',
  role: '',
  email: '',
  jenis_kelamin: '',
  tanggal_lahir: '',
  password: '',
  password_validation: '',
  alamat: {
    desa: '',
    kecamatan: '',
    kota: '',
    provinsi: '',
    lengkap: '',
  },
})

function addModal() {
  mode.value = 'add'
  form.value = {
    nama: '',
    role: 'pasien',
    jenis_kelamin: '',
    tanggal_lahir: '',
    email: '',
    password: '',
    password_validation: '',
    alamat: {
      desa: '',
      kecamatan: '',
      kota: '',
      provinsi: '',
      lengkap: '',
    },
  }
  dialogVisible.value = true
}

function editModal(user: any) {
  mode.value = 'edit'
  selectedId.value = user.id
  form.value = {
    nama: user.nama,
    role: user.role,
    email: user.email,
    jenis_kelamin: user.jenis_kelamin,
    tanggal_lahir: user.tanggal_lahir,
    password: '',
    password_validation: '',
    alamat: {
      desa: user.alamat?.desa,
      kecamatan: user.alamat?.kecamatan,
      kota: user.alamat?.kota,
      provinsi: user.alamat?.provinsi,
      lengkap: user.alamat?.lengkap,
    },
  }
  dialogVisible.value = true
}

async function mapUser() {
  const res = await getUserAdmin(search.value, currentPage.value, limit.value)

  const meta = res.data?.meta
  const data = res.data?.data || []

  total.value = meta?.total ?? 0
  currentPage.value = meta?.current_page ?? 1
  limit.value = meta?.limit ?? 10
  total_pages.value = meta?.total_pages ?? 1

  rows.value = data.map((item: User) => ({
    id: item.id,
    nama: item.nama,
    role: item.role,
    email: item.email,
    jenis_kelamin: item.jenis_kelamin,
    tanggal_lahir: item.tanggal_lahir,
    alamat: {
      desa: item.alamat?.desa,
      kecamatan: item.alamat?.kecamatan,
      kota: item.alamat?.kota,
      provinsi: item.alamat?.provinsi,
      lengkap: item.alamat?.lengkap,
    },
  }))
}

async function submitForm() {
  const payload = {
    role: form.value.role,
    nama: form.value.nama,
    email: form.value.email,
    jenis_kelamin: form.value.jenis_kelamin,
    tanggal_lahir: form.value.tanggal_lahir,
    password: form.value.password,
    password_validation: form.value.password_validation,
    alamat: {
      desa: form.value.alamat?.desa,
      kecamatan: form.value.alamat?.kecamatan,
      kota: form.value.alamat?.kota,
      provinsi: form.value.alamat?.provinsi,
      lengkap: form.value.alamat?.lengkap,
    },
  }

  if (mode.value === 'edit' && !payload.password && !payload.password_validation) {
    delete (payload as any).password
    delete (payload as any).password_validation
  }

  try {
    if (mode.value == 'add') {
      await postUser(payload)
    } else if (selectedId.value !== null) {
      await editUser(selectedId.value, payload)
    }
    dialogVisible.value = false
    await Swal.fire({
      title: 'Berhasil',
      text: 'Data berhasil disimpan',
      icon: 'success',
    })
    mapUser()
  } catch (error) {
    Swal.fire({
      title: 'ERROR',
      text: String(error),
      icon: 'warning',
    })
  }
}

function closeModal() {
  dialogVisible.value = false
}

const header = [
  { label: 'Nama', key: 'nama' },
  { label: 'Role', key: 'role' },
  { label: 'Gender', key: 'jenis_kelamin' },
  { label: 'Tanggal Lahir', key: 'tanggal_lahir' },
]
</script>
