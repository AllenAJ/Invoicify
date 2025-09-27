/**
 * Sample Invoice PDF Generator
 * Creates a simple PDF invoice for testing purposes
 */

export function generateSampleInvoicePDF(): Blob {
  // Create a simple PDF content with invoice data
  const invoiceData = {
    invoiceNumber: 'INV-2024-001',
    date: new Date().toLocaleDateString(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    from: 'Your Business Name',
    to: 'Acme Corporation',
    email: 'billing@acme.com',
    description: 'Consulting Services for Q4 2024',
    amount: '10000.00'
  };

  // Create a more robust PDF with better text extraction
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
>>
>>
>>
endobj

4 0 obj
<<
/Length 1200
>>
stream
BT
/F1 18 Tf
100 750 Td
(INVOICE) Tj
0 -40 Td
/F1 12 Tf
(Invoice Number: ${invoiceData.invoiceNumber}) Tj
0 -25 Td
(Date: ${invoiceData.date}) Tj
0 -25 Td
(Due Date: ${invoiceData.dueDate}) Tj
0 -40 Td
(From: ${invoiceData.from}) Tj
0 -25 Td
(To: ${invoiceData.to}) Tj
0 -25 Td
(Email: ${invoiceData.email}) Tj
0 -40 Td
(Description: ${invoiceData.description}) Tj
0 -25 Td
(Amount: $${invoiceData.amount}) Tj
0 -40 Td
/F1 14 Tf
(Total Amount: $${invoiceData.amount}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
1454
%%EOF`;

  return new Blob([pdfContent], { type: 'application/pdf' });
}

export function downloadSampleInvoice(): void {
  const pdfBlob = generateSampleInvoicePDF();
  const url = URL.createObjectURL(pdfBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sample-invoice.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
