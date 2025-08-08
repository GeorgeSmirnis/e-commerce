import React, { useEffect, useState } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import connection from "../components/SignalR";

interface Item {
  productId: number;
  price: number;
  quantity: number;
  storeId: string;
}

interface Order {
  id: string;
  userId: string;
  email: string;
  username: string;
  totalPrice: number;
  createdAt: string;
  items: Item[];
}

const MyShopOrders: React.FC = () => {
  const { id: storeId } = useParams();
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const response = await api.get(`/order/getOrdersByStoreId/${storeId}`);
      setOrders(response.data);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [storeId]);

  useEffect(() => {
    const handleNewOrder = (message: string) => {
      try {
        const parsed = JSON.parse(message);

        // If full order object with items:
        if (parsed.items && parsed.items.some((item: Item) => item.storeId === storeId)) {
          console.log("Full order received via SignalR, refreshing orders list...");
          fetchOrders();
        }
        // If partial notification with StoreId only:
        else if (parsed.StoreId === storeId) {
          console.log("Order notification received via SignalR, refreshing orders list...");
          fetchOrders();
        }
      } catch (err) {
        console.error("❌ Error parsing order message:", err);
      }
    };

    connection.on("ReceiveMessage", handleNewOrder);

    return () => {
      connection.off("ReceiveMessage", handleNewOrder);
    };
  }, [storeId]);

  return (
    <div className="container mt-4">
      <h2>🛒 My Shop Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul className="list-group mt-3">
          {orders.map((order) => (
            <li key={order.id} className="list-group-item">
              <strong>Customer:</strong> {order.username} <br />
              <strong>Items:</strong>{" "}
              {order.items
                .filter((item) => item.storeId === storeId)
                .map(
                  (item) =>
                    `Product ${item.productId} x${item.quantity} ($${item.price.toFixed(2)})`
                )
                .join(", ")}
              <br />
              <strong>Total:</strong> ${order.totalPrice.toFixed(2)} <br />
              <small>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "Date not available"}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyShopOrders;
