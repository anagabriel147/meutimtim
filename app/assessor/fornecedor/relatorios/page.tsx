import { ReportsClient } from '@/components/fornecedor/reports-client'
import { AdvisorSupplierShell } from '@/components/assessor/advisor-supplier-shell'

export default function Page() {
  return (
    <AdvisorSupplierShell>
      <ReportsClient />
    </AdvisorSupplierShell>
  )
}
