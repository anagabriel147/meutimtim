import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

function getUser(req: NextRequest) {
  const token = req.headers.get('authorization')?.slice(7)
  if (!token) return null
  return supabase.auth.getUser(token)
}

export async function GET(req: NextRequest) {
  try {
    const auth = await getUser(req)
    if (!auth) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
    const { data: { user }, error } = auth
    if (error || !user) return NextResponse.json({ error: 'Token inválido.' }, { status: 401 })

    const { data, err } = await (supabase
      .from('contracts')
      .select(`
        *,
        profiles!client_id(full_name, avatar_url),
        profiles!vendor_id(full_name, avatar_url),
        events(title, event_date)
      `)
      .order('created_at', { ascending: false }) as any)

    if (err) return NextResponse.json({ error: err.message }, { status: 500 })
    return NextResponse.json({ contracts: data })
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getUser(req)
    if (!auth) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
    const { data: { user }, error: authError } = auth
    if (authError || !user) return NextResponse.json({ error: 'Token inválido.' }, { status: 401 })

    const body = await req.json()
    const { proposal_id, event_id, vendor_id, total_amount, platform_fee_pct, split_installments } = body

    if (!event_id || !vendor_id || !total_amount) {
      return NextResponse.json(
        { error: 'event_id, vendor_id e total_amount são obrigatórios.' },
        { status: 400 },
      )
    }

    const { data: contract, error: contractError } = await supabase
      .from('contracts')
      .insert({
        proposal_id: proposal_id ?? null,
        event_id,
        client_id: user.id,
        vendor_id,
        total_amount,
        platform_fee_pct: platform_fee_pct ?? 5,
        split_installments: split_installments ?? 1,
        status: 'active',
        signed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (contractError) return NextResponse.json({ error: contractError.message }, { status: 500 })

    if (proposal_id) {
      await supabase.from('proposals').update({ status: 'accepted' }).eq('id', proposal_id)
    }

    return NextResponse.json({ contract }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
