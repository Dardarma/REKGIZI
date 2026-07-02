<template>
  <div class="flex flex-wrap gap-4 mx-2 mb-2">
    <div class="w-full text-red-500 font-bold">Logo bintang (*) wajib diisi</div> 
    <dynamicInput
      v-for="param in parameters"
      :key="param.id"
      :field="param"
      :modelValue="modelValue[param.id]"
      @update:modelValue="(val) => updateValue(param.id, val)"
    />
  </div>
  <div class="grid justify-items-stretch mx-5">
    <button
      type="button"
      class="bg-[#FA812F] text-white px-4 py-2 rounded-md hover:bg-[#E67300] justify-self-end"
      @click="handleSave"
    >
      Save
    </button>
  </div>
</template>
<script setup lang="ts">
import dynamicInput from '../../common/dynamicInput.vue'
import Parameter from '@/views/ahligizipage/master/parameter.vue'
import { postParameterPasien } from '@/service/ahliGizi/diagnosa/asuhan'
import Swal from 'sweetalert2'

interface Parameter {
  id: number
  nama: string
  kategori: string
  tipe_input: 'number' | 'select' | 'text' | 'boolean'
  satuan: string | null
  opsi_parameter: any[]
}

const props = defineProps<{
  parameters: Parameter[]
  rekam_pasien_id: number
  modelValue: Record<number, any>
}>()

const emit = defineEmits(['update:modelValue', 'success'])

const updateValue = (id: number, value: any) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [id]: value,
  })
}

const handleSave = () => {
  const data = Object.entries(props.modelValue)
    .map(([parameter_id, value]: any) => {
      const param = props.parameters.find((p) => p.id === Number(parameter_id))

      if (!param) return null

      const isEmpty =
        !value || value.jawaban === '' || value.jawaban === null || value.jawaban === undefined

      if (isEmpty) return null

      return {
        parameter_id: Number(parameter_id),
        opsi_parameter_id: value.opsi_parameter_id ?? null,
        jawaban: String(value.jawaban),
      }
    })
    .filter(Boolean)

  const payload = {
    rekam_pasien_id: props.rekam_pasien_id,
    data,
  }

  postRekamParameterPasien(payload)
}

async function postRekamParameterPasien(payload: any) {
  try {
    await postParameterPasien(payload)
    await Swal.fire({
      title: 'Berhasil',
      text: 'Data berhasil disimpan',
      icon: 'success',
    })
    emit('success')
  } catch (error) {
    Swal.fire({
      title: 'ERROR',
      text: String(error),
      icon: 'warning',
    })
  }
}
</script>
