import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.slice(7)
    if (!token) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) return NextResponse.json({ error: 'Token inválido.' }, { status: 401 })

    const { data: wallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('owner_id', user.id)
      .maybeSingle()

    const { data: transactions } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('wallet_id', wallet?.id)
      .order('created_at', { ascending: false })
      .limit(50)

    return NextResponse.json({
      wallet: wallet ?? {
        balance: 0,
        escrow_balance: 0,
        total_earned: 0,
        total_paid: 0,
      },
      transactions: transactions ?? [],
    })
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
