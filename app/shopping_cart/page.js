'use client';

import { useEffect, useState } from 'react';
import { CartContainer } from '../../components/cart/cart-container';
import { CartProvider } from '../../components/cart/cart-context';

export default function CartPage() {
  return (
    <CartProvider>
      <CartContainer />
    </CartProvider>
  );
}