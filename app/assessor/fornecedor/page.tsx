import { SupplierDashboard } from '@/components/fornecedor/supplier-dashboard'
import { AdvisorSupplierShell } from '@/components/assessor/advisor-supplier-shell'

export default function Page() {
  return (
    <AdvisorSupplierShell>
      <SupplierDashboard />
    </AdvisorSupplierShell>
  )
}
