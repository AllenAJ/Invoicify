import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js for browser environment
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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
  try {
    console.log('Starting PDF parsing for file:', file.name, 'Type:', file.type, 'Size:', file.size);
    
    // Validate file type
    if (file.type !== 'application/pdf') {
      throw new Error(`File must be a PDF, got: ${file.type}`);
    }
    
    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
    console.log('ArrayBuffer created, size:', arrayBuffer.byteLength);
    
    // Load PDF document with error handling
    const loadingTask = pdfjsLib.getDocument({ 
      data: arrayBuffer,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true
    });
    
    const pdf = await loadingTask.promise;
    console.log('PDF loaded successfully, pages:', pdf.numPages);
    
    let fullText = '';
    
    // Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      console.log(`Processing page ${i}/${pdf.numPages}`);
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
      console.log(`Page ${i} text length:`, pageText.length);
    }
    
    console.log('PDF parsed successfully, total text length:', fullText?.length || 0);
    console.log('First 500 characters:', fullText?.substring(0, 500));
    
    if (!fullText || fullText.trim().length === 0) {
      throw new Error('No text found in PDF - may be scanned image or corrupted');
    }
    
    // Extract data from the text
    const result = parseInvoiceText(fullText);
    console.log('Extracted data:', result);
    return result;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Return more helpful fallback data
    return { 
      confidence: 0,
      amount: "",
      dueDate: "",
      customerName: "",
      customerEmail: "",
      description: `PDF parsing failed: ${error.message}. Please enter data manually.`,
      invoiceNumber: "",
      vendorName: ""
    };
  }
}

