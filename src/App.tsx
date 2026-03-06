import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useInvoiceStore } from './store/useInvoiceStore'
import Sidebar from './components/layout/Sidebar'
import InvoiceList from './components/invoices/InvoiceList'
import InvoiceDetail from './components/invoice/InvoiceDetail'
import InvoiceForm from './components/invoice/InvoiceForm'

export default function App() {
  const { theme, selectedId } = useInvoiceStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div className="min-h-screen bg-[#f8f8fb] dark:bg-[#141625] transition-colors duration-300">
      <Sidebar />

      <main className="pt-[72px] lg:pt-0 lg:pl-[103px] min-h-screen">
        <AnimatePresence mode="wait">
          {selectedId ? (
            <InvoiceDetail key="detail" />
          ) : (
            <InvoiceList key="list" />
          )}
        </AnimatePresence>
      </main>

      <InvoiceForm />
    </div>
  )
}
