<template>
  <AhliGiziLayout>
    <h1 class="text-3xl font-[jua] text-[#FA812F] mb-5">Parameter</h1>

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
            @click="editModal(row)"
          >
            <Pencil class="w-6 h-6" />
          </button>

          <button
            class="bg-[#FA812F] text-white px-1 py-1 mx-2 rounded-lg hover:bg-[#E67300] transition-colors duration-200"
            @click="deletedParams(row)"
          >
            <TrashIcon class="w-6 h-6" />
          </button>
          <router-link
            :to="`/ahligizi/master/parameter/${row.id}`"
            class="inline-flex items-center justify-center bg-[#FA812F] text-white px-1 py-1 mx-2 rounded-lg hover:bg-[#E67300] transition-colors duration-200"
            v-if="row.tipe_input === 'select'"
          >
            <SettingsIcon class="w-6 h-6" />
          </router-link>
        </template>
      </TableMaster>
    </div>

    <Modal
      :dialogVisible="dialogVisible"
      :modalTitle="mode === 'add' ? 'Tambah Parameter' : 'Edit Parameter'"
      @close="closeModal"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Parameter</label>
            <input
              type="text"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
              placeholder="Masukkan nama parameter"
              v-model="form.namaParameter"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select
              v-model="form.kategori"
              class="h-11 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F] font-[jua]"
            >
              <option value="" disabled class="font-[jua]">Select Option</option>
              <option value="antropometri" class="font-[jua]">Antropometri</option>
              <option value="biokimia" class="font-[jua]">Biokimia</option>
              <option value="fisik klinis" class="font-[jua]">Fisik Klinis</option>
              <option value="riwayat" class="font-[jua]">Riwayat</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipe Input</label>
            <select
              v-model="form.tipeInput"
              class="h-11 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F] font-[jua]"
            >
              <option value="" disabled class="font-[jua]">Select Option</option>
              <option value="text" class="font-[jua]">Teks Bebas</option>
              <option value="number" class="font-[jua]">Angka</option>
              <option value="select" class="font-[jua]">Pilihan</option>
              <option value="textarea" class="font-[jua]">Text Area</option>
              <option value="boolean" class="font-[jua]">Benar/Salah</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Important</label>
            <select
              v-model="form.important"
              class="h-11 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F] font-[jua]"
            >
              <option value="true" class="font-[jua]">Benar</option>
              <option value="false" class="font-[jua]">Salah</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
            <input
              type="text"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
              placeholder="Masukkan nilai normal"
              v-model="form.satuan"
            />
          </div>

          <div class="border-t pt-4">
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input type="checkbox" v-model="form.isCalculation" />
              Parameter hasil kalkulasi
            </label>
          </div>

          <div v-if="form.isCalculation" class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Formula</label>
              <input
                type="text"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
                placeholder="contoh: berat / ((tinggi / 100) * (tinggi / 100))"
                v-model="form.calculation.formula"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Pembulatan</label>
              <input
                type="number"
                min="0"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
                v-model.number="form.calculation.rounding"
              />
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-sm font-medium text-gray-700">Source Parameter</label>
                <button
                  type="button"
                  class="bg-[#FA812F] text-white px-3 py-1 rounded-md hover:bg-[#E67300]"
                  @click="addSource"
                >
                  Tambah Source
                </button>
              </div>

              <div
                v-for="(source, index) in form.calculation.sources"
                :key="index"
                class="grid grid-cols-[1fr_1fr_auto] gap-2 mb-2"
              >
                <select
                  v-model.number="source.source_parameter_id"
                  class="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
                >
                  <option :value="0" disabled>Pilih source</option>
                  <option
                    v-for="param in sourceOptions"
                    :key="param.id"
                    :value="param.id"
                  >
                    {{ param.namaParameter }}
                  </option>
                </select>

                <input
                  type="text"
                  class="h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
                  placeholder="variable, contoh: berat"
                  v-model="source.variable_name"
                />

                <button
                  type="button"
                  class="bg-gray-200 px-3 rounded-md hover:bg-gray-300"
                  @click="removeSource(index)"
                >
                  Hapus
                </button>
              </div>
            </div>
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
          @click="submitForm"
        >
          Save
        </button>
      </template>
    </Modal>
  </AhliGiziLayout>
</template>
<script setup lang="ts">
import AhliGiziLayout from '@/components/layout/Ahligizi/AhliGiziLayout.vue'
import TableMaster from '@/components/costumeComponents/common/tableMaster.vue'
import Modal from '@/components/costumeComponents/common/modal.vue'
import { SettingsIcon } from '@/icons/index'
import { Pencil } from '@/icons/customeIcon'
import { computed, ref, onMounted } from 'vue'
import { TrashIcon } from '@/icons/index'
import {
  getParameter,
  createParameter,
  editParameter,
  deleteParameter,
} from '@/service/ahliGizi/master/parameter'
import Swal from 'sweetalert2'

