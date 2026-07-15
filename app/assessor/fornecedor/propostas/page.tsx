import { ProposalsClient } from '@/components/fornecedor/proposals-client'
import { AdvisorSupplierShell } from '@/components/assessor/advisor-supplier-shell'

export default function Page() {
  return (
    <AdvisorSupplierShell>
      <ProposalsClient />
    </AdvisorSupplierShell>
  )
}
