import React, { useEffect, useState } from "react";
import Product from "../components/Product";
import Loading from "../components/Loader";

function Home() {
  const [data, setdata] = useState(null);

  const getAllProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/products`
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
    getAllProducts();
    document.title = "Ecommerce App - Home";
  }, []);

  return (
    <div className="mt-3">
      <h1 className="text-2xl font-bold italic text-center px-3">
        Explore, all available products here.
      </h1>

      <div className="flex flex-wrap max-[670px]:justify-center min-[650px]">
        {data ? (
          data.products.map((e, i) => <Product details={e} key={i} />)
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
}

export default Home;
