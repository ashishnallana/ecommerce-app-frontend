import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Loader from "../components/Loader";
import ProductImages from "../components/ProductImages";
import Reviews from "../components/Reviews";
import { useStateValue } from "../StateProvider";
import { Rating } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductPage() {
  const [searchParams] = useSearchParams();
  const [data, setdata] = useState(null);
  const [{ basket }, dispatch] = useStateValue();
  const [gallery, setgallery] = useState(null);

  const getAvgReview = () => {
    const reviews = data.reviews;
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

  const addToBasket = () => {
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        productId: data._id,
        uid: data.uid,
        details: data,
        price: data.price,
      },
    });
  };

  const getProduct = async (query) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/product?${query}`
      );
      if (!response.ok) {
        throw new Error("Some error ooccured!");
      }
      const product = await response.json();
      console.log(product);
      setdata(product.product[0]);
      setgallery(product.product[0].images);
    } catch (error) {
      console.error("Error fetching products: ", error.message);
    }
  };

  const notify = () => {
    // toast(`${details.title} - added to cart`);
    toast.success(`${data.title} - added to cart`, {
      position: "bottom-right",
      autoClose: 3000, // Milliseconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  useEffect(() => {
    console.log(searchParams.toString());
    getProduct(searchParams.toString());
    document.title = searchParams.get("q");
  }, []);

  return (
    <div>
      {!data ? (
        <Loader />
      ) : (
        <div className="flex flex-col">
          <div className="flex flex-wrap bg-white pt-5  pb-5">
            {data.images && <ProductImages images={gallery} />}
            <div className="pr-5 pl-5 mt-5">
              <h1 className="font-bold text-2xl mb-3">{data.title}</h1>
              <p className="w-[40vw] max-[540px]:w-[90vw]">
                {data.description}
              </p>
              <h1 className="font-bold text-2xl mt-3">${data.price}</h1>
              <button
                className="bg-[#FFD814] font-semibold px-3 py-1 rounded mt-5 mb-3"
                onClick={() => {
                  addToBasket();
                  notify();
                }}
              >
                Add To Cart
              </button>
              {/*  reviews */}
              <p>
                {getAvgReview() !== "No reviews yet!" && (
                  <Rating name="read-only" value={getAvgReview()} readOnly />
                )}
              </p>

              <p>{getAvgReview() == "No reviews yet!" && getAvgReview()}</p>
            </div>
          </div>
          {/* reviews */}
          <div>
            <Reviews details={data} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
