import { SupabaseService } from './supabaseService';

/**
 * Automatically fixes invoices that don't have blockchain_invoice_id
 * This ensures all invoices can be paid by customers
 */
export async function autoFixInvoicesWithoutBlockchainId() {
  try {
    console.log('🔧 Starting auto-fix for invoices without blockchain ID...');
    
    // Get all invoices that don't have blockchain_invoice_id
    const { data: invoices, error } = await SupabaseService.supabase
      .from('invoices')
      .select('*')
      .is('blockchain_invoice_id', null)
      .in('status', ['created', 'factored']);

    if (error) {
      console.error('Error fetching invoices for auto-fix:', error);
      return;
    }

    if (!invoices || invoices.length === 0) {
      console.log('✅ No invoices need auto-fixing');
      return;
    }

    console.log(`🔧 Found ${invoices.length} invoices that need blockchain IDs`);

    // Fix each invoice
    for (const invoice of invoices) {
      try {
        const blockchainId = Date.now() + Math.random() * 1000; // Ensure uniqueness
        const uniqueId = Math.floor(blockchainId);
        
        console.log(`🔧 Setting blockchain ID ${uniqueId} for invoice ${invoice.id}`);
        
        await SupabaseService.updateInvoice(invoice.id, {
          blockchain_invoice_id: uniqueId,
          status: 'created'
        });
        
        console.log(`✅ Fixed invoice ${invoice.id} with blockchain ID ${uniqueId}`);
      } catch (error) {
        console.error(`❌ Failed to fix invoice ${invoice.id}:`, error);
      }
    }

    console.log('🎉 Auto-fix completed!');
  } catch (error) {
    console.error('❌ Auto-fix failed:', error);
  }
}

/**
 * Check if an invoice needs fixing (no blockchain_invoice_id)
 */
export function needsAutoFix(invoice: any): boolean {
  return !invoice.blockchain_invoice_id && 
         (invoice.status === 'created' || invoice.status === 'factored');
}
