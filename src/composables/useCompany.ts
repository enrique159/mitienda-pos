import { Company } from "@/api/interfaces"
import { useCompanyStore } from "@/stores/companyStore"
import { storeToRefs } from "pinia"
import { computed } from "vue"

export const useCompany = () => {
  const companyStore = useCompanyStore()
  const { company } = storeToRefs(companyStore)

  function setCompany(newCompany: Company) {
    companyStore.setCompany(newCompany)
  }

  return {
    company,
    setCompany,
  }
}
