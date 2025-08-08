import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import { LOCAL_KEY } from "../constants";

type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
};



const Category: React.FC = () => {
  const { category } = useParams<{ category: string }>();
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
    const fetchCategoryProducts = async () => {
      try {
        const response = await api.get(`/product/getProductsByCategory/${category}`);
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.warn("Expected array but got:", response.data);
        }
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category]);

  const toggleCart = (productId: number) => {
    setCart((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="container py-5">
      <h1 className="fw-bold display-6 mb-4">Category: {category}</h1>

      {loading ? (
        <p className="text-muted">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-muted">No products found in this category.</p>
      ) : (
        <div className="row g-4">
          {products.map((product) => {
            const isInCart = cart.includes(product.id);

            return (
              <div key={product.id} className="col-12 col-sm-6 col-md-4">
                <div className="card h-100 shadow-sm border-0">
                  <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  </Link>
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{product.name}</h5>
                    <p className="card-text text-muted mb-2">
                      <strong>Description:</strong> {product.description}
                    </p>
                    <p className="card-text">
                      <strong>Price:</strong> ${product.price}
                    </p>
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

export default Category;
