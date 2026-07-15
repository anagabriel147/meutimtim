import { CadastroHeader } from '@/components/cadastro/cadastro-header'
import { PasswordForm } from '@/components/cadastro/password-form'
import { SiteFooter } from '@/components/site-footer'

export default function SenhaPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <CadastroHeader step={3} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        <PasswordForm />
      </main>
      <SiteFooter secure />
    </div>
  )
}
