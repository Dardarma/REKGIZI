<template>
  <AhliGiziLayout>
    <h1 class="text-3xl font-[jua] text-[#FA812F] mb-5">Diagnosa</h1>

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
            @click="deleteDiagnose(row)"
          >
            <TrashIcon class="w-6 h-6" />
          </button>
        </template>
      </TableMaster>
    </div>

    <Modal
      :dialogVisible="dialogVisible"
      :modalTitle="mode === 'add' ? 'Tambah Diagnosa' : 'Edit Diagnosa'"
      @close="closeModal"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kode</label>
            <input
              type="text"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
              placeholder="Masukkan nama parameter"
              v-model="form.kode"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Diagnosa</label>
            <textarea
              id="Tujuan Diet"
              class="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F]"
              rows="5"
              v-model="form.diagnosa"
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
import { onMounted, ref } from 'vue'
import { TrashIcon } from '@/icons/index'
import { createDiagnosa, editDiagnosa, getDiagnosa, deleteDiagnosa } from '@/service/ahliGizi/master/diagnosa'
import Diagnosa from '../diagnose/Diagnosa.vue'
import Swal from 'sweetalert2'

const dialogVisible = ref(false)
const mode = ref('add')
const rows = ref([])
const selectedId = ref<number | null>(null)

const form = ref({
  kode: '',
  diagnosa: '',
})

interface Diagnosa {
  id: number
  kode: string
  diagnosa: string
}

onMounted(async () => {
  mapDiagnosa()
})

async function mapDiagnosa() {
  const diagnosa = await getDiagnosa()

  rows.value = diagnosa.data.map((item: Diagnosa) => ({
    id: item.id,
    diagnosa: item.diagnosa,
    kode: item.kode,
  })) ?? []
}

function addModal() {
  mode.value = 'add'
  form.value = {
    kode: '',
    diagnosa: '',
  }
  dialogVisible.value = true
}

function editModal(diagnosa: any) {
  mode.value = 'edit'
  selectedId.value = diagnosa.id
  form.value = {
    kode: diagnosa.kode,
    diagnosa: diagnosa.diagnosa,
  }
  dialogVisible.value = true
}

async function submitForm() {
  const payload = {
    kode: form.value.kode,
    diagnosa: form.value.diagnosa,
  }

  try {
    if (mode.value == 'add') {
      await createDiagnosa(payload)
    } else if (selectedId.value !== null) {
      await editDiagnosa(selectedId.value, payload)
    }
    dialogVisible.value = false
    await Swal.fire({
      title: 'Berhasil',
      text: 'Data berhasil disimpan',
      icon: 'success',
    })

    mapDiagnosa()
  } catch (error) {
    Swal.fire({
      title: 'ERROR',
      text: String(error),
      icon: 'warning',
    })
  }
}

function deleteDiagnose(diagnosa: any) {
  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: `${diagnosa.kode} akan dihapus!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      selectedId.value = diagnosa.id
      try {
        await deleteDiagnosa(selectedId.value!)
        Swal.fire('Deleted!', 'Data berhasil dihapus.', 'success')
        
        await mapDiagnosa()
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
  { label: 'Kode', key: 'kode' },
  { label: 'Diagnosa', key: 'diagnosa' },
]
</script>
