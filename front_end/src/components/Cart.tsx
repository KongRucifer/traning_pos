import { formatKip } from '../api';
import type { CartItem } from '../types';

interface Props {
  items: CartItem[];
  paying: boolean;
  onChangeQty: (productId: number, delta: number) => void;
  onRemove: (productId: number) => void;
  onCheckout: () => void;
}

export function Cart({ items, paying, onChangeQty, onRemove, onCheckout }: Props) {
  // Total shown here is only a preview — the backend calculates the real total
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <aside className="cart">
      <h2>ກະຕ່າ ({items.length})</h2>

      {items.length === 0 && <p className="muted">ກົດເລືອກສິນຄ້າເພື່ອເພີ່ມໃສ່ກະຕ່າ</p>}

      <ul className="cart-list">
        {items.map(({ product, quantity }) => (
          <li key={product.id} className="cart-row">
            <div className="cart-info">
              <span>{product.name}</span>
              <span className="muted">{formatKip(product.price)} × {quantity}</span>
            </div>
            <div className="qty">
              <button onClick={() => onChangeQty(product.id, -1)} disabled={quantity <= 1}>−</button>
              <span>{quantity}</span>
              <button onClick={() => onChangeQty(product.id, +1)} disabled={quantity >= product.stock}>+</button>
              <button className="remove" onClick={() => onRemove(product.id)} title="ລຶບ">✕</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="total">
        <span>ລວມທັງໝົດ</span>
        <strong>{formatKip(total)}</strong>
      </div>

      <button className="pay" disabled={items.length === 0 || paying} onClick={onCheckout}>
        {paying ? 'ກຳລັງຊຳລະ...' : 'ຊຳລະເງິນ'}
      </button>
    </aside>
  );
}
