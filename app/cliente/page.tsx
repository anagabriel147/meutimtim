import type { Metadata } from 'next'

import { DashboardClient } from '@/components/cliente/dashboard-client'

export const metadata: Metadata = {
  title: 'Painel de Controle · TimTim',
  description: 'Gerencie os seus fornecedores, propostas e datas num só lugar.',
}

export default function ClientePage() {
  return <DashboardClient />
}
