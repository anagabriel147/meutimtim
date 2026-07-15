import type { Metadata } from 'next'

import { SupplierMessagesClient } from '@/components/fornecedor/supplier-messages-client'

export const metadata: Metadata = {
  title: 'Mensagens · Fornecedor · TimTim',
  description: 'Converse com seus clientes sobre propostas e contratos em um só lugar.',
}

export default function FornecedorMensagensPage() {
  return <SupplierMessagesClient />
}
