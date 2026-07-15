import { CadastroHeader } from '@/components/cadastro/cadastro-header'
import { RoleSelection } from '@/components/cadastro/role-selection'
import { SiteFooter } from '@/components/site-footer'

export default function CadastroPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <CadastroHeader step={1} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10 md:py-16">
        <RoleSelection />
      </main>
      <SiteFooter />
    </div>
  )
}
