import { WalletClient } from '@/components/fornecedor/wallet-client'
import { AdvisorSupplierShell } from '@/components/assessor/advisor-supplier-shell'

export default function Page() {
  return (
    <AdvisorSupplierShell>
      <WalletClient />
    </AdvisorSupplierShell>
  )
}
