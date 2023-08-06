import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Firebase";
import Rating from "@mui/material/Rating";
import Review from "./Review";

function Reviews({ details }) {
  const [user, loading, error] = useAuthState(auth);
  const [value, setvalue] = useState(0);
  const [displayName, setdisplayName] = useState("Guest");
  const [displayPicture, setdisplayPicture] = useState(
    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  );
  const [message, setmessage] = useState("");
  const [reviews, setreviews] = useState(details.reviews);

  console.log(details);

  const getProfilePictureAndName = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/user/${user.uid}`
      );
      if (!response.ok) {
        throw new Error("Some error ooccured!");
      }
      const userData = await response.json();
      console.log(userData);
      setdisplayPicture(userData.displayPicture);
      setdisplayName(userData.name);
    } catch (error) {
      console.error("Error fetching user displayPicture: ", error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_BASE_URL}/AddReview`, {
      method: "POST",
      body: JSON.stringify({
        uid: user.uid,
        productId: details._id,
        message,
        rating: value,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setreviews(data.reviews);
      })
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    if (loading) return;
    if (user) getProfilePictureAndName();
  }, [user, loading]);

  return (
    <div>
      {user && (
        <div className="flex px-3 items-center mb-5 flex-wrap bg-white">
          <img
            src={displayPicture}
            alt="user profile picture"
            className="h-[50px] w-[50px] rounded-full mr-3 mb-3"
          />
          <form
            onSubmit={handleSubmit}
            className="flex items-center flex-wrap space-y-2 pb-5"
          >
            <textarea
              // cols="50"
              rows="3"
              placeholder="Add your review!"
              value={message}
              onChange={(e) => setmessage(e.target.value)}
              className="mr-5 placeholder:text-black py-2 px-3 rounded max-[650px]:w-[80vw] w-[40vw] outline-none"
              style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            ></textarea>
            <Rating
              name="simple-controlled"
              value={value}
              className="mr-3"
              onChange={(event, newValue) => {
                setvalue(newValue);
              }}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
      <div className="flex flex-col space-y-3 mb-5">
        {reviews && reviews.map((e, i) => <Review key={i} details={e} />)}
      </div>
    </div>
  );
}

export default Reviews;
