import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Loader from "../components/Loader";
import Product from "../components/Product";

function Search() {
  const [data, setdata] = useState(null);
  const [searchParams] = useSearchParams();

  const searchProducts = async (query) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/search?${query}`
      );
      if (!response.ok) {
        throw new Error("Some error ooccured!");
      }
      const products = await response.json();
      console.log(products);
      setdata(products);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    console.log(searchParams.toString());
    searchProducts(searchParams.toString());
    console.log(data);
    document.title = `Search - ${searchParams.get("q")}`;
  }, [searchParams]);

  // useEffect(() => {
  //   document.title = `Search - ${searchParams.get("q")}`;
  // }, []);

  return (
    <div>
      {!data ? (
        <Loader />
      ) : (
        <div className="flex flex-wrap max-[670px]:justify-center min-[650px]">
          {data.products.map((e, i) => (
            <Product userType={"buyer"} details={e} key={i} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
