import type { InvoiceStatus } from '../../types/invoice'

interface Props {
  status: InvoiceStatus
}

const config: Record<InvoiceStatus, { label: string; classes: string }> = {
  paid: {
    label: 'Paid',
    classes: 'bg-[#33d69f]/10 text-[#33d69f]',
  },
  pending: {
    label: 'Pending',
    classes: 'bg-[#ff8f00]/10 text-[#ff8f00]',
  },
  draft: {
    label: 'Draft',
    classes: 'bg-[#373b53]/10 text-[#373b53] dark:bg-[#dfe3fa]/10 dark:text-[#dfe3fa]',
  },
}

export default function StatusBadge({ status }: Props) {
  const { label, classes } = config[status]
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-3 rounded-md font-bold text-xs tracking-wide ${classes}`}>
      <span className="w-2 h-2 rounded-full bg-current" />
      {label}
    </span>
  )
}
