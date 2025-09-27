import { useState, useEffect } from 'react'
import { SupabaseService } from '@/lib/supabaseService'
import { Invoice, InvoiceFactoring } from '@/lib/supabase'

export function useInvoices(userId?: string) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInvoices = async () => {
    if (!userId) return

    try {
      setLoading(true)
      setError(null)
      const data = await SupabaseService.getInvoices(userId)
      setInvoices(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices')
    } finally {
      setLoading(false)
    }
  }

  const createInvoice = async (invoiceData: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null)
      const newInvoice = await SupabaseService.createInvoice(invoiceData)
      setInvoices(prev => [newInvoice, ...prev])
      return newInvoice
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create invoice'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateInvoice = async (id: string, updates: Partial<Invoice>) => {
    try {
      setError(null)
      const updatedInvoice = await SupabaseService.updateInvoice(id, updates)
      setInvoices(prev => prev.map(invoice => 
        invoice.id === id ? updatedInvoice : invoice
      ))
      return updatedInvoice
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update invoice'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const uploadPDF = async (file: File, userId: string) => {
    try {
      setError(null)
      const pdfUrl = await SupabaseService.uploadPDF(file, userId)
      return pdfUrl
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload PDF'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const createInvoiceFactoring = async (factoringData: Omit<InvoiceFactoring, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null)
      const factoring = await SupabaseService.createInvoiceFactoring(factoringData)
      
      // Update the invoice status
      await updateInvoice(factoring.invoice_id, { 
        status: 'factored',
        factor_amount: factoring.factor_amount,
        factor_fee: factoring.factor_fee,
        net_amount: factoring.net_amount
      })
      
      return factoring
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create invoice factoring'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [userId])

  return {
    invoices,
    loading,
    error,
    createInvoice,
    updateInvoice,
    uploadPDF,
    createInvoiceFactoring,
    refetch: fetchInvoices
  }
}
