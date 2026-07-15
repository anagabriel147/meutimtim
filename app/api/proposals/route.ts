import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Token inválido.' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('event_id')
    const status = searchParams.get('status')

    let query = supabase
      .from('proposals')
      .select('*, profiles!vendor_id(full_name, avatar_url)')
      .order('created_at', { ascending: false })

    if (eventId) query = query.eq('event_id', eventId)
    if (status) query = query.eq('status', status)

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ proposals: data })
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Token inválido.' }, { status: 401 })
    }

    const body = await req.json()
    const { event_id, price, description, title, validity_days, split_installments } = body

    if (!event_id || !price || price <= 0) {
      return NextResponse.json({ error: 'event_id e price são obrigatórios.' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('proposals')
      .insert({
        event_id,
        vendor_id: user.id,
        price,
        title: title ?? 'Proposta',
        description: description ?? null,
        validity_days: validity_days ?? 7,
        split_installments: split_installments ?? 1,
        status: 'pending',
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ proposal: data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
