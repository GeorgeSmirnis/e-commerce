import React, { useEffect, useState } from "react";
import api from "../api";
import { LOCAL_KEY } from "../constants";

type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
  storeId: number;
};

type CartItem = {
  product: Product;
  quantity: number;
};

const QUANTITY_KEY = "cart_quantities";

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartProducts = async () => {
      const storedIds = localStorage.getItem(LOCAL_KEY);
      const storedQuantities = localStorage.getItem(QUANTITY_KEY);

      const ids: number[] = storedIds ? JSON.parse(storedIds) : [];
      const quantities: Record<number, number> = storedQuantities ? JSON.parse(storedQuantities) : {};

      if (ids.length === 0) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      try {
        const response = await api.post("/product/getProductsInCart", { Ids: ids });
        if (Array.isArray(response.data)) {
          const items: CartItem[] = response.data.map((p: Product) => ({
            product: p,
            quantity: quantities[p.id] || 1,
          }));
          console.log("Response from getProductsInCart:", response.data);

          setCartItems(items);
        } else {
          console.warn("Unexpected response:", response.data);
        }
      } catch (error) {
        console.error("Failed to load cart products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartProducts();
  }, []);

  const updateLocalStorage = (items: CartItem[]) => {
    const ids = items.map((item) => item.product.id);
    const quantities: Record<number, number> = {};
    items.forEach((item) => (quantities[item.product.id] = item.quantity));

    localStorage.setItem(LOCAL_KEY, JSON.stringify(ids));
    localStorage.setItem(QUANTITY_KEY, JSON.stringify(quantities));
  };

  const removeFromCart = (productId: number) => {
    const updated = cartItems.filter((item) => item.product.id !== productId);
    setCartItems(updated);
    updateLocalStorage(updated);
  };

  const changeQuantity = (productId: number, delta: number) => {
    const updated = cartItems.map((item) => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updated);
    updateLocalStorage(updated);
  };

  const total = cartItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

  const handleOrder = async () => {
    try {
      const email = localStorage.getItem("username");
      const username = localStorage.getItem("username");
      const Id = localStorage.getItem("id")

      if (!email || !username) {
        alert("You must be logged in to place an order.");
        return;
      }

      const orderPayload = {
        UserId: Id,
        email: email,
        username: username,
        items: cartItems.map((item) => ({
          StoreId: item.product.storeId,
          productId: item.product.id,
          price: item.product.price,
          quantity: item.quantity,
        })),
        totalPrice: total,
      };
      console.log("Payload to be sent:", orderPayload);


      const response = await api.post("/order/createOrder", orderPayload);

      if (response.status === 200 || response.status === 201) {
        
        setCartItems([]);
        localStorage.removeItem(LOCAL_KEY);
        localStorage.removeItem(QUANTITY_KEY);
      }
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Failed to place order.");
    }
  };

  return (
    <div className="container py-5">
      <h1 className="fw-bold display-5 mb-4">Your Cart</h1>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : cartItems.length === 0 ? (
        <p className="text-muted">Your cart is empty.</p>
      ) : (
        <>
          <div className="row g-4 mb-4">
            {cartItems.map(({ product, quantity }) => (
              <div key={product.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0">
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{product.name}</h5>
                    <p className="card-text text-muted">{product.description}</p>
                    <p className="card-text">
                      <strong>Price:</strong> ${product.price}
                    </p>
                    <div className="d-flex align-items-center mb-3">
                      <button
                        className="btn btn-outline-secondary me-2"
                        onClick={() => changeQuantity(product.id, -1)}
                      >
                        -
                      </button>
                      <span className="fw-bold">{quantity}</span>
                      <button
                        className="btn btn-outline-secondary ms-2"
                        onClick={() => changeQuantity(product.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="btn btn-danger w-100"
                      onClick={() => removeFromCart(product.id)}
                    >
                      Remove from Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-between align-items-center border-top pt-3">
            <h4>Total: ${total.toFixed(2)}</h4>
            <button className="btn btn-success px-4" onClick={handleOrder}>
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;

