import React, { useState, useEffect } from "react";
import Rating from "@mui/material/Rating";

function Review({ details }) {
  const [displayName, setdisplayName] = useState("User");
  const [displayPicture, setdisplayPicture] = useState(
    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  );

  const getProfilePictureAndName = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/user/${details.uid}`
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

  useEffect(() => {
    getProfilePictureAndName();
  }, []);

  return (
    <div className="flex pl-3 my-2 bg-white mr-3 py-2 rounded ml-3">
      {displayPicture !== "" && (
        <img
          src={displayPicture}
          alt="user profile picture"
          className="h-[30px] w-[30px] rounded-full mr-3 mt-2"
          title={displayName}
        />
      )}
      <div>
        <p className="">{details.message}</p>
        {/* <div className="flex space-x-2 text-sm"> */}
        <Rating name="read-only" value={details.rating} readOnly />
        <p className="text-sm">{displayName}</p>

        {/* </div> */}
      </div>
    </div>
  );
}

export default Review;
