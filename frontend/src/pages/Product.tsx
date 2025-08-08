import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

type Comment = {
  id?: number;
  comment: string;       // matches your backend property
  username: string;
  createdAt: string;
};

type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
  comment: Comment[]; // from backend: Product.Comment (ICollection<Comments>)
};

const LOCAL_KEY = "cart_product_ids";

const ProductDisplay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [newComment, setNewComment] = useState("");
  const storedusesrname = localStorage.getItem("username")
  const [username] = useState(storedusesrname); // optional: user input
  const [cart, setCart] = useState<number[]>(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  // Fetch product with comments
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/product/getProductById/${id}`);
        if (response.data?.id) {
          setProduct(response.data);
        } else if (Array.isArray(response.data) && response.data.length > 0) {
          setProduct(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  // Toggle Cart
  const toggleCart = (productId: number) => {
    const updated = cart.includes(productId)
      ? cart.filter((i) => i !== productId)
      : [...cart, productId];

    setCart(updated);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
  };

  // Add new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await api.post(`/product/comments/${id}`, {
        comment: newComment,
        username: username || "Anonymous",
      });

      // Add new comment to product
      setProduct((prev) =>
        prev
          ? {
              ...prev,
              comment: [...prev.comment, res.data],
            }
          : prev
      );

      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  if (!product) {
    return (
      <div className="container py-5 text-center text-muted">
        Loading product...
      </div>
    );
  }

  const isInCart = cart.includes(product.id);

  return (
    <div className="container py-5">
      <div className="row g-5 align-items-center">
        {/* Product Image */}
        <div className="col-lg-6">
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid w-100 rounded shadow"
            style={{ maxHeight: "500px", objectFit: "cover" }}
          />
        </div>

        {/* Product Info */}
        <div className="col-lg-6">
          <h2 className="fw-bold mb-3">{product.name}</h2>
          <p className="text-muted mb-3">{product.description}</p>
          <p className="mb-2">
            <strong>Category:</strong> {product.category}
          </p>
          <p className="h5 mb-4">
            <strong>Price:</strong> ${product.price.toFixed(2)}
          </p>
          <button
            className={`btn ${isInCart ? "btn-danger" : "btn-primary"} btn-lg px-5`}
            onClick={() => toggleCart(product.id)}
          >
            {isInCart ? "Remove from Cart" : "Add to Cart"}
          </button>
        </div>
      </div>

      <hr className="my-5" />

      {/* Comments Section */}
      <div className="comments-section">
        <h4 className="mb-4">Comments</h4>

        
          <textarea
            className="form-control mb-2"
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <button className="btn btn-success" onClick={handleAddComment}>
            Post Comment
          </button>
        </div>

        {/* Comment List */}
        {product.comment.length === 0 ? (
          <p className="text-muted">No comments yet.</p>
        ) : (
          <ul className="list-group">
            {product.comment.map((comment, index) => (
              <li key={index} className="list-group-item">
                <p className="mb-1">{comment.comment}</p>
                <small className="text-muted">
                  {comment.username} – {new Date(comment.createdAt).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
    
  );
};

export default ProductDisplay;
