import { useState, useRef, useEffect } from 'react'
import type { InvoiceStatus } from '../../types/invoice'
import { useInvoiceStore } from '../../store/useInvoiceStore'
import arrowDown from '../../assets/icon-arrow-down.svg'
import iconCheck from '../../assets/icon-check.svg'
import { AnimatePresence, motion } from 'framer-motion'

const options: { value: InvoiceStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
]

export default function FilterDropdown() {
  const { filter, setFilter } = useInvoiceStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-3 font-bold text-sm text-[#0c0e16] dark:text-white hover:text-purple dark:hover:text-purple transition-colors"
      >
        <span className="hidden sm:inline">Filter by status</span>
        <span className="sm:hidden">Filter</span>
        <img
          src={arrowDown}
          alt=""
          aria-hidden="true"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="
              absolute top-full left-1/2 -translate-x-1/2 mt-6
              w-48 bg-white dark:bg-[#252945]
              rounded-lg shadow-[0_10px_20px_rgba(72,84,159,0.25)]
              p-6 flex flex-col gap-4 z-50
            "
          >
            {options.map(({ value, label }) => (
              <li
                key={value}
                role="option"
                aria-selected={filter === value}
                onClick={() => { setFilter(value); setOpen(false) }}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <span className={`
                  w-4 h-4 rounded-sm border flex items-center justify-center transition-colors
                  ${filter === value
                    ? 'bg-purple border-purple'
                    : 'border-[#dfe3fa] dark:border-[#494e6e] group-hover:border-purple'
                  }
                `}>
                  {filter === value && (
                    <img src={iconCheck} alt="" aria-hidden="true" className="w-2.5" />
                  )}
                </span>
                <span className="font-bold text-sm text-[#0c0e16] dark:text-white">{label}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
