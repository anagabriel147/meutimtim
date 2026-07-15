import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'E-mail e senha são obrigatórios.' }, { status: 400 })
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      return NextResponse.json({ error: 'Credenciais inválidas.' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name, avatar_url')
      .eq('id', data.user.id)
      .maybeSingle()

    const redirects: Record<string, string> = {
      client: '/cliente',
      supplier: '/fornecedor',
      advisor: '/assessor',
      admin: '/admin',
    }

    return NextResponse.json({
      success: true,
      session: data.session,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: profile?.role ?? 'client',
        name: profile?.full_name ?? '',
        avatar_url: profile?.avatar_url ?? null,
      },
      redirect: redirects[profile?.role ?? 'client'] ?? '/cliente',
    })
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
