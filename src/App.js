import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reset from "./pages/Reset";
import Dashboard from "./pages/Dashboard";
import NewProduct from "./pages/NewProduct";
import Cart from "./pages/Cart";
import ProductPage from "./pages/ProductPage";
import EditProduct from "./pages/EditProduct";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="app">
      <Router>
        <ToastContainer />

        <Navbar />
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/search" Component={Search} />
          <Route path="/login" Component={Login} />
          <Route path="/register" Component={Register} />
          <Route path="/password-reset" Component={Reset} />
          <Route path="/dashboard" Component={Dashboard} />
          <Route path="/NewProduct" Component={NewProduct} />
          <Route path="/cart" Component={Cart} />
          <Route path="/product" Component={ProductPage} />
          <Route path="/edit" Component={EditProduct} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
