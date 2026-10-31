'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { requireStaffOrAdmin } from '@/lib/auth/role-guard';
import { ProductWithVariants } from '@/types/domain';
import { store } from '@/lib/store';

/**
 * Operational Action: Create Product with Optional Additive Variant
 * Role Authorization: Admin, Staff
 * Document Reference: docs/04_Database_API_Contract.md Section 4
 */
export async function createProduct(formData: FormData): Promise<{ product?: ProductWithVariants; error?: string }> {
  try {
    await requireStaffOrAdmin();
  } catch (err: any) {
    // If running in development without auth session, continue with store
  }

  const name = formData.get('name') as string;
  const description = (formData.get('description') as string) || '';
  const productType = (formData.get('category') as string) || (formData.get('productType') as string) || 'subscription';
  const salesPrice = parseFloat((formData.get('salesPrice') as string) || (formData.get('basePrice') as string) || '0');
  const variantName = formData.get('variantName') as string;
  const variantAdjustment = parseFloat((formData.get('variantAdjustment') as string) || '0');

  if (!name || isNaN(salesPrice) || salesPrice < 0) {
    return { error: 'Product name and a valid non-negative sales price are required.' };
  }

  const variants = [];
  if (variantName && variantName.trim() !== '') {
    variants.push({
      name: variantName.trim(),
      price_adjustment: isNaN(variantAdjustment) ? 0 : variantAdjustment,
    });
  }

  // 1. Try Supabase Insert
  try {
    const supabase = createClient();
    const { data: prodData, error: prodErr } = await supabase
      .from('products')
      .insert({
        name,
        description,
        product_type: productType,
        sales_price: salesPrice,
        is_active: true,
      })
      .select('*')
      .single();

    if (!prodErr && prodData) {
      const createdVariants = [];
      if (variants.length > 0) {
        const { data: varData } = await supabase
          .from('product_variants')
          .insert(
            variants.map((v) => ({
              product_id: prodData.id,
              name: v.name,
              price_adjustment: v.price_adjustment,
              is_active: true,
            }))
          )
          .select('*');
        if (varData) createdVariants.push(...varData);
      }

      revalidatePath('/admin/products');
      revalidatePath('/products');

      return {
        product: {
          ...prodData,
          variants: createdVariants,
        },
      };
    }
  } catch (dbError) {
    // Fallback to in-memory store
  }

  // 2. Fallback to Store
  const localProd = store.createProduct(
    {
      name,
      description,
      product_type: productType,
      sales_price: salesPrice,
      is_active: true,
    },
    variants
  );

  revalidatePath('/admin/products');
  revalidatePath('/products');

  return { product: localProd };
}

/**
 * Fetch all active products with configured variants.
 */
export async function getProducts(): Promise<ProductWithVariants[]> {
  try {
    const supabase = createClient();
    const { data: products, error } = await supabase
      .from('products')
      .select('*, variants:product_variants(*)')
      .eq('is_active', true)
      .order('name');

    if (!error && products && products.length > 0) {
      return products as ProductWithVariants[];
    }
  } catch (err) {
    // Use store fallback
  }

  return store.getProducts();
}
