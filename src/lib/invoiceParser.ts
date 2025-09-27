// Simplified PDF parser - for demo purposes
// In production, you would use a more robust PDF parsing solution

export interface ExtractedInvoiceData {
  amount?: string;
  dueDate?: string;
  customerName?: string;
  customerEmail?: string;
  description?: string;
  invoiceNumber?: string;
  vendorName?: string;
  confidence: number;
}

export async function extractInvoiceData(file: File): Promise<ExtractedInvoiceData> {
  // Simulate PDF parsing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // For demo purposes, return mock data based on filename
  // In production, this would use actual PDF parsing
  const mockData = getMockInvoiceData(file.name);
  
  return mockData;
}

function getMockInvoiceData(filename: string): ExtractedInvoiceData {
  const mockInvoices = [
    {
      amount: "15000",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      customerName: "TechStart Inc",
      customerEmail: "billing@techstart.com",
      description: "Professional consulting services for Q1 2024",
      invoiceNumber: "INV-2024-001",
      vendorName: "Acme Corporation",
      confidence: 85
    },
    {
      amount: "8500",
      dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      customerName: "StartupCo",
      customerEmail: "accounts@startupco.com", 
      description: "Web development and API integration services",
      invoiceNumber: "GS-2024-002",
      vendorName: "Global Solutions Ltd",
      confidence: 78
    },
    {
      amount: "25000",
      dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      customerName: "Enterprise Corp",
      customerEmail: "finance@enterprise.com",
      description: "Enterprise software implementation and training",
      invoiceNumber: "ENT-2024-003", 
      vendorName: "Tech Solutions Inc",
      confidence: 92
    }
  ];
  
  // Select mock data based on filename hash
  const hash = filename.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const index = Math.abs(hash) % mockInvoices.length;
  return mockInvoices[index];
}

// Note: In production, you would implement actual PDF text extraction here
// This demo version provides realistic mock data for testing the UI
