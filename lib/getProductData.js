import { supabase } from './supabase';

export const getProductData = async () => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      category,
      style,
      price,
      image_url,
      product_sizes (
        size,
        stock
      )
    `);

  if (error) {
    throw new Error('Failed to fetch product data: ' + error.message);
  }

  return data;
};
