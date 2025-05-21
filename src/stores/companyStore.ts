import { Company } from "@/api/interfaces"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useCompanyStore = defineStore('company', () => {
  const company = ref<Company>({} as Company)

  const setCompany = (newCompany: Company) => {
    company.value = newCompany
  }

  return {
    company,
    setCompany,
  }
})
