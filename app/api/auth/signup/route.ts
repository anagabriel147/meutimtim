import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, role, phone, city } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Campos obrigatórios em falta.' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 8 caracteres.' },
        { status: 400 },
      )
    }

    const validRoles = ['client', 'supplier', 'advisor']
    const userRole = validRoles.includes(role) ? role : 'client'

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        return NextResponse.json({ error: 'Este e-mail já está registado.' }, { status: 409 })
      }
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Erro ao criar utilizador.' }, { status: 500 })
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      full_name: name,
      role: userRole,
      phone: phone ?? null,
      city: city ?? null,
    })

    if (profileError) {
      return NextResponse.json({ error: 'Erro ao criar perfil.' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      user: { id: authData.user.id, email: authData.user.email, role: userRole },
    })
  } catch {
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
