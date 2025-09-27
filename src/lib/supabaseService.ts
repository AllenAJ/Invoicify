import { supabase, User, Invoice, InvoiceFactoring } from './supabase'

export class SupabaseService {
  // Authentication
  static async signInWithWallet(walletAddress: string) {
    try {
      // Create or get user directly (no Supabase Auth needed)
      const { data: user, error } = await supabase
        .from('users')
        .upsert(
          { wallet_address: walletAddress },
          { onConflict: 'wallet_address' }
        )
        .select()
        .single()

      if (error) throw error

      return user
    } catch (error) {
      console.error('Error signing in with wallet:', error)
      throw error
    }
  }

  static async signOut() {
    // No auth session to sign out from
    return
  }

  static async getCurrentUser(walletAddress: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single()

    if (error) return null
    return data
  }

  // Invoice operations
  static async createInvoice(invoiceData: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('invoices')
      .insert(invoiceData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getInvoices(userId: string): Promise<Invoice[]> {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async updateInvoice(id: string, updates: Partial<Invoice>) {
    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // PDF Storage
  static async uploadPDF(file: File, userId: string): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('invoices')
      .upload(fileName, file)

    if (error) throw error

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('invoices')
      .getPublicUrl(fileName)

    return urlData.publicUrl
  }

  static async deletePDF(fileName: string) {
    const { error } = await supabase.storage
      .from('invoices')
      .remove([fileName])

    if (error) throw error
  }

  // Invoice Factoring
  static async createInvoiceFactoring(factoringData: Omit<InvoiceFactoring, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('invoice_factoring')
      .insert(factoringData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getInvoiceFactoring(invoiceId: string): Promise<InvoiceFactoring | null> {
    const { data, error } = await supabase
      .from('invoice_factoring')
      .select('*')
      .eq('invoice_id', invoiceId)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
    return data
  }

  static async updateInvoiceFactoring(id: string, updates: Partial<InvoiceFactoring>) {
    const { data, error } = await supabase
      .from('invoice_factoring')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // User profile
  static async updateUserProfile(userId: string, profile: Partial<User['profile']>) {
    const { data, error } = await supabase
      .from('users')
      .update({ profile })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }
}
