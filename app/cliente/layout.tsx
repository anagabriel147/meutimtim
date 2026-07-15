import type { ReactNode } from 'react'

import { ChatProvider } from '@/components/mensagens/chat-store'
import { ContractsProvider } from '@/components/contratos/contracts-store'

export default function ClienteLayout({ children }: { children: ReactNode }) {
  return (
    <ChatProvider>
      <ContractsProvider>{children}</ContractsProvider>
    </ChatProvider>
  )
}
