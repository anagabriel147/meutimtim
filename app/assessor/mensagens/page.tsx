import type { Metadata } from 'next'
import { AdvisorMessagesClient } from '@/components/assessor/advisor-messages-client'

export const metadata: Metadata = {
  title: 'Mensagens · Assessor · TimTim',
  description: 'Converse com os casais sob sua assessoria pelo TimTim.',
}

export default function AssessorMensagensPage() {
  return <AdvisorMessagesClient />
}
