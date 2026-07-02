<template>
  <div class="flex flex-col w-1/4 mx-3">
    <label class="mb-1 font-[jua]">
      {{ field.nama }}
      <span v-if="field.calculation" class="text-xs text-gray-500">(otomatis)</span>
      <span v-if="field.important" class="text-red-500"> * </span>
    </label>

    <div class="relative w-full">
      <input
        v-if="field.tipe_input === 'text' || field.tipe_input === 'number'"
        :type="field.tipe_input"
        :value="modelValue?.jawaban || ''"
        :readonly="!!field.calculation"
        @input="
          !field.calculation &&
            emit('update:modelValue', {
              opsi_parameter_id: null,
              jawaban: ($event.target as HTMLInputElement).value,
            })
        "
        class="w-full rounded-xl border bg-white px-4 py-2 pr-14 focus:ring-2 focus:ring-[#FA812F] outline-none"
        :class="{ 'bg-gray-100 text-gray-600 cursor-not-allowed': field.calculation }"
      />

      <select
        v-else-if="field.tipe_input === 'select'"
        :value="modelValue?.opsi_parameter_id || ''"
        @change="onChange($event)"
        class="w-full rounded-xl bg-white border px-4 py-2 pr-10 focus:ring-2 focus:ring-[#FA812F] outline-none appearance-none"
      >
        <option disabled value="">Select</option>
        <option value="">Hapus pilihan</option>
        <option v-for="opt in field.opsi_parameter" :key="opt.id" :value="opt.id">
          {{ opt.jawaban }}
        </option>
      </select>

      <select
        v-else-if="field.tipe_input === 'boolean'"
        :value="modelValue?.jawaban ?? ''"
        @change="
          emit('update:modelValue', {
            opsi_parameter_id: null,
            jawaban: ($event.target as HTMLSelectElement).value === 'true',
          })
        "
        class="w-full rounded-xl bg-white border px-4 py-2 focus:ring-2 focus:ring-[#FA812F] outline-none"
      >
        <option disabled value="">Select</option>
        <option value="true">Ya</option>
        <option value="false">Tidak</option>
      </select>

      <span
        v-if="field.satuan && field.tipe_input !== 'select' && field.tipe_input !== 'boolean'"
        class="absolute right-4 top-1/2 -translate-y-1/2 text-black text-sm pointer-events-none"
      >
        {{ field.satuan }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  field: any
  modelValue: any
}>()

const emit = defineEmits(['update:modelValue'])
const onChange = (event: Event) => {
  const selectedId = (event.target as HTMLSelectElement).value

  if (!selectedId) {
    emit('update:modelValue', {
      opsi_parameter_id: null,
      jawaban: '',
    })
    return
  }

  const selectedOption = props.field.opsi_parameter?.find(
    (opt: any) => String(opt.id) === String(selectedId),
  )

  if (!selectedOption) {
    emit('update:modelValue', {
      opsi_parameter_id: null,
      jawaban: '',
    })
    return
  }

  emit('update:modelValue', {
    opsi_parameter_id: selectedOption.id,
    jawaban: selectedOption.jawaban,
  })
}
</script>
