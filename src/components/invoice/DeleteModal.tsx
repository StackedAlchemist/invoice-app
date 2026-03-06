import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useInvoiceStore } from '../../store/useInvoiceStore'
import Button from '../ui/Button'

interface Props {
  open: boolean
  invoiceId: string
  onClose: () => void
}

export default function DeleteModal({ open, invoiceId, onClose }: Props) {
  const { deleteInvoice } = useInvoiceStore()
  const cancelRef = useRef<HTMLButtonElement>(null)

  // Focus cancel button when modal opens
  useEffect(() => {
    if (open) cancelRef.current?.focus()
  }, [open])

  // Trap focus & close on Escape
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  function handleDelete() {
    deleteInvoice(invoiceId)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-60"
            onClick={onClose}
          />
          <motion.div
            key="modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            aria-describedby="delete-desc"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="
              fixed inset-0 m-auto z-70
              w-[calc(100%-48px)] max-w-md h-fit
              bg-white dark:bg-[#1e2139]
              rounded-lg p-10 shadow-2xl
            "
          >
            <h2 id="delete-title" className="text-2xl font-bold text-[#0c0e16] dark:text-white mb-4">
              Confirm Deletion
            </h2>
            <p id="delete-desc" className="text-sm text-[#888eb0] dark:text-[#dfe3fa] leading-relaxed mb-8">
              Are you sure you want to delete invoice #{invoiceId}? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2">
              <Button ref={cancelRef} variant="secondary" onClick={onClose}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete}>Delete</Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
