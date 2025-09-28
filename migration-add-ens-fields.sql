-- Migration to add ENS fields to existing invoices table
-- Run this in your Supabase SQL editor

-- Add new columns to invoices table
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS customer_address TEXT,
ADD COLUMN IF NOT EXISTS customer_ens_name TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invoices_customer_ens_name ON invoices(customer_ens_name);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_address ON invoices(customer_address);

-- Update existing records to have empty strings for the new fields (optional)
-- UPDATE invoices 
-- SET customer_address = '', customer_ens_name = NULL 
-- WHERE customer_address IS NULL;
