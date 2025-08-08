import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

type Items = {
  productId: number;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  email: string;
  username: string;
  totalPrice: number;
  createdAt: string;
  items: Items[];
};

const OrderHistory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get(`/order/getById/${id}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [id]);

  if (loading) return <div className="container py-5">Loading...</div>;

  if (orders.length === 0) {
    return <div className="container py-5">No orders found for user: {id}</div>;
  }

  return (
    <div className="container py-5">
      <h1 className="fw-bold display-5 mb-4">Order History</h1>
      {orders.map((order) => (
        <div key={order.id} className="mb-4 border rounded p-3 shadow-sm bg-light">
          <h5 className="fw-bold">Order ID: {order.id}</h5>
          <p>Email: {order.email}</p>
          <p>Username: {order.username}</p>
          <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
          <p>Total Price: ${order.totalPrice.toFixed(2)}</p>

          <ul className="list-group mt-3">
            {order.items.map((item, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between">
                <span>Product ID: {item.productId}</span>
                <span>Quantity: {item.quantity}</span>
                <span>Unit Price: ${item.price.toFixed(2)}</span>
                <span>Total: ${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
