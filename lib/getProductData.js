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
      discounted_price,
      product_sizes (
        size,
        stock
      ),
       orders(rating)
    `);

  if (error) {
    throw new Error('Failed to fetch product data: ' + error.message);
  }

  // Return the data from products with sizes and stock information
  return data;
};
