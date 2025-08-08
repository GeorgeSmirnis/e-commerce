import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { LOCAL_KEY } from "../constants"; // or define LOCAL_KEY here if needed

type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
  StoreId: number;
};

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState<number[]>(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/product/getAllProducts");
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const toggleCart = (productId: number) => {
    setCart((prevCart) =>
      prevCart.includes(productId)
        ? prevCart.filter((id) => id !== productId)
        : [...prevCart, productId]
    );
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">All Products</h2>

      {loading ? (
        <p className="text-muted">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-muted">No products available.</p>
      ) : (
        <div className="row g-4">
          {products.map((product) => {
            const isInCart = cart.includes(product.id);

            return (
              <div key={product.id} className="col-12 col-sm-6 col-md-4">
                <div className="card h-100 shadow-sm border-0">
                  <Link
                    to={`product/${product.id}`}
                    className="text-decoration-none text-dark"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  </Link>
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{product.name}</h5>
                    <p className="card-text text-muted mb-2">{product.description}</p>
                    <p className="card-text"><strong>Category:</strong> {product.category}</p>
                    <p className="card-text"><strong>Price:</strong> ${product.price}</p>
                    <button
                      className={`btn ${isInCart ? "btn-danger" : "btn-primary"} mt-3 w-100`}
                      onClick={() => toggleCart(product.id)}
                    >
                      {isInCart ? "Remove from Cart" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
