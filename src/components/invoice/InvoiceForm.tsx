import { useEffect } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import { useInvoiceStore } from '../../store/useInvoiceStore'
import type { InvoiceFormData } from '../../types/invoice'
import Button from '../ui/Button'
import iconPlus from '../../assets/icon-plus.svg'
import iconDelete from '../../assets/icon-delete.svg'
import arrowLeft from '../../assets/icon-arrow-left.svg'

const PAYMENT_TERMS = [
  { value: 1, label: 'Net 1 Day' },
  { value: 7, label: 'Net 7 Days' },
  { value: 14, label: 'Net 14 Days' },
  { value: 30, label: 'Net 30 Days' },
]

const defaultValues: InvoiceFormData = {
  createdAt: new Date().toISOString().split('T')[0],
  description: '',
  paymentTerms: 30,
  clientName: '',
  clientEmail: '',
  status: 'pending',
  senderAddress: { street: '', city: '', postCode: '', country: '' },
  clientAddress: { street: '', city: '', postCode: '', country: '' },
  items: [{ name: '', quantity: 1, price: 0 }],
}

interface FieldProps {
  label: string
  error?: string
  children: React.ReactNode
  className?: string
}

function Field({ label, error, children, className = '' }: FieldProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className={`text-xs font-medium ${error ? 'text-red' : 'text-[#7e88c3] dark:text-[#dfe3fa]'}`}>
        {label}
        {error && <span className="ml-2 italic">{error}</span>}
      </label>
      {children}
    </div>
  )
}

const inputClass = (hasError?: boolean) => `
  w-full px-4 py-3 rounded-md border font-bold text-sm
  bg-white dark:bg-[#252945]
  text-[#0c0e16] dark:text-white
  ${hasError
    ? 'border-red focus:border-red'
    : 'border-[#dfe3fa] dark:border-[#252945] focus:border-purple dark:focus:border-purple'
  }
  outline-none transition-colors
`