const dialogVisible = ref(false)
const mode = ref('add')
const rows = ref<any[]>([])
const selectedId = ref<number | null>(null)

interface Parameter {
  id: number
  nama: string
  kategori: string
  tipe_input: string
  satuan: string
  important: boolean
  calculation?: ParameterCalculation | null
}

interface CalculationSource {
  source_parameter_id: number
  variable_name: string
}

interface ParameterCalculation {
  formula: string
  rounding: number | null
  is_active: boolean
  sources: CalculationSource[]
}

const form = ref({
  namaParameter: '',
  kategori: '',
  tipeInput: '',
  satuan: '',
  important: false,
  isCalculation: false,
  calculation: {
    formula: '',
    rounding: 2,
    is_active: true,
    sources: [] as CalculationSource[],
  },
})

onMounted(async () => {
  mapParameter()
})

async function mapParameter() {
  const parameter = await getParameter()

  rows.value = parameter.data.map((item: Parameter) => ({
    id: item.id,
    namaParameter: item.nama,
    kategori: item.kategori,
    tipe_input: item.tipe_input,
    satuan: item.satuan,
    important: item.important ? 'Wajib diisi' : 'Tidak wajib diisi',
    calculation: item.calculation,
    jenis_nilai: item.calculation ? 'Kalkulasi' : 'Manual',
  }))
}

function addModal() {
  mode.value = 'add'
  form.value = {
    namaParameter: '',
    kategori: '',
    tipeInput: '',
    satuan: '',
    important: false,
    isCalculation: false,
    calculation: {
      formula: '',
      rounding: 2,
      is_active: true,
      sources: [],
    },
  }
  dialogVisible.value = true
}

function editModal(parameter: any) {
  mode.value = 'edit'
  selectedId.value = parameter.id

  form.value = {
    namaParameter: parameter.namaParameter,
    kategori: parameter.kategori,
    satuan: parameter.satuan,
    tipeInput: parameter.tipe_input,
    important: parameter.important,
    isCalculation: !!parameter.calculation,
    calculation: {
      formula: parameter.calculation?.formula ?? '',
      rounding: parameter.calculation?.rounding ?? 2,
      is_active: parameter.calculation?.is_active ?? true,
      sources: parameter.calculation?.sources?.map((source: CalculationSource) => ({
        source_parameter_id: source.source_parameter_id,
        variable_name: source.variable_name,
      })) ?? [],
    },
  }

  dialogVisible.value = true
}

function addSource() {
  form.value.calculation.sources.push({
    source_parameter_id: 0,
    variable_name: '',
  })
}

function removeSource(index: number) {
  form.value.calculation.sources.splice(index, 1)
}

async function submitForm() {
  const payload = {
    nama: form.value.namaParameter,
    kategori: form.value.kategori,
    tipe_input: form.value.tipeInput,
    satuan: form.value.satuan,
    important: form.value.important,
    calculation: form.value.isCalculation
      ? {
          formula: form.value.calculation.formula,
          rounding: form.value.calculation.rounding,
          is_active: form.value.calculation.is_active,
          sources: form.value.calculation.sources.filter(
            (source) => source.source_parameter_id && source.variable_name,
          ),
        }
      : null,
  }

  try {
    if (mode.value == 'add') {
      await createParameter(payload)
    } else if (selectedId.value !== null) {
      await editParameter(selectedId.value, payload)
    }
    dialogVisible.value = false

    await Swal.fire({
      title: 'Berhasil',
      text: 'Data berhasil disimpan',
      icon: 'success',
    })

    mapParameter()
  } catch (err) {
    Swal.fire({
      title: 'ERROR',
      text: String(err),
      icon: 'warning',
    })
  }
}

function deletedParams(parameter: any) {
  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: `${parameter.namaParameter} akan dihapus!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      selectedId.value = parameter.id
      try {
        await deleteParameter(selectedId.value!)
        Swal.fire('Deleted!', 'Data berhasil dihapus.', 'success')
        mapParameter()
      } catch (err) {
        Swal.fire('Error!', String(err), 'error')
      }
    }
  })
}

function closeModal() {
  dialogVisible.value = false
}

const header = [
  { label: 'Nama Parameter', key: 'namaParameter' },
  { label: 'Kategori', key: 'kategori' },
  { label: 'Tipe input', key: 'tipe_input' },
  { label: 'Jenis nilai', key: 'jenis_nilai' },
  {label: 'Harus diisi/tiak', key: 'important'},
  { label: 'Satuan', key: 'satuan' },
]

const sourceOptions = computed(() =>
  rows.value.filter((row: any) => row.id !== selectedId.value),
)
</script>
