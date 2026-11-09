import { useEffect, useState } from 'react';
import { api, formatKip } from './api';
import { Cart } from './components/Cart';
import { OrderHistory } from './components/OrderHistory';
import { ProductGrid } from './components/ProductGrid';
import type { CartItem, Category, Order, Product } from './types';
import './App.css';

export default function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  // Load data from the backend (GET /categories, /products, /orders)
  async function loadData() {
    try {
      const [cats, prods, ords] = await Promise.all([
        api.getCategories(),
        api.getProducts(),
        api.getOrders(),
      ]);
      setCategories(cats);
      setProducts(prods);
      setOrders(ords);
    } catch (err) {
      setMessage({ type: 'error', text: `ເຊື່ອມຕໍ່ Backend ບໍ່ໄດ້: ${(err as Error).message}` });
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // ---- Cart actions (only React state, nothing saved yet) ----
  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }

  function changeQty(productId: number, delta: number) {
    setCart((prev) =>
      prev.map((i) =>
        i.product.id === productId
          ? { ...i, quantity: Math.min(Math.max(1, i.quantity + delta), i.product.stock) }
          : i,
      ),
    );
  }

  function removeFromCart(productId: number) {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }

  const inCartQty = (productId: number) =>
    cart.find((i) => i.product.id === productId)?.quantity ?? 0;

  // ---- Checkout: POST /checkout → backend cuts stock and saves the bill ----
  async function checkout() {
    setPaying(true);
    setMessage(null);
    try {
      const order = await api.checkout(
        cart.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      );
      setMessage({
        type: 'ok',
        text: `✅ ຊຳລະສຳເລັດ! ບິນເລກທີ ${order.id} — ຍອດລວມ ${formatKip(order.totalAmount)}`,
      });
      setCart([]);
    } catch (err) {
      setMessage({ type: 'error', text: `❌ ${(err as Error).message}` });
    } finally {
      setPaying(false);
      await loadData(); // refresh stock numbers from the DB
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🛒 POS ໜ້າຮ້ານ</h1>
      </header>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <main className="layout">
        <ProductGrid
          categories={categories}
          products={products}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          inCartQty={inCartQty}
          onAdd={addToCart}
        />
        <Cart
          items={cart}
          paying={paying}
          onChangeQty={changeQty}
          onRemove={removeFromCart}
          onCheckout={checkout}
        />
      </main>

      <OrderHistory orders={orders} />
    </div>
  );
}
