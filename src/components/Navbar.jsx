import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Firebase";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useStateValue } from "../StateProvider";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

function Navbar() {
  const [user, loading, error] = useAuthState(auth);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mobileOptions, setmobileOptions] = useState(false);
  const [{ basket }, dispatch] = useStateValue();
  const [searchTerm, setsearchTerm] = useState("");
  const [displayName, setdisplayName] = useState("Guest");
  const [displayPicture, setdisplayPicture] = useState(
    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  );

  // * getting name and dp of user
  const getProfilePictureAndName = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/user/${user.uid}`
      );
      if (!response.ok) {
        throw new Error("Some error ooccured!");
      }
      const UserData = await response.json();
      console.log(UserData);
      setdisplayName(UserData.name);
      setdisplayPicture(UserData.displayPicture);
    } catch (error) {
      console.error(error.message);
    }
  };

  // *setting parameters for search
  const handleSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    queryParams.set("q", searchTerm);
    navigate(`/search?${queryParams.toString()}`);
  };

  useEffect(() => {
    if (loading) return;
    if (user) getProfilePictureAndName();
  }, [user, loading]);

  useEffect(() => {
    if (searchParams.get("q")) {
      setsearchTerm(searchParams.get("q"));
    }
  }, []);

  return (
    <div className="bg-[#0f1111] text-white flex justify-between items-center px-5 h-[80px]">
      <header>
        <Link to={"/"}>
          <h1 className="text-2xl font-extrabold max-[650px]:text-xl max-[650px]:fnt-bold">
            ECOMM.
          </h1>
        </Link>
      </header>
      <form
        onSubmit={handleSubmit}
        className="flex items-center flex-1 mr-10 ml-5"
      >
        <input
          type="text"
          placeholder="Search products"
          className="p-2 border-none outline-none min-[650px]:flex-1 max-[650px]:w-[150px]"
          style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          value={searchTerm}
          onChange={(e) => setsearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="bg-orange-500 text-black h-[40px] w-[40px]"
        >
          <SearchIcon />
        </button>
      </form>
      <div className="absolute right-2 min-[650px]:hidden">
        {mobileOptions ? (
          <CloseIcon
            onClick={() => {
              setmobileOptions(false);
            }}
          />
        ) : (
          <MenuIcon
            onClick={() => {
              setmobileOptions(true);
            }}
          />
        )}
      </div>
      {/* for mobile */}
      <div
        className="flex flex-col items-end pb-2 absolute bg-[#0f1111] right-0 top-[80px] p-5 rounded-bl"
        style={{ display: mobileOptions ? "flex" : "none" }}
      >
        <p>
          <span className="text-sm">Hello,</span>{" "}
          <span className="text-lg font-semibold">{displayName}</span>
        </p>
        {/* cart and dashboard btn */}
        <div className="flex space-x-2 items-center mt-2">
          <Link to={"/cart"} onClick={() => setmobileOptions(false)}>
            <ShoppingCartIcon fontSize="large" />
            {/* no of items in the cart */}
            <div className="bg-[red] w-5 h-5 rounded-full flex justify-center items-center font-bold absolute -translate-y-[40px] translate-x-2">
              {basket.length}
            </div>
          </Link>
          <Link
            to={"/dashboard"}
            className="-translate-y-1"
            onClick={() => setmobileOptions(false)}
          >
            <img
              className="h-[30px] w-[30px] rounded-full mt-1"
              src={displayPicture}
              title="Dashboard"
              alt=""
            />
          </Link>
        </div>
      </div>
      {/* for desktop */}
      <div
        className="flex flex-col items-end pb-2 max-[650px]:hidden"
        // style={{ display: mobileOptions ? "flex" : "none" }}
      >
        <p>
          <span className="text-sm">Hello,</span>{" "}
          <span className="text-lg font-semibold">{displayName}</span>
        </p>
        {/* cart and dashboard btn */}
        <div className="flex space-x-2 items-center mt-2">
          <Link to={"/cart"}>
            <ShoppingCartIcon fontSize="large" />
            {/* no of items in the cart */}
            <div className="bg-[red] w-5 h-5 rounded-full flex justify-center items-center font-bold absolute -translate-y-[40px] translate-x-2">
              {basket.length}
            </div>
          </Link>
          <Link to={"/dashboard"} className="-translate-y-1">
            <img
              className="h-[30px] w-[30px] rounded-full mt-1"
              src={displayPicture}
              title="Dashboard"
              alt=""
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
