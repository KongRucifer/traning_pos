import { formatKip } from '../api';
import type { Category, Product } from '../types';

interface Props {
  categories: Category[];
  products: Product[];
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
  inCartQty: (productId: number) => number;
  onAdd: (product: Product) => void;
}

export function ProductGrid({
  categories,
  products,
  selectedCategoryId,
  onSelectCategory,
  inCartQty,
  onAdd,
}: Props) {
  const visible = selectedCategoryId
    ? products.filter((p) => p.categoryId === selectedCategoryId)
    : products;

  return (
    <section className="products">
      <div className="tabs">
        <button
          className={selectedCategoryId === null ? 'tab active' : 'tab'}
          onClick={() => onSelectCategory(null)}
        >
          ທັງໝົດ
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            className={selectedCategoryId === c.id ? 'tab active' : 'tab'}
            onClick={() => onSelectCategory(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid">
        {visible.map((p) => {
          const left = p.stock - inCartQty(p.id); // stock not yet in cart
          const soldOut = left <= 0;
          return (
            <button key={p.id} className="card" disabled={soldOut} onClick={() => onAdd(p)}>
              <span className="card-name">{p.name}</span>
              <span className="card-price">{formatKip(p.price)}</span>
              <span className={p.stock === 0 ? 'stock out' : p.stock <= 5 ? 'stock low' : 'stock'}>
                {p.stock === 0 ? 'ສິນຄ້າໝົດ' : `Stock: ${p.stock}`}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
