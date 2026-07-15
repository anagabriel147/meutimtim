import { DisputesClient } from '@/components/fornecedor/disputes-client'
import { AdvisorSupplierShell } from '@/components/assessor/advisor-supplier-shell'

export default function Page() {
  return (
    <AdvisorSupplierShell>
      <DisputesClient />
    </AdvisorSupplierShell>
  )
}
