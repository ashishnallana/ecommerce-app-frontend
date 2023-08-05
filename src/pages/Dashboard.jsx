import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logOut } from "../Firebase";
import { useNavigate } from "react-router-dom";
import Product from "../components/Product";
import Loading from "../components/Loader";

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [sellerProducts, setsellerProducts] = useState(null);

  const getProducts = async (uid) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/products/${uid}`
      );
      if (!response.ok) {
        throw new Error("Some error ooccured!");
      }
      const products = await response.json();
      console.log(products);
      setsellerProducts(products);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
    if (user) getProducts(user.uid);
  }, [user, loading]);

  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  return (
    <div className="pt-5">
      {/* btns */}
      <div className="flex space-x-2 absolute right-3 bottom-3">
        {/* add products btn */}
        <button
          className="rounded-full bg-orange-500 text-white font-bold py-2 px-5"
          onClick={() => navigate("/NewProduct")}
        >
          New Product
        </button>
        {/* logout btn */}
        <button
          className="rounded-full  bg-orange-500 text-white font-bold py-2 px-5"
          onClick={logOut}
        >
          Logout
        </button>
      </div>
      {/* seller products */}
      <h1 className="text-2xl font-bold italic text-center mb-5">
        My Products
      </h1>
      <div className="flex overflow-auto">
        {sellerProducts ? (
          sellerProducts.products.map((e, i) => (
            <Product
              userType={"seller"}
              details={e}
              key={i}
              getProducts={getProducts}
              // setsellerProducts={setsellerProducts}
            />
          ))
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