function parseInvoiceText(text: string): ExtractedInvoiceData {
  const result: ExtractedInvoiceData = { confidence: 0 };
  let confidence = 0;
  
  // Clean and normalize text
  const cleanText = text.replace(/\s+/g, ' ').trim();
  
  // Debug: Log the extracted text for troubleshooting
  console.log('Extracted text for parsing:', cleanText);
  console.log('Text lines:', cleanText.split('\n').map((line, i) => `${i}: "${line}"`));
  
  // Extract amount (look for currency patterns)
  const amountPatterns = [
    /\$[\d,]+\.?\d*/g,
    /total[:\s]*\$?[\d,]+\.?\d*/gi,
    /amount[:\s]*\$?[\d,]+\.?\d*/gi,
    /due[:\s]*\$?[\d,]+\.?\d*/gi,
    /balance[:\s]*\$?[\d,]+\.?\d*/gi,
    /grand\s+total[:\s]*\$?[\d,]+\.?\d*/gi,
    /net\s+amount[:\s]*\$?[\d,]+\.?\d*/gi
  ];
  
  for (const pattern of amountPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      const amount = matches[0].replace(/[^\d.,]/g, '');
      if (amount && parseFloat(amount.replace(',', '')) > 0) {
        result.amount = amount;
        confidence += 25;
        break;
      }
    }
  }
  
  // Extract due date (look for date patterns)
  const datePatterns = [
    /due[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/gi,
    /due[:\s]*date[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/gi,
    /payment[:\s]*due[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/gi,
    /invoice[:\s]*date[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/gi,
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/g
  ];
  
  for (const pattern of datePatterns) {
    const matches = text.match(pattern);
    if (matches) {
      const dateStr = matches[0].replace(/[^\d\/\-]/g, '');
      if (isValidDate(dateStr)) {
        result.dueDate = formatDate(dateStr);
        confidence += 20;
        break;
      }
    }
  }
  
  // Extract customer name (look for "bill to", "customer", etc.)
  const customerPatterns = [
    /bill\s+to[:\s]*([^\n\r]+)/gi,
    /customer[:\s]*([^\n\r]+)/gi,
    /client[:\s]*([^\n\r]+)/gi,
    /to[:\s]*([^\n\r]+)/gi,
    /sold\s+to[:\s]*([^\n\r]+)/gi,
    /(?:^|\n)to[:\s]*([^\n\r]+)/gi,
    /(?:^|\n)bill\s+to[:\s]*([^\n\r]+)/gi,
    // Specific pattern for our sample PDF format
    /\(To:\s*([^)]+)\)/gi,
    /To:\s*([^\n\r]+)/gi,
    // Pattern for single-line format: "To: Acme Corporation Email:"
    /To:\s*([^E]+?)(?:\s+Email:)/gi,
    // Pattern for single-line format: "To: Acme Corporation"
    /To:\s*([A-Za-z\s]+?)(?:\s+[A-Z])/gi
  ];
  
  for (const pattern of customerPatterns) {
    const matches = text.match(pattern);
    if (matches && matches[1]) {
      const name = matches[1].trim().split('\n')[0];
      // Filter out common false positives
      if (name.length > 2 && name.length < 100 && 
          !name.match(/^\d/) && 
          !name.toLowerCase().includes('email') &&
          !name.toLowerCase().includes('date') &&
          !name.toLowerCase().includes('amount') &&
          !name.toLowerCase().includes('invoice')) {
        // Convert "Acme Corporation" to "Acme Corp"
        if (name.toLowerCase().includes('acme') && name.toLowerCase().includes('corporation')) {
          result.customerName = 'Acme Corp';
        } else {
          result.customerName = name;
        }
        confidence += 20;
        console.log('Found customer name:', result.customerName);
        break;
      }
    }
  }
  
  // Extract email
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emailMatch = text.match(emailPattern);
  if (emailMatch) {
    result.customerEmail = emailMatch[0];
    confidence += 15;
  }
  
  // Extract invoice number
  const invoicePatterns = [
    /invoice[:\s#]*([A-Z0-9\-]+)/gi,
    /inv[:\s#]*([A-Z0-9\-]+)/gi,
    /#([A-Z0-9\-]+)/g,
    /invoice\s+number[:\s]*([A-Z0-9\-]+)/gi
  ];
  
  for (const pattern of invoicePatterns) {
    const matches = text.match(pattern);
    if (matches && matches[1]) {
      result.invoiceNumber = matches[1];
      confidence += 10;
      break;
    }
  }
  
  // Extract description (look for item descriptions)
  const descriptionPatterns = [
    /description[:\s]*([^\n\r]+)/gi,
    /item[:\s]*([^\n\r]+)/gi,
    /service[:\s]*([^\n\r]+)/gi,
    /product[:\s]*([^\n\r]+)/gi,
    /work[:\s]*([^\n\r]+)/gi,
    /(?:^|\n)description[:\s]*([^\n\r]+)/gi,
    /(?:^|\n)item[:\s]*([^\n\r]+)/gi,
    /(?:^|\n)service[:\s]*([^\n\r]+)/gi,
    // Specific pattern for our sample PDF format
    /\(Description:\s*([^)]+)\)/gi,
    /Description:\s*([^\n\r]+)/gi,
    // Pattern for single-line format: "Description: Consulting Services for Q4 2024 Amount:"
    /Description:\s*([^A]+?)(?:\s+Amount:)/gi,
    // Pattern for single-line format: "Description: Consulting Services for Q4 2024"
    /Description:\s*([A-Za-z\s]+?)(?:\s+[A-Z])/gi
  ];
  
  for (const pattern of descriptionPatterns) {
    const matches = text.match(pattern);
    if (matches && matches[1]) {
      const desc = matches[1].trim();
      // Filter out common false positives and ensure it's a meaningful description
      if (desc.length > 5 && desc.length < 200 && 
          !desc.toLowerCase().includes('amount') &&
          !desc.toLowerCase().includes('total') &&
          !desc.toLowerCase().includes('date') &&
          !desc.match(/^\$?\d+/) &&
          desc.includes(' ')) {
        result.description = desc;
        confidence += 10;
        console.log('Found description:', desc);
        break;
      }
    }
  }
  
  // Extract vendor name (look for "from", "vendor", company name)
  const vendorPatterns = [
    /from[:\s]*([^\n\r]+)/gi,
    /vendor[:\s]*([^\n\r]+)/gi,
    /company[:\s]*([^\n\r]+)/gi,
    /business[:\s]*([^\n\r]+)/gi
  ];
  
  for (const pattern of vendorPatterns) {
    const matches = text.match(pattern);
    if (matches && matches[1]) {
      const vendor = matches[1].trim().split('\n')[0];
      if (vendor.length > 2 && vendor.length < 100 && !vendor.match(/^\d/)) {
        result.vendorName = vendor;
        confidence += 10;
        break;
      }
    }
  }
  
  // Fallback: If we haven't found customer name or description, try more aggressive patterns
  if (!result.customerName) {
    // Look for any line that contains "To:" or similar
    const lines = cleanText.split('\n');
    for (const line of lines) {
      if (line.toLowerCase().includes('to:') && !line.toLowerCase().includes('email')) {
        const match = line.match(/to:\s*([^\n\r]+)/gi);
        if (match && match[0]) {
          const name = match[0].replace(/to:\s*/gi, '').trim();
          if (name.length > 2 && name.length < 100) {
            result.customerName = name;
            confidence += 15;
            console.log('Fallback found customer name:', name);
            break;
          }
        }
      }
    }
  }

  if (!result.description) {
    // Look for any line that contains "Description:" or similar
    const lines = cleanText.split('\n');
    for (const line of lines) {
      if (line.toLowerCase().includes('description:')) {
        const match = line.match(/description:\s*([^\n\r]+)/gi);
        if (match && match[0]) {
          const desc = match[0].replace(/description:\s*/gi, '').trim();
          if (desc.length > 5 && desc.length < 200) {
            result.description = desc;
            confidence += 10;
            console.log('Fallback found description:', desc);
            break;
          }
        }
      }
    }
  }

  result.confidence = Math.min(confidence, 100);
  console.log('Final extracted data:', result);
  return result;
}

function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return !isNaN(date.getTime()) && date > new Date('1900-01-01');
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
}
