import type { Metadata } from 'next'

import { VendorProfile } from '@/components/fornecedores/vendor-profile'

export const metadata: Metadata = {
  title: 'Perfil do Fornecedor · TimTim',
  description: 'Veja portfólio, avaliações e solicite orçamento ao fornecedor na TimTim.',
}

export default function VendorProfilePage() {
  return <VendorProfile />
}
