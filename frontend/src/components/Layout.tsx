import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";
import * as signalR from "@microsoft/signalr";
import connection from "./SignalR";

const categories = ["Electronics", "Clothes", "Home", "Books"];

const Layout: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem(ACCESS_TOKEN));
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [id, setId] = useState(localStorage.getItem("id"));
  const [storeName, setStoreName] = useState(localStorage.getItem("storeName"));
  const navigate = useNavigate();
  const location = useLocation();

  const hideSidebar = location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    if (connection.state === signalR.HubConnectionState.Disconnected) {
      connection
        .start()
        .then(() => {
          console.log("✅ SignalR Connected");
          connection.on("ReceiveMessage", (message: string) => {
            console.log("📩 Message received:", message);
          });
        })
        .catch((err) => console.error("SignalR Error:", err));
    }
    return () => {
      connection.off("ReceiveMessage");
    };
  }, []);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem(ACCESS_TOKEN));
    setUsername(localStorage.getItem("username") || "");
    setId(localStorage.getItem("id"));
    setStoreName(localStorage.getItem("storeName"));
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <>
      {/* Navbar */}
      <header>
        <nav className="navbar navbar-expand-sm navbar-dark bg-primary shadow-sm">
          <div className="container-fluid">
            <Link className="navbar-brand fw-bold" to="/">E Shop</Link>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link" to={`/orderhistory/${id}`}>Order History</Link>
                </li>
                {isAuthenticated && storeName && storeName !== "null" && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to={`/myShop/${id}`}>My Shop Menu</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to={`/myShopOrders/${id}`}>My Shop Orders</Link>
                    </li>
                  </>
                )}
              </ul>

              <ul className="navbar-nav ms-auto align-items-center">
                {isAuthenticated ? (
                  <>
                    <li className="nav-item me-2">
                      <Link className="nav-link position-relative" to="/cart">
                        <i className="bi bi-cart" style={{ fontSize: "1.2rem" }}></i>
                      </Link>
                    </li>
                    <li className="nav-item me-2">
                      <span className="nav-link text-white fw-semibold">{username}</span>
                    </li>
                    <li className="nav-item">
                      <button onClick={handleLogout} className="btn btn-sm btn-outline-light">Logout</button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link text-white" to="/register">Register</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link text-white" to="/login">Login</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* Sidebar + Main */}
      <div className="d-flex" style={{ minHeight: "calc(100vh - 56px)" }}>
        {!hideSidebar && (
          <aside className="bg-white border-end shadow-sm p-3" style={{ width: "220px" }}>
            <h6 className="text-uppercase text-secondary fw-bold mb-3">Categories</h6>
            <nav className="nav flex-column">
              {categories.map((category) => {
                const path = `/category/${category.toLowerCase()}`;
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={category}
                    to={path}
                    className={`nav-link mb-2 px-3 py-2 rounded ${
                      isActive ? "bg-primary text-white fw-bold" : "text-dark"
                    }`}
                    style={{ transition: "0.2s" }}
                  >
                    {category}
                  </Link>
                );
              })}
            </nav>
          </aside>
        )}

        <main className="flex-grow-1 bg-light p-4">
          <div className="card shadow-sm rounded-3 p-4 bg-white h-100">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;
