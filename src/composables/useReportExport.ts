import { printReportDocument } from '@/api/electron'
import { useBranch } from '@/composables/useBranch'
import { useReports } from '@/composables/useReports'
import { toast } from '@/composables/useToast'
import { computed, ref } from 'vue'

type ExportColumn<T> = {
  key: keyof T | string
  label: string
  format?: (value: any, row: T) => string
}

const valueFromPath = (row: any, key: string) => key.split('.').reduce((value, path) => value?.[path], row)
const textValue = (value: unknown) => value === null || value === undefined ? '' : `${value}`

const cleanCsvValue = (value: unknown) => {
  const text = textValue(value)
  return `"${text.replace(/"/g, '""')}"`
}

export const useReportExport = () => {
  const { branch } = useBranch()
  const { filters, reportData } = useReports()
  const exportingPdfTitle = ref('')

  const paymentMethodLabel = (method?: string) => ({
    cash: 'Efectivo',
    card: 'Tarjeta',
    transfer: 'Transferencia',
    other: 'Otro',
  }[method || ''] || method || '')

  const catalogName = (catalog: Array<{ id: string, name: string }>, id?: string) => (
    catalog.find((item) => item.id === id)?.name || ''
  )

  const getVisibleFilters = () => {
    const currentFilters = filters.value
    const catalogs = reportData.value.catalogs

    return [
      { label: 'Desde', value: currentFilters.startDate || '' },
      { label: 'Hasta', value: currentFilters.endDate || '' },
      { label: 'Sucursal', value: catalogName(catalogs.branches, currentFilters.id_branch) },
      { label: 'Vendedor', value: catalogName(catalogs.sellers, currentFilters.id_seller) },
      { label: 'Cliente', value: catalogName(catalogs.customers, currentFilters.id_customer) },
      { label: 'Pago', value: paymentMethodLabel(currentFilters.payment_method) },
      { label: 'Categoria', value: catalogName(catalogs.categories, currentFilters.id_category) },
      { label: 'Producto', value: catalogName(catalogs.products, currentFilters.id_product) },
      { label: 'Buscar', value: currentFilters.search || '' },
    ].filter((filter) => filter.value)
  }

  const exportCsv = <T extends Record<string, any>>(title: string, rows: T[], columns: ExportColumn<T>[]) => {
    const headers = columns.map((column) => cleanCsvValue(column.label)).join(',')
    const body = rows.map((row) => columns.map((column) => {
      const value = valueFromPath(row, String(column.key))
      return cleanCsvValue(column.format ? column.format(value, row) : value)
    }).join(',')).join('\n')
    const blob = new Blob([`${headers}\n${body}`], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const exportPdf = <T extends Record<string, any>>(title: string, rows: T[], columns: ExportColumn<T>[]) => {
    if (exportingPdfTitle.value) return
    exportingPdfTitle.value = title

    const payload = {
      title,
      generatedAt: new Date().toISOString(),
      branch: {
        logo: branch.value.logo,
        name: branch.value.branch_name,
        alias: branch.value.branch_alias,
      },
      filters: getVisibleFilters(),
      columns: columns.map((column) => ({ label: column.label })),
      rows: rows.map((row) => columns.map((column) => {
        const value = valueFromPath(row, String(column.key))
        return textValue(column.format ? column.format(value, row) : value)
      })),
    }

    try {
      printReportDocument(payload, (response: any) => {
        exportingPdfTitle.value = ''
        if (!response.success) {
          toast.error(response.message || 'No se pudo generar el PDF')
          return
        }
        toast.success(response.message || 'Documento guardado como PDF')
      })
    } catch (error) {
      exportingPdfTitle.value = ''
      toast.error(error instanceof Error ? error.message : 'No se pudo generar el PDF')
    }
  }

  const isExportingPdf = (title: string) => computed(() => exportingPdfTitle.value === title)

  return { exportCsv, exportPdf, isExportingPdf }
}
