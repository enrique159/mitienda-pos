<template>
  <div class="p-8 pt-4 w-full overflow-y-auto max-w-[1080px] mx-auto">
    <h6 class="text-2xl font-bold mb-4">
      Crear nuevo producto
    </h6>
    <form @submit.prevent="handleSubmit" class="space-y-12">
      <!-- **************** GENERAL INFO **************** -->
      <div>
        <h6 class="font-bold text-lg text-black-1">
          Información general
        </h6>
        <div class="divider my-0" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Nombre del producto -->
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text text-black-1 font-medium required">Nombre del producto</span>
            </div>
            <input
              id="name"
              type="text"
              v-model="formData.name"
              placeholder="Ej. Coca Cola 600ml"
              class="input input-bordered w-full"
            >
            <div v-for="(error, index) in v$.name.$errors" :key="`error-name-${index}`">
              <span class="text-brand-pink text-sm">{{ error.$message }}</span>
            </div>
          </label>

          <!-- Sku -->
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text text-black-1 font-medium required">SKU</span>
            </div>
            <input
              id="sku"
              v-model="formData.sku"
              type="text"
              placeholder="Ej. CC600"
              class="input input-bordered w-full"
            >
            <div v-for="(error, index) in v$.sku.$errors" :key="`error-sku-${index}`">
              <span class="text-brand-pink text-sm">{{ error.$message }}</span>
            </div>
          </label>

          <!-- Código de barras -->
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text text-black-1 font-medium">Código de barras</span>
            </div>
            <input
              id="barcode"
              v-model="formData.barcode"
              type="text"
              placeholder="Ej. 7501055300556"
              class="input input-bordered w-full"
            >
          </label>

          <!-- Categoría -->
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text text-black-1 font-medium">Categoría</span>
            </div>
            <select
              id="category"
              v-model="formData.id_category"
              class="select select-bordered w-full"
            >
              <option v-for="category in availableCategories" :key="`select-option-${category.id}`" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </label>

          <!-- Descripción -->
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text text-black-1 font-medium">Descripción</span>
            </div>
            <textarea
              id="description"
              v-model="formData.description"
              rows="3"
              class="textarea textarea-bordered w-full"
              placeholder="Descripción del producto..."
            />
          </label>

          <!-- Proveedores -->
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text text-black-1 font-medium required">Proveedor</span>
            </div>
            <select
              id="provider"
              v-model="formData.id_provider"
              class="select select-bordered w-full"
            >
              <option v-for="provider in providers" :key="`select-option-${provider.id}`" :value="provider.id">
                {{ provider.name }}
              </option>
            </select>
          </label>

          <!-- HAS EXPIRATION DATE -->
          <div class="form-control">
            <label class="label cursor-pointer w-fit">
              <input
                type="checkbox"
                class="checkbox"
                :checked="formData.has_expiration_date"
                @change="formData.has_expiration_date = !formData.has_expiration_date"
              >
              <div class="flex flex-col items-start ml-2">
                <span class="font-semibold text-black-1 mr-2">Tiene fecha de caducidad</span>
                <span class="text-sm text-black-2">
                  El producto tiene una fecha de caducidad
                </span>
              </div>
            </label>
          </div>

          <!-- REQUIRES QUANTITY -->
          <div class="form-control">
            <label class="label cursor-pointer w-fit">
              <input
                type="checkbox"
                class="checkbox"
                :checked="formData.requires_quantity"
                @change="formData.requires_quantity = !formData.requires_quantity"
              >
              <div class="flex flex-col items-start ml-2">
                <span class="font-semibold text-black-1 mr-2">Requiere cantidad</span>
                <span class="text-sm text-black-2">
                  Al agregar el producto a la venta, se solicita cantidad
                </span>
              </div>
            </label>
          </div>

          <!-- EXPIRATION DATE -->
          <div v-if="formData.has_expiration_date">
            <label for="expiration_date" class="block mb-2 pl-1 text-sm font-medium text-black-2">Fecha de caducidad</label>
            <div class="flex items-center gap-4">
              <select id="expiration_date_month" v-model="expirationDate.month" class="select select-bordered w-full">
                <option v-for="month in Months" :key="`select-option-${month.value}`" :value="month.value">
                  {{ month.label }}
                </option>
              </select>
              <input
                id="expiration_date_year"
                v-model="expirationDate.year"
                type="number"
                min="0"
                step="1"
                class="input input-bordered w-fit min-w-12"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- **************** SALES INFO **************** -->
      <div>
        <h6 class="font-bold text-lg text-black-1">
          Venta
        </h6>
        <div class="divider my-0" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Precio de compra -->
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text text-black-1 font-medium required">Precio de compra</span>
              <span class="text-xs text-black-2">Costo del producto con proveedor</span>
            </div>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
              <input
                id="purchase_price"
                v-model="formData.purchase_price"
                type="number"
                min="0"
                step="any"
                class="input input-bordered w-full pl-7"
              >
            </div>
            <div v-for="(error, index) in v$.purchase_price.$errors" :key="`error-purchase_price-${index}`">
              <span class="text-brand-pink text-sm">{{ error.$message }}</span>
            </div>
          </label>

          <!-- Precio de venta -->
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text text-black-1 font-medium required">Precio de venta</span>
              <span class="text-xs text-black-2">Precio de venta al cliente</span>
            </div>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
              <input
                id="selling_price"
                v-model="formData.selling_price"
                type="number"
                min="0"
                step="any"
                class="input input-bordered w-full pl-7"
              >
            </div>
            <div v-for="(error, index) in v$.selling_price.$errors" :key="`error-selling_price-${index}`">
              <span class="text-brand-pink text-sm">{{ error.$message }}</span>
            </div>
          </label>

          <!-- TAXES AVAILABLE -->
          <div class="form-control w-full">
            <div class="label">
              <span class="label-text text-black-1 font-medium required">Impuestos</span>
            </div>
            <div class="flex items-center gap-4">
              <select
                id="taxes"
                class="select select-bordered w-full"
                v-model="selectedTax"
              >
                <option v-for="tax in taxesAvailable" :key="`select-option-tax_${tax.id}`" :value="tax.id">
                  {{ `${tax.code} - ${tax.name} - ${tax.type === 'tasa' ? tax.value + '%' : tax.type === 'cuota' ? formatCurrencySimple(tax.value!) : 'EXENTO'}` }}
                </option>
              </select>
              <button
                type="button"
                class="btn bg-white-2 shadow-none"
                @click="addTax"
              >
                Agregar
                <IconArrowRight class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- TAXES APPLIED -->
          <div class="form-control w-full">
            <div class="label">
              <span class="label-text text-black-1 font-medium">Impuestos aplicados</span>
              <span v-if="taxesApplied.length === 0" class="text-xs text-brand-orange">No se han agregado impuestos aún</span>
            </div>
            <div class="flex flex-col gap-2">
              <div
                v-for="(tax, index) in taxesAppliedInfo"
                :key="`tax-applied-${index}`"
                class="flex items-center gap-2"
              >
                <div class="w-full flex items-center justify-between border-2 border-dashed border-white-3 rounded-md p-3">
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-black-2">{{ tax.code }}</span>
                    <span class="text-sm text-black-2">{{ tax.name }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-black-2">{{ tax.type }}</span>
                    <span class="text-sm text-black-2">{{ tax.type === 'tasa' ? tax.value + '%' : tax.type === 'cuota' ? formatCurrencySimple(tax.value!) : 'EXENTO' }}</span>
                    <span class="text-sm text-black-1">{{ tax.value ? formatCurrencySimple((tax.value * formData.selling_price) / 100) : formatCurrencySimple(0) }}</span>
                  </div>
                </div>
                <button
                  type="button"
                  class="btn btn-sm btn-circle bg-brand-pink hover:bg-brand-black text-brand-white"
                  @click="removeTax(index)"
                >
                  <IconX class="w-6 h-6" />
                </button>
              </div>
            </div>

            <div v-if="taxesApplied.length > 0" class="w-full">
              <div class="divider my-0 mt-4" />

              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span class="text-black-1">Impuestos totales:</span>
                  <span class="text-black-1 font-bold">{{ formatCurrencySimple(taxTotal) }}</span>
                </div>

                <div class="flex items-center gap-2">
                  <span class="text-black-1">Precio venta total:</span>
                  <span class="text-green-500 font-bold">{{ formatCurrencySimple(formData.selling_price) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- UNIT MEASUREMENT -->
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text text-black-1 font-medium required">Unidad de medida</span>
            </div>
            <select
              id="unit_measurement"
              v-model="formData.unit_measurement"
              class="select select-bordered w-full"
            >
              <option v-for="unit in unitMeasurements" :key="`select-option_${unit.value}`" :value="unit.value">
                {{ unit.label }}
              </option>
            </select>
            <div v-for="(error, index) in v$.unit_measurement.$errors" :key="`error-unit-${index}`">
              <span class="text-brand-pink text-sm">{{ error.$message }}</span>
            </div>
          </label>

          <!-- BULK PRODUCT -->
          <div class="form-control pt-7">
            <label class="label cursor-pointer w-fit">
              <input
                type="checkbox"
                class="checkbox"
                :checked="formData.is_bulk"
                @change="formData.is_bulk = !formData.is_bulk"
              >
              <div class="flex flex-col items-start ml-2">
                <span class="font-semibold text-black-1 mr-2">Venta a granel</span>
                <span class="text-sm text-black-2">
                  El producto se vende a granel o en fracciones
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- **************** STOCK INFO **************** -->
      <div>
        <div class="flex justify-between items-center">
          <h6 class="font-bold text-lg text-black-1">
            Inventario
          </h6>
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text mr-2">Requiere inventario</span>
              <input
                type="checkbox"
                class="toggle checked:text-brand-pink"
                :checked="formData.unlimited_stock"
                @change="toggleUnlimitedStock"
              >
            </label>
          </div>
        </div>
        <div class="divider my-0" />
        <div class="grid grid-cols-2 gap-4">
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text text-black-1 font-medium required">Stock</span>
            </div>
            <input
              id="stock"
              v-model="formData.stock"
              type="number"
              min="0"
              step="1"
              :disabled="!formData.unlimited_stock"
              class="input input-bordered w-full"
            >
            <div v-for="(error, index) in v$.stock.$errors" :key="`error-stock-${index}`">
              <span class="text-brand-pink text-sm">{{ error.$message }}</span>
            </div>
          </label>

          <label class="form-control w-full">
            <div class="label">
              <span class="label-text text-black-1 font-medium required">Stock mínimo</span>
            </div>
            <input
              id="stock_minimum"
              v-model="formData.stock_minimum"
              type="number"
              min="0"
              step="1"
              :disabled="!formData.unlimited_stock"
              class="input input-bordered w-full"
            >
            <div v-for="(error, index) in v$.stock_minimum.$errors" :key="`error-stock_minimum-${index}`">
              <span class="text-brand-pink text-sm">{{ error.$message }}</span>
            </div>
          </label>
        </div>
      </div>

      <div class="flex justify-end space-x-4">
        <base-button
          type="button"
          @click="$router.back()"
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

  <dialog id="dialogProviderAlert" ref="dialogProviderAlertRef" class="modal" @keydown.escape.prevent="() => {}">
    <div class="modal-box min-w-[480px]">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold">
          No hay proveedores disponibles
        </h3>
      </div>

      <div class="flex flex-col justify-center items-center mt-8">
        <p class="text-center text-black-1 mb-4">
          Para crear un producto, debes agregar al menos un proveedor. <br>¿Deseas agregar uno ahora?
        </p>
        <base-button
          type="button"
          class="flex items-center gap-2"
          @click="$router.push('/main/products/providers')"
        >
          <IconTruckLoading :size="18" />
          Ir a proveedores
        </base-button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { IconArrowRight, IconX, IconTruckLoading } from '@tabler/icons-vue'
import { required, helpers, minValue } from '@vuelidate/validators'
import { CreateProduct, UnitMeasurement, Tax, Response, ProductTax, Product } from '@/api/interfaces'
import { createProduct, getAllProducts, getProducts } from '@/api/electron'
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { useCurrency } from '@/composables/useCurrency'
import { useBranch } from '@/composables/useBranch'
import { useTax } from '@/composables/useTax'
import { useProduct } from '@/composables/useProduct'
import { useDate } from '@/composables/useDate'
import { Months } from '@/constants'
import { toast } from 'vue3-toastify'
import { useProvider } from '@/composables/useProvider'

const { taxes } = useTax()
const { branch } = useBranch()
const { setAllProducts, setProducts, availableCategories } = useProduct()
const { providers } = useProvider()
const { formatCurrencySimple } = useCurrency()
const { formatDate } = useDate()

// Providers
const dialogProviderAlertRef = ref()
const emptyProviders = computed(() => providers.value.length === 0)

const openProviderAlertModal = () => {
  dialogProviderAlertRef.value?.showModal()
}

watch(emptyProviders, (value: boolean) => {
  if (value) {
    openProviderAlertModal()
  }
})

onMounted(() => {
  if (emptyProviders.value) {
    openProviderAlertModal()
  }
})

// Taxes
const selectedTax = ref<string>(taxes.value[0].id)
const taxesApplied = ref<Tax[]>([])
const taxesAvailable = computed(() => taxes.value.filter((tax) => tax.transferred))
const taxesAppliedInfo = computed(() => {
  return taxesApplied.value.map((tax) => ({
    ...tax,
  }))
})

const addTax = () => {
  const tax = taxes.value.find((tax) => tax.id === selectedTax.value)
  if (tax) {
    taxesApplied.value.push(tax)
    selectedTax.value = tax.id
  }
}
const removeTax = (index: number) => {
  taxesApplied.value.splice(index, 1)
}

const taxTotal = computed(() => {
  return taxesApplied.value.reduce((total: number, tax: Tax): number => {
    if (tax.type === 'tasa') {
      const taxValue = Number((formData.selling_price * tax.value! / 100).toFixed(2))
      return total + taxValue
    } else if (tax.type === 'cuota') {
      return total + Number(tax.value!.toFixed(2))
    } else {
      return total
    }
  }, 0)
})

// Unidades de medida
const unitMeasurements = [
  { value: UnitMeasurement.PIECE, label: 'Pieza' },
  { value: UnitMeasurement.KG, label: 'Kilogramo' },
  { value: UnitMeasurement.G, label: 'Gramo' },
  { value: UnitMeasurement.LITER, label: 'Litro' },
  { value: UnitMeasurement.ML, label: 'Mililitro' },
  { value: UnitMeasurement.BOX, label: 'Caja' },
  { value: UnitMeasurement.OTHER, label: 'Otro' },
]

const expirationDate = ref({
  month: Months[0].value,
  year: new Date().getFullYear(),
})

const formData = reactive({
  id_company: '',
  id_category: '',
  id_provider: '',
  name: '',
  sku: '',
  barcode: '',
  description: '',
  unit_measurement: UnitMeasurement.PIECE,
  is_bulk: false,
  unlimited_stock: true,
  stock: null as number | null,
  stock_minimum: null as number | null,
  purchase_price: 0,
  selling_price: 0,
  taxes: [],
  is_active: true,
  has_expiration_date: false,
  expiration_date: undefined,
  requires_quantity: false,
  is_composite: false,
})

const rules = computed(() => {
  return {
    name: { required: helpers.withMessage('El nombre es requerido', required) },
    sku: { required: helpers.withMessage('El SKU es requerido', required) },
    unit_measurement: { required: helpers.withMessage('La unidad de medida es requerida', required) },
    stock: {
      minValue: helpers.withMessage('El stock debe ser mayor o igual a 0', minValue(0)),
    },
    stock_minimum: {
      minValue: helpers.withMessage('El stock mínimo debe ser mayor o igual a 0', minValue(0)),
    },
    purchase_price: {
      required: helpers.withMessage('El precio de compra es requerido', required),
      minValue: helpers.withMessage('El precio de compra debe ser mayor o igual a 0', minValue(0)),
      maxTwoDecimals: helpers.withMessage('El precio de compra no debe tener más de 2 decimales', maxTwoDecimals),
    },
    selling_price: {
      required: helpers.withMessage('El precio de venta es requerido', required),
      minValue: helpers.withMessage('El precio de venta debe ser mayor o igual a 0', minValue(0)),
      maxTwoDecimals: helpers.withMessage('El precio de venta no debe tener más de 2 decimales', maxTwoDecimals),
    },
  }
})

const maxTwoDecimals = (value: number) => {
  const decimalStr = value.toString().split('.')[1]
  return !decimalStr || decimalStr.length <= 2
}

const v$ = useVuelidate(rules, formData)

// Methods
const toggleUnlimitedStock = () => {
  formData.unlimited_stock = !formData.unlimited_stock
  formData.stock = formData.unlimited_stock ? null : 0
  formData.stock_minimum = formData.unlimited_stock ? null : 0
}


const taxMaping = (tax: Tax): ProductTax => {
  return {
    code: tax.code,
    type: tax.type,
    name: tax.name,
    value: tax.value ?? null,
  }
}


const handleSubmit = async () => {
  try {
    const isFormCorrect = await v$.value.$validate()
    if (!isFormCorrect) {
      toast.warn('Formulario no válido, revise los errores')
      return
    }

    const newProduct: CreateProduct = {
      ...formData,
      expiration_date: formData.has_expiration_date
        ? formatDate(new Date(expirationDate.value.year, expirationDate.value.month, 1))
        : undefined,
      taxes: taxesApplied.value.map(taxMaping),
      purchase_price: formData.purchase_price * 100,
      selling_price: formData.selling_price * 100,
      id_company: branch.value.id_company,
    }

    createProduct(newProduct, (response: Response<void>) => {
      if (!response.success) {
        toast.error(response.message)
        return
      }
      reloadProducts()
      toast.success('Producto creado exitosamente')
    })
  } catch (error) {
    console.error('Error creating product:', error)
    toast.error('Error al crear el producto')
  }
}

const reloadProducts = () => {
  getAllProducts((response: Response<Product[]>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    setAllProducts(response.response)
  })

  getProducts((response: Response<Product[]>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    setProducts(response.response)
  })
}

onMounted(() => {
  formData.id_category = availableCategories.value[0] ? availableCategories.value[0].id : ''
  formData.id_provider = providers.value[0] ? providers.value[0].id : ''
  formData.stock = 0
  formData.stock_minimum = 0
})
</script>