import { ProposalForm } from '@/components/fornecedor/proposal-form'

export default async function NovaPropostaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ProposalForm opportunityId={id} />
}
