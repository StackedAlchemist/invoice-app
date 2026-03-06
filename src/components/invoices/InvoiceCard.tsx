import { motion } from 'framer-motion'
import type { Invoice } from '../../types/invoice'
import { formatCurrency, formatDate } from '../../utils/formatters'
import StatusBadge from '../ui/StatusBadge'
import arrowRight from '../../assets/icon-arrow-right.svg'

interface Props {
  invoice: Invoice
  onClick: () => void
}

export default function InvoiceCard({ invoice, onClick }: Props) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="
        group flex items-center gap-4 flex-wrap
        bg-white dark:bg-[#1e2139]
        border border-transparent hover:border-purple
        rounded-lg p-6 cursor-pointer
        transition-all duration-200
        shadow-[0_10px_10px_-10px_rgba(72,84,159,0.1)]
      "
    >
      {/* ID */}
      <p className="font-bold text-sm text-[#0c0e16] dark:text-white w-24">
        <span className="text-[#7e88c3]">#</span>
        {invoice.id}
      </p>

      {/* Due date */}
      <p className="text-sm text-[#7e88c3] dark:text-[#dfe3fa] flex-1">
        Due {formatDate(invoice.paymentDue)}
      </p>

      {/* Client name */}
      <p className="text-sm text-[#858bb2] dark:text-white text-right flex-1">
        {invoice.clientName}
      </p>

      {/* Total */}
      <p className="font-bold text-base text-[#0c0e16] dark:text-white w-32 text-right">
        {formatCurrency(invoice.total)}
      </p>

      {/* Status */}
      <div className="flex items-center gap-4">
        <StatusBadge status={invoice.status} />
        <img
          src={arrowRight}
          alt=""
          aria-hidden="true"
          className="hidden sm:block w-2"
        />
      </div>
    </motion.article>
  )
}
