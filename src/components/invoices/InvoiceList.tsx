import { AnimatePresence, motion } from 'framer-motion'
import { useInvoiceStore } from '../../store/useInvoiceStore'
import InvoiceCard from './InvoiceCard'
import FilterDropdown from './FilterDropdown'
import Button from '../ui/Button'
import iconPlus from '../../assets/icon-plus.svg'
import emptyIllustration from '../../assets/illustration-empty.svg'

export default function InvoiceList() {
  const { invoices, filter, selectInvoice, openCreateForm } = useInvoiceStore()

  const filtered = filter === 'all'
    ? invoices
    : invoices.filter((inv) => inv.status === filter)

  const countLabel = filtered.length === 0
    ? 'No invoices'
    : `${filtered.length} invoice${filtered.length !== 1 ? 's' : ''}`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto px-6 py-12 lg:py-16"
    >
      {/* Header */}
      <header className="flex items-center gap-4 mb-10">
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#0c0e16] dark:text-white tracking-tight">
            Invoices
          </h1>
          <p className="text-sm text-[#888eb0] dark:text-[#dfe3fa] mt-1">
            {countLabel}
          </p>
        </div>

        <FilterDropdown />

        <Button
          onClick={openCreateForm}
          className="gap-4 pl-2"
        >
          <span className="flex items-center justify-center w-8 h-8 bg-white rounded-full">
            <img src={iconPlus} alt="" aria-hidden="true" className="w-3 h-3" />
          </span>
          <span className="hidden sm:inline">New Invoice</span>
          <span className="sm:hidden">New</span>
        </Button>
      </header>

      {/* List */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <img src={emptyIllustration} alt="No invoices" className="w-48 mb-10" />
            <h2 className="text-xl font-bold text-[#0c0e16] dark:text-white mb-4">
              Nothing here
            </h2>
            <p className="text-sm text-[#888eb0] dark:text-[#dfe3fa] max-w-xs leading-relaxed">
              Create an invoice by clicking the <strong>New Invoice</strong> button and get started.
            </p>
          </motion.div>
        ) : (
          <motion.div key="list" className="flex flex-col gap-4">
            {filtered.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                invoice={invoice}
                onClick={() => selectInvoice(invoice.id)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
