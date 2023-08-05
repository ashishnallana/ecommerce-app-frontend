import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

function Loader() {
  return (
    <div className="h-[calc(100vh-80px)] w-screen absolute top-[80px] flex justify-center items-center">
      <CircularProgress />
    </div>
  );
}

export default Loader;
