import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  wallet_address: string
  created_at: string
  updated_at: string
  profile?: {
    business_name?: string
    email?: string
    phone?: string
  }
}

export interface Invoice {
  id: string
  user_id: string
  invoice_number?: string
  amount: number
  due_date: string
  customer_name: string
  customer_email: string
  description: string
  pdf_url?: string
  pdf_filename?: string
  status: 'draft' | 'created' | 'factored' | 'paid' | 'overdue'
  blockchain_invoice_id?: number
  factor_amount?: number
  factor_fee?: number
  net_amount?: number
  created_at: string
  updated_at: string
}

export interface InvoiceFactoring {
  id: string
  invoice_id: string
  user_id: string
  factor_amount: number
  factor_fee: number
  net_amount: number
  blockchain_transaction_hash?: string
  status: 'pending' | 'completed' | 'failed'
  created_at: string
  updated_at: string
}
