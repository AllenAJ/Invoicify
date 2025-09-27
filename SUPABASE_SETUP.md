# Supabase Setup Guide

This guide will help you set up Supabase for the Invoice Factor application.

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `invoice-factor` (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose the closest region to your users
6. Click "Create new project"

## 2. Get Your Project Credentials

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## 3. Set Up Environment Variables

1. Create a `.env.local` file in the root directory of your project
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4. Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `supabase-schema.sql`
3. Paste it into the SQL editor
4. Click **Run** to execute the schema

This will create:
- `users` table for wallet-based authentication
- `invoices` table for invoice data
- `invoice_factoring` table for factoring records
- Storage bucket for PDF files
- Row Level Security policies
- Indexes for performance

## 5. Configure Storage

1. Go to **Storage** in your Supabase dashboard
2. You should see the `invoices` bucket created by the schema
3. The bucket is configured to be private (users can only access their own files)

## 6. Test the Setup

1. Start your development server: `npm run dev`
2. Connect your wallet
3. Try uploading an invoice - it should save to Supabase

## 7. Database Tables Overview

### Users Table
- `id`: UUID primary key
- `wallet_address`: Unique wallet address
- `profile`: JSONB for additional user data
- `created_at`, `updated_at`: Timestamps

### Invoices Table
- `id`: UUID primary key
- `user_id`: Foreign key to users table
- `invoice_number`: Invoice number from PDF
- `amount`: Invoice amount
- `due_date`: Payment due date
- `customer_name`, `customer_email`: Customer details
- `description`: Invoice description
- `pdf_url`: URL to stored PDF file
- `pdf_filename`: Original PDF filename
- `status`: Invoice status (draft, created, factored, paid, overdue)
- `blockchain_invoice_id`: On-chain invoice ID
- `factor_amount`, `factor_fee`, `net_amount`: Factoring details

### Invoice Factoring Table
- `id`: UUID primary key
- `invoice_id`: Foreign key to invoices table
- `user_id`: Foreign key to users table
- `factor_amount`: Amount advanced to business
- `factor_fee`: Fee charged
- `net_amount`: Net amount received by business
- `blockchain_transaction_hash`: On-chain transaction hash
- `status`: Factoring status (pending, completed, failed)

## 8. Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Wallet-based Authentication**: Uses wallet address as user identifier
- **Private Storage**: PDF files are private to each user
- **JWT Tokens**: Secure API access with JWT tokens

## 9. Monitoring and Analytics

You can monitor your application in the Supabase dashboard:
- **Database**: View table data and run queries
- **Storage**: Manage uploaded files
- **Logs**: View API and database logs
- **Metrics**: Monitor usage and performance

## 10. Production Considerations

For production deployment:
1. Set up proper environment variables in your hosting platform
2. Configure custom domain for Supabase
3. Set up database backups
4. Monitor usage and scale as needed
5. Consider upgrading to Pro plan for higher limits

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Make sure `.env.local` file exists and has correct values
   - Restart your development server after adding environment variables

2. **"Failed to authenticate with Supabase"**
   - Check that your Supabase URL and anon key are correct
   - Verify the database schema has been applied

3. **"Permission denied" errors**
   - Make sure RLS policies are properly set up
   - Check that the user is authenticated

4. **PDF upload fails**
   - Verify the storage bucket exists
   - Check storage policies are configured correctly

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Join the [Supabase Discord](https://discord.supabase.com)
- Review the application logs in the Supabase dashboard
