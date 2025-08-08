import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";
import * as signalR from "@microsoft/signalr";
import connection from "./SignalR"; // your singleton SignalR connection

const categories = ["Electronics", "Clothes", "Home", "Books"];

const Layout: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem(ACCESS_TOKEN));
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [id, setId] = useState(localStorage.getItem("id"));
  const [storeName, setStoreName] = useState(localStorage.getItem("storeName"));
  const navigate = useNavigate();
  const location = useLocation();

  // Hide sidebar on login and register pages
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
        .catch((err) => {
          console.error("SignalR Error:", err);
        });
    }

    return () => {
      connection.off("ReceiveMessage");
      // Do NOT call connection.stop() here because connection is shared
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
        <nav className="navbar navbar-expand-sm navbar-light bg-white border-bottom shadow-sm mb-0">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">E Shop</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link text-dark" to={`/orderhistory/${id}`}>Order History</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-dark" to="/cart">Cart</Link>
                </li>
                {isAuthenticated && storeName && storeName !== "null" && (
                  <>
                  <li className="nav-item">
                    <Link className="nav-link text-dark" to={`/myShop/${id}`}>My Shop Menu</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-dark" to={`/myShopOrders/${id}`}>My Shop Orders</Link>
                  </li>
                  </>
                )}
              </ul>
              <ul className="navbar-nav ms-auto">
                {isAuthenticated ? (
                  <>
                    <li className="nav-item">
                      <button className="nav-link btn btn-link text-dark">{username}</button>
                    </li>
                    <li className="nav-item">
                      <button onClick={handleLogout} className="nav-link btn btn-link text-dark">Logout</button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link text-dark" to="/register">Register</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link text-dark" to="/login">Login</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* Sidebar + Main Content */}
      <div className="d-flex vh-100">
        {/* Sidebar (hidden on login/register) */}
        {!hideSidebar && (
          <aside className="bg-light border-end p-4" style={{ width: "20%", minWidth: "180px" }}>
            <h6 className="text-uppercase text-secondary fw-semibold mb-4 px-2" style={{ letterSpacing: "0.05em" }}>
              Categories
            </h6>
            <nav className="nav flex-column">
              {categories.map((category) => {
                const path = `/category/${category.toLowerCase()}`;
                const isActive = location.pathname === path;

                return (
                  <Link
                    key={category}
                    to={path}
                    className={`nav-link mb-2 px-3 py-2 rounded fw-semibold ${
                      isActive ? "bg-primary text-white shadow-sm" : "text-dark bg-light border"
                    }`}
                    style={{ transition: "all 0.3s", textDecoration: "none" }}
                  >
                    {category}
                  </Link>
                );
              })}
            </nav>
          </aside>
        )}

        {/* Main content area */}
        <main className="flex-grow-1 p-4 bg-light">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layout;
