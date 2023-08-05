import React, { useEffect } from "react";
import { useStateValue } from "../StateProvider";
import { getBasketTotal } from "../Reducer";
import CurrencyFormat from "react-currency-format";
import { useSearchParams } from "react-router-dom";
import Product from "../components/Product";

function Cart() {
  const [{ basket }, dispatch] = useStateValue();
  const [searchParams] = useSearchParams();

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
      return product.product[0];
      // setdata(product.product[0]);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    document.title = "Cart";
  }, []);

  return (
    <div>
      <div className="flex flex-col justify-center items-center space-y-4 text-2xl font-bold bg-orange-500  py-5">
        <CurrencyFormat
          renderText={(value) => (
            <>
              <p>
                Subtotal ({basket?.length || 0} items): <strong>{value}</strong>
              </p>
            </>
          )}
          decimalScale={2}
          value={getBasketTotal(basket) ? getBasketTotal(basket) : 0}
          displayType={"text"}
          thousandSeparator={true}
          prefix={"$"}
        />
        <button
          className="text-sm font-medium border-2 border-black bg-white p-2 px-3 rounded-full"
          onClick={() => alert("No checkout page!")}
        >
          Proceed to checkout
        </button>
      </div>
      {/* added products */}
      <div className="flex flex-wrap max-[670px]:justify-center min-[650px]">
        <p className="text-center w-screen mt-5">
          Note: The items in the cart are not getting stored in the database.
          The cart is to showcase context functionality.
        </p>
        {basket.length !== 0 ? (
          basket.map((e, i) => (
            <Product
              userType={"buyer"}
              details={e.details}
              key={i}
              cart={true}
            />
          ))
        ) : (
          <h1 className="text-center mt-5 w-screen">
            No products in the cart!
          </h1>
        )}
      </div>
    </div>
  );
}

export default Cart;
