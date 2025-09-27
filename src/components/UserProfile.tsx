import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Database, FileText, Loader2 } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useInvoices } from "@/hooks/useInvoices";

export default function UserProfile() {
  const { user, loading, isAuthenticated, signOut } = useSupabaseAuth();
  const { invoices, loading: invoicesLoading } = useInvoices(user?.id);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Connecting to Database...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Setting up your account...</p>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Not Connected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Connect your wallet to access your invoice data and start storing invoices.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Your Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Wallet Address</p>
              <p className="text-sm text-muted-foreground font-mono">
                {user.wallet_address}
              </p>
            </div>
            <Badge variant="outline">Connected</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Account Created</p>
              <p className="text-sm text-muted-foreground">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <Button 
            onClick={signOut} 
            variant="outline" 
            size="sm"
            className="w-full"
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Your Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invoicesLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading invoices...</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Invoices</span>
                <Badge variant="secondary">{invoices.length}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Factored Invoices</span>
                <Badge variant="default">
                  {invoices.filter(inv => inv.status === 'factored').length}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Draft Invoices</span>
                <Badge variant="outline">
                  {invoices.filter(inv => inv.status === 'draft').length}
                </Badge>
              </div>

              {invoices.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Recent Invoices:</p>
                  <div className="space-y-1">
                    {invoices.slice(0, 3).map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <FileText className="h-3 w-3" />
                          <span>{invoice.invoice_number || `INV-${invoice.id.slice(0, 8)}`}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>${invoice.amount}</span>
                          <Badge 
                            variant={
                              invoice.status === 'factored' ? 'default' :
                              invoice.status === 'draft' ? 'outline' : 'secondary'
                            }
                            className="text-xs"
                          >
                            {invoice.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
