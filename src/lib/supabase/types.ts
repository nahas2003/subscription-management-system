/**
 * BrightLoop Subscription Management System
 * Module: Finance Operations (Member 4)
 * TypeScript Database Definitions matching PostgreSQL schema
 * Document Reference: supabase/migrations/20261031_001_finance_schema.sql
 */

export interface Database {
  public: {
    Tables: {
      taxes: {
        Row: {
          id: string;
          name: string;
          rate: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          rate: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['taxes']['Insert']>;
      };
      discounts: {
        Row: {
          id: string;
          name: string;
          code: string | null;
          discount_type: 'fixed' | 'percentage';
          value: number;
          minimum_purchase: number | null;
          minimum_quantity: number | null;
          starts_at: string | null;
          ends_at: string | null;
          usage_limit: number | null;
          usage_count: number;
          scope_type: 'subscription' | 'product' | 'global';
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code?: string | null;
          discount_type: 'fixed' | 'percentage';
          value: number;
          minimum_purchase?: number | null;
          minimum_quantity?: number | null;
          starts_at?: string | null;
          ends_at?: string | null;
          usage_limit?: number | null;
          usage_count?: number;
          scope_type?: 'subscription' | 'product' | 'global';
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['discounts']['Insert']>;
      };
      invoices: {
        Row: {
          id: string;
          invoice_number: string;
          customer_id: string;
          subscription_id: string | null;
          invoice_date: string;
          due_date: string;
          billing_period_start: string | null;
          billing_period_end: string | null;
          status: 'draft' | 'confirmed' | 'paid' | 'cancelled';
          currency: 'INR';
          subtotal: number;
          discount_total: number;
          tax_total: number;
          total: number;
          amount_paid: number;
          balance_due: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          invoice_number: string;
          customer_id: string;
          subscription_id?: string | null;
          invoice_date?: string;
          due_date: string;
          billing_period_start?: string | null;
          billing_period_end?: string | null;
          status?: 'draft' | 'confirmed' | 'paid' | 'cancelled';
          currency?: 'INR';
          subtotal?: number;
          discount_total?: number;
          tax_total?: number;
          total?: number;
          amount_paid?: number;
          balance_due?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['invoices']['Insert']>;
      };
      invoice_lines: {
        Row: {
          id: string;
          invoice_id: string;
          product_id: string | null;
          variant_id: string | null;
          description_snapshot: string;
          quantity: number;
          unit_price: number;
          discount_amount: number;
          tax_rate_snapshot: number;
          tax_amount: number;
          line_total: number;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          product_id?: string | null;
          variant_id?: string | null;
          description_snapshot: string;
          quantity: number;
          unit_price: number;
          discount_amount?: number;
          tax_rate_snapshot?: number;
          tax_amount?: number;
          line_total: number;
        };
        Update: Partial<Database['public']['Tables']['invoice_lines']['Insert']>;
      };
      payments: {
        Row: {
          id: string;
          payment_reference: string;
          customer_id: string;
          payment_method: 'bank_transfer' | 'upi' | 'credit_card' | 'cash' | 'other';
          amount: number;
          payment_date: string;
          note: string | null;
          recorded_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          payment_reference: string;
          customer_id: string;
          payment_method: 'bank_transfer' | 'upi' | 'credit_card' | 'cash' | 'other';
          amount: number;
          payment_date?: string;
          note?: string | null;
          recorded_by: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['payments']['Insert']>;
      };
      payment_allocations: {
        Row: {
          id: string;
          payment_id: string;
          invoice_id: string;
          amount_allocated: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          payment_id: string;
          invoice_id: string;
          amount_allocated: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['payment_allocations']['Insert']>;
      };
      discount_applications: {
        Row: {
          id: string;
          discount_id: string;
          invoice_id: string;
          discount_name_snapshot: string;
          discount_type_snapshot: 'fixed' | 'percentage';
          discount_value_snapshot: number;
          amount_applied: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          discount_id: string;
          invoice_id: string;
          discount_name_snapshot: string;
          discount_type_snapshot: 'fixed' | 'percentage';
          discount_value_snapshot: number;
          amount_applied: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['discount_applications']['Insert']>;
      };
    };
  };
}
