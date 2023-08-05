import React from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useStateValue } from "../StateProvider";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Rating } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Product({ userType, details, cart, getProducts }) {
  const [{ basket }, dispatch] = useStateValue();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams();

  const getAvgReview = () => {
    const reviews = details.reviews;
    const numRevs = reviews.length;
    if (numRevs == 0) return "No reviews yet!";
    else {
      let x = 0; // sum of ratings
      reviews.forEach((e, i) => {
        x = x + e.rating;
      });
      return (x / (numRevs * 5)) * 5;
    }
  };

  const openProduct = () => {
    queryParams.set("q", details.title);
    navigate(`/product?${queryParams.toString()}`);
  };

  const editProduct = () => {
    queryParams.set("q", details.title);
    navigate(`/edit?${queryParams.toString()}`);
  };

  const deleteProduct = () => {
    fetch(`${process.env.REACT_APP_BASE_URL}/DeleteProduct`, {
      method: "POST",
      body: JSON.stringify({
        uid: details.uid,
        productId: details._id,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // navigate("/dashboard");
        getProducts(details.uid);
      })
      .catch((error) => console.log(error.message));
  };

  const addToBasket = () => {
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        productId: details._id,
        uid: details.uid,
        details,
        price: details.price,
      },
    });
  };

  const removeFromBasket = () => {
    dispatch({
      type: "REMOVE_FROM_BASKET",
      productId: details._id,
    });
  };

  const notify = () => {
    // toast(`${details.title} - added to cart`);
    toast.success(`${details.title} - added to cart`, {
      position: "bottom-right",
      autoClose: 3000, // Milliseconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const notifyRemove = () => {
    // toast(`${details.title} - removed from cart`);
    toast.warning(`${details.title} - removed from cart`, {
      position: "bottom-right",
      autoClose: 3000, // Milliseconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div className="w-[280px] space-y-5 bg-white my-5 pb-5 px-5 rounded pt-3 mx-3">
      <div
        onClick={openProduct}
        className="cursor-pointer flex flex-col items-center space-y-2"
      >
        {/* product image */}
        <div
          className="h-[250px] w-[250px] mb-2"
          style={{
            backgroundImage: `url(${details.images[0]})`,
            backgroundPosition: "center",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <h1 className="text-center text-xl font-semibold">{details.title}</h1>
        {/*  reviews */}
        {getAvgReview() !== "No reviews yet!" && (
          <Rating name="read-only" value={getAvgReview()} readOnly />
        )}

        <p>{getAvgReview() == "No reviews yet!" && getAvgReview()}</p>
      </div>
      {/* add to cart btn with price */}
      <div className="flex justify-center space-x-2 items-center">
        <h2 className="text-center text-lg font-semibold">
          $ {details.price}{" "}
        </h2>
        {!cart && (
          <button
            className="bg-[#ffd814] px-5 py-2 rounded-full"
            onClick={() => {
              addToBasket();
              notify();
            }}
          >
            Add to <ShoppingCartIcon />
          </button>
        )}
        {cart && (
          <button
            className="bg-[#ffd814] px-5 py-2 rounded-full"
            onClick={() => {
              removeFromBasket();
              notifyRemove();
            }}
          >
            Remove
          </button>
        )}
      </div>
      {/* seller options */}
      {userType == "seller" && (
        <div className="flex justify-center space-x-2">
          <button
            className="bg-orange-400 px-5 py-2 rounded-full"
            onClick={editProduct}
          >
            <EditIcon />
          </button>
          <button
            className="bg-orange-400 px-5 py-2 rounded-full"
            onClick={deleteProduct}
          >
            <DeleteIcon />
          </button>
        </div>
      )}
    </div>
  );
}

export default Product;
