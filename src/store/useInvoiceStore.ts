import { create } from 'zustand'
import type { Invoice, InvoiceStatus, InvoiceFormData } from '../types/invoice'
import { loadInvoices, saveInvoices } from '../utils/storage'
import { generateId, addDays } from '../utils/formatters'

interface InvoiceStore {
  invoices: Invoice[]
  filter: InvoiceStatus | 'all'
  selectedId: string | null
  formOpen: boolean
  formMode: 'create' | 'edit'
  theme: 'light' | 'dark'

  // Actions
  setFilter: (filter: InvoiceStatus | 'all') => void
  selectInvoice: (id: string | null) => void
  openCreateForm: () => void
  openEditForm: () => void
  closeForm: () => void
  createInvoice: (data: InvoiceFormData, status: 'draft' | 'pending') => void
  updateInvoice: (id: string, data: InvoiceFormData) => void
  deleteInvoice: (id: string) => void
  markAsPaid: (id: string) => void
  toggleTheme: () => void
}

function buildInvoice(data: InvoiceFormData, status: 'draft' | 'pending'): Invoice {
  const today = new Date().toISOString().split('T')[0]
  const createdAt = data.createdAt || today
  const items = data.items.map((item) => ({
    ...item,
    total: item.quantity * item.price,
  }))
  const total = items.reduce((sum, item) => sum + item.total, 0)
  return {
    ...data,
    id: generateId(),
    status,
    createdAt,
    paymentDue: addDays(createdAt, data.paymentTerms),
    items,
    total,
  }
}

function getInitialTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem('invoice-app-theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  invoices: loadInvoices(),
  filter: 'all',
  selectedId: null,
  formOpen: false,
  formMode: 'create',
  theme: getInitialTheme(),

  setFilter: (filter) => set({ filter }),

  selectInvoice: (id) => set({ selectedId: id }),

  openCreateForm: () => set({ formOpen: true, formMode: 'create' }),

  openEditForm: () => set({ formOpen: true, formMode: 'edit' }),

  closeForm: () => set({ formOpen: false }),

  createInvoice: (data, status) => {
    const invoice = buildInvoice(data, status)
    const invoices = [...get().invoices, invoice]
    saveInvoices(invoices)
    set({ invoices })
  },

  updateInvoice: (id, data) => {
    const invoices = get().invoices.map((inv) => {
      if (inv.id !== id) return inv
      const items = data.items.map((item) => ({
        ...item,
        total: item.quantity * item.price,
      }))
      const total = items.reduce((sum, item) => sum + item.total, 0)
      return {
        ...inv,
        ...data,
        items,
        total,
        paymentDue: addDays(data.createdAt, data.paymentTerms),
      }
    })
    saveInvoices(invoices)
    set({ invoices })
  },

  deleteInvoice: (id) => {
    const invoices = get().invoices.filter((inv) => inv.id !== id)
    saveInvoices(invoices)
    set({ invoices, selectedId: null })
  },

  markAsPaid: (id) => {
    const invoices = get().invoices.map((inv) =>
      inv.id === id ? { ...inv, status: 'paid' as const } : inv
    )
    saveInvoices(invoices)
    set({ invoices })
  },

  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('invoice-app-theme', next)
    set({ theme: next })
  },
}))
