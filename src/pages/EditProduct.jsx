import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Firebase";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../components/Loader";

function EditProduct() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [data, setdata] = useState(null);
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [price, setprice] = useState(0);

  //   getting the prooduct from id in url
  const getProduct = async (query) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/product?${query}`
      );
      if (!response.ok) {
        throw new Error("Some error ooccured!");
      }
      const product = await response.json();
      console.log(product.product);
      setdata(product.product[0]);
      settitle(product.product[0].title);
      setdescription(product.product[0].description);
      setprice(product.product[0].price);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(
      `${process.env.REACT_APP_BASE_URL}/EditProduct/${user.uid}/${data._id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          title,
          description,
          price,
        }),
        headers: {
          "Content-type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        navigate("/dashboard");
      })
      .catch((error) => console.log(error.message));
  };

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
  }, [user, loading]);

  useEffect(() => {
    console.log(searchParams);
    getProduct(searchParams.toString());
    document.title = `Edit - ${searchParams.get("q")}`;
  }, []);

  return (
    <div>
      {data ? (
        <form
          method="PATCH"
          className="flex flex-col p-5 space-y-5"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="title"
            className="outline-none bg-[white] text-black p-3 rounded border-2 border-gray-700 font-semibold"
            value={title}
            onChange={(e) => settitle(e.target.value)}
          />
          <textarea
            rows={5}
            type="text"
            placeholder="description"
            className="outline-none bg-[white] text-black p-3 rounded border-2 border-gray-700 font-semibold"
            value={description}
            onChange={(e) => setdescription(e.target.value)}
          />
          <div className="space-x-2 items-center">
            <span>$</span>
            <input
              type="number"
              className="outline-none bg-[white] text-black p-3 rounded border-2 border-gray-700 font-semibold"
              placeholder="price $"
              value={price}
              onChange={(e) => setprice(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-orange-400 font-bold px-5 py-2 rounded-full text-white"
          >
            Submit Edit
          </button>
        </form>
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default EditProduct;
