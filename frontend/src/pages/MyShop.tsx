import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
};

const LOCAL_KEY = "cart_product_ids";

const MyShop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<number[]>(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const storeId = localStorage.getItem("id");

  useEffect(() => {
    const fetchStoreProducts = async () => {
      if (!storeId) return;
      try {
        const response = await api.get(`/product/MyStoreProducts/${storeId}`);
        if (Array.isArray(response.data)) setProducts(response.data);
        else console.warn("Expected array but got:", response.data);
      } catch (error) {
        console.error("Failed to fetch store products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreProducts();
  }, [storeId]);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(cart));
  }, [cart]);

  const toggleCart = (productId: number) => {
    setCart((prevCart) =>
      prevCart.includes(productId)
        ? prevCart.filter((id) => id !== productId)
        : [...prevCart, productId]
    );
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedProduct) return;
    const { name, value } = e.target;
    setSelectedProduct({ ...selectedProduct, [name]: value });
  };

  const saveChanges = async () => {
    if (!selectedProduct) return;

    try {
      await api.put(`/product/update/${selectedProduct.id}`, selectedProduct);
      setShowModal(false);
      // Refresh products
      const response = await api.get(`/product/MyStoreProducts/${storeId}`);
      setProducts(response.data);
    } catch (err) {
      console.error("Failed to update product", err);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">My Products</h2>
        <Link to={`/createProduct/${storeId}`} className="btn btn-primary">
          <i className="bi bi-plus-lg me-2"></i>
          Create New Product
        </Link>
      </div>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-muted">No products found in your store.</p>
      ) : (
        <div className="row g-4">
          {products.map((product) => {
            const isInCart = cart.includes(product.id);

            return (
              <div key={product.id} className="col-12 col-sm-6 col-md-4">
                <div className="card h-100 shadow-sm border-0">
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title fw-bold">{product.name}</h5>
                      <p className="card-text text-muted mb-2">
                        {product.description}
                      </p>
                      <p className="card-text">
                        <strong>Category:</strong> {product.category}
                      </p>
                      <p className="card-text">
                        <strong>Price:</strong> ${product.price}
                      </p>
                    </div>
                    <div className="mt-3">
                      <button
                        className={`btn ${isInCart ? "btn-danger" : "btn-primary"} w-100 mb-2`}
                        onClick={() => toggleCart(product.id)}
                      >
                        {isInCart ? "Remove from Cart" : "Add to Cart"}
                      </button>
                      <button
                        className="btn btn-outline-secondary w-100"
                        onClick={() => openEditModal(product)}
                      >
                        Edit Product
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {selectedProduct && (
        <div className={`modal fade show ${showModal ? "d-block" : "d-none"}`} tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Product</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-2">
                    <label className="form-label">Name</label>
                    <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={selectedProduct.name}
                    onChange={handleInputChange}
                    />
                </div>
                <div className="mb-2">
                    <label className="form-label">Description</label>
                    <input
                    type="text"
                    className="form-control"
                    name="description"
                    value={selectedProduct.description}
                    onChange={handleInputChange}
                    />
                </div>
                <div className="mb-2">
                    <label className="form-label">Image URL</label>
                    <input
                    type="text"
                    className="form-control"
                    name="image"
                    value={selectedProduct.image}
                    onChange={handleInputChange}
                    />
                </div>
                <div className="mb-2">
                    <label className="form-label">Category</label>
                    <input
                    type="text"
                    className="form-control"
                    name="category"
                    value={selectedProduct.category}
                    onChange={handleInputChange}
                    />
                </div>
                <div className="mb-2">
                    <label className="form-label">Price</label>
                    <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={selectedProduct.price}
                    onChange={handleInputChange}
                    />
                </div>
                </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={saveChanges}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyShop;
