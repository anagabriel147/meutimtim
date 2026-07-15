import type { Metadata } from 'next'

import { EventWizard } from '@/components/cliente/event-wizard'

export const metadata: Metadata = {
  title: 'Criar Evento · TimTim',
  description: 'Crie o seu evento e receba propostas dos melhores fornecedores.',
}

export default function NovoEventoPage() {
  return <EventWizard />
}
