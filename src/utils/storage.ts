import type { Invoice } from '../types/invoice'
import seedData from '../data.json'

const STORAGE_KEY = 'invoice-app-data'

export function loadInvoices(): Invoice[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as Invoice[]
    // First visit — seed from data.json
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData))
    return seedData as Invoice[]
  } catch {
    return seedData as Invoice[]
  }
}

export function saveInvoices(invoices: Invoice[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices))
}