export default function InvoiceForm() {
  const { formOpen, formMode, selectedId, invoices, closeForm, createInvoice, updateInvoice } = useInvoiceStore()

  const existingInvoice = formMode === 'edit' ? invoices.find((inv) => inv.id === selectedId) : null

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormData>({ defaultValues })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  // Populate form when editing
  useEffect(() => {
    if (formOpen && existingInvoice) {
      reset({
        createdAt: existingInvoice.createdAt,
        description: existingInvoice.description,
        paymentTerms: existingInvoice.paymentTerms,
        clientName: existingInvoice.clientName,
        clientEmail: existingInvoice.clientEmail,
        status: existingInvoice.status,
        senderAddress: existingInvoice.senderAddress,
        clientAddress: existingInvoice.clientAddress,
        items: existingInvoice.items.map(({ name, quantity, price }) => ({ name, quantity, price })),
      })
    } else if (formOpen && formMode === 'create') {
      reset(defaultValues)
    }
  }, [formOpen, existingInvoice, formMode, reset])

  const watchedItems = watch('items')

  const onSend = handleSubmit((data) => {
    if (formMode === 'edit' && existingInvoice) {
      updateInvoice(existingInvoice.id, data)
    } else {
      createInvoice(data, 'pending')
    }
    closeForm()
  })

  const onSaveDraft = handleSubmit((data) => {
    createInvoice(data, 'draft')
    closeForm()
  })

  const title = formMode === 'edit' && existingInvoice
    ? `Edit #${existingInvoice.id}`
    : 'New Invoice'

  return (
    <AnimatePresence>
      {formOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeForm}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="
              fixed top-0 bottom-0 left-0
              w-full sm:w-[616px] lg:w-[719px]
              lg:left-[103px]
              bg-white dark:bg-[#141625]
              z-50 flex flex-col
              rounded-r-[20px]
              overflow-hidden
            "
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide px-6 sm:px-10 lg:px-14 py-12">
              {/* Mobile back button */}
              <button
                onClick={closeForm}
                className="flex items-center gap-4 sm:hidden font-bold text-sm text-[#0c0e16] dark:text-white hover:text-[#7e88c3] mb-6"
              >
                <img src={arrowLeft} alt="" aria-hidden="true" />
                Go back
              </button>

              <h2 className="text-2xl font-bold text-[#0c0e16] dark:text-white mb-10">{title}</h2>

              <form id="invoice-form" noValidate>
                {/* Bill From */}
                <fieldset className="mb-10">
                  <legend className="text-xs font-bold text-purple mb-6">Bill From</legend>
                  <div className="flex flex-col gap-6">
                    <Field label="Street Address" error={errors.senderAddress?.street?.message}>
                      <input
                        {...register('senderAddress.street', { required: "can't be empty" })}
                        className={inputClass(!!errors.senderAddress?.street)}
                      />
                    </Field>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                      <Field label="City" error={errors.senderAddress?.city?.message}>
                        <input
                          {...register('senderAddress.city', { required: "can't be empty" })}
                          className={inputClass(!!errors.senderAddress?.city)}
                        />
                      </Field>
                      <Field label="Post Code" error={errors.senderAddress?.postCode?.message}>
                        <input
                          {...register('senderAddress.postCode', { required: "can't be empty" })}
                          className={inputClass(!!errors.senderAddress?.postCode)}
                        />
                      </Field>
                      <Field label="Country" className="col-span-2 sm:col-span-1" error={errors.senderAddress?.country?.message}>
                        <input
                          {...register('senderAddress.country', { required: "can't be empty" })}
                          className={inputClass(!!errors.senderAddress?.country)}
                        />
                      </Field>
                    </div>
                  </div>
                </fieldset>

                {/* Bill To */}
                <fieldset className="mb-10">
                  <legend className="text-xs font-bold text-purple mb-6">Bill To</legend>
                  <div className="flex flex-col gap-6">
                    <Field label="Client's Name" error={errors.clientName?.message}>
                      <input
                        {...register('clientName', { required: "can't be empty" })}
                        className={inputClass(!!errors.clientName)}
                      />
                    </Field>
                    <Field label="Client's Email" error={errors.clientEmail?.message}>
                      <input
                        type="email"
                        placeholder="e.g. email@example.com"
                        {...register('clientEmail', { required: "can't be empty" })}
                        className={inputClass(!!errors.clientEmail)}
                      />
                    </Field>
                    <Field label="Street Address" error={errors.clientAddress?.street?.message}>
                      <input
                        {...register('clientAddress.street', { required: "can't be empty" })}
                        className={inputClass(!!errors.clientAddress?.street)}
                      />
                    </Field>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                      <Field label="City" error={errors.clientAddress?.city?.message}>
                        <input
                          {...register('clientAddress.city', { required: "can't be empty" })}
                          className={inputClass(!!errors.clientAddress?.city)}
                        />
                      </Field>
                      <Field label="Post Code" error={errors.clientAddress?.postCode?.message}>
                        <input
                          {...register('clientAddress.postCode', { required: "can't be empty" })}
                          className={inputClass(!!errors.clientAddress?.postCode)}
                        />
                      </Field>
                      <Field label="Country" className="col-span-2 sm:col-span-1" error={errors.clientAddress?.country?.message}>
                        <input
                          {...register('clientAddress.country', { required: "can't be empty" })}
                          className={inputClass(!!errors.clientAddress?.country)}
                        />
                      </Field>
                    </div>
                  </div>
                </fieldset>

                {/* Dates & Terms */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                  <Field label="Invoice Date">
                    <input
                      type="date"
                      {...register('createdAt')}
                      className={inputClass()}
                    />
                  </Field>

                  <Field label="Payment Terms">
                    <Controller
                      control={control}
                      name="paymentTerms"
                      render={({ field }) => (
                        <select
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className={`${inputClass()} appearance-none cursor-pointer`}
                        >
                          {PAYMENT_TERMS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      )}
                    />
                  </Field>

                  <Field label="Project Description" className="sm:col-span-2">
                    <input
                      placeholder="e.g. Graphic Design Service"
                      {...register('description')}
                      className={inputClass()}
                    />
                  </Field>
                </div>

                {/* Item List */}
                <div>
                  <h3 className="text-lg font-bold text-[#777f98] mb-6">Item List</h3>

                  <div className="flex flex-col gap-12">
                    {fields.map((field, index) => {
                      const qty = watchedItems?.[index]?.quantity ?? 0
                      const price = watchedItems?.[index]?.price ?? 0
                      const total = qty * price

                      return (
                        <div key={field.id} className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-end">
                          <Field label="Item Name" className="sm:col-span-1" error={errors.items?.[index]?.name?.message}>
                            <input
                              {...register(`items.${index}.name`, { required: "can't be empty" })}
                              className={inputClass(!!errors.items?.[index]?.name)}
                            />
                          </Field>

                          <div className="grid grid-cols-[64px_1fr_1fr_auto] sm:contents gap-4 items-end">
                            <Field label="Qty." error={errors.items?.[index]?.quantity?.message}>
                              <input
                                type="number"
                                min="1"
                                {...register(`items.${index}.quantity`, {
                                  required: true,
                                  valueAsNumber: true,
                                  min: 1,
                                })}
                                className={inputClass(!!errors.items?.[index]?.quantity)}
                              />
                            </Field>

                            <Field label="Price" error={errors.items?.[index]?.price?.message}>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                {...register(`items.${index}.price`, {
                                  required: true,
                                  valueAsNumber: true,
                                  min: 0,
                                })}
                                className={inputClass(!!errors.items?.[index]?.price)}
                              />
                            </Field>

                            <Field label="Total">
                              <p className="py-3 font-bold text-sm text-[#888eb0] dark:text-[#888eb0]">
                                {total.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </p>
                            </Field>

                            <button
                              type="button"
                              onClick={() => remove(index)}
                              aria-label="Delete item"
                              className="mb-3 p-1 text-[#888eb0] hover:text-red transition-colors"
                            >
                              <img src={iconDelete} alt="" aria-hidden="true" className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => append({ name: '', quantity: 1, price: 0 })}
                    className="
                      w-full mt-6 py-4 rounded-full
                      bg-[#f9fafe] dark:bg-[#252945]
                      hover:bg-[#dfe3fa] dark:hover:bg-[#0c0e16]
                      font-bold text-sm text-[#7e88c3] dark:text-[#dfe3fa]
                      flex items-center justify-center gap-2
                      transition-colors
                    "
                  >
                    <img src={iconPlus} alt="" aria-hidden="true" className="w-3 h-3" />
                    Add New Item
                  </button>
                </div>
              </form>
            </div>

            {/* Footer actions */}
            <div className="
              px-6 sm:px-10 lg:px-14 py-6
              bg-white dark:bg-[#141625]
              shadow-[0_-16px_32px_rgba(0,0,0,0.1)]
              flex items-center gap-2
            ">
              {formMode === 'create' ? (
                <>
                  <Button variant="secondary" onClick={closeForm}>Discard</Button>
                  <div className="flex-1" />
                  <Button variant="dark" onClick={onSaveDraft}>Save as Draft</Button>
                  <Button onClick={onSend}>Save &amp; Send</Button>
                </>
              ) : (
                <>
                  <div className="flex-1" />
                  <Button variant="secondary" onClick={closeForm}>Cancel</Button>
                  <Button onClick={onSend}>Save Changes</Button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
