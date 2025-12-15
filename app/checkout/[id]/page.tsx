import { notFound } from 'next/navigation';
import { getOrderById } from '@/lib/action/order-action';
import { Suspense } from 'react';

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrderById(params.id);
  if (!order) return notFound();

  // You can expand this with more order details as needed
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Order #{order._id}</h1>
      <div className="mb-2">Placed: {new Date(order.createdAt).toLocaleString()}</div>
      <div className="mb-2">Total: ${order.totalPrice.toFixed(2)}</div>
      <div className="mb-2">Status: Processing</div>
      <h2 className="text-xl font-semibold mt-6 mb-2">Items</h2>
      <ul className="divide-y">
        {order.items.map((item: any) => (
          <li key={item.clientId} className="py-2 flex justify-between">
            <span>{item.name} x {item.quantity}</span>
            <span>${item.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      {/* Add more details as needed */}
    </main>
  );
}
