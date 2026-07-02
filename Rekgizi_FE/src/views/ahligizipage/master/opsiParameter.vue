<template>
  <AhliGiziLayout>
    <h1 class="text-3xl font-[jua] text-[#FA812F] mb-5">OPSI {{ parameter?.nama }}</h1>

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
            @click="deletedOpsi(row)"
          >
            <TrashIcon class="w-6 h-6" />
          </button>
          <router-link
            :to="`/ahligizi/master/parameter/${row.id}`"
            class="bg-[#FA812F] text-white px-1 py-1 mx-2 rounded-lg hover:bg-[#E67300] transition-colors duration-200"
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Jawaban</label>
            <input
              type="text"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
              placeholder="Masukkan nama parameter"
              v-model="form.jawaban"
            />
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
import { Pencil } from '@/icons/customeIcon'
import { ref, onMounted } from 'vue'
import { TrashIcon } from '@/icons/index'
import { useRoute } from 'vue-router'

import Swal from 'sweetalert2'
import { createOpsi, deleteOpsi, editOpsi, getOpsi } from '@/service/ahliGizi/master/opsi'
import { getParameterID } from '@/service/ahliGizi/master/parameter'

const route = useRoute()

const dialogVisible = ref(false)
const mode = ref('add')
const rows = ref([])
const selectedId = ref<number | null>(null)
const parameter_id = parseInt(route.params.id as string)
const parameter = ref<parameter | null>(null)

interface Opsi {
  id: number
  parameter_id: number
  jawaban: string
}

const form = ref({
  parameter_id: parameter_id,
  jawaban:''
})

interface parameter {
  id: number
  nama: string
}

onMounted(async () => {
  const res = await getParameterID(parameter_id)
  parameter.value = res.data?.data ?? res.data

  mapOpsi(parameter_id)
})

async function mapOpsi(parameter_id: number) {
  const opsi = await getOpsi(parameter_id)

  rows.value = opsi.data.map((item: Opsi) => ({
    id: item.id,
    parameter_id: item.parameter_id,
    jawaban : item.jawaban
  }))
}

function addModal() {
  mode.value = 'add'

  form.value = {
    parameter_id: parameter_id,
    jawaban: ''
  }
  dialogVisible.value = true
}

function editModal(Opsi: any) {
  mode.value = 'edit'
  selectedId.value = Opsi.id

  form.value = {
    parameter_id: Opsi.parameter_id,
    jawaban: Opsi.jawaban
  }

  dialogVisible.value = true
}

async function submitForm() {
  const payload = {
    parameter_id: form.value.parameter_id,
    jawaban: form.value.jawaban
  }

  try {
    if (mode.value == 'add') {
      await createOpsi(payload)
    } else if (selectedId.value !== null) {
      await editOpsi(selectedId.value, payload)
    }
    dialogVisible.value = false

    await Swal.fire({
      title: 'Berhasil',
      text: 'Data berhasil disimpan',
      icon: 'success',
    })

    mapOpsi(parameter_id)
  } catch (err) {
    Swal.fire({
      title: 'ERROR',
      text: String(err),
      icon: 'warning',
    })
  }
}

function deletedOpsi(Opsi: any) {
  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: `${Opsi.jawaban} akan dihapus!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      selectedId.value = Opsi.id
      try {
        await deleteOpsi(selectedId.value!)
        Swal.fire('Deleted!', 'Data berhasil dihapus.', 'success')
        mapOpsi(parameter_id)
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
  { label: 'Jawaban', key: 'jawaban' },
]
</script>
