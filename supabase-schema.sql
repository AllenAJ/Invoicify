-- Invoice Factor Database Schema
-- Run this in your Supabase SQL editor

-- Enable Row Level Security

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  profile JSONB DEFAULT '{}'::jsonb
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  invoice_number TEXT,
  amount DECIMAL(18,6) NOT NULL,
  due_date DATE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  description TEXT,
  pdf_url TEXT,
  pdf_filename TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'created', 'factored', 'paid', 'overdue')),
  blockchain_invoice_id BIGINT,
  factor_amount DECIMAL(18,6),
  factor_fee DECIMAL(18,6),
  net_amount DECIMAL(18,6),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoice_factoring table
CREATE TABLE IF NOT EXISTS invoice_factoring (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  factor_amount DECIMAL(18,6) NOT NULL,
  factor_fee DECIMAL(18,6) NOT NULL,
  net_amount DECIMAL(18,6) NOT NULL,
  blockchain_transaction_hash TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for PDFs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('invoices', 'invoices', false)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);
CREATE INDEX IF NOT EXISTS idx_invoice_factoring_invoice_id ON invoice_factoring(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_factoring_user_id ON invoice_factoring(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
DROP TRIGGER IF EXISTS update_invoice_factoring_updated_at ON invoice_factoring;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoice_factoring_updated_at BEFORE UPDATE ON invoice_factoring
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies (Simplified for wallet-based auth)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_factoring ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations on users" ON users;
DROP POLICY IF EXISTS "Allow all operations on invoices" ON invoices;
DROP POLICY IF EXISTS "Allow all operations on invoice_factoring" ON invoice_factoring;

-- Allow all operations for now (we'll filter by wallet address in the app)
-- In production, you might want to implement more sophisticated RLS policies
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on invoices" ON invoices FOR ALL USING (true);
CREATE POLICY "Allow all operations on invoice_factoring" ON invoice_factoring FOR ALL USING (true);

-- Storage policies for PDFs (Simplified)
DROP POLICY IF EXISTS "Allow all operations on invoices storage" ON storage.objects;
CREATE POLICY "Allow all operations on invoices storage" ON storage.objects
    FOR ALL USING (bucket_id = 'invoices');
