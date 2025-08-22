import React, { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import { useNavigate } from 'react-router-dom';

const categories = ["Clothes", "Electronics", "Books", "Toys", "Beauty"];

const NewProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState(categories[0]); // default to first category

  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productData = {
        name,
        description,
        price: Number(price),
        image,
        category,
        storeId: id,
      };

      const response = await api.post("/product/createNewProduct", productData, {
        headers:{
            Authorization: `Bearer ${ACCESS_TOKEN}`
        }
      });
      console.log("Product created:", response.data);
      
    } catch (error) {
      console.error("Error creating product:", error);
    }
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Create New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            value={price}
            min="0"
            onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input
            type="text"
            className="form-control"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Create Product
        </button>
      </form>
    </div>
  );
};

export default NewProduct;


