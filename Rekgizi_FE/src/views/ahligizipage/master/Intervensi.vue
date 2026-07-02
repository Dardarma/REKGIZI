<template>
  <AhliGiziLayout>
    <h1 class="text-3xl font-[jua] text-[#FA812F] mb-5">Intervensi</h1>

    <div class="mx-2 my-2">
      <TableMaster :headers="header" :rows="rows">
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
            @click="modalDetail(row)"
          >
            <eye class="w-6 h-6" />
          </button>
          <button
            class="bg-[#FA812F] text-white px-1 py-1 mx-2 rounded-lg hover:bg-[#E67300] transition-colors duration-200"
            @click="editModal(row)"
          >
            <Pencil class="w-6 h-6" />
          </button>

          <button
            class="bg-[#FA812F] text-white px-1 py-1 mx-2 rounded-lg hover:bg-[#E67300] transition-colors duration-200"
            @click="deletedInterven(row)"
          >
            <TrashIconLg class="w-6 h-6" />
          </button>
        </template>
      </TableMaster>
    </div>

    <Modal
      :dialogVisible="dialogVisible"
      :modalTitle="mode === 'add' ? 'Tambah intervensi' : 'Edit intervensi'"
      @close="closeModal"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Diet</label>
            <input
              type="text"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
              placeholder="Jenis diet"
              v-model="form.jenis_diet"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tujuan</label>
            <textarea
              id="Tujuan Diet"
              class="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F]"
              rows="5"
              v-model="form.tujuan"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prinsip Diet</label>
            <textarea
              id="Tujuan Diet"
              class="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F]"
              rows="5"
              v-model="form.prinsip"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Rencana Diet</label>
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Protein</label>
                <input
                  type="number"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
                  placeholder="Protein"
                  v-model="form.protein"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Energi</label>
                <input
                  type="number"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
                  placeholder="Energi"
                  v-model="form.energi"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Karbohidrat</label>
                <input
                  type="number"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
                  placeholder="Karbohidrat"
                  v-model="form.karbohidrat"
                />
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Edukasi</label>
            <textarea
              id="Tujuan Diet"
              class="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F]"
              rows="5"
              v-model="form.edukasi"
            ></textarea>
          </div>
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

    <Modal
      :dialogVisible="dialogDetailVisible"
      modalTitle="Detail Intervesi"
      @close="closeModalDetail"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block font-[jua] text-lg font-medium text-gray-700 mb-1"
              >Jenis Diet</label
            >
            <p class="font-[jua] text-sm">
              {{ form.jenis_diet }}
            </p>
          </div>

          <div>
            <label class="block text-lg font-medium text-gray-700 mb-1">Tujuan</label>
            <p class="font-[jua] text-sm">
              {{ form.tujuan }}
            </p>
          </div>

          <div>
            <label class="block text-lg font-medium text-gray-700 mb-1">Prinsip</label>
            <p class="font-[jua] text-sm">
              {{ form.prinsip }}
            </p>
          </div>

          <div>
            <label class="block text-lg font-medium text-gray-700 mb-1">Rencan Diet</label>
            <ul class="font-[jua] text-sm">
              <li>Protein : {{ form.protein }}</li>
              <li>Energi: {{ form.energi }}</li>
              <li>Karbohidrat: {{ form.karbohidrat }}</li>
            </ul>
          </div>

          <div>
            <label class="block text-lg font-medium text-gray-700 mb-1">Edukasi</label>
            <p class="font-[jua] text-sm">
              {{ form.edukasi }}
            </p>
          </div>
        </div>
      </template>
      <template #button>
        <button
          type="button"
          class="bg-[#FA812F] text-white px-4 py-2 rounded-md hover:bg-[#E67300]"
          @click="closeModalDetail"
        >
          Ok
        </button>
      </template>
    </Modal>
  </AhliGiziLayout>
</template>
<script setup lang="ts">
import AhliGiziLayout from '@/components/layout/Ahligizi/AhliGiziLayout.vue'
import TableMaster from '@/components/costumeComponents/common/tableMaster.vue'
import Modal from '@/components/costumeComponents/common/modal.vue'
import { Pencil, eye } from '@/icons/customeIcon'
import { onMounted, ref } from 'vue'
import { TrashIconLg } from '@/icons/index'
import {
  createIntervensi,
  deleteIntervensi,
  editIntervensi,
  getIntervensi,
} from '@/service/ahliGizi/master/intervensi'
import Intervensi from '../diagnose/Intervensi.vue'
import Swal from 'sweetalert2'

