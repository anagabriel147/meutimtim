import { SupplierContractsClient } from '@/components/fornecedor/contracts-client'
import { AdvisorSupplierShell } from '@/components/assessor/advisor-supplier-shell'

export default function Page() {
  return (
    <AdvisorSupplierShell>
      <SupplierContractsClient />
    </AdvisorSupplierShell>
  )
}
