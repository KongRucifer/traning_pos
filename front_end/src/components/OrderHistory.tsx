import { formatKip } from '../api';
import type { Order } from '../types';

export function OrderHistory({ orders }: { orders: Order[] }) {
  if (orders.length === 0) return null;

  return (
    <section className="history">
      <h2>ບິນຫຼ້າສຸດ</h2>
      <table>
        <thead>
          <tr>
            <th>ບິນ #</th>
            <th>ເວລາ</th>
            <th>ລາຍການ</th>
            <th className="num">ຍອດລວມ</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{new Date(o.createdAt).toLocaleString('en-GB')}</td>
              <td>{o.items.map((i) => `${i.product.name} ×${i.quantity}`).join(', ')}</td>
              <td className="num">{formatKip(o.totalAmount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
