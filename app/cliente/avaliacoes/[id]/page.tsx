import { ReviewClient } from '@/components/avaliacoes/review-client'

export default async function AvaliarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ReviewClient contractId={id} />
}
