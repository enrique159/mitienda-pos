<template>
  <div class="overflow-hidden">
    <header
      class="w-full h-[65px] px-8 bg-white border-b border-gray-200 flex items-center justify-between"
    >
      <h1 class="text-2xl text-black-2 font-medium">
        Impuestos
      </h1>

      <button
        class="btn btn-sm bg-brand-orange text-white shadow-none hover:bg-brand-pink hover:border-brand-pink"
        @click="openCreateTaxModal"
      >
        <icon-plus class="w-4 h-4" />
        Nuevo impuesto
      </button>
    </header>

    <TaxTable />

    <!-- DIALOG CREATE TAX -->
    <dialog id="dialogCreateTax" ref="dialogCreateTaxRef" class="modal" @keydown.escape="closeCreateTaxModal">
      <div class="modal-box max-w-lg">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">
            Nuevo impuesto
          </h3>
          <div class="modal-action mt-0">
            <form method="dialog" @submit="closeCreateTaxModal">
              <!-- if there is a button in form, it will close the modal -->
              <button class="close-btn">
                Cerrar
                <CustomKbd>ESC</CustomKbd>
              </button>
            </form>
          </div>
        </div>

        <form @submit.prevent="validateSubmit" class="w-full grid grid-cols-2 gap-4">
          <label class="form-control w-full col-span-2">
            <div class="label">
              <span class="label-text text-black-1 font-medium required">Tipo de impuesto</span>
            </div>
            <select
              id="tax_option"
              class="select select-bordered w-full"
              v-model="taxToCreate.code"
              @change="setTaxOption"
            >
              <option v-for="tax in taxOptions" :key="`select-option_${tax.code}`" :value="tax.code">
                {{ `${tax.code} - ${tax.name}` }}
              </option>
            </select>
          </label>

          <label class="form-control w-full">
            <div class="label">
              <span class="label-text text-black-1 font-medium required">Tasa o cuota</span>
            </div>
            <select
              id="tax_type"
              class="select select-bordered w-full"
              v-model="taxToCreate.type"
              @change="setTaxType"
            >
              <option v-for="tax in taxTypesFiltered" :key="`select-option_${tax}`" :value="tax">
                {{ tax.toUpperCase() }}
              </option>
            </select>
          </label>

          <label v-if="taxToCreate.type === 'cuota'" class="form-control w-full">
            <div class="label">
              <span class="label-text text-black-1 font-medium required">Importe</span>
            </div>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
              <input
                id="tax_import"
                v-model="taxToCreate.import"
                type="number"
                min="0"
                step="0.000001"
                class="input input-bordered w-full pl-7"
              >
            </div>
          </label>

          <label v-if="taxToCreate.type === 'tasa'" class="form-control w-full">
            <div class="label">
              <span class="label-text text-black-1 font-medium required">Porcentaje</span>
            </div>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2">%</span>
              <input
                id="tax_percentage"
                v-model="taxToCreate.percentage"
                type="number"
                min="0"
                step="0.000001"
                class="input input-bordered w-full pl-7"
              >
            </div>
          </label>

          <div class="col-span-2 flex justify-end space-x-4 pt-4">
            <base-button
              type="button"
              @click="closeCreateTaxModal"
            >
              Cancelar
            </base-button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-brand-orange rounded-md hover:bg-brand-pink"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </dialog>
  </div>
</template>

<script lang="ts" setup>
import TaxTable from '../components/TaxTable.vue'
import { IconPlus } from '@tabler/icons-vue'
import { ref, reactive, computed } from 'vue'
import { createTax, getTaxes } from '@/api/electron'
import { Response, CreateTax } from '@/api/interfaces'
import { useBranch } from '@/composables/useBranch'
import { useTax } from '@/composables/useTax'
import { toast } from 'vue3-toastify'

const { setTaxes } = useTax()
const { branch } = useBranch()
const dialogCreateTaxRef = ref()

const openCreateTaxModal = () => {
  dialogCreateTaxRef.value.showModal()
}

const closeCreateTaxModal = () => {
  dialogCreateTaxRef.value.close()
  resetTaxToCreate()
}

const taxOptions = [
  { code: '001', name: 'ISR' },
  { code: '002', name: 'IVA' },
  { code: '003', name: 'IEPS' },
]
const taxTypes = ['tasa', 'cuota', 'exento']
const taxTypesFiltered = computed(() => {
  if (taxToCreate.code !== '002') return taxTypes.filter((type) => type !== 'exento')
  return taxTypes
})

const setTaxOption = (event: any) => {
  taxToCreate.code = event.target.value
  taxToCreate.name = taxOptions.find((tax) => tax.code === taxToCreate.code)?.name ?? ''
}

const setTaxType = (event: any) => {
  const type = event.target.value
  taxToCreate.type = type

  switch (type) {
  case 'tasa':
    taxToCreate.percentage = 0
    taxToCreate.import = undefined
    break
  case 'cuota':
    taxToCreate.percentage = undefined
    taxToCreate.import = 0
    break
  case 'exento':
    taxToCreate.percentage = undefined
    taxToCreate.import = undefined
    break
  }
}

// Form
const taxToCreate = reactive({
  code: '002',
  name: 'IVA',
  type: 'tasa' as 'tasa' | 'cuota' | 'exento',
  percentage: 0 as number | undefined,
  import: undefined as number | undefined,
})

const resetTaxToCreate = () => {
  taxToCreate.code = '002'
  taxToCreate.name = 'IVA'
  taxToCreate.type = 'tasa'
  taxToCreate.percentage = 0
  taxToCreate.import = undefined
}

// Create tax
const saveTax = async() => {
  const tax: CreateTax = {
    id_company: branch.value.id_company,
    ...taxToCreate,
  }
  createTax(tax, (response: Response<void>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    toast.success('Impuesto creado exitosamente')
    getAllTaxes()
    closeCreateTaxModal()
  })
}

const validateSubmit = () => {
  if (taxToCreate.type === 'tasa') {
    if (taxToCreate.percentage === null || taxToCreate.percentage === undefined || taxToCreate.percentage.toString() === '') {
      toast.warn('Ingrese un porcentaje válido para la tasa')
      return false
    }
  } else if (taxToCreate.type === 'cuota') {
    if (taxToCreate.import === null || taxToCreate.import === undefined || taxToCreate.import.toString() === '') {
      toast.warn('Ingrese un importe válido para la cuota')
      return false
    }
  }
  saveTax()
}

const getAllTaxes = async () => {
  const response = await getTaxes()
  if (!response.success) {
    return toast.error(response.message)
  }
  setTaxes(response.response)
}
</script>
