import React, { useState } from "react";

function ProductImages({ images }) {
  const [currentImage, setcurrentImage] = useState(images[0]);

  return (
    <div className="flex mr-5 max-[540px]:flex-col-reverse">
      <div className="max-[540px]:flex overflow-auto">
        {images.map((e, i) => (
          <img
            src={e}
            alt="product image"
            key={i}
            onClick={() => setcurrentImage(e)}
            className="h-[70px] w-[70px] m-2"
          />
        ))}
      </div>
      <div
        style={{
          backgroundImage: `url(${currentImage})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
        }}
        className="h-[400px] w-[400px] ml-5 max-[540px]:w-[90vw] max-[540px]:h-[90vw]"
      ></div>
    </div>
  );
}

export default ProductImages;