const dialogVisible = ref(false)
const dialogDetailVisible = ref(false)
const mode = ref('add')
const selectedId = ref<number | null>(null)
const rows = ref([])

interface Intervensi {
  id: number
  jenis_diet: string
  tujuan: string
  prinsip: string
  edukasi: string
  protein: number
  energi: number
  karbohidrat: number
}

const form = ref({
  jenis_diet: '',
  tujuan: '',
  prinsip: '',
  edukasi: '',
  protein: '',
  energi: '',
  karbohidrat: '',
})

const defaultForm = {
  jenis_diet: '',
  tujuan: '',
  prinsip: '',
  edukasi: '',
  protein: '',
  energi: '',
  karbohidrat: '',
}

function resetForm() {
  form.value = { ...defaultForm }
}

onMounted(async () => {
  mapIntervensi()
})

async function mapIntervensi() {
  const intervensi = await getIntervensi()

  rows.value = intervensi.data.map((item: Intervensi) => ({
    id: item.id,
    jenis_diet: item.jenis_diet,
    tujuan: item.tujuan,
    prinsip: item.prinsip,
    edukasi: item.edukasi,
    protein: item.protein,
    energi: item.energi,
    karbohidrat: item.karbohidrat,
  }))
}
const header = [{ label: 'Intervensi', key: 'jenis_diet' }]

function addModal() {
  mode.value = 'add'
  form.value = {
    jenis_diet: '',
    tujuan: '',
    prinsip: '',
    edukasi: '',
    protein: '',
    energi: '',
    karbohidrat: '',
  }
  dialogVisible.value = true
}

function editModal(Intervensi: any) {
  mode.value = 'edit'
  selectedId.value = Intervensi.id

  form.value = {
    jenis_diet: Intervensi.jenis_diet,
    tujuan: Intervensi.tujuan,
    prinsip: Intervensi.prinsip,
    edukasi: Intervensi.edukasi,
    protein: Intervensi.protein,
    energi: Intervensi.energi,
    karbohidrat: Intervensi.karbohidrat,
  }
  dialogVisible.value = true
}

function modalDetail(Intervensi: any) {
  dialogDetailVisible.value = true
  form.value = {
    jenis_diet: Intervensi.jenis_diet,
    tujuan: Intervensi.tujuan,
    prinsip: Intervensi.prinsip,
    edukasi: Intervensi.edukasi,
    protein: Intervensi.protein,
    energi: Intervensi.energi,
    karbohidrat: Intervensi.karbohidrat,
  }

  dialogDetailVisible.value = true
}

async function submitForm() {
  const payload = {
    jenis_diet: form.value.jenis_diet,
    tujuan: form.value.tujuan,
    prinsip: form.value.prinsip,
    edukasi: form.value.edukasi,
    protein: form.value.protein,
    energi: form.value.energi,
    karbohidrat: form.value.karbohidrat,
  }

  try {
    if (mode.value == 'add') {
      await createIntervensi(payload)
    } else if (selectedId.value !== null) {
      await editIntervensi(selectedId.value, payload)
    }
    resetForm()
    dialogVisible.value = false

    await Swal.fire({
      title: 'Berhasil',
      text: 'Data berhasil disimpan',
      icon: 'success',
    })

    mapIntervensi()
  } catch (error) {
    Swal.fire({
      title: 'ERROR',
      text: String(error),
      icon: 'warning',
    })
  }
}

function deletedInterven(intervensi: any) {
  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: `${intervensi.jenis_diet} akan dihapus!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      selectedId.value = intervensi.id
      try {
        await deleteIntervensi(selectedId.value!)
        Swal.fire('Deleted!', 'Data berhasil dihapus.', 'success')
        mapIntervensi()
      } catch (err) {
        Swal.fire('Error!', String(err), 'error')
      }
    }
  })
}

function closeModal() {
  resetForm()
  dialogVisible.value = false
}

function closeModalDetail() {
  resetForm()
  dialogDetailVisible.value = false
}
</script>
