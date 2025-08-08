// src/pages/Register.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

type RegisterFormData = {
  email: string;
  password: string;
  role: 'Customer' | 'StoreOwner';
  storeName: string;
};

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    role: 'Customer',
    storeName: '',
  });

  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const navigate = useNavigate();
 


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrors({});
  

  try {
    const response = await api.post('/auth/register', formData) 
      

    if (response.status === 200 || response.status === 201) {
      navigate('/login');
    } else {
      console.error('Registration failed');
    }
  } catch (err) {
    console.error('Registration failed', err);
    
  }
};


  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Register</h2>

          <form onSubmit={handleSubmit}>
            

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
              />
              {errors.email && <span className="text-danger">{errors.email}</span>}
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
              />
              {errors.password && <span className="text-danger">{errors.password}</span>}
            </div>

            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Customer">Customer</option>
                <option value="StoreOwner">Store Owner</option>
              </select>
              {errors.role && <span className="text-danger">{errors.role}</span>}
            </div>

            <div className="mb-3">
              <label className="form-label">Store Name</label>
              <input
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                className="form-control"
              />
              {errors.storeName && <span className="text-danger">{errors.storeName}</span>}
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

