import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Category from "./pages/Category";
import MyShop from "./pages/MyShop";
import NewProduct from "./pages/NewProduct";
import Cart from "./pages/Cart";
import ProductDisplay from "./pages/Product";
import OrderHistory from "./pages/OrderHistory";
import MyShopOrders from "./pages/MyShopOrders";




const App: React.FC = () => {
  return (
   <BrowserRouter>
    <Routes>
      <Route path = "/" element = {<Layout/>}>
        <Route index element = {<Home/>}/>

        <Route path = "register" element = {<Register/>}/>
        <Route path = "login" element = {<Login/>}/>

        <Route path = "category/:category" element = {<Category/>}/>
        <Route path = "product/:id" element = {<ProductDisplay/>}/>

        <Route path = "myShop/:id" element = {<MyShop/>}/>
        <Route path = "myShopOrders/:id" element = {<MyShopOrders/>}/>
        <Route path = "createProduct/:id" element = {<NewProduct/>}/>
        

        <Route path = "orderhistory/:id" element = {<OrderHistory/>}/>

        <Route path = "cart" element = {<Cart/>}/>

      </Route>
    </Routes>
   </BrowserRouter>
  )
}

export default App
