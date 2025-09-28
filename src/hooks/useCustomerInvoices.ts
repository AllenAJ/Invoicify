import { useState, useEffect } from 'react'
import { SupabaseService } from '@/lib/supabaseService'
import { Invoice } from '@/lib/supabase'

export function useCustomerInvoices(ensName?: string, address?: string) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInvoices = async () => {
    if (!ensName && !address) {
      setInvoices([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      let data: Invoice[] = []
      
      if (ensName) {
        data = await SupabaseService.getInvoicesByCustomerENS(ensName)
      } else if (address) {
        data = await SupabaseService.getInvoicesByCustomerAddress(address)
      }
      
      setInvoices(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices')
    } finally {
      setLoading(false)
    }
  }

  const updateInvoiceStatus = async (invoiceId: string, status: Invoice['status']) => {
    try {
      setError(null)
      await SupabaseService.updateInvoice(invoiceId, { status })
      
      // Update local state
      setInvoices(prev => prev.map(invoice => 
        invoice.id === invoiceId ? { ...invoice, status } : invoice
      ))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update invoice'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateInvoiceBlockchainId = async (invoiceId: string, blockchainId: number) => {
    try {
      setError(null)
      const updatedInvoice = await SupabaseService.updateInvoice(invoiceId, { 
        blockchain_invoice_id: blockchainId,
        status: 'created'
      })
      
      // Update local state
      setInvoices(prev => prev.map(invoice => 
        invoice.id === invoiceId ? updatedInvoice : invoice
      ))
      
      return updatedInvoice
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update invoice'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [ensName, address])

  return {
    invoices,
    loading,
    error,
    refetch: fetchInvoices,
    updateInvoiceStatus,
    updateInvoiceBlockchainId
  }
}
