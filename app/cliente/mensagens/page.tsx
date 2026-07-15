import type { Metadata } from 'next'

import { MessagesClient } from '@/components/mensagens/messages-client'

export const metadata: Metadata = {
  title: 'Mensagens · TimTim',
  description: 'Converse com os fornecedores do seu evento em um só lugar.',
}

export default function MensagensPage() {
  return <MessagesClient />
}
