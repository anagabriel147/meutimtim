/**
 * POST /api/contracts/release
 * Simulate escrow release after service confirmation.
 * In production this would trigger the payment gateway payout.
 */
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.slice(7)
    if (!token) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) return NextResponse.json({ error: 'Token inválido.' }, { status: 401 })

    const { contract_id } = await req.json()
    if (!contract_id) return NextResponse.json({ error: 'contract_id é obrigatório.' }, { status: 400 })

    const { data: contract, error: fetchError } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', contract_id)
      .eq('client_id', user.id)
      .maybeSingle()

    if (fetchError || !contract) {
      return NextResponse.json({ error: 'Contrato não encontrado.' }, { status: 404 })
    }

    if (contract.status !== 'active') {
      return NextResponse.json({ error: 'Este contrato não pode ser liberado.' }, { status: 409 })
    }

    const platformFee = +(contract.total_amount * (contract.platform_fee_pct / 100)).toFixed(2)
    const supplierNet = +(contract.total_amount - platformFee).toFixed(2)

    const { data: updated, error: updateError } = await supabase
      .from('contracts')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', contract_id)
      .select()
      .single()

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

    return NextResponse.json({
      success: true,
      contract: updated,
      simulation: {
        message: 'Escrow liberado com sucesso (simulado).',
        platform_fee: platformFee,
        supplier_net: supplierNet,
        payout_eta: '1-2 dias úteis',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
