import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInvoiceStore } from '../../store/useInvoiceStore'
import { formatCurrency, formatDate } from '../../utils/formatters'
import StatusBadge from '../ui/StatusBadge'
import Button from '../ui/Button'
import DeleteModal from './DeleteModal'
import arrowLeft from '../../assets/icon-arrow-left.svg'

export default function InvoiceDetail() {
  const { invoices, selectedId, selectInvoice, openEditForm, markAsPaid } = useInvoiceStore()
  const [showDelete, setShowDelete] = useState(false)

  const invoice = invoices.find((inv) => inv.id === selectedId)
  if (!invoice) return null

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="max-w-3xl mx-auto px-6 py-12 lg:py-16"
      >
        {/* Back */}
        <button
          onClick={() => selectInvoice(null)}
          className="flex items-center gap-4 font-bold text-sm text-[#0c0e16] dark:text-white hover:text-[#7e88c3] dark:hover:text-[#7e88c3] transition-colors mb-8"
        >
          <img src={arrowLeft} alt="" aria-hidden="true" />
          Go back
        </button>

        {/* Status bar */}
        <div className="flex items-center justify-between bg-white dark:bg-[#1e2139] rounded-lg p-6 mb-4 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <span className="text-sm text-[#858bb2] dark:text-[#dfe3fa]">Status</span>
            <StatusBadge status={invoice.status} />
          </div>

          {/* Desktop action buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="secondary" onClick={openEditForm}>Edit</Button>
            <Button variant="danger" onClick={() => setShowDelete(true)}>Delete</Button>
            {invoice.status !== 'paid' && (
              <Button onClick={() => markAsPaid(invoice.id)}>Mark as Paid</Button>
            )}
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white dark:bg-[#1e2139] rounded-lg p-6 sm:p-10 shadow-sm">
          {/* Top meta */}
          <div className="flex flex-col sm:flex-row justify-between gap-8 mb-10">
            <div>
              <p className="font-bold text-base text-[#0c0e16] dark:text-white">
                <span className="text-[#7e88c3]">#</span>{invoice.id}
              </p>
              <p className="text-sm text-[#7e88c3] dark:text-[#dfe3fa] mt-1">{invoice.description}</p>
            </div>
            <address className="not-italic text-sm text-[#7e88c3] dark:text-[#dfe3fa] sm:text-right leading-6">
              <p>{invoice.senderAddress.street}</p>
              <p>{invoice.senderAddress.city}</p>
              <p>{invoice.senderAddress.postCode}</p>
              <p>{invoice.senderAddress.country}</p>
            </address>
          </div>

          {/* Dates + client */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-10">
            <div className="flex flex-col gap-8">
              <div>
                <p className="text-sm text-[#7e88c3] dark:text-[#dfe3fa] mb-3">Invoice Date</p>
                <p className="font-bold text-base text-[#0c0e16] dark:text-white">{formatDate(invoice.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-[#7e88c3] dark:text-[#dfe3fa] mb-3">Payment Due</p>
                <p className="font-bold text-base text-[#0c0e16] dark:text-white">{formatDate(invoice.paymentDue)}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-[#7e88c3] dark:text-[#dfe3fa] mb-3">Bill To</p>
              <p className="font-bold text-base text-[#0c0e16] dark:text-white mb-2">{invoice.clientName}</p>
              <address className="not-italic text-sm text-[#7e88c3] dark:text-[#dfe3fa] leading-6">
                <p>{invoice.clientAddress.street}</p>
                <p>{invoice.clientAddress.city}</p>
                <p>{invoice.clientAddress.postCode}</p>
                <p>{invoice.clientAddress.country}</p>
              </address>
            </div>

            <div>
              <p className="text-sm text-[#7e88c3] dark:text-[#dfe3fa] mb-3">Sent To</p>
              <p className="font-bold text-base text-[#0c0e16] dark:text-white break-all">{invoice.clientEmail || '—'}</p>
            </div>
          </div>

          {/* Items table */}
          <div className="bg-[#f9fafe] dark:bg-[#252945] rounded-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              {/* Header — desktop only */}
              <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 mb-8 text-sm text-[#7e88c3] dark:text-[#dfe3fa]">
                <span>Item Name</span>
                <span className="text-center">QTY.</span>
                <span className="text-right">Price</span>
                <span className="text-right">Total</span>
              </div>

              <div className="flex flex-col gap-6">
                {invoice.items.map((item, i) => (
                  <div key={i} className="grid grid-cols-2 sm:grid-cols-[1fr_auto_auto_auto] gap-4 items-center">
                    <div>
                      <p className="font-bold text-sm text-[#0c0e16] dark:text-white">{item.name}</p>
                      <p className="sm:hidden text-sm font-bold text-[#7e88c3] dark:text-[#888eb0] mt-1">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className="hidden sm:block text-sm font-bold text-[#7e88c3] dark:text-[#dfe3fa] text-center">{item.quantity}</p>
                    <p className="hidden sm:block text-sm font-bold text-[#7e88c3] dark:text-[#dfe3fa] text-right">{formatCurrency(item.price)}</p>
                    <p className="font-bold text-sm text-[#0c0e16] dark:text-white text-right">{formatCurrency(item.total)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Amount due */}
            <div className="flex items-center justify-between bg-[#373b53] dark:bg-[#0c0e16] rounded-b-lg px-6 sm:px-8 py-8">
              <p className="text-sm text-white">Amount Due</p>
              <p className="text-2xl sm:text-3xl font-bold text-white">{formatCurrency(invoice.total)}</p>
            </div>
          </div>
        </div>

        {/* Mobile action buttons */}
        <div className="sm:hidden flex items-center justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={openEditForm}>Edit</Button>
          <Button variant="danger" onClick={() => setShowDelete(true)}>Delete</Button>
          {invoice.status !== 'paid' && (
            <Button onClick={() => markAsPaid(invoice.id)}>Mark as Paid</Button>
          )}
        </div>
      </motion.div>

      <DeleteModal
        open={showDelete}
        invoiceId={invoice.id}
        onClose={() => setShowDelete(false)}
      />
    </>
  )
}
