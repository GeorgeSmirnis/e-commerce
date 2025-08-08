import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { ACCESS_TOKEN } from '../constants';

interface LoginViewModel {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const [form, setForm] = useState<LoginViewModel>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
        rememberMe: form.rememberMe,
      });

      const data = response.data;
      localStorage.setItem(ACCESS_TOKEN, data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('role', data.role);
      localStorage.setItem('id', data.id);
      localStorage.setItem('storeName', data.storeName);

      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-check mb-3">
              <input
                id="rememberMe"
                type="checkbox"
                name="rememberMe"
                checked={form.rememberMe}
                onChange={handleChange}
                className="form-check-input"
              />
              <label htmlFor="rememberMe" className="form-check-label">Remember Me</label>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary w-100">Login</button>
            </div>

           

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

