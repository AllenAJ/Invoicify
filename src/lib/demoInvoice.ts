// Demo invoice data for testing
export const demoInvoices = [
  {
    filename: "demo-invoice-1.pdf",
    content: `
INVOICE #INV-2024-001

From: Acme Corporation
123 Business St, City, State 12345
Email: billing@acme.com

Bill To: TechStart Inc
456 Innovation Ave, Tech City, TC 67890
Email: accounts@techstart.com

Description: Professional consulting services for Q1 2024
Amount: $15,000.00
Due Date: 02/15/2024
Payment Terms: Net 30

Total Due: $15,000.00
    `,
    expectedData: {
      amount: "15000",
      dueDate: "2024-02-15",
      customerName: "TechStart Inc",
      customerEmail: "accounts@techstart.com",
      description: "Professional consulting services for Q1 2024",
      invoiceNumber: "INV-2024-001",
      vendorName: "Acme Corporation"
    }
  },
  {
    filename: "demo-invoice-2.pdf", 
    content: `
INVOICE

From: Global Solutions Ltd
789 Enterprise Blvd, Metro City, MC 54321
Email: finance@globalsolutions.com

Customer: StartupCo
321 Growth St, Startup City, SC 98765
Email: billing@startupco.com

Services Rendered:
- Web development and design
- Database optimization
- API integration

Amount: $8,500.00
Due: 01/30/2024
Invoice #: GS-2024-002

Total: $8,500.00
    `,
    expectedData: {
      amount: "8500",
      dueDate: "2024-01-30", 
      customerName: "StartupCo",
      customerEmail: "billing@startupco.com",
      description: "Web development and design, Database optimization, API integration",
      invoiceNumber: "GS-2024-002",
      vendorName: "Global Solutions Ltd"
    }
  }
];

export function createDemoInvoiceFile(index: number = 0): File {
  const invoice = demoInvoices[index] || demoInvoices[0];
  const blob = new Blob([invoice.content], { type: 'text/plain' });
  return new File([blob], invoice.filename, { type: 'application/pdf' });
}
