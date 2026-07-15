/**
 * Split Payment Simulation API
 *
 * Simulates TimTim's escrow split logic:
 *   client pays → platform holds escrow
 *   service delivered → platform releases to supplier (minus fee)
 *
 * Supports: PIX, card (credit/debit), boleto
 * Returns: simulated success/failure with split breakdown
 */
import { NextRequest, NextResponse } from 'next/server'

type PaymentMethod = 'pix' | 'credit_card' | 'debit_card' | 'boleto'
type InstallmentOption = 1 | 2 | 3 | 6 | 12

const PLATFORM_FEE_PCT = 10
const PAYMENT_FEES: Record<PaymentMethod, number> = {
  pix: 0,
  debit_card: 1.5,
  credit_card: 2.99,
  boleto: 3.5,
}
const INSTALLMENT_INTEREST: Record<number, number> = {
  1: 0,
  2: 1.5,
  3: 1.5,
  6: 2.5,
  12: 3.9,
}

function simulatePaymentGateway(method: PaymentMethod): {
  approved: boolean
  transaction_id: string
  gateway_message: string
} {
  const failRate = method === 'boleto' ? 0.05 : 0.02
  const approved = Math.random() > failRate
  return {
    approved,
    transaction_id: approved ? `TT-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}` : '',
    gateway_message: approved ? 'Aprovado' : 'Recusado pelo emissor',
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      contract_amount,
      payment_method,
      installments = 1,
      contract_id,
    }: {
      contract_amount: number
      payment_method: PaymentMethod
      installments: InstallmentOption
      contract_id?: string
    } = body

    if (!contract_amount || contract_amount <= 0) {
      return NextResponse.json({ error: 'Valor inválido.' }, { status: 400 })
    }

    const validMethods: PaymentMethod[] = ['pix', 'credit_card', 'debit_card', 'boleto']
    if (!validMethods.includes(payment_method)) {
      return NextResponse.json({ error: 'Método de pagamento inválido.' }, { status: 400 })
    }

    const paymentFeePct = PAYMENT_FEES[payment_method]
    const installmentInterestPct = INSTALLMENT_INTEREST[installments] ?? 0

    const paymentFee = +(contract_amount * (paymentFeePct / 100)).toFixed(2)
    const installmentInterest = +(contract_amount * (installmentInterestPct / 100)).toFixed(2)
    const grossAmount = +(contract_amount + paymentFee + installmentInterest).toFixed(2)

    const platformFee = +(contract_amount * (PLATFORM_FEE_PCT / 100)).toFixed(2)
    const supplierNet = +(contract_amount - platformFee).toFixed(2)
    const installmentValue = installments > 1 ? +(grossAmount / installments).toFixed(2) : grossAmount

    const gateway = simulatePaymentGateway(payment_method)

    const response = {
      simulation: true,
      contract_id: contract_id ?? null,
      payment_method,
      installments,
      breakdown: {
        contract_amount: +contract_amount.toFixed(2),
        payment_fee_pct: paymentFeePct,
        payment_fee: paymentFee,
        installment_interest_pct: installmentInterestPct,
        installment_interest: installmentInterest,
        gross_amount: grossAmount,
        installment_value: installmentValue,
        platform_fee_pct: PLATFORM_FEE_PCT,
        platform_fee: platformFee,
        supplier_net: supplierNet,
        escrow_held: +contract_amount.toFixed(2),
      },
      gateway: {
        approved: gateway.approved,
        transaction_id: gateway.transaction_id,
        message: gateway.gateway_message,
        timestamp: new Date().toISOString(),
      },
      escrow_status: gateway.approved ? 'held' : 'failed',
      next_action: gateway.approved
        ? 'Pagamento retido em escrow. Será liberado ao fornecedor após confirmação do serviço.'
        : 'Pagamento recusado. Por favor, tente novamente ou use outro método.',
    }

    return NextResponse.json(response, {
      status: gateway.approved ? 200 : 402,
    })
  } catch {
    return NextResponse.json({ error: 'Erro interno ao processar pagamento.' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'POST /api/split/simulate',
    description: 'Simula o split de pagamento TimTim com escrow.',
    platform_fee_pct: PLATFORM_FEE_PCT,
    supported_methods: Object.keys(PAYMENT_FEES),
    payment_fees: PAYMENT_FEES,
    installment_options: Object.keys(INSTALLMENT_INTEREST).map(Number),
    installment_interest: INSTALLMENT_INTEREST,
  })
}
