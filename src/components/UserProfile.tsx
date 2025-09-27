import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, FileText, Loader2, LogOut } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useInvoices } from "@/hooks/useInvoices";

export default function UserProfile() {
  const { user, loading, isAuthenticated, signOut } = useSupabaseAuth();
  const { invoices, loading: invoicesLoading } = useInvoices(user?.id);

  if (loading) {
    return (
      <div className='minimal-card text-center space-y-6'>
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <div className='space-y-2'>
          <h3 className='text-xl font-bold text-foreground'>Connecting to Database...</h3>
          <p className="text-muted-foreground">Setting up your account...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className='minimal-card text-center space-y-6'>
        <div className='space-y-2'>
          <h3 className='text-xl font-bold text-foreground'>Not Connected</h3>
          <p className="text-muted-foreground">
            Connect your wallet to access your invoice data and start storing invoices.
          </p>
        </div>
      </div>
    );
  }

  const totalInvoices = invoices?.length || 0;
  const factoredInvoices = invoices?.filter(inv => inv.status === 'factored').length || 0;
  const draftInvoices = totalInvoices - factoredInvoices;

  return (
    <div className='minimal-card space-y-12'>
      <div className='text-center space-y-4'>
        <h2 className='text-3xl font-bold text-foreground'>
          Your Profile
        </h2>
        <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
          Manage your invoices and track your factoring activity
        </p>
      </div>

      <div className='space-y-8'>
        <div className='text-center space-y-4'>
          <div className='space-y-2'>
            <p className="text-sm text-muted-foreground">Wallet Address</p>
            <p className="font-mono text-base break-all bg-muted p-4 rounded-2xl">{user.wallet_address}</p>
          </div>
          <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
            <User className="h-4 w-4" />
            <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-muted rounded-2xl">
            <p className="text-3xl font-bold text-foreground">{totalInvoices}</p>
            <p className="text-sm text-muted-foreground">Total Invoices</p>
          </div>
          <div className="p-6 bg-primary/5 rounded-2xl">
            <p className="text-3xl font-bold text-primary">{factoredInvoices}</p>
            <p className="text-sm text-muted-foreground">Factored</p>
          </div>
          <div className="p-6 bg-secondary/50 rounded-2xl">
            <p className="text-3xl font-bold text-foreground">{draftInvoices}</p>
            <p className="text-sm text-muted-foreground">Draft</p>
          </div>
        </div>

        <div className='space-y-6'>
          <h3 className="text-2xl font-bold text-foreground text-center">
            Recent Invoices
          </h3>
          {invoicesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading invoices...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {invoices && invoices.length > 0 ? (
                invoices.slice(0, 5).map(invoice => (
                  <div key={invoice.id} className="flex items-center justify-between p-6 bg-muted rounded-2xl">
                    <div>
                      <p className="font-medium text-foreground">{invoice.invoice_number || `INV-${invoice.id.slice(0, 8)}`}</p>
                      <p className="text-sm text-muted-foreground">${invoice.amount.toFixed(2)} - Due {new Date(invoice.due_date).toLocaleDateString()}</p>
                    </div>
                    <Badge variant={invoice.status === 'factored' ? 'default' : 'secondary'} className='text-sm px-3 py-1'>
                      {invoice.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className='text-center py-8'>
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No invoices found. Upload one to get started!</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className='text-center pt-4'>
          <Button 
            onClick={signOut} 
            variant="outline" 
            className="minimal-button"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
